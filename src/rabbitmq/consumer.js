const amqp = require("amqplib");
const EmailService = require("../services/email.service");

async function consume() {
  const conn = await amqp.connect(process.env.RABBITMQ_URL + "?heartbeat=30");
  const channel = await conn.createChannel();

  const exchange = "email_events";

  await channel.assertExchange(exchange, "fanout", {
    durable: false
  });

  // Cola efímera y única por instancia
  const q = await channel.assertQueue("", {
    exclusive: true,
    autoDelete: true
  });

  channel.bindQueue(q.queue, exchange, "");

  console.log("EmailService escuchando exchange:", exchange);

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
