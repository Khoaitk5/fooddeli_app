// File: src/pages/Customer/ConfirmOrder.jsx (Phiên bản hoàn chỉnh)

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BackArrow from "../../components/shared/BackArrow";
import LocationIcon from "../../components/shared/LocationIcon";
import ClockIcon2 from "../../components/shared/ClockIcon2";
import PaymentIcon from "../../components/shared/PaymentIcon";
import TagIcon from "../../components/shared/TagIcon";
import CardIcon from "../../components/shared/CardIcon";
import PlusIcon from "../../components/shared/PlusIcon";
import MinusIcon from "../../components/shared/MinusIcon";

// --- Styles cho Modal ---
const modalStyles = {
  backdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  content: {
    background: "white",
    padding: "20px",
    borderRadius: "8px",
    width: "80vw",
    maxWidth: "300px",
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
  },
  text: {
    fontSize: "1.4rem",
    color: "#333",
    marginBottom: "20px",
    lineHeight: 1.4,
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
  },
  button: {
    padding: "10px 0",
    flex: 1,
    borderRadius: "999px",
    border: "none",
    fontSize: "1.2rem",
    fontWeight: "600",
    cursor: "pointer",
  },
  buttonCancel: {
    border: "1px solid #ccc",
    background: "#fff",
    color: "#555",
  },
  buttonConfirm: {
    background: "#FE5621",
    color: "white",
  },
};
// --- Hết Styles Modal ---

// Format tiền
const formatPrice = (price) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);

