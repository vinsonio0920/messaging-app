import { prisma } from "../lib/prisma.js";

async function findChatById(chatId) {
  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: Number(chatId),
      },
      include: {
        members: true,
      },
    });

    return chat;
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
}

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

async function createGroupChat(name, members) {
  try {
    const groupChat = await prisma.chat.create({
      data: {
        name: name,
        members: {
          connect: members.map((id) => ({ id })),
        },
      },
    });

    return groupChat;
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

export { findChatById, createChat, createGroupChat, findAllChats };
