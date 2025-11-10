import { useState, useEffect, useMemo } from "react";
import { ShoppingCart, ChevronRight, UtensilsCrossed } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BackArrow from "../../components/shared/BackArrow";
import { useCart } from "../../hooks/useCart";

export function CartPage({ isMobile, isTablet, onCheckout }) {
  const navigate = useNavigate();
  const { cartItems: initialCartItems, loading, refreshCart } = useCart();
  const [cartItems, setCartItems] = useState(initialCartItems || []);

  // Đồng bộ lại cartItems khi dữ liệu hook cập nhật
  useEffect(() => {
    if (initialCartItems) {
      setCartItems(initialCartItems);
    }
  }, [initialCartItems]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  // ✅ Nhóm sản phẩm theo shop
  const groupedCarts = useMemo(() => {
    if (!cartItems || !Array.isArray(cartItems)) return {};
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

  // ✅ Hàm xử lý khi click vào shop card
  const handleShopClick = (shopId, group) => {
    const storeTotal = group.items.reduce(
      (sum, i) => sum + Number(i.line_total || i.unit_price * i.quantity),
      0
    );

    const checkoutData = {
      cartItems: group.items,
      total: storeTotal,
      shop_id: shopId,
      shop_name: group.shop_name,
    };

    localStorage.setItem("checkoutData", JSON.stringify(checkoutData));
    navigate("/customer/confirm-order", { state: checkoutData });
  };

  // Keyframe animations
  const styles = `
    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes shimmer {
      0% {
        background-position: -1000px 0;
      }
      100% {
        background-position: 1000px 0;
      }
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.8;
      }
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-10px);
      }
    }

    .cart-card {
      animation: slideInUp 0.5s ease-out;
    }

    .shimmer-loading {
      background: linear-gradient(
        90deg,
        #f0f0f0 25%,
        #e0e0e0 50%,
        #f0f0f0 75%
      );
      background-size: 1000px 100%;
      animation: shimmer 2s infinite;
    }
  `;

  if (loading)
    return (
      <>
        <style>{styles}</style>
        <div
          style={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #FFF5F5 0%, #FFF8E1 100%)",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              className="shimmer-loading"
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                margin: "0 auto 1rem",
              }}
            />
            <p style={{ fontSize: "1.1rem", color: "#636E72", fontWeight: 500 }}>
              Đang tải giỏ hàng...
            </p>
          </div>
        </div>
      </>
    );

  return (
    <>
      <style>{styles}</style>
      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #FFF5F5 0%, #FFF8E1 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Floating Food Decorations */}
        <div
          style={{
            position: "fixed",
            top: "20%",
            left: "5%",
            fontSize: "3rem",
            opacity: 0.05,
            animation: "float 6s ease-in-out infinite",
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          🍕
        </div>
        <div
          style={{
            position: "fixed",
            top: "60%",
            right: "8%",
            fontSize: "2.5rem",
            opacity: 0.05,
            animation: "float 5s ease-in-out infinite 1s",
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          🍔
        </div>
        <div
          style={{
            position: "fixed",
            top: "40%",
            right: "15%",
            fontSize: "2.8rem",
            opacity: 0.05,
            animation: "float 7s ease-in-out infinite 0.5s",
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          🍜
        </div>

        {/* Header */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            background: "linear-gradient(135deg, #FE5621 0%, #FF7A45 50%, #FFA726 100%)",
            padding: "1rem 1rem 1.2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: "1.25rem",
            boxShadow: "0 4px 20px rgba(254, 86, 33, 0.25)",
            zIndex: 1100,
            color: "#fff",
            textShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <button
            onClick={() => navigate("/customer/discover")}
            style={{
              position: "absolute",
              left: "1rem",
              background: "rgba(255, 255, 255, 0.2)",
              border: "none",
              cursor: "pointer",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(10px)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)";
              e.currentTarget.style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <BackArrow style={{ color: "#fff" }} />
          </button>
          <ShoppingCart
            size={22}
            style={{ marginRight: "0.5rem" }}
            strokeWidth={2.5}
          />
          Giỏ hàng
        </div>

        {/* Nội dung */}
        <div
          style={{
            padding: "1.5rem 1rem",
            paddingTop: "5.5rem",
            paddingBottom: "2rem",
            position: "relative",
            zIndex: 1,
          }}
        >
          {Object.keys(groupedCarts).length > 0 ? (
            Object.entries(groupedCarts).map(([shopId, group], index) => {
              const storeTotal = group.items.reduce(
                (sum, i) => sum + Number(i.line_total || i.unit_price * i.quantity),
                0
              );
              const totalItems = group.items.reduce((sum, i) => sum + i.quantity, 0);
              const shopAvatar = group.items[0]?.shop_avatar || "/default-avatar.png";

              return (
                <div
                  key={shopId}
                  className="cart-card"
                  onClick={() => handleShopClick(shopId, group)}
                  style={{
                    background: "linear-gradient(135deg, #ffffff 0%, #fffbf8 100%)",
                    borderRadius: "1.25rem",
                    padding: "1.5rem",
                    marginBottom: "1.25rem",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                    cursor: "pointer",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    position: "relative",
                    animationDelay: `${index * 0.05}s`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.02)";
                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.08)";
                  }}
                >
                  {/* Badge số lượng món */}
                  <div
                    style={{
                      position: "absolute",
                      top: "-8px",
                      right: "1.5rem",
                      background: "linear-gradient(135deg, #FE5621 0%, #FF7A45 100%)",
                      color: "#fff",
                      padding: "0.35rem 0.75rem",
                      borderRadius: "20px",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      boxShadow: "0 2px 8px rgba(254, 86, 33, 0.3)",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                    }}
                  >
                    <UtensilsCrossed size={12} />
                    {totalItems} món
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    {/* Ảnh shop với gradient background */}
                    <div
                      style={{
                        position: "relative",
                        flexShrink: 0,
                      }}
                    >
                      {/* Gradient background circle */}
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          width: "85px",
                          height: "85px",
                          borderRadius: "16px",
                          background: "linear-gradient(135deg, rgba(254, 86, 33, 0.15) 0%, rgba(255, 167, 38, 0.15) 100%)",
                          filter: "blur(8px)",
                          zIndex: 0,
                        }}
                      />
                      <img
                        src={shopAvatar}
                        alt={group.shop_name}
                        style={{
                          position: "relative",
                          width: "70px",
                          height: "70px",
                          borderRadius: "12px",
                          objectFit: "cover",
                          display: "block",
                          boxShadow: "0 6px 20px rgba(254, 86, 33, 0.3)",
                          zIndex: 1,
                        }}
                        onError={(e) => {
                          e.target.src = "/default-avatar.png";
                        }}
                      />
                    </div>

                    {/* Thông tin shop */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3
                        style={{
                          margin: 0,
                          fontSize: "1.2rem",
                          fontWeight: 800,
                          background: "linear-gradient(135deg, #2D3436 0%, #636E72 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                          marginBottom: "0.5rem",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {group.shop_name}
                      </h3>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          flexWrap: "wrap",
                        }}
                      >
                        <p
                          style={{
                            margin: 0,
                            fontSize: "1.1rem",
                            fontWeight: 700,
                            background: "linear-gradient(135deg, #FE5621 0%, #FF7A45 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                          }}
                        >
                          {formatPrice(storeTotal)}
                        </p>
                      </div>
                    </div>

                    {/* Icon mũi tên với gradient */}
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #FE5621 0%, #FF7A45 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        animation: "pulse 2s ease-in-out infinite",
                      }}
                    >
                      <ChevronRight size={20} color="#fff" strokeWidth={3} />
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div
              style={{
                height: "75vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "2rem",
              }}
            >
              {/* Gradient Circle Background */}
              <div
                style={{
                  position: "relative",
                  marginBottom: "2rem",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "180px",
                    height: "180px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #FE5621 0%, #FFA726 100%)",
                    opacity: 0.1,
                    animation: "pulse 3s ease-in-out infinite",
                  }}
                />
                <div
                  style={{
                    position: "relative",
                    padding: "2rem",
                    background: "linear-gradient(135deg, #FE5621 0%, #FF7A45 100%)",
                    borderRadius: "50%",
                    display: "inline-flex",
                    boxShadow: "0 8px 30px rgba(254, 86, 33, 0.25)",
                  }}
                >
                  <ShoppingCart size={64} color="#fff" strokeWidth={2} />
                </div>
              </div>

              {/* Text */}
              <h3
                style={{
                  margin: 0,
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  background: "linear-gradient(135deg, #2D3436 0%, #636E72 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  marginBottom: "0.5rem",
                }}
              >
                Giỏ hàng trống
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: "1rem",
                  color: "#636E72",
                  marginBottom: "2rem",
                  maxWidth: "280px",
                }}
              >
                Hãy thêm món ăn yêu thích vào giỏ hàng để bắt đầu đặt hàng nhé!
              </p>

              {/* Food Emojis Decoration */}
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  fontSize: "2rem",
                  opacity: 0.3,
                }}
              >
                <span style={{ animation: "float 3s ease-in-out infinite" }}>🍕</span>
                <span style={{ animation: "float 3s ease-in-out infinite 0.3s" }}>
                  🍔
                </span>
                <span style={{ animation: "float 3s ease-in-out infinite 0.6s" }}>
                  🍜
                </span>
                <span style={{ animation: "float 3s ease-in-out infinite 0.9s" }}>
                  🍰
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}