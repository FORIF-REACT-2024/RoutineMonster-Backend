import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 유저 정보 찾기
export async function findUserM(email) {
  const findUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  return findUser;
}

// 유저 정보 생성 (회원가입)
export async function makeUserM(name, email, deadtime) {
  const makeUser = await prisma.user.create({
    data: {
      name: name,
      email: email,
      deadtime: deadtime,
    },
  });
  return makeUser;
}
