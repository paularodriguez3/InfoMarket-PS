import { onAuth, getUserData, updateUserData, logoutUser } from "../../scripts/firebase/firebase.js";

console.log("¿Se está cargando personal-profile.js?");

function waitForElement(selector, callback) {
    const element = document.querySelector(selector);
    if (element) {
        callback();
    } else {
        setTimeout(() => waitForElement(selector, callback), 100);
    }
}

waitForElement("#profile", async () => {
    if (sessionStorage.getItem("currentUser") !== null) {
        let uid = JSON.parse(sessionStorage.getItem("currentUser")).uid;
        await loadUserData(uid);
    } else {
        console.error("No hay usuario autenticado.");
    }

    async function loadUserData(uid) {
        try {
            const userData = await getUserData(uid);
            if (userData) {
                console.log("Datos del usuario:", userData);
                document.querySelector("input[placeholder='Nombre']").value = userData.firstName || '';
                document.querySelector("input[placeholder='Primer apellido']").value = userData.lastName1 || '';
                document.querySelector("input[placeholder='Segundo apellido']").value = userData.lastName2 || '';
                document.querySelector("input[placeholder='Nombre de usuario']").value = userData.username || '';
                document.querySelector("input[placeholder='Email']").value = userData.email || '';
                document.querySelector("input[placeholder='Número de telefono']").value = userData.phone || '';
            } else {
                console.error("No se encontraron datos para el usuario en Firestore.");
            }
        } catch (error) {
            console.error("Error al obtener datos del usuario:", error);
        }
    }

    const form = document.querySelector('.login-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const updatedData = {
                firstName: document.querySelector("input[placeholder='Nombre']").value,
                lastName1: document.querySelector("input[placeholder='Primer apellido']").value,
                lastName2: document.querySelector("input[placeholder='Segundo apellido']").value,
                username: document.querySelector("input[placeholder='Nombre de usuario']").value,
                email: document.querySelector("input[placeholder='Email']").value,
                phone: document.querySelector("input[placeholder='Número de telefono']").value
            };

            onAuth(async (user) => {
                if (user) {
                    try {
                        await updateUserData(user.uid, updatedData);
                        alert("Datos de perfil actualizados con éxito.");
                    } catch (error) {
                        console.error("Error al actualizar el perfil:", error);
                    }
                } else {
                    console.error("No hay usuario autenticado para actualizar el perfil.");
                }
            });
        });
    }

    waitForElement(".send:last-child", () => {
        const logoutButton = document.querySelector(".send:last-child");

        logoutButton.addEventListener("click", async (event) => {
            event.preventDefault();
            try {
                await logoutUser();
                document.querySelectorAll('.login-form input').forEach(field => field.value = '');
                window.location.href = "../index.html";
            } catch (error) {
                console.error("Error al cerrar sesión:", error);
            }
        });
    });
});