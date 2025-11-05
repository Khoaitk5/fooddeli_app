// server/controllers/paymentController.js
import payos from "../config/payos.js";

export const createPayment = async (req, res) => {
  try {
    // Nếu FE chưa gửi orderCode, ta tạo tạm từ timestamp
    const { amount, orderCode, description } = req.body;

    const paymentData = {
      orderCode: orderCode || Math.floor(Date.now() / 1000), // ✅ phải là số nguyên
      amount,
      description: description || "Thanh toán đơn hàng FoodDeli",
      returnUrl: "http://localhost:5173/customer/order-success",
      cancelUrl: "http://localhost:5173/customer/confirm-order",
    };

    const response = await payos.createPaymentLink(paymentData);

    res.status(200).json({
      success: true,
      paymentUrl: response.checkoutUrl,
    });
  } catch (error) {
    console.error("❌ [PayOS Error]:", error.message || error);
    res.status(500).json({
      success: false,
      message: error.message || "Lỗi tạo link thanh toán",
    });
  }
};

export const webhook = async (req, res) => {
  try {
    console.log("📩 PayOS Webhook:", req.body);
    // ⚠️ Tại đây bạn có thể cập nhật trạng thái đơn hàng trong DB
    res.status(200).send("OK");
  } catch (error) {
    console.error("❌ Webhook error:", error);
    res.status(500).send("Error");
  }
};
