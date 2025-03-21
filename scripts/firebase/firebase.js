// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getFirestore, doc, getDoc, collection, query, getDocs, addDoc, deleteDoc, updateDoc, where } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js"
import { getAuth } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getStorage, ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-storage.js";
import { firebaseConfig, inicioSesion, inicioDeSesion } from "../../config.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app);
const auth = getAuth(app);

// Esta función lee los datos de la colección especificada y los devuelve en un objeto id : datos
export const readCollection = async (cole) => {
    let col = cole.split("/");
    await inicioDeSesion(auth);
    const colRef = query(collection(database, ...col));
    const colSnap = await getDocs(colRef);
    if (!colSnap.empty) {
        let data = {};
        colSnap.forEach((item) => {data[item.id] = item.data()});
        return data;
    } else {
        console.log("No existe esa colección.");
    }
};

// Esta función lee los datos del documento solicitado de la colección especificada y lo devuelve.
export const readDoc = async (cole, document) => {
    let col = cole.split("/");
    await inicioDeSesion(auth);
    const docRef = doc(database, ...col, document);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        console.log("No existe el documento");
    }
}

// Esta función recibe datos en formato object y crea un documento en la colección especificada,
// con los datos especificados. Además, devuelve la referencia a ese documento.
export const createDocOnCollection = async (cole, data) => {
    let col = cole.split("/");
    await inicioDeSesion(auth);
    const docRef = await addDoc(collection(database, ...col), data);
    return docRef.id;
}

// Esta función actualiza un documento, añadiendo campos o modificando aquellos ya existentes
export const updateDocOnCollection = async (cole, id, data) => {
    let col = cole.split("/");
    await inicioDeSesion(auth);
    const docRef = doc(database, ...col, id);
    await updateDoc(docRef, data);
}

// Esta función elimina un documento de la colección especificada.
export const deleteDocOnCollection = async (cole, document) => {
    let col = cole.split("/");
    await inicioDeSesion(auth);
    await deleteDoc(doc(database, ...col, document));
}

// Esta función filtra por el campo solicitado y devuelve un objeto ID : datos con los objetos cuyo campo sea igual al
// tercer parámetro.
export const filterEqualsByFieldOnCollection = async (cole, field, equals) => {
    let col = cole.split("/");
    await inicioDeSesion(auth);
    const q = query(collection(database, ...col), where(field, "==", equals));
    const querySnapshot = await getDocs(q);
    const data = {}
    querySnapshot.forEach((doc) => {
        data[doc.id] = doc.data();
    });
    return data;
}

// Esta función filtra la colección pasada por parámetro según si el field cumple el filtro pasado por parámetro,
// junto con el value a comprobar.
export const filterByFieldOnCollection = async (cole, field, filter, value) => {
    let col = cole.split("/");
    await inicioDeSesion(auth);
    const q = query(collection(database, ...col), where(field, filter, value));
    const querySnapshot = await getDocs(q);
    const data = {}
    querySnapshot.forEach((doc) => {
        data[doc.id] = doc.data();
    });
    return data;
}

export const getImageUrl = async (imgName) => {
    try {
        const storage = getStorage();
        const url = await getDownloadURL(ref(storage, imgName));
        return url;
    } catch (error) {
        console.log("ERROR", error);
        throw error;
    }
}