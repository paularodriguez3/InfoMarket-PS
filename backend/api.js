import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Configuración del transportador usando Gmail
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

app.post("/send-email", async (req, res) => {
    // Extraemos 'html', ya que es lo que se enviará desde Angular
    const { to, subject, html } = req.body;

    if (!to || !subject || !html) {
        return res.status(400).json({ error: "Faltan parámetros" });
    }

    try {
        const info = await transporter.sendMail({
            from: process.env.GMAIL_USER, // Remitente verificado (tu correo)
            to,                          // Correo del destinatario
            subject,                     // Asunto del correo
            html,                        // Cuerpo del mensaje en HTML (directamente la plantilla)
            text: html.replace(/<[^>]+>/g, ''), // Texto plano generado a partir del HTML (opcional)
        });

        console.log("Correo enviado:", info);
        res.json({ message: "Correo enviado correctamente", info });
    } catch (error) {
        console.error("Error enviando correo:", error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log("Servidor corriendo en puerto 3000"));
