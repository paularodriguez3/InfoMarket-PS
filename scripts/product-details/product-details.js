import { getImageUrl } from "../firebase/firebase.js";

document.addEventListener("DOMContentLoaded", async () => {
    const producto = JSON.parse(localStorage.getItem("productoSeleccionado"));
    //console.log(producto.id);
    //console.log(producto.data);
    const imagen = await getImageUrl(producto.data.Imagen);

    document.querySelector("#image").src = imagen;
    document.querySelector("#product-name").textContent = producto.data.Nombre;
    document.querySelector("#product-desc").textContent = producto.data.Descripcion;
    document.querySelector("#price").textContent = producto.data.Precio;

    const caracteristicas = document.getElementById("product-features");

    Object.entries(producto.data.Caracteristicas).forEach(([clave, valor]) => {
        const caracteristica = document.createElement("p");
        caracteristica.textContent = `${clave}: ${valor}`;
        caracteristicas.appendChild(caracteristica);
    });
});
