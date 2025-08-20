// Import the functions you need from the SDKs you need

import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDvqbuakOA3n7wJRJGzblf534MMcHd-7ks",
  authDomain: "aichatbot-cf2dc.firebaseapp.com",
  projectId: "aichatbot-cf2dc",
  storageBucket: "aichatbot-cf2dc.firebasestorage.app",
  messagingSenderId: "1018914765861",
  appId: "1:1018914765861:web:903104aabd4c267b5793cc",
  measurementId: "G-YJT182QQJS"
};

// Initialize Firebase
const app = getApps().length === 0? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
auth.useDeviceLanguage();
export { auth };

