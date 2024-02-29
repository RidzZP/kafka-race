// consumer.js
const { Kafka } = require("kafkajs");
const mysql = require("mysql2/promise");

const kafka = new Kafka({
  clientId: "race-consumer",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "eureka" });

const mysqlConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "kafka_race",
};

const runConsumer = async () => {
  const connection = await mysql.createConnection(mysqlConfig);
  console.log("Connected to MySQL");

  await consumer.connect();
  console.log("Kafka consumer connected");

  await consumer.subscribe({ topic: "Race", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const key = message.key.toString();
      const value = JSON.parse(message.value.toString());

      console.log(
        `Received message on partition ${message.partition} with key ${key}:`,
        value
      );

      const [existingData] = await connection.query(
        "SELECT * FROM kendaraanstatus WHERE id_msm = ? AND empty_load = ?",
        [value.id_msm, value.empty_load]
      );

      if (existingData.length > 0) {
        console.log("Data already exist.");
      } else {
        try {
          await connection.query(
            "INSERT INTO kendaraanstatus (id_kendaraan, no_polisi, id_pengemudi, nama_driver, id_msm, kondisi_kendaraan, action, empty_load, keterangan, memo, customer, posisi, longitude, latitude, tujuan, foto, tgl_update, id_user, tgl_create ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW(),?,NOW())",
            [
              value.id_kendaraan,
              value.no_polisi,
              value.id_pengemudi,
              value.nama_driver,
              value.id_msm,
              value.kondisi_kendaraan,
              value.action,
              value.empty_load,
              value.keterangan,
              value.memo,
              value.customer,
              value.posisi,
              value.longitude,
              value.latitude,
              value.tujuan,
              value.foto,
              value.id_user,
            ]
          );
          console.log("Data saved to MySQL");
        } catch (error) {
          console.error("Error saving data to MySQL:", error);
        }
      }
    },
  });
};

runConsumer().catch((error) => {
  console.error("Error running consumer:", error);
});
