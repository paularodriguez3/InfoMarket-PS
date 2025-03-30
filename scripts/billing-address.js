document.addEventListener("DOMContentLoaded", function () {
    const continueButton = document.getElementById("continue-button");
    continueButton.addEventListener("click", (e) => {
        e.preventDefault();
        let canContinue = true;
        document.querySelectorAll("input").forEach(input => {
            if (input.placeholder === "¿Qué estás buscando?...") return;
            if (input.value === "") {canContinue = false;}
        });
        if (canContinue) {
            window.location.href = "../screens/shipping-method.html";
        } else {
            alert("Rellena todos los campos, por favor.")
        }
    });
});