import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getRoutine(userId) {
  const states = ["expected", "ongoing", "completed"];
  const response = { response: [] };

  for (const state in states) {
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
  }

  return response;
}

export async function makeRoutine(
  userId,
  title,
  category,
  startDate,
  endDate,
  times
) {
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
      completedTimes: 0,
      userId: userId,
    },
  });

  return makeRoutine;
}

export async function deleteRoutine(routineId) {
  const deleteRoutine = await prisma.routineList.update({
    where: { id: routineId },
    data: { state: "deleted" },
  });
  return deleteRoutine;
}

export async function getDeletedRoutine(routineId) {
  const getDeletedRoutine = await prisma.routineList.findUnique({
    where: { id: routineId },
    select: {
      id: true,
      state: true,
    },
  });

  return getDeletedRoutine;
}
