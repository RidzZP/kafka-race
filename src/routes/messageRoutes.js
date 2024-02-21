// messageRoutes.js
import express from "express";
import { sendMessage } from "../controllers/messageController.js";
import { sendStatus } from "../controllers/statusController.js";

const router = express.Router();

router.post("/", sendMessage);
router.post("/status", sendStatus);

export { router };
