// kafkaService.js
import { producer } from "../config/kafkaConfig.js";

export async function sendToKafka(name, age, job, file) {
  try {
    await producer.connect();

    const key = String(Math.floor(Math.random() * 10) + 1);
    const photoPath = file ? `assets/images/${file.filename}` : null;

    await producer.send({
      topic: "Race",
      messages: [
        {
          key,
          value: JSON.stringify({ name, age, job, key, photoPath }),
        },
      ],
    });
  } finally {
    await producer.disconnect();
  }
}
