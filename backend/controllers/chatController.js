import { findAllChats, findChatById } from "../db/chatDb.js";
import {
  createMessage,
  deleteMessage,
  findAllMessages,
  findMessageById,
  updateMessage,
} from "../db/messageDb.js";
import { supabase } from "../lib/supabase.js";
import { getFilePathFromPublicUrl, jwtUserIdMatches } from "../utils.js";
import path from "path";

async function getAllChats(req, res, next) {
  const { userId } = req.body;

  try {
    const jwtToken = req.headers["authorization"].split(" ")[1];
    const userIdMatches = jwtUserIdMatches(userId, jwtToken);
    if (!userIdMatches)
      throw new Error("Signed in user's id doesn't match params user id.");

    const chats = await findAllChats(userId, jwtToken);

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

async function getAllChatMessages(req, res, next) {
  const { chatId } = req.params;
  const { userId } = req.body;

  try {
    const jwtToken = req.headers["authorization"].split(" ")[1];
    const userIdMatches = jwtUserIdMatches(userId, jwtToken);
    if (!userIdMatches)
      throw new Error("Signed in user's id doesn't match params user id.");

    const messages = await findAllMessages(chatId);

    return res.json({
      apiVersion: "1.0",
      status: "success",
      data: messages,
      errors: null,
    });
  } catch (err) {
    next(err);
  }
}

async function postChatMessage(req, res, next) {
  const { chatId } = req.params;
  const { userId, message } = req.body;
  const image = req.file;
  let imageUrl = null;

  try {
    const jwtToken = req.headers["authorization"].split(" ")[1];
    const userIdMatches = jwtUserIdMatches(userId, jwtToken);
    if (!userIdMatches)
      throw new Error("Signed in user's id doesn't match params user id.");

    // Make sure that the user is a member of the chat
    const chat = await findChatById(chatId);
    const userIsMember = chat.members.find(
      (member) => member.id === Number(userId),
    );
    if (!userIsMember)
      throw new Error("User does not have access to this chat.");

    // must have either a message or an image
    if (!message && !image)
      throw new Error("A message or an image is required to post.");

    if (image) {
      // upload image to supabase and get the image url
      // filePath is the name given to the file for supabase (chatId -> image file)
      const filePath = `${chatId}/${crypto.randomUUID()}${path.extname(image.originalname)}`;
      const { data: imageData, error: imageError } = await supabase.storage
        .from("Message Images")
        .upload(filePath, image.buffer, {
          contentType: image.mimetype,
        });

      if (imageError) throw new Error(imageError.message);

      // get public URL after upload
      const { data: urlData } = supabase.storage
        .from("Message Images")
        .getPublicUrl(filePath);

      imageUrl = urlData.publicUrl;
    }

    const newMessage = await createMessage(message, userId, chatId, imageUrl);

    return res.json({
      apiVersion: "1.0",
      status: "success",
      data: newMessage,
      errors: null,
    });
  } catch (err) {
    next(err);
  }
}

async function putChatMessage(req, res, next) {
  const { chatId, messageId } = req.params;
  const { userId, message } = req.body;
  const image = req.file;
  let imageUrl = null;

  // tomorrow finish these and maybe start on the frontend (optional)!
  // and also the delete... (simply delete the image url!)

  try {
    const jwtToken = req.headers["authorization"].split(" ")[1];
    const userIdMatches = jwtUserIdMatches(userId, jwtToken);
    if (!userIdMatches)
      throw new Error("Signed in user's id doesn't match params user id.");

    // make sure that the message belongs to the user
    const findMessage = await findMessageById(messageId);
    const userIsSender = findMessage.senderId === Number(userId);
    if (!userIsSender)
      throw new Error("You are not the sender of this message.");

    // must have either a message or an image
    if (!message && !image)
      throw new Error("A message or an image is required to post.");

    // replace image if it exists
    if (image) {
      // first upload image (unique UUID so no need for upsert)
      const filePath = `${chatId}/${crypto.randomUUID()}${path.extname(image.originalname)}`;
      const { data: imageData, error: imageError } = await supabase.storage
        .from("Message Images")
        .upload(filePath, image.buffer, {
          contentType: image.mimetype,
        });

      if (imageError) throw new Error(imageError.message);

      // delete previous image if applicable
      const previousFilePath = getFilePathFromPublicUrl(findMessage.image);
      if (previousFilePath && findMessage.image) {
        const { data: removeData, error: removeError } = await supabase.storage
          .from("Message Images")
          .remove([previousFilePath]);

        if (removeError) throw new Error(removeError.message);
        if (!removeData || removeData.length === 0)
          throw new Error(
            "File was not deleted (RLS policy or previousFilePath most likely).",
          );
      }

      // get the publicUrl after preparations are complete
      const { data: urlData } = supabase.storage
        .from("Message Images")
        .getPublicUrl(filePath);

      imageUrl = urlData.publicUrl;
    } else {
      // if no image this time, simply delete previous image
      const previousFilePath = getFilePathFromPublicUrl(findMessage.image);
      if (previousFilePath && findMessage.image) {
        const { data: removeData, error: removeError } = await supabase.storage
          .from("Message Images")
          .remove([previousFilePath]);

        if (removeError) throw new Error(removeError.message);
        if (!removeData || removeData.length === 0)
          throw new Error(
            "File was not deleted (RLS policy or previousFilePath most likely).",
          );
      }
    }

    const updatedMessage = await updateMessage(messageId, message, imageUrl);

    return res.json({
      apiVersion: "1.0",
      status: "success",
      data: updatedMessage,
      errors: null,
    });
  } catch (err) {
    next(err);
  }
}

async function deleteChatMessage(req, res, next) {
  const { messageId } = req.params;
  const { userId } = req.body;

  try {
    const jwtToken = req.headers["authorization"].split(" ")[1];
    const userIdMatches = jwtUserIdMatches(userId, jwtToken);
    if (!userIdMatches)
      throw new Error("Signed in user's id doesn't match params user id.");

    const findMessage = await findMessageById(messageId);
    const userIsSender = findMessage.senderId === Number(userId);
    if (!userIsSender)
      throw new Error("You are not the sender of this message.");

    const deletedMessage = await deleteMessage(messageId);

    return res.json({
      apiVersion: "1.0",
      status: "success",
      data: deletedMessage,
      errors: null,
    });
  } catch (err) {
    next(err);
  }
}

export {
  getAllChats,
  getAllChatMessages,
  postChatMessage,
  putChatMessage,
  deleteChatMessage,
};
