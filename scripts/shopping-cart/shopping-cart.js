import {getImageUrl, readCollection} from "../firebase/firebase.js";

document.addEventListener("DOMContentLoaded", async () => {
    const shoppingCart = JSON.parse(localStorage.getItem("carrito")) || [];

    await showShoppingCart(shoppingCart);

    const continueShopping = document.getElementById("continue-shopping-button");
    continueShopping.addEventListener("click", () => {
        window.location.href = "../screens/index.html";
    });

    const buy = document.getElementById("buy-button");
    buy.addEventListener("click", () => {
        localStorage.setItem("pedido", JSON.stringify({ productos: shoppingCart, direccion: {}, metodoEnvio: null }));
        window.location.href = "../screens/billing-adress.html";
    });
});

// PRUEBA CON LA BASE DE DATOS
/*document.addEventListener("DOMContentLoaded", async () => {
    const test_data = await readCollection("productos/Informática/Ordenadores");
    for (let product in test_data) {
        addToCart({[product]:test_data[product]});
    }
    console.log(shoppingCart);

    await showShoppingCart();
});*/
// =============================

async function showShoppingCart(shoppingCart) {
    // Obtener el template de product-info-component
    await loadProductInfoComponent();
    const template = document.getElementById("product-info-template").content;

    // Obtener el elemento shopping-cart
    const shoppingCartList = document.getElementById("shopping-cart-list");

    let totalPrice = 0;
    for (const item of shoppingCart) {
        // Cargar el template
        const itemComponent = document.importNode(template, true);

        // Modificar valores del template
        itemComponent.querySelector("#image").src = await getImageUrl(item.data.Imagen);
        itemComponent.querySelector("#product-name-component").textContent = item.data.Nombre;
        itemComponent.querySelector("#product-desc-component").textContent = item.data.Descripcion;
        itemComponent.querySelector("#product-quantity-component").textContent = "Qty: " + item.Cantidad;
        let price= parseFloat(item.data.Precio) * parseFloat(item.Cantidad);
        itemComponent.querySelector("#product-price-component").textContent = price.toFixed(2) + "€";
        totalPrice += price;

        // Añadir botones
        const plus = itemComponent.getElementById("button-plus");
        plus.addEventListener("click", () => {
            addToCart(item, 1);
            window.location.reload();
            showShoppingCart();
        });

        const minus = itemComponent.getElementById("button-minus");
        minus.addEventListener("click", () => {
            removeFromCart(item, 1);
            window.location.reload();
            showShoppingCart();
        });

        plus.classList.remove("hidden-button");
        minus.classList.remove("hidden-button");

        // Añadir componente
        shoppingCartList.appendChild(itemComponent);
    }
    document.getElementById("total-price").innerText = totalPrice.toFixed(2) + "€";

    localStorage.setItem("precio-total", JSON.stringify(totalPrice));
}

export function addToCart(item, quantity) {
    const shoppingCart = JSON.parse(localStorage.getItem("carrito")) || [];
    const cartItem = shoppingCart.find(e => e.id === item.id);
    if (!cartItem) {
        item.Cantidad = quantity;
        shoppingCart.push(item);
    } else {
        cartItem.Cantidad += quantity;
    }
    localStorage.setItem("carrito", JSON.stringify(shoppingCart));
}

function removeFromCart(item) {
    const shoppingCart = JSON.parse(localStorage.getItem("carrito")) || [];
    const cartItem = shoppingCart.find(e => e.id === item.id);
    if (!cartItem) {
        console.log("Objeto no encontrado.");
        return;
    }
    cartItem.Cantidad--;
    if (cartItem.Cantidad === 0) {
        shoppingCart.splice(shoppingCart.indexOf(cartItem), 1);
    }
    localStorage.setItem("carrito", JSON.stringify(shoppingCart));
}

async function loadProductInfoComponent() {
    const productInfoComponent = await fetch("../../templates/shopping-info-component/product-info-component.html");
    const text = await productInfoComponent.text();
    const productInfoDiv = document.createElement("div");
    productInfoDiv.innerHTML = text;
    document.body.appendChild(productInfoDiv);
}