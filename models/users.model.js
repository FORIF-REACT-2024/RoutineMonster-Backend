import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 유저 정보 찾기
export async function findUserM(email) {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (user) {
    return user;
  }
  return null;
}

// 유저 정보 생성 (회원가입)
export async function makeUserM(name, email) {
  const user = await prisma.user.create({
    data: {
      name: name,
      email: email,
    },
  });
  return user;
}
