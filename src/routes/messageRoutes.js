// messageRoutes.js
import express from "express";
import { sendStatus } from "../controllers/statusController.js";

const router = express.Router();

router.post("/status", sendStatus);
export { router };
