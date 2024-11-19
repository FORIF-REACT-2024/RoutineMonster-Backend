import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// < getDateRoutineM - 일별 루틴 조회 >
export async function getDateRoutineM(userId, date) {
  const realDate = new Date(date);
  realDate.setHours(0, 0, 0, 0);

  const startOfDay = new Date(realDate);
  const endOfDay = new Date(realDate);
  endOfDay.setHours(23, 59, 59, 999);

  // 일별 루틴 조회
  const dateRoutines1 = await prisma.routineCheck.findMany({
    where: {
      date: {
        gte: startOfDay, // 시작 시간
        lte: endOfDay, // 종료 시간
      },
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
  const commentData = await prisma.calendar.findUnique({
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
  const realDate = new Date(date);
  const startOfDay = new Date(realDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(realDate.setHours(23, 59, 59, 999));

  // 1. 이전에 체크되었던 루틴 리스트 가져오기
  const previouslyCheckedRoutines = await prisma.routineCheck.findMany({
    where: {
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
      completed: true,
      userId: userId,
    },
  });

  // 2. 체크 해제된 루틴 찾아서 completedTimes -1
  const routinesToUncheck = previouslyCheckedRoutines.filter(
    (routine) => !checkedRoutineIds.includes(routine.routineId)
  );

  for (const routine of routinesToUncheck) {
    const result = await prisma.routineList.update({
      where: { id: routine.routineId, userId: userId },
      data: {
        completedTimes: {
          decrement: 1,
        },
      },
    });
  }

  // 3. 이전에 체크되지 않았던 루틴 리스트 가져오기
  const previouslyUncheckedRoutines = await prisma.routineCheck.findMany({
    where: {
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
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

  for (const checkedRoutineId of routinesToCheck) {
    const result = await prisma.routineList.update({
      where: { id: checkedRoutineId, userId: userId },
      data: {
        completedTimes: {
          increment: 1,
        },
      },
    });
  }

  // 5. 모든 루틴의 completed를 false로 초기화
  const resetCompletedStatusResult = await prisma.routineCheck.updateMany({
    where: {
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
      userId: userId,
    },
    data: { completed: false },
  });

  // 6. checkedRoutineIds에 있는 루틴 Id만 completed를 true로 설정
  for (const checkedRoutineId of checkedRoutineIds) {
    const result = await prisma.routineCheck.updateMany({
      where: {
        routineId: checkedRoutineId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        userId: userId,
      },
      data: { completed: true },
    });
  }
}

// < updateCommentM - 일별 코멘트 저장하기 >
export async function updateCommentM(userId, date, comment) {
  const [year, month, day] = date.split("-").map(Number);
  const realDate = new Date(Date.UTC(year, month - 1, day)); // 받은 날짜를 Date 객체로 변환
  console.log(realDate);

  const updatedComment = await prisma.calendar.upsert({
    where: {
      date: realDate,
      userId: userId,
    },
    update: { comment: comment },
    create: {
      date: realDate,
      userId: userId,
      comment: comment,
    },
  });
}

// < getCalendarM - 전체 캘린더 루틴 조회 >
export async function getCalendarM(userId, year, month) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const responsePromises = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day); // 각 날짜를 생성
    date.setHours(0, 0, 0, 0); // 자정으로 설정

    const dayPromises = prisma.routineCheck.findMany({
      where: {
        date: date,
        userId: userId,
        completed: true,
      },
      select: {
        routine: {
          select: {
            title: true,
            category: true,
          },
        },
      },
    });
    const dayRoutine = {
      date: date.toISOString().split("T")[0],
      completed: dayPromises.map((dayPromise) => {
        dayPromise.routine;
      }),
    };

    responsePromises.push(dayRoutine);
  }

  const response = await Promise.all(responsePromises);

  return response;
}
