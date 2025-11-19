jest.mock("amqplib");
jest.mock("../src/services/email.service");

const amqp = require("amqplib");
const EmailService = require("../src/services/email.service");
const consume = require("../src/rabbitmq/consumer");

describe("RabbitMQ Consumer", () => {
    let channelMock;
    let connectMock;

    beforeEach(() => {
        channelMock = {
            assertExchange: jest.fn(),
            assertQueue: jest.fn().mockResolvedValue({ queue: "email_queue" }),
            bindQueue: jest.fn(),
            consume: jest.fn(),
            ack: jest.fn(),
            nack: jest.fn(),
        };

        connectMock = {
            createChannel: jest.fn().mockResolvedValue(channelMock)
        };

        amqp.connect.mockResolvedValue(connectMock);
    });

    test("Debe consumir mensajes y llamar EmailService.sendReportEmail", async () => {
        await consume();

        const fakeMsg = {
            content: Buffer.from(JSON.stringify({
                to: "test@example.com",
                userName: "daniel",
                reportName: "Reporte X",
                generatedAt: new Date().toISOString()
            }))
        };

        const consumeCallback = channelMock.consume.mock.calls[0][1];

        EmailService.sendReportEmail.mockResolvedValue(true);

        await consumeCallback(fakeMsg);

        expect(EmailService.sendReportEmail).toHaveBeenCalledTimes(1);
        expect(channelMock.ack).toHaveBeenCalledWith(fakeMsg);
    });

    test("Debe llamar nack si hay error enviando el correo", async () => {
        await consume();

        const fakeMsg = {
            content: Buffer.from(JSON.stringify({ test: true }))
        };

        const cb = channelMock.consume.mock.calls[0][1];

        // 🟣 Evita que el test imprima el console.error
        const consoleErrorMock = jest.spyOn(console, "error").mockImplementation(() => { });

        EmailService.sendReportEmail.mockRejectedValue(new Error("Error SMTP"));

        await cb(fakeMsg);

        expect(channelMock.nack).toHaveBeenCalledWith(fakeMsg, false, false);

        // 🟣 Restaurar consola original
        consoleErrorMock.mockRestore();
    });
});
