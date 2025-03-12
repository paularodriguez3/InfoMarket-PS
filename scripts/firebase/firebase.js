// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getDatabase, ref, onValue, set, update, remove } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js"
import { firebaseConfig } from "/InfoMarket-PS/config.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase();


// Esta función lee los datos de la ruta especificada de la realtime database
export const leerDatos = (ruta) => {
    return new Promise((resolve, reject) => {
        const dbRef = ref(database, ruta);
        onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
            resolve(data);
        }, (error) => {
            reject(error);
        });
    });
};

// Esta función escribe y/o modifica el datoAModificar en la realtime database para que tenga el valor pasado por parámetro
export const escribirDatos = (ruta, datoAModificar, valor) => {
    return new Promise((resolve, reject) => {
        try {
            const dbRef = ref(database, ruta);
            const dataToUpdate = { [datoAModificar]: valor };

            console.log('Data to be updated:', dataToUpdate);

            update(dbRef, dataToUpdate)
                .then(() => {
                    console.log('Dato actualizado correctamente');
                    resolve();
                })
                .catch((error) => {
                    console.error('Error al actualizar el dato:', error);
                    reject(error);
                });
        } catch (error) {
            console.error('Error en la función escribirDatos:', error);
            reject(error);
        }
    });
}

// Esta función sirve para eliminar datos de la realtime database
export const eliminarDatos = (ruta, datoAEliminar) => {
    return escribirDatos(ruta, datoAEliminar, null);
}


