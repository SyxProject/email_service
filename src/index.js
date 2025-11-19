require('dotenv').config()
const consume = require('./rabbitmq/consumer')

console.log("Email service iniciado. Esperando eventos...")
consume()
