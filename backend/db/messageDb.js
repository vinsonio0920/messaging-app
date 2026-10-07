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

async function findAllChats(userId) {
  try {
    const chats = await prisma.chat.findMany({
      where: {
        members: {
          some: {
            id: Number(userId),
          },
        },
      },
      include: {
        members: true,
      },
    });

    return chats;
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
}

async function findAllMessages(chatId) {
  try {
    const chats = await prisma.chat.findUnique({
      where: {
        id: Number(chatId),
      },
      include: {
        messages: true,
      },
    });

    return chats;
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
}

export { createChat, findAllChats, findAllMessages };
