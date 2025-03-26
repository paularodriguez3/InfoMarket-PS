document.addEventListener("DOMContentLoaded", function () {
    if (sessionStorage.getItem("currentUser") !== null) {
        document.querySelector(".hideauth").style.display = "none";
    }
});