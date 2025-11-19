// 1. Mockear nodemailer ANTES de importar el servicio
jest.mock("nodemailer", () => ({
  createTransport: jest.fn()
}));

const nodemailer = require("nodemailer");

// Mock del sendMail
const sendMailMock = jest.fn().mockResolvedValue(true);

// Configurar el mock de createTransport
nodemailer.createTransport.mockReturnValue({
  sendMail: sendMailMock
});

// 2. Ahora sí importar el servicio (ya mockeado)
const EmailService = require("../src/services/email.service");

describe("EmailService.sendReportEmail", () => {

  test("Debe enviar un correo con los datos correctos", async () => {
    const payload = {
      to: "test@example.com",
      userName: "danna",
      reportName: "Reporte de Prueba",
      generatedAt: new Date().toISOString()
    };

    await EmailService.sendReportEmail(payload);

    expect(sendMailMock).toHaveBeenCalledTimes(1);
    expect(sendMailMock).toHaveBeenCalledWith({
      from: process.env.EMAIL_USER,
      to: "test@example.com",
      subject: "SYX | Reporte de Prueba",
      text: expect.stringContaining("Reporte generado por: danna")
    });
  });
});
