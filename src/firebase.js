// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCtthOD7bb0ZF8-f9WXLLReQwY6RCk_anQ",
  authDomain: "student-c2904.firebaseapp.com",
  projectId: "student-c2904",
  storageBucket: "student-c2904.firebasestorage.app",
  messagingSenderId: "3493277740",
  appId: "1:3493277740:web:dc0195f8d24729aab22189",
  measurementId: "G-61D8V7VWGZ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
