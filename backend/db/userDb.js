import { prisma } from "../lib/prisma.js";

async function findAllUsers() {
  try {
    const users = await prisma.user.findMany({
      omit: {
        password: true,
      },
    });

    return users;
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
}

async function findUserFriends(userId) {
  try {
    const userFriends = await prisma.userFriends.findMany({
      where: {
        user1: {
          equals: Number(userId),
        },
      },
    });

    return userFriends;
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
}

export { findAllUsers, findUserFriends };
