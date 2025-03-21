import { paymentApiKeyCreditCard } from '../../config.js';

const express = require("express");
const cors = require("cors");
const {paymentApiKeyCreditCard} = require("../../config");  // <-- Agregar esto
const stripe = require("stripe")(paymentApiKeyCreditCard); // Tu clave secreta de Stripe
const app = express();

app.use(cors({
    origin: 'http://localhost:63342' // Aquí tu URL frontend
}));
app.use(express.json());
app.use(express.static("public"));

app.post("/crear-sesion-pago", async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: { name: "Producto de prueba" },
                        unit_amount: 5000, // 50.00 USD
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: "http://localhost:3000",
            cancel_url: "http://localhost:3000",
        });

        // Asegúrate de que el id de la sesión se envíe correctamente
        res.json({ id: session.id });
    } catch (error) {
        console.error(error); // Para ver detalles del error en la consola del servidor
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log("Servidor en http://localhost:3000"));