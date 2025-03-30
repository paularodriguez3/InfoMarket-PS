import { getImageUrl } from "../firebase/firebase.js";
import { addToCart } from "../shopping-cart/shopping-cart.js";

let quantity= 1;

document.addEventListener("DOMContentLoaded", async () => {
    const producto = JSON.parse(localStorage.getItem("productoSeleccionado"));
    //console.log(producto.id);
    //console.log(producto.data);
    const imagen = await getImageUrl(producto.data.Imagen);

    document.querySelector("#image").src = imagen;
    document.querySelector("#product-name").textContent = producto.data.Nombre;
    document.querySelector("#product-desc").textContent = producto.data.Descripcion;
    document.querySelector("#price").textContent = producto.data.Precio;
    document.querySelector("#qty-value").textContent = quantity;

    const caracteristicas = document.getElementById("product-features");

    Object.entries(producto.data.Caracteristicas).forEach(([clave, valor]) => {
        const caracteristica = document.createElement("p");
        caracteristica.textContent = `${clave}: ${valor}`;
        caracteristicas.appendChild(caracteristica);
    });

    const addToCartButton = document.getElementById("add-to-cart");
    addToCartButton.addEventListener("click", () => {
        addToCart(producto, quantity);
    });

    const plus = document.getElementById("plus");
    plus.addEventListener("click", () => {
        quantity++;
        document.querySelector("#qty-value").textContent = quantity;
        document.querySelector("#price").textContent = Math.round(parseFloat(producto.data.Precio)*quantity*100)/100;
    });

    const minus = document.getElementById("minus");
    minus.addEventListener("click", () => {
        if (quantity !== 1) {
            quantity--;
            document.querySelector("#qty-value").textContent = quantity;
            document.querySelector("#price").textContent = Math.round(parseFloat(producto.data.Precio)*quantity*100)/100
        }
    });
});
