// server/config/firebase.js  (CommonJS)
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

// Tránh init lại nếu file được require nhiều lần
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // Giữ nguyên bucket bạn đang dùng (vì upload của bạn đã chạy ổn)
    storageBucket: "fooddeli-6d394.firebasestorage.app",
  });
}

// Lấy sẵn bucket & auth (có thể dùng trực tiếp)
const bucket = admin.storage().bucket();
const auth = admin.auth();

// Export theo tên để nơi khác lấy đúng đối tượng
module.exports = { admin, bucket, auth };
