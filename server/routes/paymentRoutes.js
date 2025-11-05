// server/routes/paymentRoutes.js
import express from "express";
import { createPayment, webhook } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create", createPayment);
router.post("/webhook", webhook);

router.get("/test", async (req, res) => {
  try {
    const response = await import("../config/payos.js").then((m) => m.default.createPaymentLink({
      orderCode: Math.floor(Date.now() / 1000),
      amount: 20000,
      description: "Thanh toán test PayOS",
      returnUrl: "http://localhost:5173/customer/order-success",
      cancelUrl: "http://localhost:5173/customer/confirm-order",
    }));

    res.redirect(response.checkoutUrl);
  } catch (error) {
    console.error("❌ Lỗi khi test PayOS:", error);
    res.status(500).send(`Lỗi khi test PayOS: ${error.message}`);
  }
});

export default router;
