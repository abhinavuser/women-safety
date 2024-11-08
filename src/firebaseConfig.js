// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBVGYqeuSWreFvEKrFutwM5QpfIAjHts5s",
  authDomain: "women-safety-20f49.firebaseapp.com",
  databaseURL: "https://women-safety-20f49-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "women-safety-20f49",
  storageBucket: "women-safety-20f49.appspot.com",
  messagingSenderId: "211376542952",
  appId: "1:211376542952:web:aa8c83a706efee4e4ae55d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app); // Export Firestore instance

export { firestore };
