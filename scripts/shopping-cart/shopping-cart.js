import { readCollection } from "../firebase/firebase.js";

const shoppingCart = [];

// PRUEBA CON LA BASE DE DATOS
document.addEventListener("DOMContentLoaded", () => {
    readCollection("productos").then(products =>  {
        for (const product of Object.keys(products)) {
            addToCart(products[product]);
        }
    showShoppingCart();
    });
});
// =============================

function showShoppingCart() { // TODO: Finish showShoppingCart()
    // Obtener shopping-cart-component
    let shoppingCartComponent;

    // Vaciar la lista de shoppingCartComponent

    shoppingCart.forEach(item => {
        console.log(item);

        // Obtener product-info-component
         let productInfoComponent;

        // Modificar productInfoComponent para que sus datos coincidan con item

        // Añadir productInfoComponent a shoppingCartComponent

    });
}
function addToCart(item) {
    shoppingCart.push(item);
}
