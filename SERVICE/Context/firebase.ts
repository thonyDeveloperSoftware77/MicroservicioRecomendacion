// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBiaNszGo9unbL5aymazRk6vwaVcZblPKE",
  authDomain: "recomendacionpelicula.firebaseapp.com",
  projectId: "recomendacionpelicula",
  storageBucket: "recomendacionpelicula.appspot.com",
  messagingSenderId: "221562378449",
  appId: "1:221562378449:web:324ce42d3588360e66cdf0",
  measurementId: "G-H18L2V9QN9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase

const db = getFirestore(app);

export default db;
