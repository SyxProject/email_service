require('dotenv').config()
const express = require('express')
const consume = require('./rabbitmq/consumer')

const app = express()
const port = process.env.PORT || 4000

consume()

app.listen(port, () => {
  console.log(`Event Service escuchando en puerto ${port}`)
  startConsumer().catch(console.error)
})