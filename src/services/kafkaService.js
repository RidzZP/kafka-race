// kafkaService.js
import { producer } from "../config/kafkaConfig.js";

export async function sendToKafka(name, age, job, foto) {
  try {
    await producer.connect();

    const key = String(Math.floor(Math.random() * 10) + 1);

    await producer.send({
      topic: "Race",
      messages: [
        {
          key,
          value: JSON.stringify({ name, age, job, foto, key }),
        },
      ],
    });
  } finally {
    await producer.disconnect();
  }
}
