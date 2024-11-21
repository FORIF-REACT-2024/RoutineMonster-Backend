import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// < getRoutineM - 전체 루틴 목록 조회 >
export async function getRoutineM(userId, pageId, itemsPerPage = 8) {
  const routines = await prisma.routineList.findMany({
    where: {
      user: { id: userId },
    },
    select: {
      id: true,
      category: true,
      title: true,
      startDate: true,
      endDate: true,
      times: true,
      completedTimes: true,
    },
    skip: (pageId - 1) * itemsPerPage,
    take: itemsPerPage,
  });

  const totalCount = await prisma.routineList.count({
    where: {
      userId: userId,
    },
  });

  return {
    routineList: routines,
    totalCount: totalCount,
    currentPage: pageId,
    totalPages: Math.ceil(totalCount / itemsPerPage),
  };
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
      title,
      category,
      state,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      times,
      userId,
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
  // routineCheck에서 삭제
  const deletedChecks = await prisma.routineCheck.deleteMany({
    where: {
      routineId: routineId,
      userId: userId,
    },
  });
  // routineList에서 삭제
  const deletedRoutine = await prisma.routineList.deleteMany({
    where: { id: routineId, userId: userId },
  });

  return {
    deletedRoutine: deletedRoutine.count > 0, // 삭제된 루틴의 개수 확인
    deletedChecks: deletedChecks.count > 0, // 삭제된 체크 항목의 개수 확인
  };
}
