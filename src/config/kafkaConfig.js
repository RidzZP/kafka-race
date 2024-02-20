// kafkaConfig.js
import { Kafka, Partitioners } from "kafkajs";

const kafka = new Kafka({
  brokers: ["localhost:9092"],
});

const producer = kafka.producer({
  createPartitioner: Partitioners.DefaultPartitioner,
});

export { producer };
