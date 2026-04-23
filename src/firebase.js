import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCWAGAWuRm4gjnhmVaDxlQrnHgOY5m1iqI",
  authDomain: "crud-app-daf93.firebaseapp.com",
  projectId: "crud-app-daf93",
  storageBucket: "crud-app-daf93.firebasestorage.app",
  messagingSenderId: "486270671238",
  appId: "1:486270671238:web:f0949f19abae6f7330f407",
  measurementId: "G-2EDM2BSX3R"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app