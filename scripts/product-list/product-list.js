import {createDocOnCollection, readCollection, readDoc, filterEqualsByFieldOnCollection, deleteDocOnCollection, updateDocOnCollection, getImageUrl, getCategory } from "../../scripts/firebase/firebase.js";

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

    console.log(categoria);

    const productos = await getCategory(categoria);

    console.log(productos);

    for (const [id, productoData] of Object.entries(productos)) {

        const productoElemento = document.importNode(template, true);

        const imagen = await getImageUrl(productoData.Imagen);

        productoElemento.querySelector("#image").src = imagen;
        productoElemento.querySelector("#product-name").textContent = productoData.Nombre;
        productoElemento.querySelector("#product-desc").textContent = productoData.Descripcion;
        productoElemento.querySelector("#price").textContent = productoData.Precio;

        const seeButton = productoElemento.querySelector("#see");

        seeButton.addEventListener("click", () => {
            localStorage.setItem("productoSeleccionado", JSON.stringify({ id, data: productoData }));
            window.location.href = "../screens/product-details.html";
            //console.log([id, productoData]);
        });

        productosGrid.appendChild(productoElemento);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const parametros = new URLSearchParams(window.location.search);
    const categoria = parametros.get("categoria");
    let path = categoria.split("/");
    let doc = await readDoc(path[0], path[1]);
    document.getElementById("main-title").textContent = doc.Nombre;
    await obtenerProductos(categoria);
});

function waitForElement(selector, callback) {
    const element = document.querySelector(selector);
    if (element) {
        callback();
    } else {
        setTimeout(() => waitForElement(selector, callback), 100);
    }
}

waitForElement("#filter-menu-wrapper", () => {
    const filterButton = document.querySelector('#filter-button');
    const filterMenu = document.querySelector('#filter-menu-wrapper');
    const applyButton = document.querySelector('#apply-button');

    filterButton.addEventListener('click', function () {
        filterMenu.classList.toggle("show-filter-menu");
    });

    applyButton.addEventListener('click', function () {
        filterMenu.classList.toggle("show-filter-menu");
    });
});