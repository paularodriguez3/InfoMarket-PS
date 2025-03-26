document.addEventListener("DOMContentLoaded", function () {
    if (sessionStorage.getItem("currentUser") !== null) {
        document.querySelectorAll(".hideauth").forEach(e => e.style.display = "none");
    } else {
        document.querySelector(".progress-container").style.marginTop = "30rem";
    }
});