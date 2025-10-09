// client/src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDVADTRyha6lV5MbF9epUO6ubVNjQGIA80",
  authDomain: "fooddeli-6d394.firebaseapp.com",
  projectId: "fooddeli-6d394",
  storageBucket: "fooddeli-6d394.appspot.com",
  messagingSenderId: "791352003469",
  appId: "1:791352003469:web:907026dda68039657b4bc4",
  measurementId: "G-THRB97DEF3",
};

// ✅ Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// ✅ Lấy instance Auth
const auth = getAuth(app);

// ✅ Khởi tạo provider cho Google Login
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
