import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyDvqbuakOA3n7wJRJGzblf534MMcHd-7ks",
  authDomain: "aichatbot-cf2dc.firebaseapp.com",
  projectId: "aichatbot-cf2dc",
  storageBucket: "aichatbot-cf2dc.appspot.com",
  messagingSenderId: "1018914765861",
  appId: "1:1018914765861:web:903104aabd4c267b5793cc",
  measurementId: "G-YJT182QQJS",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let auth;
if (Platform.OS === "web") {
  auth = getAuth(app);
} else {
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (e) {
    console.warn(
      "Firebase native persistence not available. Falling back to in-memory auth.",
      e
    );
    auth = getAuth(app);
  }
}

auth.useDeviceLanguage();

export { app, auth };

