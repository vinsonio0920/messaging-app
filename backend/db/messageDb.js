import { prisma } from "../lib/prisma.js";

async function findMessageById(messageId) {
  try {
    const message = await prisma.message.findUnique({
      where: {
        id: Number(messageId),
      },
      include: {
        sender: true,
      },
    });

    return message;
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

async function updateMessage(messageId, message) {
  try {
    const updatedMessage = await prisma.message.update({
      where: {
        id: Number(messageId),
      },
      data: {
        message,
      },
    });

    return updatedMessage;
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
}

export { findAllMessages, findMessageById, createMessage, updateMessage };
