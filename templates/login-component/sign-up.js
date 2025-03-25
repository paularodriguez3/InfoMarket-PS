console.log("¿Se está cargando sign-up.js?");
import { createUser, signOut } from "../../scripts/firebase/firebase.js";

function waitForElement(selector, callback) {
    const element = document.querySelector(selector);
    if (element) {
        callback();
    } else {
        setTimeout(() => waitForElement(selector, callback), 100);
    }
}

waitForElement("#sign-up", () => {
    const signupForm = document.getElementById("signup-form");
    const usernameInput = document.getElementById("user-register");
    const passwordInput = document.getElementById("password-register");
    const emailInput = document.getElementById("email-register");
    const usernameRequirements = document.getElementById("username-requirements");
    const passwordRequirements = document.getElementById("password-requirements");

    const usernameRegex = /^[A-Za-z][A-Za-z0-9]{4,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    const passwordRequirementsElements = {
        length: document.getElementById("password-length"),
        uppercase: document.getElementById("password-uppercase"),
        number: document.getElementById("password-number"),
        lowercase: document.getElementById("password-lowercase"),
        special: document.getElementById("password-special"),
    };

    const usernameRequirementsElements = {
        firstLetter: document.getElementById("first-letter"),
        alphanumeric: document.getElementById("alphanumeric"),
        length: document.getElementById("length")
    };

    usernameInput.addEventListener("focus", () => {
        if (usernameInput.value !== "") {
            usernameRequirements.style.display = "block";
        }
    });

    usernameInput.addEventListener("blur", () => {
        if (usernameInput.value === "" || usernameRegex.test(usernameInput.value)) {
            usernameRequirements.style.display = "none";
        }
    });

    usernameInput.addEventListener("input", () => {
        const usernameValue = usernameInput.value;

        usernameRequirementsElements.firstLetter.classList.toggle('valid', /^[A-Za-z]/.test(usernameValue));
        usernameRequirementsElements.alphanumeric.classList.toggle('valid', /^[A-Za-z0-9]+$/.test(usernameValue));
        usernameRequirementsElements.length.classList.toggle('valid', usernameValue.length >= 5);

        if (usernameValue === "" || usernameRegex.test(usernameValue)) {
            usernameRequirements.style.display = "none";
        } else {
            usernameRequirements.style.display = "block";
        }
    });

    passwordInput.addEventListener("focus", () => {
        if (passwordInput.value !== "") {
            passwordRequirements.style.display = "block";
        }
    });

    passwordInput.addEventListener("blur", () => {
        if (passwordInput.value === "" || passwordRegex.test(passwordInput.value)) {
            passwordRequirements.style.display = "none";
        }
    });

    passwordInput.addEventListener("input", () => {
        const passwordValue = passwordInput.value;

        passwordRequirementsElements.length.classList.toggle('valid', passwordValue.length >= 8);
        passwordRequirementsElements.uppercase.classList.toggle('valid', /[A-Z]/.test(passwordValue));
        passwordRequirementsElements.number.classList.toggle('valid', /\d/.test(passwordValue));
        passwordRequirementsElements.lowercase.classList.toggle('valid', /[a-z]/.test(passwordValue));
        passwordRequirementsElements.special.classList.toggle('valid', /[@$!%*?&]/.test(passwordValue));

        if (passwordValue === "" || passwordRegex.test(passwordValue)) {
            passwordRequirements.style.display = "none";
        } else {
            passwordRequirements.style.display = "block";
        }
    });

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = emailInput.value;
            const password = passwordInput.value;
            const username = usernameInput.value;

            // Validación de nombre de usuario y contraseña
            if (!usernameRegex.test(username)) {
                alert("El nombre de usuario no es válido. Debe tener al menos 5 caracteres, comenzar con una letra y contener solo letras y números.");
                return;
            }

            if (!passwordRegex.test(password)) {
                alert("La contraseña no es válida. Debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.");
                return;
            }

            try {
                // Registro del usuario utilizando la función createUser
                const userCredential = await createUser(email, password);
                const user = userCredential.user;
                alert("Usuario creado con éxito");

                // Esperamos a que el usuario esté completamente autenticado
                if (user) {
                    // Actualizar el nombre de usuario
                    await user.updateProfile({ displayName: username });
                    alert("Nombre de usuario actualizado");

                    // Verificar si el correo no ha sido verificado aún
                    if (!user.emailVerified) {
                        // Enviar correo de verificación
                        await user.sendEmailVerification();
                        alert("Se ha enviado un correo de verificación.");
                    } else {
                        alert("El correo ya ha sido verificado.");
                    }
                }
            } catch (error) {
                alert(`Error: ${error.message}`);
            }
        });
    }
});