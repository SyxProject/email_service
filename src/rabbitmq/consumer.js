const amqp = require("amqplib");
const EmailService = require("../services/email.service");

async function consume() {
  const conn = await amqp.connect(process.env.RABBITMQ_URL + "?heartbeat=30");
  const channel = await conn.createChannel();

  const exchange = "email_events";

  await channel.assertExchange(exchange, "fanout", {
    // Hacemos durable el exchange para que sobreviva reinicios si se requiere
    durable: true
  });

  // Cola nombrada `email_queue` permanente (la cola permanece en broker)
  // - `exclusive: false` -> permite múltiples consumidores conectados
  // - `autoDelete: false` -> la cola NO se borra automáticamente
  // - `durable: true` -> la cola persiste en el broker
  const q = await channel.assertQueue("email_queue", {
    exclusive: false,
    autoDelete: false,
    durable: true
  });

  await channel.bindQueue(q.queue, exchange, "");

  console.log("EmailService escuchando exchange:", exchange, "queue:", q.queue);

  channel.consume(q.queue, async msg => {
    if (!msg) return;

    const data = JSON.parse(msg.content.toString());
    console.log("Evento recibido:", data);

    try {
      await EmailService.sendReportEmail(data);
      channel.ack(msg);
    } catch (err) {
      console.error("Error enviando correo:", err);
      channel.nack(msg, false, false);
    }
  });
}

module.exports = consume;
