import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// < getDateRoutineM - 일별 루틴 조회 >
export async function getDateRoutineM(userId, date) {
  const realDate = new Date(date);
  date.setHours(0, 0, 0, 0);

  // 일별 루틴 조회
  const dateRoutines1 = await prisma.routineCheck.findMany({
    where: {
      date: realDate,
      userId: userId,
    },
    select: {
      routineId: true,
      completed: true,
    },
  });

  const dateRoutines2 = await Promise.all(
    dateRoutines1.map(async (dateRoutine) => {
      const routine = await prisma.routineList.findUnique({
        where: {
          id: dateRoutine.routineId,
        },
        select: {
          title: true,
          category: true,
          startDate: true,
          endDate: true,
          times: true,
        },
      });

      return {
        title: routine.title,
        category: routine.category,
        startDate: routine.startDate,
        endDate: routine.endDate,
        times: routine.times,
        completed: dateRoutine.completed,
      };
    })
  );

  // 일별 코멘트 가져오기
  const comment = await prisma.calendar.findUnique({
    where: { date: realDate, userId: userId },
    select: {
      comment: true,
    },
  });

  const response = {
    date: realDate,
    comment: commentData ? commentData.comment : null,
    todaylist: dateRoutines2,
  };

  return response;
}

// < checkRoutineM - 일별 루틴 체크 수정 >
export async function checkRoutineM(checkedRoutineIds, date, userId) {
  // 1. 이전에 체크되었던 루틴 리스트 가져오기
  const previouslyCheckedRoutines = await prisma.routineCheck.findMany({
    where: {
      date: date,
      userId: userId,
      completed: true,
    },
  });
  // 2. 체크 해제된 루틴 찾아서 completedTimes -1
  const routinesToUncheck = previouslyCheckedRoutines.filter(
    (routine) => !checkedRoutineIds.includes(routine.routineId)
  );

  const decrementPromises = routinesToUncheck.map(
    async (routine) =>
      await prisma.routineList.update({
        where: { id: routine.routineId, userId: userId },
        data: {
          completedTimes: {
            decrement: 1,
          },
        },
      })
  );

  // 3. 이전에 체크되지 않았던 루틴 리스트 가져오기
  const previouslyUncheckedRoutines = await prisma.routineCheck.findMany({
    where: {
      date: date,
      userId: userId,
      completed: false,
    },
  });

  // 4. 새롭게 체크된 루틴 찾아서 completedTimes +1
  const routinesToCheck = checkedRoutineIds.filter((checkedRoutineId) =>
    previouslyUncheckedRoutines.some(
      (routine) => routine.routineId === checkedRoutineId
    )
  );

  const incrementPromises = routinesToCheck.map((checkedRoutineId) =>
    prisma.routineList.update({
      where: { id: checkedRoutineId, userId: userId },
      data: {
        completedTimes: {
          increment: 1,
        },
      },
    })
  );

  // 5. 모든 루틴의 completed를 false로 초기화
  const resetCompletedStatusPromise = await prisma.routineCheck.updateMany({
    where: { date: date, userId: userId },
    data: { completed: false },
  });

  // 6. checkedRoutineIds에 있는 루틴 Id만 completed를 true로 설정
  const updatePromises = checkedRoutineIds.map((checkedRoutineId) =>
    prisma.routineCheck.update({
      where: { routineId: checkedRoutineId, date: date, userId: userId },
      data: { completed: true },
    })
  );

  // 모든 비동기 작업을 병렬로 처리
  await Promise.allSettled([
    ...decrementPromises, // 2. 체크 해제된 루틴의 completedTimes 감소
    ...incrementPromises, // 4. 새로 체크된 루틴의 completedTimes 증가
    resetCompletedStatusPromise, // 5. 모든 루틴의 completed 상태 false로 초기화
    ...updatePromises, // 6. checkedRoutineIds에 있는 루틴의 completed 상태 true로 설정
  ]);
}

// < updateCommentM - 일별 코멘트 저장하기 >
export async function updateCommentM(userId, date, comment) {
  const updatedComment = await prisma.calendar.upsert({
    where: { date: date, userId: userId },
    data: { comment: comment },
    create: { date: date, userId: userId, comment: comment },
  });
}
