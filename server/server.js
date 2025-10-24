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

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
setupSession(app);

app.use((req, res, next) => {
    console.log(`📡 ${req.method} ${req.originalUrl}`);
    next();
});

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

app.get("/debug", (req, res) => res.send("✅ Server đang chạy!"));
app.get("/", (req, res) => res.send("✅ API hoạt động ổn định!"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`));

export default app;
