// app.js
import express from "express";
import { router as messageRoutes } from "./routes/messageRoutes.js";

const app = express();

app.use(express.json());

app.use("/send-message", messageRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
