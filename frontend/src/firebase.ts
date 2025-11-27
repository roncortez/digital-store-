import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBd70KASazLe_o-L6vn9Q0E5fNTtOIthd8",
  authDomain: "digital-store-7b9b1.firebaseapp.com",
  projectId: "digital-store-7b9b1",
  storageBucket: "digital-store-7b9b1.firebasestorage.app",
  messagingSenderId: "309172496709",
  appId: "1:309172496709:web:017a307c23a7619ec2f62c",
  measurementId: "G-2BGSXKB3YZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
export default app;