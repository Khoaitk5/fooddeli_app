  // server/controllers/paymentController.js
  import payos from "../config/payos.js";
  import paymentDao from "../dao/paymentDao.js";
  import orderService from "../services/orderService.js";
  import orderDetailService from "../services/order_detailService.js";

  /**
   * ✅ API: Tạo link thanh toán PayOS
   * FE gọi endpoint này để lấy QR URL
   */
  export const createPayment = async (req, res) => {
    try {
      const { amount, orderCode, description } = req.body;

      const paymentData = {
        orderCode: orderCode || Math.floor(Date.now() / 1000),
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

  /**
   * ✅ API: Webhook PayOS (PayOS gọi khi user thanh toán xong)
   * Tại đây ta lưu giao dịch + tạo order trong DB
   */
  export const webhook = async (req, res) => {
    try {
      const { data } = req.body;
      console.log("📩 [PayOS Webhook Received]:", data);

      if (!data || !data.orderCode) {
        return res.status(400).json({ success: false, message: "Dữ liệu webhook không hợp lệ" });
      }

      // 🧾 1️⃣ Lưu thanh toán vào bảng payments
      await paymentDao.create({
        order_code: data.orderCode,
        amount: data.amount,
        description: data.description,
        status: data.status,
        pay_url: data.checkoutUrl || null,
      });

      // ✅ 2️⃣ Nếu thanh toán thành công thì tạo Order
      if (data.status === "PAID") {
        let user_id, shop_id, items = [];

        try {
          // ⚙️ FE nên gửi JSON string trong description
          // ví dụ: '{"user_id":1,"shop_id":3,"items":[{"product_id":1,"quantity":2,"unit_price":30000}]}'
          const meta = JSON.parse(data.description);
          user_id = meta.user_id;
          shop_id = meta.shop_id;
          items = meta.items || [];
        } catch (err) {
          console.warn("⚠️ Không parse được description JSON:", data.description);
        }

        // 🧍 Nếu không có user/shop thì bỏ qua
        if (!user_id || !shop_id) {
          console.error("❌ Thiếu user_id hoặc shop_id trong description");
          return res.status(400).json({ success: false, message: "Thiếu thông tin user/shop" });
        }

        // 📦 3️⃣ Tạo đơn hàng mới
        const order = await orderService.createEmptyOrder({
          user_id,
          shop_id,
          payment_method: "Chuyển khoản",
          payment_status: "paid",
          delivery_fee: 15000,
          status: "Đã thanh toán",
        });

        // 🛒 4️⃣ Thêm chi tiết sản phẩm (order_details)
        if (Array.isArray(items) && items.length > 0) {
          await orderDetailService.addMany(order.order_id, items);
        }

        // 💰 5️⃣ Cập nhật trạng thái thanh toán
        await orderService.updatePaymentStatus(order.order_id, "paid");

        console.log("✅ Đã tạo đơn hàng thành công:", order.order_id);
      }

      res.status(200).send("OK");
    } catch (error) {
      console.error("❌ [Webhook Error]:", error);
      res.status(500).send("Error");
    }
  };
