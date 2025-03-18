import {createDocOnCollection, readCollection, readDoc, filterEqualsByFieldOnCollection, deleteDocOnCollection, updateDocOnCollection } from "/scripts/firebase/firebase.js";

async function cargarComponenteProducto() {
    const response = await fetch("../templates/product-component/product-component.html");
    const text = await response.text();

    // Crear un contenedor temporal para insertar el template
    const contenedor = document.createElement("div");
    contenedor.innerHTML = text;

    // Insertar el template en el `body` del documento
    document.body.appendChild(contenedor);
}

export async function obtenerProductos(categoria, subcategoria, subcategoria2) {
    await cargarComponenteProducto();
    const productosGrid = document.getElementById("product-grid");
    const template = document.getElementById("product-template").content;

    const productos = await readCollection(categoria, subcategoria, subcategoria2);

    console.log("productos");

    Object.entries(productos).forEach(([id, productoData]) => {

        // Clonar la plantilla del producto
        const productoElemento = document.importNode(template, true);

        // Rellenar la información del producto
        productoElemento.querySelector("#image").src = productoData.Imagen;
        productoElemento.querySelector("#product-name").textContent = productoData.Nombre;
        productoElemento.querySelector("#product-desc").textContent = productoData.Desc;
        productoElemento.querySelector("#price").textContent = productoData.Precio;
        // Añadir al grid de productos
        productosGrid.appendChild(productoElemento);
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    // Llamar la función con los valores deseados de categoría y subcategorías
    await obtenerProductos("productos", "Informática", "Ordenadores");
});