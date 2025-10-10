// ✅ Import dependencies
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// ✅ Load biến môi trường
dotenv.config();

const app = express();

// ✅ CORS cấu hình chuẩn để gửi cookie session
app.use(
  cors({
    origin: "http://localhost:5173", // ⚠️ domain FE chính xác
    credentials: true, // ⚠️ bắt buộc để cookie đi kèm
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Phải bật JSON body parser
app.use(express.json());

// ✅ Thiết lập session sau CORS và trước routes
const { setupSession } = require("./services/sessionService");
setupSession(app);

// ❌ XOÁ đoạn setHeader thủ công kia đi (đừng set "*" nữa)
// Không cần middleware OPTIONS tự chế nếu dùng cors() chuẩn ở trên

// ✅ Log request để debug
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
function logRoutes(prefix, router) {
  if (!router?.stack?.length) return;
  //  console.log(`\n📜 Route từ ${prefix}:`);
  router.stack.forEach((layer) => {
    if (layer.route) {
      const methods = Object.keys(layer.route.methods)
        .map((m) => m.toUpperCase())
        .join(", ");
      //  console.log(`🔹 ${methods} ${prefix}${layer.route.path}`);
    }
  });
}

const server = app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);

  logRoutes("/api/auth", authRoutes);
  logRoutes("/api/users", userRoutes);
});

module.exports = { app, server };
