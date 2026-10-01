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

async function findOtherFriendRequesting(userId) {
  // find rows where user didn't request but friend did
  try {
    const otherFriendRequesting = await prisma.userFriends.findMany({
      where: {
        AND: {
          user2: {
            equals: Number(userId),
          },
          accepted: false,
        },
      },
    });

    return otherFriendRequesting;
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

async function findUserFriendById(userId, friendId) {
  try {
    const userFriend = await prisma.userFriends.findFirst({
      where: {
        user1: {
          equals: Number(userId),
        },
        user2: {
          equals: Number(friendId),
        },
      },
    });

    return userFriend;
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
}

async function createUserFriends(userId, friendId) {
  try {
    const userFriends = await prisma.userFriends.create({
      data: {
        user1: Number(userId),
        user2: Number(friendId),
      },
    });

    return userFriends;
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
}

async function makeUserFriends(useFriends1Id, userFriends2Id) {
  try {
    const userFriend1 = await prisma.userFriends.update({
      where: {
        id: useFriends1Id,
      },
      data: {
        accepted: true,
      },
    });

    const userFriend2 = await prisma.userFriends.update({
      where: {
        id: userFriends2Id,
      },
      data: {
        accepted: true,
      },
    });

    return {
      userFriend1,
      userFriend2,
    };
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
}

export {
  findAllUsers,
  findUserFriends,
  findOtherFriendRequesting,
  findUserFriendById,
  createUserFriends,
  makeUserFriends,
};
