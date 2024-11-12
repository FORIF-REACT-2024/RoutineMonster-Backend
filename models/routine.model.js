import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// < getRoutineM - 전체 루틴 목록 조회 >
export async function getRoutineM(userId) {
  const states = ["expected", "ongoing", "completed"];
  const response = { routinelist: [] };

  const statePromises = states.map(async (state) => {
    const routines = await prisma.routineList.findMany({
      where: {
        user: { id: userId },
        states: state,
      },
      select: {
        category: true,
        title: true,
        startDate: true,
        endDate: true,
        times: true,
        completedTimes: true,
      },
    });
    const objectives = routines.map((routine) => ({
      category: routine.category,
      title: routine.title,
      startDate: routine.startDate,
      endDate: routine.endDate,
      times: routine.times,
      completedTimes: routine.completedTimes,
    }));

    response.routinelist.push({ state: state, objective: objectives });
  });

  await Promise.all(statePromises);

  return response;
}

// < makeRoutineM - 루틴 작성 >
export async function makeRoutineM(
  title,
  category,
  startDate,
  endDate,
  times,
  userId
) {
  // routineList 테이블
  const today = new Date();

  let state;
  if (today < new Date(startDate)) {
    state = "expected";
  } else if (today >= new Date(startDate) && today <= new Date(endDate)) {
    state = "ongoing";
  } else if (today > new Date(endDate)) {
    state = "completed";
  }

  const makeRoutine = await prisma.routineList.create({
    data: {
      title: title,
      category: category,
      state: state,
      startDate: startDate,
      endDate: endDate,
      time: times,
      userId: userId,
    },
  });

  const routineId = makeRoutine.id;

  // routineCheck 테이블
  const generateDatesBetween = (start, end) => {
    const dateArray = [];
    let currentDate = new Date(start);

    while (currentDate <= end) {
      dateArray.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1); // 하루씩 증가
    }
    return dateArray;
  };

  const dates = generateDatesBetween(new Date(startDate), new Date(endDate));

  const routineChecks = dates.map((date) => ({
    routineId: routineId,
    date: date,
    userId: userId,
  }));

  const createdRoutines = await prisma.routineCheck.createMany({
    data: routineChecks,
    skipDuplicates: true, // 중복 생성 방지
  });
}

// < deleteRoutineM - 루틴 삭제 >
export async function deleteRoutineM(userId, routineId) {
  // routineList에서 삭제
  await prisma.routineList.deleteMany({
    where: { id: routineId, userId: userId },
  });

  // routineCheck에서 삭제
  await prisma.routineCheck.deleteMany({
    where: {
      routineId: routineId,
      userId: userId,
    },
  });
}
