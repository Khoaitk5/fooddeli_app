// ✅ Import dependencies
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// ✅ Load biến môi trường
dotenv.config();

// ✅ Khởi tạo ứng dụng Express
const app = express();
app.use(cors());
app.use(express.json());

// ✅ Thiết lập session: 30 ngày, rolling = true
const { setupSession } = require("./services/sessionService");
setupSession(app);

// ✅ Xử lý preflight OPTIONS (cho CORS) – rất quan trọng khi frontend gọi API
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res.sendStatus(200);
  }
  next();
});

// ✅ Log request để dễ debug API (giữ lại 1 dòng duy nhất)
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.originalUrl}`);
  next();
});

// ✅ Import routes
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

// ✅ Mount routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// ✅ Route test nhanh
app.get("/debug", (req, res) => {
  res.send("✅ Server đang chạy!");
});

app.get("/", (req, res) => {
  res.send("✅ API hoạt động ổn định!");
});

// ✅ PORT
const PORT = process.env.PORT || 5000;

// ✅ Hàm log danh sách route đã mount (tùy chọn – có thể xóa nếu muốn tối giản hơn)
function logRoutes(prefix, router) {
  if (!router?.stack?.length) return;
  // console.log(`\n📜 Route từ ${prefix}:`);
  router.stack.forEach((layer) => {
    if (layer.route) {
      const methods = Object.keys(layer.route.methods)
        .map((m) => m.toUpperCase())
        .join(", ");
      // console.log(`🔹 ${methods} ${prefix}${layer.route.path}`);
    }
  });
}

// ✅ Khởi động server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);

  // In route để xác nhận (có thể bỏ nếu muốn yên lặng hơn)
  logRoutes("/api/auth", authRoutes);
  logRoutes("/api/users", userRoutes);
});

module.exports = { app, server };
