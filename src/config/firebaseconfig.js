// firebaseConfig.js
import { initializeApp } from "firebase/app"; // Import initializeApp
import { getAuth } from "firebase/auth"; // Import auth
import { getDatabase } from "firebase/database"; // Import database
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyBrmV5xwJQt0zaZkCHXyeNSKCbQU50F44g",
    authDomain: "okokfyp-4ba43.firebaseapp.com",
    projectId: "okokfyp-4ba43",
    storageBucket: "okokfyp-4ba43.firebasestorage.app",
    messagingSenderId: "171436347924",
    appId: "1:171436347924:web:1f398f4a30faea207d4d01"
};


// Initialize Firebase (this needs to be done only once in the app)
const app = initializeApp(firebaseConfig); // Initialize Firebase app

// Get the services needed
const auth = getAuth(app); // Initialize Firebase Authentication
const database = getDatabase(app); // Initialize Firebase Realtime Database
const db = getFirestore(app);

export { auth, database, db }; // Export auth and database for use in other files