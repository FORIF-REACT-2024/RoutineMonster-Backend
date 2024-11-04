import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 유저 정보 찾기
async function findUser(email) {
  try {
    const findUser = await prisma.findUnique({
      where: {
        email: email,
      },
    });
    return findUser;
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
}
//
