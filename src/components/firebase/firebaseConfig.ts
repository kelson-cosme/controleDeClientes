
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Adicione esta linha

const firebaseConfig = {
    apiKey: "AIzaSyCMbXN0opITrTbObZL4dOdTAfjeyQU_fHQ",
    authDomain: "prospectar-ebcee.firebaseapp.com",
    projectId: "prospectar-ebcee",
    storageBucket: "prospectar-ebcee.firebasestorage.app",
    messagingSenderId: "116429095820",
    appId: "1:116429095820:web:ce8d1355ac2edea3110ca9"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o Firestore
const db = getFirestore(app);

export { db };
