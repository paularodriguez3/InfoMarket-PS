// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js"
import { firebaseConfig } from "/InfoMarket-PS/config.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase();

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
