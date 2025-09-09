import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
    apiKey: "AIzaSyDSmB6c7T23e-hnsiMos0FKeJbdlsUnykQ",
    authDomain: "tycoon-game-91379.firebaseapp.com",
    projectId: "tycoon-game-91379",
    storageBucket: "tycoon-game-91379.firebasestorage.app",
    messagingSenderId: "279504084631",
    appId: "1:279504084631:web:59a37985d58f02eea253d2",
    measurementId: "G-G6T8FM002G"
}

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);