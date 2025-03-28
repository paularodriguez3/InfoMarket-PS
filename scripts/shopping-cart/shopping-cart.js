import {getImageUrl, readCollection} from "../firebase/firebase.js";


const shoppingCart = JSON.parse(localStorage.getItem("carrito")) || [];

document.addEventListener("DOMContentLoaded", async () => {
    await showShoppingCart();
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

async function showShoppingCart() { // TODO: Finish showShoppingCart()
    // Obtener el template de product-info-component
    await loadProductInfoComponent();
    const template = document.getElementById("product-info-template").content;

    // Obtener el elemento shopping-cart
    const shoppingCartList = document.getElementById("shopping-cart-list");

    for (const item of shoppingCart) {
        // Cargar el template
        const itemComponent = document.importNode(template, true);

        // Modificar valores del template
        itemComponent.querySelector("#image").src = await getImageUrl(item.data.Imagen);
        itemComponent.querySelector("#product-name-component").textContent = item.data.Nombre;
        itemComponent.querySelector("#product-desc-component").textContent = item.data.Descripcion;
        itemComponent.querySelector("#product-quantity-component").textContent = "Qty: " + item.Cantidad;
        itemComponent.querySelector("#product-price-component").textContent = item.data.Precio;

        // Añadir botones
        const plus = itemComponent.getElementById("button-plus");
        const minus = itemComponent.getElementById("button-minus");
        console.log(plus.classList);
        plus.classList.remove("hidden-button");
        minus.classList.remove("hidden-button");
        console.log(plus.classList);
        // Añadir componente
        shoppingCartList.appendChild(itemComponent);
    }
    console.log(shoppingCart);
}

export function addToCart(item, quantity) {
    console.log(item);
    const cartItem = shoppingCart.find(e => e.id === item.id); // FIXME: Evitar guardar el mismo item varias veces
    if (!cartItem) {
        const newItem = Object.assign(Object.create(null), item, {Cantidad: 1}); // TODO: Ver como clonar el objeto sin prototype
                                                                                         // TODO: O añadir el atributo Cantidad al prototype
        shoppingCart.push(newItem);
    } else {
        cartItem.Cantidad = cartItem.Cantidad + 1;
    }
    console.log(shoppingCart);
}

async function loadProductInfoComponent() {
    const productInfoComponent = await fetch("../../templates/shopping-info-component/product-info-component.html");
    const text = await productInfoComponent.text();
    const productInfoDiv = document.createElement("div");
    productInfoDiv.innerHTML = text;
    document.body.appendChild(productInfoDiv);
}