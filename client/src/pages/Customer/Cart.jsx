import { useState, useEffect, useMemo } from "react";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BackArrow from "../../components/shared/BackArrow";
import SubmitButton from "../../components/shared/SubmitButton";
import { useCart } from "../../hooks/useCart";

export function CartPage({ isMobile, isTablet, onCheckout }) {
  const navigate = useNavigate();
  const { cartItems: initialCartItems, loading, refreshCart } = useCart();
  const [cartItems, setCartItems] = useState(initialCartItems);

  // Đồng bộ lại cartItems khi dữ liệu hook cập nhật
  useEffect(() => {
    setCartItems(initialCartItems);
  }, [initialCartItems]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  // ✅ Nhóm sản phẩm theo shop
  const groupedCarts = useMemo(() => {
    return cartItems.reduce((groups, item) => {
      const sid = item.shop_id;
      if (!groups[sid])
        groups[sid] = {
          shop_name: item.shop_name || "Cửa hàng chưa xác định",
          items: [],
        };
      groups[sid].items.push(item);
      return groups;
    }, {});
  }, [cartItems]);

  const updateQuantity = async (itemId, delta) => {
    const item = cartItems.find((i) => i.id === itemId);
    if (!item) return;
    const newQty = Math.max(1, item.quantity + delta);

    try {
      const res = await fetch("http://localhost:5000/api/cart/items", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, quantity: newQty }),
      });
      const data = await res.json();
      if (data.success) {
        setCartItems((prev) =>
          prev.map((i) =>
            i.id === itemId
              ? { ...i, quantity: newQty, line_total: newQty * i.unit_price }
              : i
          )
        );
        refreshCart();
      }
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật số lượng:", err);
    }
  };

  const removeItem = async (itemId) => {
    try {
      const res = await fetch("http://localhost:5000/api/cart/items", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId }),
      });
      const data = await res.json();
      if (data.success) {
        setCartItems((prev) => prev.filter((i) => i.id !== itemId));
        refreshCart();
      }
    } catch (err) {
      console.error("❌ Lỗi khi xóa item:", err);
    }
  };

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
      <div style={{ padding: "1rem", paddingTop: "5rem", paddingBottom: "8rem" }}>
        {Object.keys(groupedCarts).length > 0 ? (
          Object.entries(groupedCarts).map(([shopId, group]) => {
            const storeTotal = group.items.reduce(
              (sum, i) => sum + Number(i.line_total || i.unit_price * i.quantity),
              0
            );

            return (
              <div key={shopId} style={{ marginBottom: "2rem" }}>
                <h2
                  style={{
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    marginBottom: "1rem",
                    color: "#333",
                  }}
                >
                  🏪 {group.shop_name}
                </h2>

                {/* Danh sách món */}
                {group.items.map((item) => (
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
                      <h3
                        style={{
                          margin: 0,
                          fontSize: "1.1rem",
                          fontWeight: 600,
                          color: "#222",
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
                          }}
                        >
                          {item.product_description}
                        </p>
                      )}

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
                            onClick={() =>
                              item.quantity <= 1
                                ? removeItem(item.id)
                                : updateQuantity(item.id, -1)
                            }
                            style={{
                              width: "28px",
                              height: "28px",
                              borderRadius: "6px",
                              border: "none",
                              background: "#fff",
                              color: item.quantity <= 1 ? "#ef4444" : "#333",
                              cursor: "pointer",
                              fontSize: item.quantity <= 1 ? "1.2rem" : "1rem",
                              fontWeight: 600,
                            }}
                          >
                            {item.quantity <= 1 ? "🗑️" : "−"}
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

                {/* Tổng kết từng cửa hàng */}
                <div
                  style={{
                    background: "#fff",
                    borderRadius: "1rem",
                    padding: "1rem",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontWeight: 700,
                      fontSize: "1.1rem",
                    }}
                  >
                    <span>Tổng cộng:</span>
                    <span style={{ color: "#ee4d2d" }}>
                      {formatPrice(storeTotal)}
                    </span>
                  </div>

                  {/* ✅ Bổ sung localStorage khi navigate */}
                  <SubmitButton
                    isValid={group.items.length > 0}
                    onClick={() => {
                      const checkoutData = {
                        cartItems: group.items,
                        total: storeTotal,
                        shop_id: shopId,
                        shop_name: group.shop_name,
                      };
                      localStorage.setItem(
                        "checkoutData",
                        JSON.stringify(checkoutData)
                      );
                      navigate("/customer/confirm-order", { state: checkoutData });
                    }}
                    style={{ marginTop: "1rem" }}
                  >
                    Thanh toán cửa hàng này • {formatPrice(storeTotal)}
                  </SubmitButton>
                </div>
              </div>
            );
          })
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
    </div>
  );
}
