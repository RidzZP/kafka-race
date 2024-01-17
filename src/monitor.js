import { Kafka } from "kafkajs";

const kafka = new Kafka({
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "nodejs" });

const bytesToKB = (bytes) => (bytes / 1024).toFixed(2);
const bytesToMB = (bytes) => (bytes / (1024 * 1024)).toFixed(2);

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "user", fromBeginning: true });

  await consumer.run({
    eachBatch: async ({ batch }) => {
      console.log(`Received batch with ${batch.messages.length} messages`);
      const totalSizeBytes = batch.messages.reduce(
        (acc, message) => acc + message.value.length,
        0
      );

      console.log(`Total size of messages in batch: ${totalSizeBytes} bytes`);
      console.log(`Total size in KB: ${bytesToKB(totalSizeBytes)} KB`);
      console.log(`Total size in MB: ${bytesToMB(totalSizeBytes)} MB`);
    },
  });
};

run().catch(console.error);
