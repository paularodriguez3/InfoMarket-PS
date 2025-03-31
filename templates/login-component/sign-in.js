import { signIn } from "../../scripts/firebase/firebase.js";

function waitForElement(selector, callback) {
    const element = document.querySelector(selector);
    if (element) {
        callback();
    } else {
        setTimeout(() => waitForElement(selector, callback), 100);
    }
}

waitForElement("#sign-in-form", () => {
    const loginForm = document.querySelector("#sign-in-form");

    if (loginForm) {
        setupLoginForm(loginForm);
    } else {
        console.error("Error: No se encontró el formulario con ID 'sign-in-form'");
    }
});


function setupLoginForm(loginForm) {
    if (localStorage.getItem("currentUser") !== null) {
        window.location.href = "../screens/index.html";
    }
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            let userCredential = await signIn(email, password);
            alert("Inicio de sesión exitoso");
            window.location.href = "Personal-profile.html";
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

    const signUpButton = document.getElementById("sign-up-btn");
    signUpButton.addEventListener("click", () => {
        window.location.href = "sign-up.html";
    });
}
