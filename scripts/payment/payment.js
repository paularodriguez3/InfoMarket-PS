import { loadPayPalSDK } from '../../config.js';

document.addEventListener("DOMContentLoaded", async function() {
    try {
        await loadPayPalSDK();

        paypal.Buttons({
            funding: {
                disallowed: [paypal.FUNDING.CREDIT, paypal.FUNDING.DEBIT]
            },
            createOrder: function(data, actions) {
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: '10.00'
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