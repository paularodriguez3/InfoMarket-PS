import { signIn } from "../../scripts/firebase/firebase.js";
console.log("¿Se está cargando sign-in.js?");

function waitForElement(selector, callback) {
    const element = document.querySelector(selector);
    if (element) {
        callback();
    } else {
        setTimeout(() => waitForElement(selector, callback), 100);
    }
}

waitForElement("#sign-in", () => {
    const loginForm = document.querySelector(".login-form");

    if (loginForm) {
        setupLoginForm(loginForm);
    } else {
        console.error("Error: No se encontró el formulario con clase 'login-form'");
    }
});

function setupLoginForm(loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault(); // Prevenir el comportamiento por defecto

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            let userCredential = await signIn(email, password);
            sessionStorage.setItem("currentUser", JSON.stringify(userCredential));
            alert("Inicio de sesión exitoso");
            window.location.href = "Personal-profile.html"; // Redirección tras login
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;

            if (errorCode === "auth/wrong-password") {
                alert("Contraseña incorrecta");
            } else if (errorCode === "auth/user-not-found") {
                alert("No se encontró un usuario con este correo");
            } else {
                alert("Error al iniciar sesión: " + errorMessage);
            }
        }
    });
}