document.addEventListener("DOMContentLoaded", function () {
    let pedido = JSON.parse(localStorage.getItem("pedido"));
    console.log(pedido);
});

document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
        localStorage.removeItem("pedido");
        localStorage.removeItem("carrito");
    }
});