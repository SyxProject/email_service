
import { Kafka } from "kafkajs";
import emailService from "../services/email.service.js";

const kafka = new Kafka({
  clientId: "email-service",
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"]
});

const consumer = kafka.consumer({ groupId: "email-service-group" });

export async function startConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: "email_notifications" });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const payload = JSON.parse(message.value.toString());
      await emailService.sendNotification(payload);
    }
  });
}
