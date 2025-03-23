import {createDocOnCollection, readCollection, readDoc, filterEqualsByFieldOnCollection, deleteDocOnCollection, updateDocOnCollection, getImageUrl } from "../../scripts/firebase/firebase.js";

async function cargarComponenteProducto() {
    const response = await fetch("../templates/product-component/product-component.html");
    const text = await response.text();

    const contenedor = document.createElement("div");
    contenedor.innerHTML = text;

    document.body.appendChild(contenedor);
}

export async function obtenerProductos(categoria) {
    await cargarComponenteProducto();
    const productosGrid = document.getElementById("product-grid");
    const template = document.getElementById("product-template").content;

    const productos = await readCollection(categoria);

    console.log("productos");

    for (const [id, productoData] of Object.entries(productos)) {

        const productoElemento = document.importNode(template, true);

        const imagen = await getImageUrl(productoData.Imagen);

        productoElemento.querySelector("#image").src = imagen;
        productoElemento.querySelector("#product-name").textContent = productoData.Nombre;
        //productoElemento.querySelector("#product-desc").textContent = productoData.Desc;
        productoElemento.querySelector("#price").textContent = productoData.Precio;

        productosGrid.appendChild(productoElemento);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    await obtenerProductos("productos/Informática/Ordenadores");
});