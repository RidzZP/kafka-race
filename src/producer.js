import express from "express";
import { Kafka, Partitioners } from "kafkajs";
import mysql from "mysql2/promise"; // Import mysql2 with promise support
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const kafka = new Kafka({
  brokers: ["localhost:9092"],
});

const producer = kafka.producer({
  createPartitioner: Partitioners.DefaultPartitioner,
});

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "assets/images");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const formattedFileName = `foto-${uniqueSuffix}${path.extname(
      file.originalname
    )}`;
    cb(null, formattedFileName);
  },
});

const upload = multer({ storage: storage });

// config mysql2
const dbConfig = {
  host: "localhost",
  user: "root",
  database: "db_tested",
};

// membuat pool
const pool = mysql.createPool(dbConfig);

app.use(express.json());
app.use(
  "/assets/images",
  express.static(path.join(__dirname, "assets/images"))
);

app.post("/send-message", upload.single("foto"), async (req, res) => {
  try {
    const { name, age, job } = req.body;

    await producer.connect();

    const key = String(Math.floor(Math.random() * 10) + 1);

    const photoPath = req.file ? `assets/images/${req.file.filename}` : null;

    await producer.send({
      topic: "Race",
      messages: [
        {
          key,
          value: JSON.stringify({ name, age, job, key, photoPath }),
        },
      ],
    });

    await saveDataToMySQL(name, age, job, photoPath);

    await producer.disconnect();

    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

async function saveDataToMySQL(name, age, job, photoPath) {
  const connection = await pool.getConnection();

  try {
    const sql = "INSERT INTO user (name, age, job, foto) VALUES (?, ?, ?, ?)";
    const params = [name, age, job, photoPath];

    const [results] = await connection.query(sql, params);
    return results;
  } finally {
    connection.release(); // Make sure to release the connection
  }
}
