// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getFirestore, doc, getDoc, collection, query, getDocs, addDoc, deleteDoc, updateDoc, where, setDoc  } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, sendEmailVerification, onAuthStateChanged  } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getStorage, ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-storage.js";
import { firebaseConfig, inicioSesion, inicioDeSesion } from "../../config.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app);
const auth = getAuth(app);

export { auth, database };

// Esta función lee los datos de la colección especificada y los devuelve en un objeto id : datos
export const readCollection = async (cole) => {
    let col = cole.split("/");
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
    const docRef = await addDoc(collection(database, ...col), data);
    return docRef.id;
}

// Esta función actualiza un documento, añadiendo campos o modificando aquellos ya existentes
export const updateDocOnCollection = async (cole, id, data) => {
    let col = cole.split("/");
    const docRef = doc(database, ...col, id);
    await updateDoc(docRef, data);
}

// Esta función elimina un documento de la colección especificada.
export const deleteDocOnCollection = async (cole, document) => {
    let col = cole.split("/");
    await deleteDoc(doc(database, ...col, document));
}

// Esta función filtra por el campo solicitado y devuelve un objeto ID : datos con los objetos cuyo campo sea igual al
// tercer parámetro.
export const filterEqualsByFieldOnCollection = async (cole, field, equals) => {
    let col = cole.split("/");
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
    const q = query(collection(database, ...col), where(field, filter, value));
    const querySnapshot = await getDocs(q);
    const data = {}
    querySnapshot.forEach((doc) => {
        data[doc.id] = doc.data();
    });
    return data;
}

export async function createUser(email, password, username) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await sendEmailVerification(user);

        // Verifica que Firestore esté correctamente inicializado
        if (!database) {
            throw new Error("Firestore no está inicializado correctamente.");
        }

        // Almacenar el username y email en Firestore
        await setDoc(doc(database, "users", user.uid), {
            username: username,
            email: user.email
        });

        return user;
    } catch (error) {
        console.error("Error al crear usuario:", error);
        throw error; // Lanza el error para manejarlo en el frontend
    }
}


export async function signIn(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        localStorage.setItem("currentUser", JSON.stringify(userCredential.user));
        return userCredential.user;
    } catch (error) {
        throw error;
    }
}

export async function signOut() {
    auth.signOut();
}

// Esta función actualiza el perfil del usuario
export const updateUserProfile = async (displayName, photoURL) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
        await updateProfile(user, {
            displayName: displayName,
            photoURL: photoURL
        });
    } else {
        console.log("No hay usuario autenticado.");
    }
};

export function onAuth(callback) {
    console.log(auth);
    return onAuthStateChanged(auth, callback);
}

export async function logoutUser() {
    try {
        await signOut(auth);
        await localStorage.removeItem("currentUser");
        console.log("Usuario ha cerrado sesión.");
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
    }
}

export async function getUserData(uid) {
    const userRef = doc(database, "users", uid);
    const docSnap = await getDoc(userRef);
    return docSnap.exists() ? docSnap.data() : null;
}

export async function updateUserData(uid, updatedData) {
    const userRef = doc(database, "users", uid);
    await updateDoc(userRef, updatedData);
    console.log("Perfil actualizado correctamente.");
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

// Esta función devuelve un objeto con todos los objetos de una categoría
export async function getCategory(document) {
    let path = document.split("/");
    let doc = await readDoc(path[0], path[1]);
    let res = {}

    let promises = doc.subcolecciones.map(async (subcoleccion) => {
        let subcol = await readCollection(document + "/" + subcoleccion);
        for (let prod in subcol) {
            res[prod] = subcol[prod];
        }
    });

    await Promise.all(promises);

    return res;
}