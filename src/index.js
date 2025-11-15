
import { startConsumer } from "./kafka/consumer.js";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  console.log("Email service listening to Kafka...");
  await startConsumer();
}

main();
