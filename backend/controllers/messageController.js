import { findAllChats } from "../db/messageDb.js";

async function getAllChats(req, res, next) {
  const { userId } = req.params;

  try {
    const chats = await findAllChats(userId);

    return res.json({
      apiVersion: "1.0",
      status: "success",
      data: chats,
      errors: null,
    });
  } catch (err) {
    next(err);
  }
}

async function createMessage(req, res, next) {
  // we need to add image to supabase first!
  // also make sure that the
  res.send("creating...");
}

export { createMessage, getAllChats };
