const stripe = Stripe("pk_test_51R1VB9J0MkHlyoxI1GYDWpqnm420dGyipLSiqJDBYzIzHHO1Y2CMXLrTNKLQO0XqvEOHujATwlACaxhz413mHKJf00NkIcKh7a");

document.getElementById("checkout-button").addEventListener("click", async () => {
    const response = await fetch("http://localhost:3000/crear-sesion-pago", { method: "POST" });
    const session = await response.json();
    console.log(session);

    const result = await stripe.redirectToCheckout({ sessionId: session.id });
    if (result.error) {
        alert(result.error.message);
    }
});