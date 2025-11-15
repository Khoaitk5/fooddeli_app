// File: src/pages/Customer/Cart.jsx (Đã sửa)

import { useState, useEffect, useMemo } from "react";
import { ShoppingCart, ChevronRight, UtensilsCrossed } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BackArrow from "../../components/shared/BackArrow";
import { useCart } from "../../hooks/useCart";

export function CartPage() {
  const navigate = useNavigate();
  const { cartItems: initialCartItems, loading, refreshCart } = useCart();
  const [cartItems, setCartItems] = useState(initialCartItems || []);
  const [swipeStates, setSwipeStates] = useState({}); // { [shopId]: { offset: 0, startX: 0, isSwiping: false, isMouseDown: false, isJustSwiped: false } }

  // --- ✅ SỬA: Tự động làm mới giỏ hàng mỗi khi vào trang ---
  useEffect(() => {
    refreshCart();
  }, []); // [] nghĩa là "chỉ chạy 1 lần khi component được tải"
  // --- HẾT SỬA ---

  // Function to remove item from cart
  const removeItem = async (shopId) => {
    try {
      // Assuming API endpoint DELETE /api/cart/:shopId or something
      // Since grouped by shop, perhaps remove all items of that shop
      // Or need to modify to remove specific items
      // For simplicity, remove all items of the shop
      const group = groupedCarts[shopId];
      if (!group) return;

      // Call API for each item
      const promises = group.items.map(item =>
        fetch(`http://localhost:5000/api/cart/items`, {
          method: "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ itemId: item.id }),
        })
      );

      await Promise.all(promises);
      refreshCart(); // Refresh cart after delete
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  // Swipe handlers
  const handleTouchStart = (shopId, e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const isMouse = !e.touches;
    setSwipeStates(prev => ({
      ...prev,
      [shopId]: { offset: 0, startX: clientX, isSwiping: false, isMouseDown: isMouse }
    }));
  };

  const handleTouchMove = (shopId, e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const state = swipeStates[shopId];
    if (!state || (e.type === 'mousemove' && !state.isMouseDown)) return;

    const deltaX = clientX - state.startX;
    if (deltaX < 0) { // Only allow left swipe
      if (e.preventDefault) e.preventDefault(); // Prevent scroll or selection
      const offset = Math.max(deltaX, -120); // Max 120px
      setSwipeStates(prev => ({
        ...prev,
        [shopId]: { ...prev[shopId], offset, isSwiping: true }
      }));
    }
  };

  const handleTouchEnd = (shopId) => {
    const state = swipeStates[shopId];
    if (!state) return;

    let isJustSwiped = false;
    if (state.offset < -80) { // If swiped more than 80px left, delete
      removeItem(shopId);
      isJustSwiped = true;
    }

    // Reset offset
    setSwipeStates(prev => ({
      ...prev,
      [shopId]: { ...prev[shopId], offset: 0, isSwiping: false, isMouseDown: false, isJustSwiped }
    }));

    // Reset isJustSwiped after a short delay
    if (isJustSwiped) {
      setTimeout(() => {
        setSwipeStates(prev => ({
          ...prev,
          [shopId]: { ...prev[shopId], isJustSwiped: false }
        }));
      }, 100);
    }
  };

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
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-15px);
      }
    }

    .cart-card {
      animation: slideInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
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
            background: "#FAFAFA",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: "60px",
                height: "60px",
                border: "4px solid #F0F0F0",
                borderTop: "4px solid #FE5621",
                borderRadius: "50%",
                margin: "0 auto 1.5rem",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <p style={{ fontSize: "1.3rem", color: "#666", fontWeight: 600 }}>
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
          background: "#FAFAFA",
          position: "relative",
        }}
      >

        {/* Header */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            background: "white",
            padding: "1.2rem 1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: "1.7rem",
            boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
            zIndex: 1100,
            color: "#1A1A1A",
          }}
        >
          <div
            onClick={() => navigate("/customer/discover")}
            style={{
              position: "absolute",
              left: "4.17vw",
              cursor: "pointer",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#F5F5F5";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            <BackArrow />
          </div>
          <ShoppingCart
            size={24}
            style={{ marginRight: "0.6rem", color: "#FE5621" }}
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
                  onClick={() => {
                    if (!swipeStates[shopId]?.isJustSwiped) {
                      handleShopClick(shopId, group);
                    }
                  }}
                  onTouchStart={(e) => handleTouchStart(shopId, e)}
                  onTouchMove={(e) => handleTouchMove(shopId, e)}
                  onTouchEnd={() => handleTouchEnd(shopId)}
                  onMouseDown={(e) => handleTouchStart(shopId, e)}
                  onMouseMove={(e) => handleTouchMove(shopId, e)}
                  onMouseUp={() => handleTouchEnd(shopId)}
                  style={{
                    background: "white",
                    borderRadius: "1.6rem",
                    padding: "1.5rem",
                    marginBottom: "1rem",
                    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.06)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    position: "relative",
                    animationDelay: `${index * 0.05}s`,
                    transform: `translateX(${swipeStates[shopId]?.offset || 0}px)`,
                  }}
                  onMouseEnter={(e) => {
                    if (!swipeStates[shopId]?.offset) {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!swipeStates[shopId]?.offset) {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 2px 12px rgba(0, 0, 0, 0.06)";
                    }
                    handleTouchEnd(shopId);
                  }}
                >
                  {/* Delete Button */}
                  {swipeStates[shopId]?.offset < -40 && (
                    <div
                      style={{
                        position: "absolute",
                        right: "1.5rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "#EF4444",
                        color: "white",
                        padding: "0.8rem 1.5rem",
                        borderRadius: "10px",
                        fontSize: "1.3rem",
                        fontWeight: 700,
                        boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
                      }}
                    >
                      Xóa
                    </div>
                  )}
                  {/* Badge số lượng món */}
                  <div
                    style={{
                      position: "absolute",
                      top: "-10px",
                      right: "1.5rem",
                      background: "#FE5621",
                      color: "white",
                      padding: "0.5rem 1rem",
                      borderRadius: "999px",
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      boxShadow: "0 4px 12px rgba(254, 86, 33, 0.3)",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                    }}
                  >
                    <UtensilsCrossed size={14} />
                    {totalItems} món
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
                    {/* Ảnh shop */}
                    <div
                      style={{
                        position: "relative",
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={shopAvatar}
                        alt={group.shop_name}
                        style={{
                          width: "80px",
                          height: "80px",
                          borderRadius: "1.2rem",
                          objectFit: "cover",
                          display: "block",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
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
                          fontSize: "1.5rem",
                          fontWeight: 700,
                          color: "#1A1A1A",
                          marginBottom: "0.6rem",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {group.shop_name}
                      </h3>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "1.5rem",
                          fontWeight: 700,
                          color: "#FE5621",
                        }}
                      >
                        {formatPrice(storeTotal)}
                      </p>
                    </div>

                    {/* Icon mũi tên */}
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        background: "#FE5621",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        boxShadow: "0 2px 8px rgba(254, 86, 33, 0.2)",
                      }}
                    >
                      <ChevronRight size={22} color="white" strokeWidth={2.5} />
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
              {/* Icon */}
              <div
                style={{
                  marginBottom: "2rem",
                  padding: "2.5rem",
                  background: "white",
                  borderRadius: "50%",
                  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.08)",
                }}
              >
                <ShoppingCart size={80} color="#FE5621" strokeWidth={1.5} />
              </div>

              {/* Text */}
              <h3
                style={{
                  margin: 0,
                  fontSize: "2rem",
                  fontWeight: 700,
                  color: "#1A1A1A",
                  marginBottom: "1rem",
                }}
              >
                Giỏ hàng trống
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: "1.3rem",
                  color: "#666",
                  lineHeight: 1.6,
                  maxWidth: "300px",
                }}
              >
                Hãy thêm món ăn yêu thích vào giỏ hàng để bắt đầu đặt hàng nhé!
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}