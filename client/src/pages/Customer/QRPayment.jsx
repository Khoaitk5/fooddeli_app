import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BackArrow from "../../components/shared/BackArrow";

const QRPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hasCreated = useRef(false);

  // ✅ Lấy dữ liệu từ trang ConfirmOrder
  const { shop_id, shop_name, totalPrice, cartItems, user_id } =
    location.state || {};

  useEffect(() => {
    if (hasCreated.current) return;
    hasCreated.current = true;

    const createPayment = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/payments/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderCode: Date.now(),
            amount: totalPrice,
            description: JSON.stringify({
              user_id,
              shop_id,
              items: cartItems.map((i) => ({
                product_id: i.id,
                quantity: i.quantity,
                unit_price: i.unit_price,
              })),
            }),
          }),
        });

        const data = await res.json();

        if (data.success) {
          // ✅ Chuyển người dùng đến trang thanh toán PayOS
          window.location.href = data.paymentUrl;
        } else {
          alert("❌ Không thể tạo link thanh toán");
          console.error(data.message);
        }
      } catch (error) {
        console.error("PayOS error:", error);
        alert("Lỗi khi tạo liên kết thanh toán!");
      }
    };

    createPayment();
  }, [cartItems, shop_id, totalPrice, user_id]);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F2F2F2",
      }}
    >
      <BackArrow
        style={{
          position: "absolute",
          top: "3vh",
          left: "5vw",
          cursor: "pointer",
        }}
        onClick={() => navigate(-1)}
      />
      <h2 style={{ color: "#333", fontWeight: "600", marginBottom: "1rem" }}>
        Đang chuyển đến trang thanh toán PayOS...
      </h2>
      <p style={{ color: "#666", fontSize: "1.1rem" }}>
        Vui lòng đợi trong giây lát ⏳
      </p>
    </div>
  );
};

export default QRPayment;
