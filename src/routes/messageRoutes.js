// messageRoutes.js
import express from "express";
import { sendMessage } from "../controllers/messageController.js";
import plugins from "../plugins/uploader.js";

const router = express.Router();

router.post("/", plugins.createStatus, sendMessage);

export { router };
