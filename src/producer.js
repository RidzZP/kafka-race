import express from "express";
import { Kafka, Partitioners } from "kafkajs";
import mysql from "mysql";

const app = express();
const kafka = new Kafka({
  brokers: ["localhost:9092"],
});

const producer = kafka.producer({
  createPartitioner: Partitioners.DefaultPartitioner,
});

// config mysql
const dbConfig = {
  host: "localhost",
  user: "root",
  database: "kafka",
};

// membuat pool
const pool = mysql.createPool(dbConfig);

app.use(express.json());

app.post("/send-message", async (req, res) => {
  try {
    const { nama, pekerjaan, negara } = req.body;

    await producer.connect();

    const key = String(Math.floor(Math.random() * 10) + 1);

    await producer.send({
      topic: "user",
      messages: [
        {
          key,
          value: JSON.stringify({ nama, pekerjaan, negara, key }),
        },
      ],
    });

    setTimeout(async () => {
      try {
        // Save ke mysql
        await saveDataToMySQL(nama, pekerjaan, negara);
        console.log("Data saved to MySQL");
      } catch (error) {
        console.error("Error saving data to MySQL:", error);
      }
    }, 2 * 60 * 1000); // interval 2 minute

    await producer.disconnect();

    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

async function saveDataToMySQL(nama, pekerjaan, negara) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }

      const sql = "INSERT INTO test (nama, pekerjaan, negara) VALUES (?, ?, ?)";
      const params = [nama, pekerjaan, negara];

      connection.query(sql, params, (error, results) => {
        connection.release();
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  });
}
