import { initializeApp } from "firebase/app";
import { browserLocalPersistence, initializeAuth } from "firebase/auth";

// Replace this config object with yours from the Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyCx_bh_7ffEw2oaLPeeciEtNd0hLbtgTlk",
  authDomain: "agrotech-96125.firebaseapp.com",
  projectId: "agrotech-96125",
  storageBucket: "agrotech-96125.firebasestorage.app",
  messagingSenderId: "24835610307",
  appId: "1:24835610307:web:fef3aa79a7638ef7e4b476",
  measurementId: "G-064HKX3DT9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services for use in components
export const auth = initializeAuth(app, {
  persistence: browserLocalPersistence,
});