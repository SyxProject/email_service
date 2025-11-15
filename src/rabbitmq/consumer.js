const amqp = require('amqplib')
const EmailService = require('../services/email.service')

async function consume() {
  const conn = await amqp.connect(process.env.RABBITMQ_URL + "?heartbeat=30")
  const channel = await conn.createChannel()
  const queue = 'email-queue'

  await channel.assertQueue(queue, { durable: true })
  console.log("Escuchando cola:", queue)

  channel.consume(queue, async msg => {
    if (!msg) return

    const data = JSON.parse(msg.content.toString())
    console.log("Evento recibido:", data)

    try {
      await EmailService.send(data)
      channel.ack(msg)
    } catch (err) {
      console.error("Error enviando correo:", err)
      channel.nack(msg, false, false) // descartar el mensaje si falla
    }
  })
}

module.exports = consume
