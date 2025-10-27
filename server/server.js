import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { setupSession } from "./services/sessionService.js";

import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import shopRoutes from "./routes/shopRoutes.js";
import followRoutes from "./routes/followRoutes.js";
import videoLikeRoutes from "./routes/videoLikeRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import imageUploadRouter from "./routes/imageUploadRouter.js";

dotenv.config();

const app = express();
app.set("trust proxy", 1);

// ✅ Cho phép nhiều origin (local + production)
const allowedOrigins = [
  "http://localhost:5173", // local React dev
  "https://yourdomain.com", // tên miền production của bạn
  "https://www.yourdomain.com",
];

// ✅ Cấu hình CORS linh hoạt
app.use(
  cors({
    origin: (origin, callback) => {
      // Nếu không có origin (ví dụ request nội bộ hoặc Postman), vẫn cho phép
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`❌ Blocked by CORS: ${origin}`);
        callback(new Error("CORS not allowed for this origin"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Đảm bảo server phản hồi preflight (OPTIONS)
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json());
setupSession(app);

// 🧭 Log request đơn giản để debug
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.originalUrl}`);
  next();
});

// ✅ Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/shops", shopRoutes);
app.use("/api/follows", followRoutes);
app.use("/api/video-likes", videoLikeRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/images", imageUploadRouter);

// ✅ Debug route
app.get("/debug", (req, res) => res.send("✅ Server đang chạy!"));
app.get("/", (req, res) => res.send("✅ API hoạt động ổn định!"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
  // console.log(`🌐 CORS allowed origins:`, allowedOrigins);
});

export default app;
