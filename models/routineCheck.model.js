import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 루틴 체크하기
export async function checkRoutine(date, checkedRoutineIds) {
  for (const checkedRoutineId of checkedRoutineIds) {
    const checked = await prisma.routineCheck.update({
      where: { date: date, routineId: checkedRoutineId },
      data: { completed: true },
    });
  }
}
