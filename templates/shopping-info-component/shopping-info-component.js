import {getImageUrl} from "../../scripts/firebase/firebase.js";

function waitForElement(selector, callback) {
    const element = document.querySelector(selector);
    if (element) {
        callback();
    } else {
        setTimeout(() => waitForElement(selector, callback), 100);
    }
}

waitForElement("#products-info-component", () => {
    showShoppingCart();
});

async function showShoppingCart() {
    await loadProductInfoComponent();
    const template = document.getElementById("product-info-template").content;

    const shoppingInfo = document.getElementById("products-info-component");

    const shoppingCart = JSON.parse(localStorage.getItem("carrito")) || [];
    let totalPrice = 0;
    for (const item of shoppingCart) {
        const itemComponent = document.importNode(template, true);

        itemComponent.querySelector("#image").src = await getImageUrl(item.data.Imagen);
        itemComponent.querySelector("#product-name-component").textContent = item.data.Nombre;
        itemComponent.querySelector("#product-desc-component").textContent = item.data.Descripcion;
        itemComponent.querySelector("#product-quantity-component").textContent = "Qty: " + item.Cantidad;
        let price= parseFloat(item.data.Precio) * parseFloat(item.Cantidad);
        itemComponent.querySelector("#product-price-component").textContent = Math.round(price * 100)/100 + "€";
        totalPrice += price;

        shoppingInfo.appendChild(itemComponent);
    }
    document.getElementById("shopping-info-total-price").innerText = Math.round(totalPrice*100)/100 + "€";
    //console.log(shoppingCart);
}

async function loadProductInfoComponent() {
    const productInfoComponent = await fetch("../../templates/shopping-info-component/product-info-component.html");
    const text = await productInfoComponent.text();
    const productInfoDiv = document.createElement("div");
    productInfoDiv.innerHTML = text;
    document.body.appendChild(productInfoDiv);
}