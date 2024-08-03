// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-7ca1c.firebaseapp.com",
  projectId: "mern-estate-7ca1c",
  storageBucket: "mern-estate-7ca1c.appspot.com",
  messagingSenderId: "810174513916",
  appId: "1:810174513916:web:a4145bbcfd0174c1940d79"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);