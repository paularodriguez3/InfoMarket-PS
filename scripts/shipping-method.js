import { readCollection } from "./firebase/firebase.js"


document.addEventListener("DOMContentLoaded", async function () {
    const addressInput = document.getElementById("address");
    const shopInput = document.getElementById("shop");
    const form = document.querySelector("form");

    // Función para alternar la habilitación de los campos
    function toggleFields() {
        if (addressInput.value.trim() !== "") {
            shopInput.value = "";
            shopInput.setAttribute("disabled", "true"); // Deshabilitar el campo de tienda física
        } else {
            shopInput.removeAttribute("disabled"); // Habilitar el campo de tienda física
        }

        if (shopInput.value.trim() !== "") {
            addressInput.value = "";
            addressInput.setAttribute("disabled", "true"); // Deshabilitar el campo de dirección
        } else {
            addressInput.removeAttribute("disabled"); // Habilitar el campo de dirección
        }
    }

    // Escuchar cambios en los campos para alternar la habilitación
    addressInput.addEventListener("input", toggleFields);
    shopInput.addEventListener("input", toggleFields);

    // Validar el formulario antes de enviarlo
    form.addEventListener("submit", function (event) {
        if (addressInput.value.trim() === "" && shopInput.value.trim() === "") {
            event.preventDefault();
            alert('Infomarket dice: "Por favor, completa al menos un campo: Dirección o Tienda física."');
        }
    });
    let direcciones = await readCollection("direccionesTiendas");
    for (let tienda in direcciones) {
        let option = document.createElement("option");
        option.value = direcciones[tienda].direccion;
        option.innerText = direcciones[tienda].direccion;
        document.getElementById("shop").appendChild(option);
    }
});