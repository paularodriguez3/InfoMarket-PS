document.addEventListener("DOMContentLoaded", function () {
    let pedido = JSON.parse(localStorage.getItem("pedido"));

    const continueButton = document.getElementById("continue-button");
    continueButton.addEventListener("click", (e) => {
        e.preventDefault();
        let canContinue = true;
        document.querySelectorAll("input").forEach(input => {
            if (input.placeholder === "¿Qué estás buscando?...") return;
            if (input.value === "") {canContinue = false;}
        });
        if (canContinue) {
            pedido.direccion = {
                pais: document.getElementById("country").value,
                direccion: document.getElementById("address").value,
                cp: document.getElementById("zip").value,
                provincia: document.getElementById("province").value
            }

            localStorage.setItem("pedido", JSON.stringify(pedido));
            window.location.href = "../screens/shipping-method.html";
        } else {
            alert("Rellena todos los campos, por favor.")
        }
    });
});