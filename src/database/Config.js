import { initializeApp } from "firebase/app";   
import { getDatabase } from "firebase/database";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC-qqiyD5vlWXAp3rW0z9bFY3i59ayt8jU",
    authDomain: "inventaris-4b528.firebaseapp.com",
    databaseURL: "https://inventaris-4b528-default-rtdb.firebaseio.com",
    projectId: "inventaris-4b528",
    storageBucket: "inventaris-4b528.appspot.com",
    messagingSenderId: "668621719795",
    appId: "1:668621719795:web:8f72bf6c4311438a7a0f86",
    measurementId: "G-HD8Y3YF7SL"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);    

//initizile database
export const db = getDatabase(app);