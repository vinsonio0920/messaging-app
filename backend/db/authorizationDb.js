import { prisma } from "../lib/prisma.js";

async function createUser(email, password, username, profile) {
  try {
    const newUser = await prisma.user.create({
      data: {
        email,
        password,
        username,
        profile,
      },
    });

    return newUser;
  } catch (err) {
    // logs the error and lets error handler middleware handle the rest
    console.error(err);
    throw new Error(err);
  }
}

async function findUser(email, password) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: email,
        password: password,
      },
    });

    return user;
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
}

async function findUserById(id) {
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: Number(id),
      },
    });

    return user;
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
}

async function findUserByEmail(email) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    return user;
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
}

export { createUser, findUser, findUserById, findUserByEmail };
