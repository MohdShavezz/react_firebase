import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCB8BCslrdkhv3yO7JXMG16O1Ubr5yTI1E",
  authDomain: "my-react-app-c8bc8.firebaseapp.com",
  projectId: "my-react-app-c8bc8",
  storageBucket: "my-react-app-c8bc8.firebasestorage.app",
  messagingSenderId: "1014290740741",
  appId: "1:1014290740741:web:6a99a971c0156188490e6c",
  measurementId: "G-HHYW25QNNN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app