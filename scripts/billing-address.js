document.addEventListener("DOMContentLoaded", function () {
    const continueButton = document.getElementById("continue-button");
    continueButton.addEventListener("click", () => {
        window.location.href = "../screens/shipping-method.html";
    });
});