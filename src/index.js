// app.js
import express from "express";
import { router as messageRoutes } from "./routes/messageRoutes.js";
import { upload } from "./middleware/multerMiddleware.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(
  "/assets/images",
  express.static(path.join(__dirname, "../assets/images"))
);

// Use the 'upload' middleware for all routes under '/send-message'
app.use("/send-message", upload.single("foto"), messageRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