export default function ConfirmOrder() {
  const navigate = useNavigate();
  const location = useLocation();

  const savedData = JSON.parse(localStorage.getItem("checkoutData") || "{}");
  const initialState = location.state || savedData;

  const [cartItems, setCartItems] = useState(initialState.cartItems || []);
  const [total, setTotal] = useState(initialState.total || 0); // total là totalItemPrice
  const { shop_id, shop_name = "Cửa hàng chưa xác định" } = initialState;

  const [modalVisible, setModalVisible] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  const address = "Trường Đại Học FPT Đà Nẵng";
  const contactInfo = "Nguyễn Chí Vương | +84778579293";
  const [note, setNote] = useState("");
  const savedPayment =
    localStorage.getItem("selectedPaymentMethod") || "Tiền mặt";
  const [paymentMethod, setPaymentMethod] = useState(savedPayment);
  const [couponCount, setCouponCount] = useState(0);

  // Các biến cho PaymentDetails
  const shippingFee = 15000;
  const foodDiscount = 0; // Tạm set là 0
  const shippingDiscount = 0; // Tạm set là 0

  // Tính tổng số lượng món
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  // total (từ state) chính là totalItemPrice
  const totalItemPrice = total;
  // totalPrice (tổng cuối cùng)
  const totalPrice = totalItemPrice + shippingFee - foodDiscount - shippingDiscount;

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  // --- Styles cho PaymentDetails ---
  const paymentStyles = {
    paymentDetailsContainer: {
      marginLeft: "auto",
      marginRight: "auto",
      marginTop: "2.5vh",
      width: "91.67vw",
      background: "white",
      borderRadius: "1.4rem",
      paddingTop: "2.75vh",
      paddingBottom: "2.125vh",
    },
    paymentTitle: {
      marginLeft: "3.89vw",
      color: "black",
      fontSize: "1.3rem",
      fontWeight: "600",
      wordWrap: "break-word",
      lineHeight: "1",
    },
    paymentRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      paddingLeft: "3.89vw",
      paddingRight: "3.89vw",
    },
    paymentLabel: {
      color: "rgba(0, 0, 0, 0.50)",
      fontSize: "1.3rem",
      fontWeight: "500",
      wordWrap: "break-word",
      lineHeight: "1",
    },
    paymentValue: {
      color: "black",
      fontSize: "1.3rem",
      fontWeight: "500",
      wordWrap: "break-word",
      lineHeight: "1",
    },
    paymentTotalLabel: {
      color: "black",
      fontSize: "1.3rem",
      fontWeight: "500",
      wordWrap: "break-word",
      lineHeight: "1",
    },
    paymentTotalValue: {
      color: "#FE5621", // Đổi sang màu cam
      fontSize: "1.4rem",
      fontWeight: "500",
      wordWrap: "break-word",
      lineHeight: "1",
    },
  };
  // --- Hết ---

  // Cập nhật total và localStorage
  const updateTotalsAndLocalStorage = (items) => {
    const newTotal = items.reduce(
      (sum, item) => sum + item.unit_price * item.quantity,
      0
    );
    setTotal(newTotal); // Cập nhật state totalItemPrice

    localStorage.setItem(
      "checkoutData",
      JSON.stringify({
        cartItems: items,
        total: newTotal,
        shop_id,
        shop_name,
      })
    );
  };

  // --- Xử lý TĂNG/GIẢM số lượng (Đã gọi API PUT) ---
  const handleQuantityChange = async (itemId, change) => {
    const item = cartItems.find((i) => i.id === itemId);
    if (!item) return;

    const newQuantity = item.quantity + change;
    if (newQuantity <= 0) return;

    try {
      const res = await fetch(`http://localhost:5000/api/cart/items`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: itemId,
          quantity: newQuantity,
        }),
      });

      if (!res.ok) {
        throw new Error("Không thể cập nhật số lượng.");
      }

      const newCartItems = cartItems.map((i) =>
        i.id === itemId ? { ...i, quantity: newQuantity } : i
      );
      setCartItems(newCartItems);
      updateTotalsAndLocalStorage(newCartItems);
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượng:", error);
      alert("Đã xảy ra lỗi khi cập nhật số lượng!");
    }
  };

  // --- Xử lý XÓA (Đã gọi API DELETE) ---
  const handleRemoveItem = async (itemId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/cart/items`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: itemId }),
      });

      if (!res.ok) {
        throw new Error("Không thể xóa sản phẩm.");
      }

      const newCartItems = cartItems.filter((i) => i.id !== itemId);
      setCartItems(newCartItems);
      updateTotalsAndLocalStorage(newCartItems);
    } catch (error) {
      console.error("Lỗi khi xóa món hàng:", error);
      alert("Đã xảy ra lỗi khi xóa món hàng!");
    }
  };

  // --- Hàm xử lý cho Modal ---
  const handleConfirmRemove = async () => {
    if (itemToRemove) {
      await handleRemoveItem(itemToRemove);
    }
    setModalVisible(false);
    setItemToRemove(null);
  };

  const handleCancelRemove = () => {
    setModalVisible(false);
    setItemToRemove(null);
  };

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
            background: "#FE5621",
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
        const res = await fetch(
          "http://localhost:5000/api/orders/create-cash",
          {
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
          }
        );

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
      {/* --- Render Modal --- */}
      {modalVisible && (
        <div style={modalStyles.backdrop}>
          <div style={modalStyles.content}>
            <p style={modalStyles.text}>
              Bạn có muốn xóa sản phẩm khỏi đơn hàng?
            </p>
            <div style={modalStyles.buttonContainer}>
              <button
                onClick={handleCancelRemove}
                style={{ ...modalStyles.button, ...modalStyles.buttonCancel }}
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmRemove}
                style={{ ...modalStyles.button, ...modalStyles.buttonConfirm }}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
      {/* --- Hết Modal --- */}

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
          margin: "2.5vh auto",
          padding: "1rem",
          width: "91.67vw",
          height: "13.5vh",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <LocationIcon />
          <div>
            <div style={{ fontWeight: 600, fontSize: "1.3rem" }}>{address}</div>
            <div style={{ color: "#777" }}>{contactInfo}</div>
          </div>
          <div
            style={{
              marginLeft: "auto",
              color: "#FE5621",
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
          margin: "2.5vh auto",
          width: "91.67vw",
          // Bỏ height cứng, thêm padding
          paddingBottom: "1.875vh",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            paddingTop: "1.875vh",
          }}
        >
          <div
            style={{
              color: "black",
              fontSize: "1.3rem",
              fontWeight: "600",
              wordWrap: "break-word",
              lineHeight: 1,
              marginLeft: "4.17vw",
            }}
          >
            Tóm tắt đơn
          </div>

          <div
            style={{
              color: "#FE5621",
              fontSize: "1.2rem",
              fontWeight: "600",
              wordWrap: "break-word",
              cursor: "pointer",
              lineHeight: 1,
              marginRight: "4.17vw",
            }}
            onClick={() =>
              navigate("/customer/restaurant-details", {
                state: { shop_id: shop_id },
              })
            }
          >
            Thêm món
          </div>
        </div>

        {/* --- Cập nhật logic map --- */}
        {cartItems.map((item) => {
          // Logic giảm số lượng
          const handleDecreaseClick = () => {
            if (item.quantity === 1) {
              setItemToRemove(item.id);
              setModalVisible(true);
            } else {
              handleQuantityChange(item.id, -1);
            }
          };

          // Logic tăng số lượng
          const handleIncreaseClick = () => {
            handleQuantityChange(item.id, 1);
          };

          return (
            <div
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                paddingTop: "1.875vh",
                paddingBottom: "1.875vh",
              }}
            >
              <img
                src={item.product_image || "/default-food.jpg"}
                alt={item.product_name}
                style={{
                  width: "4.5rem",
                  height: "4.5rem",
                  borderRadius: "0.8rem",
                  objectFit: "cover",
                  marginRight: "4.17vw",
                  marginLeft: "4.17vw",
                }}
              />
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "4.5rem",
                }}
              >
                <div
                  style={{
                    color: "black",
                    fontSize: "1.3rem",
                    fontWeight: "600",
                    wordWrap: "break-word",
                    lineHeight: 1,
                  }}
                >
                  {item.product_name}
                </div>
                <div
                  style={{
                    color: "black",
                    fontSize: "1.2rem",
                    fontWeight: "600",
                    wordWrap: "break-word",
                    lineHeight: 1,
                  }}
                >
                  {formatPrice(item.unit_price)}
                </div>
              </div>
              <div
                style={{
                  width: "18.33vw",
                  height: "3.625vh",
                  borderRadius: "1.4rem",
                  border: "0.1rem #FE5621 solid",
                  marginRight: "4.17vw",
                  marginLeft: "auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0 0.5rem",
                }}
              >
                <MinusIcon
                  style={{ cursor: "pointer" }}
                  onClick={handleDecreaseClick}
                />
                <span style={{ fontSize: "1.2rem", fontWeight: "600" }}>
                  {item.quantity}
                </span>
                <PlusIcon
                  style={{ cursor: "pointer" }}
                  onClick={handleIncreaseClick}
                />
              </div>
            </div>
          );
        })}
        {/* --- Hết map --- */}
      </div>

      {/* --- THÊM MỚI: JSX CỦA PAYMENT DETAILS --- */}
      <div style={paymentStyles.paymentDetailsContainer}>
        <div style={paymentStyles.paymentTitle}>Chi tiết thanh toán</div>

        {/* Row 1: Tổng giá món */}
        <div style={{ ...paymentStyles.paymentRow, marginTop: "1.875vh" }}>
          <div style={paymentStyles.paymentLabel}>
            Tổng giá món ({totalQuantity} món)
          </div>
          <div style={paymentStyles.paymentValue}>
            {formatPrice(totalItemPrice)}
          </div>
        </div>

        {/* Row 2: Phí giao hàng */}
        <div style={{ ...paymentStyles.paymentRow, marginTop: "1.875vh" }}>
          <div style={paymentStyles.paymentLabel}>Phí giao hàng</div>
          <div style={paymentStyles.paymentValue}>{formatPrice(shippingFee)}</div>
        </div>

        {/* Row 3: Giảm giá món ăn */}
        {foodDiscount > 0 && (
          <div style={{ ...paymentStyles.paymentRow, marginTop: "1.875vh" }}>
            <div style={paymentStyles.paymentLabel}>Giảm giá món ăn</div>
            <div style={{ ...paymentStyles.paymentValue, color: "#007E51" }}>
              -{formatPrice(foodDiscount)}
            </div>
          </div>
        )}

        {/* Row 4: Giảm giá vận chuyển */}
        {shippingDiscount > 0 && (
          <div style={{ ...paymentStyles.paymentRow, marginTop: "1.875vh" }}>
            <div style={paymentStyles.paymentLabel}>Giảm giá vận chuyển</div>
            <div style={{ ...paymentStyles.paymentValue, color: "#007E51" }}>
              -{formatPrice(shippingDiscount)}
            </div>
          </div>
        )}

        {/* Row 5: Tổng thanh toán */}
        <div style={{ ...paymentStyles.paymentRow, marginTop: "2.125vh" }}>
          <div style={paymentStyles.paymentTotalLabel}>Tổng thanh toán</div>
          <div style={paymentStyles.paymentTotalValue}>
            {formatPrice(totalPrice)}
          </div>
        </div>
      </div>
      {/* --- HẾT PAYMENT DETAILS --- */}


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
            background: "#FE5621",
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