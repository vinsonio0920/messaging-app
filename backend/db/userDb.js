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

export { findAllUsers };
