
import { readCollection } from "../firebase/firebase.js";


const shoppingCart = [];

// PRUEBA CON LA BASE DE DATOS
document.addEventListener("DOMContentLoaded", async () => {
    const test_data = await readCollection("productos/Informática/Ordenadores");
    for (let product in test_data) {
        addToCart({[product]:test_data[product]});
    }
    console.log(shoppingCart);

    await showShoppingCart();
});
// =============================

async function showShoppingCart() { // TODO: Finish showShoppingCart()
    // Obtener el template de product-info-component
    await loadProductInfoComponent();
    const template = document.getElementById("product-info-template").content;

    // Obtener el elemento shopping-cart
    const shoppingCartList = document.getElementById("shopping-cart");
    shoppingCart.forEach(databaseElement => {
        for (let id in databaseElement) {
            let element = databaseElement[id];
            // Cargar el template
            const item = document.importNode(template, true);
            console.log(item);

            // Modificar valores del template
            console.log(element.Imagen);
            item.querySelector("#image").src = element.Imagen;
            item.querySelector("#product-name").textContent = element.Nombre;
            item.querySelector("#product-desc").textContent = element.Desc;
            item.querySelector("#product-quantity").textContent = element.Quantity;
            item.querySelector("#product-price").textContent = element.Price;

            // Añadir componente
            shoppingCartList.appendChild(item);
        }
    });
}

function addToCart(item) {
    shoppingCart.push(item);
}

async function loadProductInfoComponent() {
    const productInfoComponent = await fetch("../../templates/shopping-info-component/product-info-component.html");
    const text = await productInfoComponent.text();
    const productInfoDiv = document.createElement("div");
    productInfoDiv.innerHTML = text;
    document.body.appendChild(productInfoDiv);
}