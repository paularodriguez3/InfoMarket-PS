const express = require("express");
const cors = require("cors");  // <-- Agregar esto
const stripe = require("stripe")("sk_test_51R1VB9J0MkHlyoxIRxG3yGD1h1Ik67ZVKgFisSpDpo2ZHOINqUXqqIEJUz6PbSLDaYbhvDvh1lO8vQFxVwaXWj3u00DCSqTJrY"); // Tu clave secreta de Stripe
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
                        currency: "EUR",
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

        res.json({ id: session.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log("Servidor en http://localhost:3000"));