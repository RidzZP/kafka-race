// messageController.js
import { sendToKafka } from "../services/kafkaService.js";
import { saveDataToMySQL } from "../models/databaseModel.js";

export async function sendMessage(req, res) {
  try {
    const { name, age, job, foto } = req.body;

    await sendToKafka(name, age, job, foto);
    await saveDataToMySQL(name, age, job, foto);

    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
