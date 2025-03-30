import { loadPayPalSDK } from '../../config.js';

document.addEventListener("DOMContentLoaded", async function() {
    try {
        await loadPayPalSDK();

        let precioOriginal = 10.00;
        let precioFinal = precioOriginal;

        const totalAmountElement = document.getElementById("total-amount");
        const discountInput = document.getElementById("discount-code");
        const applyDiscountButton = document.getElementById("apply-discount");

        // Lista de códigos de descuento válidos
        const descuentos = {
            "DESCUENTO5": 5.00,  // Código "DESCUENTO5" aplica 5€ de descuento
            "DESCUENTO2": 2.00   // Código "DESCUENTO2" aplica 2€ de descuento
        };

        // Aplicar código de descuento
        applyDiscountButton.addEventListener("click", function() {
            const codigo = discountInput.value.trim().toUpperCase();

            if (descuentos[codigo]) {
                precioFinal = Math.max(precioOriginal - descuentos[codigo], 0);
                alert(`Código aplicado. Nuevo total: ${precioFinal.toFixed(2)}€`);
            } else {
                precioFinal = precioOriginal;
                alert("Código inválido o expirado.");
            }

            totalAmountElement.innerText = precioFinal.toFixed(2);
        });

        paypal.Buttons({
            funding: {
                disallowed: [paypal.FUNDING.CREDIT, paypal.FUNDING.DEBIT]
            },
            createOrder: function(data, actions) {
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: precioFinal.toFixed(2)
                        }
                    }]
                });
            },
            onApprove: function(data, actions) {
                return actions.order.capture().then(function(details) {
                    alert('Pago realizado con éxito por ' + details.payer.name.given_name);
                });
            },
            onError: function(err) {
                alert('Ha ocurrido un error en el proceso de pago: ' + err);
            }
        }).render('#paypal-button-container');

    } catch (error) {
        console.error('Error al cargar PayPal SDK:', error);
        alert('Error al cargar el sistema de pagos. Por favor, recarga la página.');
    }
});
