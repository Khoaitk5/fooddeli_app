require("dotenv").config();
const admin = require("firebase-admin");

// 📌 Parse JSON từ biến môi trường
const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY);

// ✅ Khởi tạo Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
