
import nodemailer from "nodemailer";

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NOTIFY_EMAIL_USER,
        pass: process.env.NOTIFY_EMAIL_PASS
      }
    });
  }

  buildHtml({ username, reportName, generatedAt }) {
    return `
      <h1>Nuevo Reporte Generado</h1>
      <p>Usuario: <strong>${username}</strong></p>
      <p>Reporte: <strong>${reportName}</strong></p>
      <p>Fecha: ${generatedAt}</p>
    `;
  }

  async sendNotification({ to, username, reportName, generatedAt }) {
    const html = this.buildHtml({ username, reportName, generatedAt });

    await this.transporter.sendMail({
      from: process.env.NOTIFY_EMAIL_USER,
      to,
      subject: `Reporte generado: ${reportName}`,
      html
    });
  }
}

export default new EmailService();
