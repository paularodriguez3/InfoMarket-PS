import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:4200'
}));

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

const DEEPL_API_KEY = process.env.DEEPL_API_KEY;

if (!DEEPL_API_KEY) {
    throw new Error('No se encontró DEEPL_API_KEY en el archivo .env');
}

const DEEPL_API_URL = 'https://api-free.deepl.com/v2/translate';

const translateText = async (text, to) => {
    if (!text || typeof text !== 'string' || text.trim() === '') return text;

    const res = await axios.post(
        DEEPL_API_URL,
        new URLSearchParams({
            auth_key: DEEPL_API_KEY,
            text,
            source_lang: 'ES',
            target_lang: to.toUpperCase()
        })
    );

    return res.data.translations[0].text;
};

/*app.post('/translate-product', async (req, res) => {
    const product = req.body;
    const langs = { en: 'EN', fr: 'FR', zh: 'ZH' };

    if (
        !product?.Nombre?.es ||
        !product?.Descripcion?.es ||
        typeof product.Caracteristicas !== 'object'
    ) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    try {
        const nombreEs = product.Nombre.es;
        const descripcionEs = product.Descripcion.es;

        // Convertir Características ES de objeto a array
        const caracteristicasEs = Object.entries(product.Caracteristicas).map(([clave, valor]) => ({
            clave,
            valor
        }));

        // Inicializar
        product.Nombre = { es: nombreEs };
        product.Descripcion = { es: descripcionEs };
        product.Caracteristicas = { es: caracteristicasEs };

        // Traducir Nombre y Descripcion
        for (const [langKey, deeplLang] of Object.entries(langs)) {
            product.Nombre[langKey] = await translateText(nombreEs, deeplLang);
            product.Descripcion[langKey] = await translateText(descripcionEs, deeplLang);
        }

        // Traducir Características
        for (const [langKey, deeplLang] of Object.entries(langs)) {
            const traducciones = [];

            for (const { clave, valor } of caracteristicasEs) {
                const claveTraducida = await translateText(clave, deeplLang);
                const valorTraducido = await translateText(valor, deeplLang);
                traducciones.push({ clave: claveTraducida, valor: valorTraducido });
            }

            product.Caracteristicas[langKey] = traducciones;
        }

        res.json(product);
    } catch (error) {
        console.error('Error al traducir:', error.response?.data || error.message);
        res.status(500).json({ error: 'Error al traducir con DeepL' });
    }
});*/

app.post('/translate-product', async (req, res) => {
    const product = req.body;
    const langs = { en: 'EN', fr: 'FR', zh: 'ZH' };

    if (
        !product?.Nombre?.es ||
        !product?.Descripcion?.es ||
        typeof product.Caracteristicas !== 'object'
    ) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    try {
        const nombreEs = product.Nombre.es;
        const descripcionEs = product.Descripcion.es;

        // Convertir Características ES de objeto a array si no lo está
        const caracteristicasEs = Array.isArray(product.Caracteristicas.es)
            ? product.Caracteristicas.es
            : Object.entries(product.Caracteristicas).map(([clave, valor]) => ({ clave, valor }));

        // Asegurar estructura consistente
        product.Nombre = { es: nombreEs, ...product.Nombre };
        product.Descripcion = { es: descripcionEs, ...product.Descripcion };
        product.Caracteristicas = { es: caracteristicasEs, ...product.Caracteristicas };

        // Traducir Nombre y Descripcion solo si no están traducidos
        for (const [langKey, deeplLang] of Object.entries(langs)) {
            if (!product.Nombre[langKey]) {
                product.Nombre[langKey] = await translateText(nombreEs, deeplLang);
            }
            if (!product.Descripcion[langKey]) {
                product.Descripcion[langKey] = await translateText(descripcionEs, deeplLang);
            }
        }

        // Traducir Características
        for (const [langKey, deeplLang] of Object.entries(langs)) {
            if (!product.Caracteristicas[langKey]) {
                product.Caracteristicas[langKey] = [];
            }

            // Traducciones existentes
            const existentes = product.Caracteristicas[langKey];

            for (const { clave, valor } of caracteristicasEs) {
                const yaTraducida = existentes.find(e =>
                    e.clave?.toLowerCase?.() === clave.toLowerCase() ||
                    e.valor?.toLowerCase?.() === valor.toLowerCase()
                );

                if (!yaTraducida) {
                    const claveTraducida = await translateText(clave, deeplLang);
                    const valorTraducido = await translateText(valor, deeplLang);
                    product.Caracteristicas[langKey].push({ clave: claveTraducida, valor: valorTraducido });
                }
            }
        }

        res.json(product);
    } catch (error) {
        console.error('Error al traducir:', error.response?.data || error.message);
        res.status(500).json({ error: 'Error al traducir con DeepL' });
    }
});

app.listen(3000, () => console.log("Servidor corriendo en puerto 3000"));
