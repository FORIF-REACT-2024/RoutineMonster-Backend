import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 코멘트 저장
export async function updateComment(date, comment) {
  const updatedComment = await prisma.calendar.update({
    where: { date: date },
    data: { comment: comment },
  });
}
