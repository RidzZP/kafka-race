// messageRoutes.js
import express from "express";
import { sendMessage } from "../controllers/messageController.js";
import { sendStatus, updateStatus } from "../controllers/statusController.js";

const router = express.Router();

router.post("/", sendMessage);
router.post("/status", sendStatus);
router.post("/update-status", updateStatus);

export { router };
