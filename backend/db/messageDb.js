import { prisma } from "../lib/prisma.js";

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

async function createMessage(message, userId, chatId) {
  try {
    const newMessage = await prisma.message.create({
      data: {
        message,
        senderId: Number(userId),
        chatId: Number(chatId),
      },
    });

    return newMessage;
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
}

export { findAllMessages, createMessage };
