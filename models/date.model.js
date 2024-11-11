import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// < getDateRoutineM - 일별 루틴 가져오기 >
export async function getDateRoutineM(userID, date1) {
  const date = new Date(date1);
  date.setHours(0, 0, 0, 0);

  // 일별 루틴 가져오기
  const todayRoutines = await prisma.routineList.findMany({
    where: {
      userId: userID,
      startDate: {
        lte: date, // startDate가 오늘보다 작거나 같음
      },
      endDate: {
        gte: date, // endDate가 오늘보다 크거나 같음
      },
    },
    select: {
      id: true,
      category: true,
      title: true,
      startDate: true,
      endDate: true,
      times: true,
      routineCheck: {
        completed: true,
      },
    },
  });

  // 일별 코멘트 가져오기
  const comment = await prisma.calendar.findUnique({
    where: { date: date },
    select: {
      comment: true,
    },
  });

  const response = { date: date, comment: comment, todaylist: todayRoutines };

  return response;
}

// < checkRoutineM - 일별 루틴 체크 수정하기 >
export async function checkRoutineM(date, checkedRoutineIds) {
  // Step 1: 주어진 date에 해당하는 루틴 중에서 기존에 completed가 true였던 것 찾기
  const previouslyCheckedRoutines = await prisma.routineCheck.findMany({
    where: {
      date: date,
      completed: true, // 이전에 true였던 루틴들만 찾기
    },
  });

  // 체크 해제된 루틴: 이전에 completed가 true였으나 현재 checkedRoutineIds에 없는 루틴
  const routinesToUncheck = previouslyCheckedRoutines.filter(
    (routine) => !checkedRoutineIds.includes(routine.routineId)
  );

  const decrementPromises = routinesToUncheck.map((routine) =>
    prisma.routineList.update({
      where: { id: routine.routineId },
      data: {
        completedTimes: {
          decrement: 1,
        },
      },
    })
  );

  // Step 2: 체크가 새로 true로 변경된 루틴: 이전에 completed가 false였고, 현재 checkedRoutineIds에 포함된 루틴
  const previouslyUncheckedRoutines = await prisma.routineCheck.findMany({
    where: {
      date: date,
      completed: false,
    },
  });

  const routinesToCheck = checkedRoutineIds.filter((checkedRoutineId) =>
    previouslyUncheckedRoutines.some(
      (routine) => routine.routineId === checkedRoutineId
    )
  );

  const incrementPromises = routinesToCheck.map((checkedRoutineId) =>
    prisma.routineList.update({
      where: { id: checkedRoutineId },
      data: {
        completedTimes: {
          increment: 1,
        },
      },
    })
  );

  // Step 3: 모든 루틴의 completed 상태를 false로 초기화
  await prisma.routineCheck.updateMany({
    where: { date: date },
    data: { completed: false },
  });

  // Step 4: checkedRoutineIds에 있는 루틴 ID만 completed를 true로 업데이트
  const updatePromises = checkedRoutineIds.map((checkedRoutineId) =>
    prisma.routineCheck.update({
      where: { date: date, routineId: checkedRoutineId },
      data: { completed: true },
    })
  );

  // 모든 비동기 작업을 병렬로 처리
  await Promise.all([
    ...decrementPromises, // 체크 해제된 루틴 completedTimes 감소
    ...incrementPromises, // 새로 체크된 루틴 completedTimes 증가
    ...updatePromises, // checkedRoutineIds 루틴을 completed true로 설정
  ]);
}

// < updateCommentM - 일별 코멘트 저장하기 >
export async function updateCommentM(date, comment) {
  const updatedComment = await prisma.calendar.upsert({
    where: { date: date },
    data: { comment: comment },
    create: { date: date, comment: comment },
  });
}
