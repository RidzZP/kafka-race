// messageController.js
import { sendToKafka } from "../services/kafkaService.js";
import { saveDataToMySQL } from "../models/databaseModel.js";

export async function sendMessage(req, res) {
  try {
    const { name, age, job } = req.body;
    const key = String(Math.floor(Math.random() * 10) + 1);
    const photoPath = req.file ? `assets/images/${req.file.filename}` : null;

    await sendToKafka(name, age, job, req.file);
    await saveDataToMySQL(name, age, job, photoPath);

    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
