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

waitForElement("#profile", () => {
    onAuth(async (user) => {
        if (user) {
            console.log("Usuario autenticado:", user);
            loadUserData(user.uid);
        } else {
            console.error("No hay usuario autenticado.");
        }
    });
    if (localStorage.getItem("currentUser") === null) {
        window.location.href = "../screens/sign-in.html";
    }



    async function loadUserData(uid) {
        try {
            const userData = await getUserData(uid);
            if (userData) {
                console.log("Datos del usuario:", userData);

                // Asignar los valores de los datos a los campos del formulario
                document.querySelector("input[name='user-name']").value = userData.username || '';
                document.querySelector("input[name='firstName']").value = userData.firstName || '';
                document.querySelector("input[name='lastName']").value = userData.lastName || '';
                document.querySelector("input[name='email']").value = userData.email || '';
                document.querySelector("input[name='phone']").value = userData.phone || '';
            } else {
                console.error("No se encontraron datos para el usuario en Firestore.");
            }
        } catch (error) {
            console.error("Error al obtener datos del usuario:", error);
        }
    }

    const form = document.querySelector('.profile-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const updatedData = {
                username: document.querySelector("input[name='user-name']").value,
                firstName: document.querySelector("input[name='firstName']").value,
                lastName: document.querySelector("input[name='lastName']").value,
                email: document.querySelector("input[name='email']").value,
                phone: document.querySelector("input[name='phone']").value
            };
            onAuth(async (user) => {
                if (user) {
                    try {
                        await updateUserData(user.uid, updatedData); // Actualizar los datos en Firebase
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

    waitForElement(".logout-button", () => {
        const logoutButton = document.querySelector(".logout-button");

        logoutButton.addEventListener("click", async (event) => {
            event.preventDefault();
            try {
                await logoutUser(); // Cerrar sesión
                document.querySelectorAll('.profile-form input').forEach(field => field.value = ''); // Limpiar los campos
                window.location.href = "../screens/index.html";
            } catch (error) {
                console.error("Error al cerrar sesión:", error);
            }
        });
    });
});