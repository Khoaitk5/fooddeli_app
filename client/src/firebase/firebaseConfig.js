// client/src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDVADTRyha6lV5MbF9epUO6ubVNjQGIA80",
  authDomain: "fooddeli-6d394.firebaseapp.com",
  projectId: "fooddeli-6d394",
  storageBucket: "fooddeli-6d394.appspot.com",
  messagingSenderId: "791352003469",
  appId: "1:791352003469:web:907026dda68039657b4bc4",
  measurementId: "G-THRB97DEF3",
};

// ✅ Khởi tạo Firebase App
const app = initializeApp(firebaseConfig);

// ✅ Lấy instance Auth để dùng cho OTP
const auth = getAuth(app);

export { auth };

