import { createUser, signOut } from "../../scripts/firebase/firebase.js";

function waitForElement(selector, callback) {
    const element = document.querySelector(selector);
    if (element) {
        callback();
    } else {
        setTimeout(() => waitForElement(selector, callback), 100);
    }
}

waitForElement("#signup-form", () => {
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

    function updateRequirement(element, isValid) {
        if (isValid) {
            element.classList.add("valid");
            element.querySelector("span").style.display = "inline";
        } else {
            element.classList.remove("valid");
            element.querySelector("span").style.display = "none";
        }
    }

    usernameInput.addEventListener("input", () => {
        const usernameValue = usernameInput.value;

        if (usernameValue === "") {
            usernameRequirements.style.display = "none";
        } else {
            updateRequirement(usernameRequirementsElements.firstLetter, /^[A-Za-z]/.test(usernameValue));
            updateRequirement(usernameRequirementsElements.alphanumeric, /^[A-Za-z0-9]+$/.test(usernameValue));
            updateRequirement(usernameRequirementsElements.length, usernameValue.length >= 5);
            usernameRequirements.style.display = usernameRegex.test(usernameValue) ? "none" : "block";
        }
    });

    passwordInput.addEventListener("input", () => {
        const passwordValue = passwordInput.value;

        if (passwordValue === "") {
            passwordRequirements.style.display = "none";
        } else {
            updateRequirement(passwordRequirementsElements.length, passwordValue.length >= 8);
            updateRequirement(passwordRequirementsElements.uppercase, /[A-Z]/.test(passwordValue));
            updateRequirement(passwordRequirementsElements.number, /\d/.test(passwordValue));
            updateRequirement(passwordRequirementsElements.lowercase, /[a-z]/.test(passwordValue));
            updateRequirement(passwordRequirementsElements.special, /[@$!%*?&]/.test(passwordValue));
            passwordRequirements.style.display = passwordRegex.test(passwordValue) ? "none" : "block";
        }
    });

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = emailInput.value;
            const password = passwordInput.value;
            const username = usernameInput.value;

            if (!usernameRegex.test(username)) {
                alert("El nombre de usuario no es válido.");
                return;
            }

            if (!passwordRegex.test(password)) {
                alert("La contraseña no es válida.");
                return;
            }

            try {
                const userCredential = await createUser(email, password, username);
                alert("Usuario creado con éxito");
                window.location.href = "sign-in.html";
            } catch (error) {
                alert(`Error: ${error.message}`);
            }
        });
    }

    document.getElementById("sign-up-btn").addEventListener("click", function() {
        window.location.href = "sign-in.html";
    });
});
