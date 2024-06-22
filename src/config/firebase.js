import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDOKAGDqQ2AcLd-di9k4B3hTwtCZEFEjD0",
  authDomain: "projectfully-56995.firebaseapp.com",
  databaseURL: "https://projectfully-56995-default-rtdb.firebaseio.com",
  projectId: "projectfully-56995",
  storageBucket: "projectfully-56995.appspot.com",
  messagingSenderId: "615895761995",
  appId: "1:615895761995:web:acb78249998fd92c9739ce",
  measurementId: "G-1VL2NLJMLJ",
};

const firebaseApp = initializeApp(firebaseConfig);

export const db = getDatabase(firebaseApp);
export const storage = getStorage(firebaseApp);
