// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCZkZWd_2_u2Ch1WuiMInBgIV_0MKkBsnM",
  authDomain: "nextjs-socialmedia-app.firebaseapp.com",
  projectId: "nextjs-socialmedia-app",
  storageBucket: "nextjs-socialmedia-app.appspot.com",
  messagingSenderId: "964777816107",
  appId: "1:964777816107:web:48a1625e80f3eb09f77a6e",
  measurementId: "G-WVEQ25HK30"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth();
export const firestore = getFirestore();
export const storage = getStorage();