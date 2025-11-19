const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

class EmailService {
  static async sendReportEmail({ to, userName, reportName, generatedAt }) {
    const date = new Date(generatedAt).toLocaleString("es-CO", {
      timeZone: "America/Bogota"
    });

    const subject = `SYX | ${reportName}`;

    const text = `
Reporte generado por: ${userName}
Nombre del reporte: ${reportName}
Fecha de generación: ${date}
`.trim();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
    });

    console.log("Correo enviado:", to);
  }
}

module.exports = EmailService;
