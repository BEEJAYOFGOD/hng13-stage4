// Import the functions you need from the SDKs you need
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCmC9IK3OOTYAGdbg7zLO4Y9gZyP_L73wM",
    authDomain: "framez-d771c.firebaseapp.com",
    projectId: "framez-d771c",
    storageBucket: "framez-d771c.firebasestorage.app",
    messagingSenderId: "955733643780",
    appId: "1:955733643780:web:fef50081820a90a343db51",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});
export const db = getFirestore(app);
export const storage = getStorage(app);

AsyncStorage.setItem("test", "value")
    .then(() => {
        console.log("AsyncStorage is working!");
    })
    .catch((err) => {
        console.log("AsyncStorage ERROR:", err);
    });
