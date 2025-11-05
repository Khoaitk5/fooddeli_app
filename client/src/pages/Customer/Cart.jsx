import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BackArrow from "../../components/shared/BackArrow";
import SubmitButton from "../../components/shared/SubmitButton";
import { useOrder } from "../../contexts/OrderContext";

export function CartPage({ isMobile, isTablet, onCheckout }) {
  const navigate = useNavigate();
  
  // Lấy data từ OrderContext (chung với ConfirmOrder)
  const {
    items: cartItems,
    quantities,
    handleQuantityChange,
    handleRemoveItem,
    totalItemPrice,
    cartLoading: loading,
  } = useOrder();

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  if (loading)
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.25rem",
          color: "#555",
        }}
      >
        Đang tải giỏ hàng...
      </div>
    );

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#f7f7f7" }}>
      {/* Header */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          background: "#fff",
          padding: "1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontSize: "1.25rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          zIndex: 1100,
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            position: "absolute",
            left: "1rem",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          <BackArrow />
        </button>
        Giỏ hàng
      </div>

      {/* Nội dung */}
      <div
        style={{ padding: "1rem", paddingTop: "5rem", paddingBottom: "8rem" }}
      >
        {cartItems.length > 0 ? (
          <>
            {cartItems.map((item, index) => (
              <div
                key={item.id}
                style={{
                  background: "#fff",
                  borderRadius: "1rem",
                  padding: "1rem",
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "1rem",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 2px 8px rgba(0,0,0,0.06)";
                }}
              >
                <img
                  src={item.img || "/default-food.jpg"}
                  alt={item.name}
                  style={{
                    width: "90px",
                    height: "90px",
                    borderRadius: "12px",
                    objectFit: "cover",
                    flexShrink: 0,
                  }}
                />

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          margin: 0,
                          fontSize: "1.1rem",
                          fontWeight: 600,
                          color: "#222",
                          lineHeight: "1.4",
                        }}
                      >
                        {item.name}
                      </h3>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "0.5rem",
                    }}
                  >
                    <span
                      style={{
                        color: "#ee4d2d",
                        fontWeight: 700,
                        fontSize: "1rem",
                      }}
                    >
                      {formatPrice(item.price)}
                    </span>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        background: "#f5f5f5",
                        borderRadius: "8px",
                        padding: "2px 6px",
                        gap: "0.5rem",
                      }}
                    >
                      <button
                        onClick={() =>
                          quantities[index] <= 1
                            ? handleRemoveItem(index)
                            : handleQuantityChange(index, -1)
                        }
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "6px",
                          border: "none",
                          background: "#fff",
                          color: quantities[index] <= 1 ? "#ef4444" : "#333",
                          cursor: "pointer",
                          fontSize: quantities[index] <= 1 ? "1.2rem" : "1rem",
                          fontWeight: 600,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {quantities[index] <= 1 ? "🗑️" : "−"}
                      </button>
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: "1rem",
                          minWidth: "24px",
                          textAlign: "center",
                        }}
                      >
                        {quantities[index]}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(index, 1)}
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "6px",
                          border: "none",
                          background: "#fff",
                          color: "#333",
                          cursor: "pointer",
                          fontSize: "1rem",
                          fontWeight: 600,
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Tổng kết đơn hàng */}
            <div
              style={{
                background: "#fff",
                borderRadius: "1rem",
                padding: "1rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Tạm tính:</span>
                <span>{formatPrice(totalItemPrice)}</span>
              </div>
              <hr style={{ margin: "0.5rem 0", borderColor: "#eee" }} />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                }}
              >
                <span>Tổng cộng:</span>
                <span style={{ color: "#ee4d2d" }}>{formatPrice(totalItemPrice)}</span>
              </div>
            </div>
          </>
        ) : (
          <div
            style={{
              height: "80vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "#666",
            }}
          >
            <ShoppingCart size={80} color="#ccc" />
            <p>Giỏ hàng trống</p>
          </div>
        )}
      </div>

      {/* Nút đặt hàng cố định */}
      {cartItems.length > 0 && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "1rem",
            paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
            display: "flex",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <SubmitButton
            isValid={cartItems.length > 0}
            onClick={() => {
              navigate("/customer/confirm-order");
            }}
            style={{
              marginTop: "0",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                textAlign: "center",
                justifyContent: "center",
                display: "flex",
                flexDirection: "column",
                fontSize: "1.5rem",
                fontWeight: "600",
                wordWrap: "break-word",
              }}
            >
              Thanh toán • {formatPrice(totalItemPrice)}
            </div>
          </SubmitButton>
        </div>
      )}
    </div>
  );
}