// messageController.js
import { sendToKafka } from "../services/kafkaService.js";
import { saveDataToMySQL } from "../models/databaseModel.js";
import multer from "multer"; // Import multer for handling file uploads
import path from "path";

// Set up multer storage to store images in the specified directory
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "assets/images/race");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage: storage }).single("foto");

export async function sendMessage(req, res) {
  try {
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
      } else if (err) {
        return res.status(500).json({ error: err.message });
      }

      const { name, age, job } = req.body;
      const foto = req.file.filename; // Use the filename generated by multer

      await sendToKafka(name, age, job, foto);
      await saveDataToMySQL(name, age, job, foto);

      res.status(200).json({ message: "Message sent successfully" });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
