import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 유저 정보 찾기
export async function findUser(email) {
  try {
    const findUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    return findUser;
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
}

// 유저 정보 생성 (회원가입)
export async function makeUser(name, email, deadtime) {
  try {
    const makeUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        deadtime: deadtime,
      },
    });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
}
