// producer.js
const express = require("express");
const { Kafka } = require("kafkajs");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 3000;

const kafka = new Kafka({
  clientId: "race-producer",
  brokers: ["localhost:9092"],
});

const producer = kafka.producer();

const storage = multer.diskStorage({
  destination: path.join(__dirname, "uploads"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.post("/sendRaceData", upload.single("foto"), async (req, res) => {
  try {
    const {
      id_kendaraan,
      no_polisi,
      id_pengemudi,
      nama_driver,
      id_msm,
      kondisi_kendaraan,
      action,
      empty_load,
      keterangan,
      memo,
      customer,
      posisi,
      longitude,
      latitude,
      tujuan,
      id_user,
    } = req.body;
    const foto = req.file ? `uploads/${req.file.filename}` : null;

    const key = (Math.floor(Math.random() * 10) + 1).toString();

    await producer.send({
      topic: "Race",
      messages: [
        {
          key,
          value: JSON.stringify({
            id_kendaraan,
            no_polisi,
            id_pengemudi,
            nama_driver,
            id_msm,
            kondisi_kendaraan,
            action,
            empty_load,
            keterangan,
            memo,
            customer,
            posisi,
            longitude,
            latitude,
            tujuan,
            foto,
            id_user,
          }),
        },
      ],
    });

    // Append the request body to a text file
    const logFilePath = path.join(__dirname, "request_logs.txt");
    const logMessage = JSON.stringify(req.body) + "\n";
    fs.appendFileSync(logFilePath, logMessage);

    res
      .status(200)
      .json({ success: true, message: 'Data sent to Kafka topic "Race".' });
  } catch (error) {
    console.error("Error sending data to Kafka:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

const startProducer = async () => {
  await producer.connect();
  console.log("Kafka producer connected");

  app.listen(port, () => {
    console.log(`Producer API is running at http://localhost:${port}`);
  });
};

startProducer().catch((error) => {
  console.error("Error starting producer:", error);
});
