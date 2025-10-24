import { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BackArrow from "../../components/shared/BackArrow";

export function CartPage({ isMobile, isTablet, onCheckout }) {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // 📦 Lấy giỏ hàng từ backend
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/cart", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (data.success && data.data?.items) setCartItems(data.data.items);
        else console.warn("⚠️ Không lấy được dữ liệu giỏ hàng:", data.message);
      } catch (err) {
        console.error("❌ Lỗi khi fetch giỏ hàng:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  const updateQuantity = async (itemId, delta) => {
    const item = cartItems.find((i) => i.id === itemId);
    if (!item) return;
    const newQty = Math.max(1, item.quantity + delta);
    try {
      const res = await fetch("/api/cart/items", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, quantity: newQty }),
      });
      const data = await res.json();
      if (data.success)
        setCartItems((prev) =>
          prev.map((i) => (i.id === itemId ? { ...i, quantity: newQty } : i))
        );
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật số lượng:", err);
    }
  };

  const removeItem = async (itemId) => {
    try {
      const res = await fetch("/api/cart/items", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId }),
      });
      const data = await res.json();
      if (data.success) setCartItems((prev) => prev.filter((i) => i.id !== itemId));
    } catch (err) {
      console.error("❌ Lỗi khi xóa item:", err);
    }
  };

  const subtotal = cartItems.reduce(
    (sum, i) => sum + Number(i.line_total || i.unit_price * i.quantity),
    0
  );
  const deliveryFee = 15000;
  const total = subtotal + deliveryFee;

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
          position: "sticky",
          top: 0,
          background: "#fff",
          padding: "1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontSize: "1.25rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          zIndex: 100,
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
      <div style={{ padding: "1rem", paddingBottom: "8rem" }}>
        {cartItems.length > 0 ? (
          <>
            {cartItems.map((item) => (
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
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
                }}
              >
                <img
                  src={item.product_image || "/default-food.jpg"}
                  alt={item.product_name}
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
                        {item.product_name}
                      </h3>
                      {item.product_description && (
                        <p
                          style={{
                            margin: "0.25rem 0 0.5rem",
                            fontSize: "0.9rem",
                            color: "#777",
                            lineHeight: "1.4",
                          }}
                        >
                          {item.product_description}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#ef4444",
                        fontSize: "1.25rem",
                        cursor: "pointer",
                        transition: "transform 0.2s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    >
                      🗑️
                    </button>
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
                      {formatPrice(item.unit_price)}
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
                        onClick={() => updateQuantity(item.id, -1)}
                        disabled={item.quantity <= 1}
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "6px",
                          border: "none",
                          background: item.quantity <= 1 ? "#ddd" : "#fff",
                          color: item.quantity <= 1 ? "#999" : "#333",
                          cursor: item.quantity <= 1 ? "not-allowed" : "pointer",
                          fontSize: "1rem",
                          fontWeight: 600,
                        }}
                      >
                        −
                      </button>
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: "1rem",
                          minWidth: "24px",
                          textAlign: "center",
                        }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
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
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Phí giao hàng:</span>
                <span>{formatPrice(deliveryFee)}</span>
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
                <span style={{ color: "#ee4d2d" }}>{formatPrice(total)}</span>
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
            background: "#fff",
            borderTop: "1px solid #eee",
            boxShadow: "0 -2px 10px rgba(0,0,0,0.05)",
            padding: "1rem",
          }}
        >
          <button
            onClick={onCheckout}
            style={{
              width: "100%",
              padding: "1rem",
              border: "none",
              borderRadius: "0.75rem",
              background: "linear-gradient(135deg, #ee4d2d, #ff6b35)",
              color: "#fff",
              fontSize: "1.2rem",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(238,77,45,0.3)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 16px rgba(238,77,45,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(238,77,45,0.3)";
            }}
          >
            Đặt hàng • {formatPrice(total)}
          </button>
        </div>
      )}
    </div>
  );
}
