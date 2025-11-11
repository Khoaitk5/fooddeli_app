import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BackArrow from "../../components/shared/BackArrow";
import LocationIcon from "../../components/shared/LocationIcon";
import ClockIcon2 from "../../components/shared/ClockIcon2";
import NoteIcon from "../../components/shared/NoteIcon";
import PaymentIcon from "../../components/shared/PaymentIcon";
import TagIcon from "../../components/shared/TagIcon";
import CardIcon from "../../components/shared/CardIcon";

export default function ConfirmOrder() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Lấy dữ liệu từ state hoặc localStorage
  const savedData = JSON.parse(localStorage.getItem("checkoutData") || "{}");
  const {
    cartItems = [],
    total = 0,
    shop_id,
    shop_name = "Cửa hàng chưa xác định",
  } = location.state || savedData;

  const address = "Trường Đại Học FPT Đà Nẵng";
  const contactInfo = "Nguyễn Chí Vương | +84778579293";
  const [note, setNote] = useState("");
  const savedPayment =
    localStorage.getItem("selectedPaymentMethod") || "Tiền mặt";
  const [paymentMethod, setPaymentMethod] = useState(savedPayment);
  const [couponCount, setCouponCount] = useState(0);
  const shippingFee = 15000;
  const totalPrice = total + shippingFee;

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  // Format tiền
  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  // Nếu giỏ hàng trống
  if (!cartItems.length) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <p style={{ fontSize: "1.2rem", color: "#555" }}>Giỏ hàng trống</p>
        <button
          onClick={() => navigate("/customer/discover")}
          style={{
            background: "#2BCDD2",
            color: "#fff",
            padding: "0.75rem 1.5rem",
            borderRadius: "999px",
            fontSize: "1rem",
            border: "none",
            cursor: "pointer",
          }}
        >
          Khám phá món ăn
        </button>
      </div>
    );
  }

  // ==========================
  // 🔘 Nút "Đặt đơn"
  // ==========================
  const handleConfirmOrder = async () => {
    if (paymentMethod === "Chuyển khoản") {
      try {
        const res = await fetch("http://localhost:5000/api/payments/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderCode: Date.now(),
            amount: 5000, // test, có thể đổi thành totalPrice
            description: `FD-${currentUser?.id || 0}-${shop_id}-${Date.now()
              .toString()
              .slice(-5)}`,
            metadata: JSON.stringify({
              user_id: currentUser?.id,
              shop_id,
              items: cartItems.map((i) => ({
                product_id: i.product_id,
                quantity: i.quantity,
                unit_price: i.unit_price,
              })),
            }),
          }),
        });

        const data = await res.json();
        if (data.success) {
          // ✅ chuyển đến trang QR của PayOS
          window.location.href = data.paymentUrl;
        } else {
          alert("❌ Không thể tạo link thanh toán");
          console.error(data.message);
        }
      } catch (err) {
        console.error("PayOS error:", err);
        alert("Lỗi khi tạo liên kết thanh toán!");
      }
    } else {
      // 💰 Thanh toán tiền mặt
      try {
        const res = await fetch("http://localhost:5000/api/orders/create-cash", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: currentUser?.id,
            shop_id,
            note,
            items: cartItems.map((i) => ({
              product_id: i.product_id,
              quantity: i.quantity,
              unit_price: i.unit_price,
            })),
          }),
        });

        const data = await res.json();
        if (data.success) {
          console.log("✅ Đã tạo đơn tiền mặt:", data.order);
          navigate("/customer/order-success", {
            state: { shop_id, shop_name, totalPrice, paymentMethod },
          });
        } else {
          alert("❌ Không thể tạo đơn hàng tiền mặt!");
          console.error(data.message);
        }
      } catch (error) {
        console.error("Lỗi khi tạo đơn hàng tiền mặt:", error);
        alert("Đã xảy ra lỗi khi gửi yêu cầu!");
      }
    }
  };

  // ==========================
  // JSX hiển thị giao diện
  // ==========================
  return (
    <div
      style={{
        backgroundColor: "#F2F2F2",
        height: "100vh",
        overflowY: "auto",
        paddingTop: "8.5vh",
        paddingBottom: "13.875vh",
      }}
    >
      {/* Header */}
      <div
        style={{
          width: "100%",
          height: "8.5vh",
          background: "white",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1,
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        }}
      >
        <BackArrow
          style={{
            position: "absolute",
            top: "50%",
            left: "5vw",
            transform: "translateY(-50%)",
          }}
          onClick={() => navigate("/customer/cart")}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
          }}
        >
          <div style={{ color: "black", fontSize: "1.6rem", fontWeight: 600 }}>
            Thanh toán
          </div>
          <div style={{ color: "#555", fontSize: "1.1rem", fontWeight: 500 }}>
            {shop_name}
          </div>
        </div>
      </div>

      {/* Thông tin giao hàng */}
      <div
        style={{
          background: "white",
          borderRadius: "1.4rem",
          margin: "1rem auto",
          padding: "1rem",
          width: "90%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <LocationIcon />
          <div>
            <div style={{ fontWeight: 600, fontSize: "1.2rem" }}>{address}</div>
            <div style={{ color: "#777" }}>{contactInfo}</div>
          </div>
          <div
            style={{
              marginLeft: "auto",
              color: "#2BCDD2",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Sửa
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginTop: "1rem",
          }}
        >
          <ClockIcon2 />
          <span>Giao nhanh • 1.2km</span>
        </div>
      </div>

      {/* Danh sách món */}
      <div
        style={{
          background: "white",
          borderRadius: "1.4rem",
          margin: "1rem auto",
          padding: "1rem",
          width: "90%",
        }}
      >
        <h3 style={{ fontSize: "1.3rem", marginBottom: "0.5rem" }}>
          Tóm tắt đơn
        </h3>
        {cartItems.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "0.75rem",
            }}
          >
            <img
              src={item.product_image || "/default-food.jpg"}
              alt={item.product_name}
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "8px",
                objectFit: "cover",
                marginRight: "1rem",
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{item.product_name}</div>
              <div style={{ color: "#777", fontSize: "0.9rem" }}>
                SL: {item.quantity} × {formatPrice(item.unit_price)}
              </div>
            </div>
            <div
              style={{
                fontWeight: 600,
                color: "#2BCDD2",
                fontSize: "1rem",
                marginLeft: "1rem",
              }}
            >
              {formatPrice(item.line_total || item.unit_price * item.quantity)}
            </div>
          </div>
        ))}

        {/* Ghi chú */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#f2f2f2",
            borderRadius: "999px",
            padding: "0.5rem 1rem",
            marginTop: "1rem",
          }}
        >
          <NoteIcon />
          <input
            type="text"
            placeholder="Quán sẽ cố gắng đáp ứng yêu cầu của bạn..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              background: "transparent",
              marginLeft: "0.5rem",
              fontSize: "1rem",
            }}
          />
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          width: "100%",
          height: "13.875vh",
          background: "white",
          boxShadow: "0px 1px 10px rgba(0, 0, 0, 0.25)",
          borderTopLeftRadius: "1.6rem",
          borderTopRightRadius: "1.6rem",
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 2,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "2.125vh",
            left: "5.55vw",
            display: "flex",
            alignItems: "center",
          }}
        >
          {paymentMethod === "Tiền mặt" ? (
            <PaymentIcon height="1.2rem" width="1.267rem" />
          ) : (
            <CardIcon height="1.2rem" width="1.267rem" />
          )}
          <div
            style={{
              marginLeft: "3.7vw",
              color: "black",
              fontSize: "1.1rem",
              fontWeight: "500",
              cursor: "pointer",
            }}
            onClick={() => navigate("/customer/payment-method")}
          >
            {paymentMethod}
          </div>

          <div
            style={{
              marginLeft: "3.7vw",
              width: "1px",
              height: "1.2rem",
              background: "#F2F2F2",
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginLeft: "3.7vw",
              cursor: "pointer",
            }}
            onClick={() => navigate("/customer/add-coupon")}
          >
            <TagIcon height="1.2rem" width="1.267rem" />
            <div
              style={{
                marginLeft: "3.7vw",
                color: "black",
                fontSize: "1.1rem",
                fontWeight: "500",
              }}
            >
              {couponCount > 0 ? `Đã áp dụng ${couponCount} mã` : "Ưu đãi"}
            </div>
          </div>
        </div>

        {/* Nút đặt đơn */}
        <div
          style={{
            position: "absolute",
            width: "87.78vw",
            height: "6.375vh",
            background: "#2BCDD2",
            borderRadius: 999,
            marginLeft: "50%",
            transform: "translateX(-50%)",
            bottom: "1.875vh",
            cursor: "pointer",
          }}
          onClick={handleConfirmOrder}
        >
          <div
            style={{
              position: "absolute",
              color: "white",
              fontSize: "1.4rem",
              fontWeight: "700",
              top: "50%",
              transform: "translateY(-50%)",
              left: "4.44vw",
            }}
          >
            Đặt đơn
          </div>
          <div
            style={{
              position: "absolute",
              color: "white",
              fontSize: "1.4rem",
              fontWeight: "700",
              top: "50%",
              transform: "translateY(-50%)",
              right: "4.44vw",
            }}
          >
            {formatPrice(totalPrice)}
          </div>
        </div>
      </div>
    </div>
  );
}
