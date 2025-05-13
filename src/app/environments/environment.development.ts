export const environment = {
    production: false,
    firebaseConfig: {
        apiKey: "AIzaSyB8M8qvPyXgA8OagR7bWqOV9QwXBmniO14",
        authDomain: "infomarket-f652e.firebaseapp.com",
        databaseURL: "https://infomarket-f652e-default-rtdb.firebaseio.com",
        projectId: "infomarket-f652e",
        storageBucket: "infomarket-f652e.firebasestorage.app",
        messagingSenderId: "98182342717",
        appId: "1:98182342717:web:9e0a0cfe38740fa4a5e254",
        measurementId: "G-R892JG8V4P"
    }
};

export function loadPayPalSDK() {
    return new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://www.paypal.com/sdk/js?client-id=AY2_sKoMjgV4oGFbkSrqNzDCpdvsxi_97tdQPBuCCl6xPwrrdyI7KgNSX-Iiokef4F6rmBP8luSryK9o&currency=EUR';

        script.onload = () => resolve();

        // Manejo de error si falla la carga del script
        script.onerror = (err) => reject(err);

        document.body.appendChild(script);
    });
}
