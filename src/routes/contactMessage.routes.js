import express from "express";
import {
  createMessage,
  getAllMessages,
  getMessageById,
  markRead,
  replyMessage,
  deleteMessage,
} from "../controllers/contactMessage.controller.js";

const router = express.Router();

// user
router.post("/", createMessage);

// admin
router.get("/", getAllMessages);
router.get("/:id", getMessageById);
router.put("/:id/read", markRead);
router.put("/:id/reply", replyMessage);
router.delete("/:id", deleteMessage);

export default router;
