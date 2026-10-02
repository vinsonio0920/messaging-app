import { prisma } from "../lib/prisma.js";

async function createChat(userId, friendId) {
  try {
    const chat = await prisma.chat.create({
      data: {
        members: {
          connect: [
            {
              id: Number(userId),
            },
            {
              id: Number(friendId),
            },
          ],
        },
      },
    });

    return chat;
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
}

export { createChat };
