const nodemailer = require('nodemailer')
const formatDate = require('../utils/formatDate')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

class EmailService {
  static async send({ to, userName, reportName, generatedAt }) {
    const date = formatDate(generatedAt)

    const subject =
      `SYX | Reporte Generado | ${date.slice(0, 10)}`

    const text = `
Reporte generado por: ${userName}
Nombre del reporte: ${reportName}
Fecha de generación: ${date}
    `.trim()

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
    })

    console.log("Correo enviado a:", to)
  }
}

module.exports = EmailService
