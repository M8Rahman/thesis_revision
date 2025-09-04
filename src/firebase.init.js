// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyB0dO-H_35dL6lNPi1aBIr7CrayVlxnMho",
    authDomain: "govt-chain.firebaseapp.com",
    projectId: "govt-chain",
    storageBucket: "govt-chain.firebasestorage.app",
    messagingSenderId: "835515017587",
    appId: "1:835515017587:web:8208cadca72661a7cd7d06"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);