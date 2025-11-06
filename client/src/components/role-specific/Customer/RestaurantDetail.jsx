import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Star,
  Clock,
  MapPin,
  Heart,
  Eye,
  ChevronLeft,
  UserPlus,
  UserCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import theme from "../../../styles/theme";
import { useCart } from "../../../hooks/useCart";
import FloatingCart from "../../shared/FloatingCart";
import Toast from "../../shared/Toast";

export default function RestaurantDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const shopId = location.state?.shopId || sessionStorage.getItem("lastShopId");
  const defaultTab = location.state?.defaultTab || "videos"; // Nhận defaultTab từ navigation

  const [shop, setShop] = useState(null);
  const [videos, setVideos] = useState([]);
  const [menu, setMenu] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState(defaultTab); // Dùng defaultTab
  const [loading, setLoading] = useState(true);

  // 🛒 Hook giỏ hàng từ backend
  const { cartItems, cartCount, refreshCart } = useCart();

  // 🍞 Toast notification state
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  // 📦 Fetch dữ liệu shop + video + menu
  useEffect(() => {
    if (!shopId) return;
    sessionStorage.setItem("lastShopId", shopId);

    const fetchData = async () => {
      try {
        const shopRes = await fetch("http://localhost:5000/api/shops/detail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ shopId }),
        });
        const shopDataRes = await shopRes.json();
        if (shopDataRes.success) {
          setShop(shopDataRes.data.shop);
          setVideos(shopDataRes.data.videos || []);

          // ✅ Kiểm tra follow ngay sau khi load shop detail
          const shopUserId = shopDataRes.data.shop.user_id;
          const checkRes = await fetch(
            "http://localhost:5000/api/follows/check",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ shopUserId }),
            }
          );

          const checkData = await checkRes.json();
          if (checkData.success) {
            setIsFollowing(checkData.isFollowing);
            console.log("📍 Follow status:", checkData.isFollowing);
          }
        }

        const menuRes = await fetch(
          "http://localhost:5000/api/products/by-shop",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ shopId }),
          }
        );
        console.log("📹 videos:", shopDataRes.data.videos);
        const menuData = await menuRes.json();
        if (menuData.success) setMenu(menuData.data || []);
      } catch (err) {
        console.error("❌ Lỗi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [shopId]);

  // 🛒 Hàm thêm món vào giỏ hàng
  const handleAddToCart = async (item) => {
    // ✅ Kiểm tra dữ liệu đầu vào
    if (!item?.product_id || !item?.shop_id) {
      alert("❌ Thiếu thông tin sản phẩm");
      return;
    }

    const itemName = item.name || item.product_name || "món ăn";

    try {
      const res = await fetch("http://localhost:5000/api/cart/items", {
        method: "POST",
        credentials: "include", // để gửi session cookie
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shop_id: item.shop_id, // ✅ Lấy shop_id từ sản phẩm (chính xác hơn)
          product_id: item.product_id,
          quantity: 1,
          unit_price: item.price,
        }),
      });

      let data = null;
      try {
        data = await res.json();
      } catch (parseErr) {
        console.error("❌ Không parse được phản hồi thêm giỏ hàng:", parseErr);
      }

      if (res.ok && data?.success) {
        const successMessage = data.message || `Đã thêm "${itemName}" vào giỏ hàng!`;
        console.log("✅ Giỏ hàng:", { item: itemName, response: data });
        
        // ✅ Refresh giỏ hàng để cập nhật UI
        refreshCart();
        
        // ✅ Hiển thị toast notification
        setToast({ show: true, message: successMessage, type: "success" });
      } else {
        const errorMessage = data?.message || "Không rõ nguyên nhân";
        setToast({ show: true, message: `Không thể thêm vào giỏ hàng: ${errorMessage}`, type: "error" });
      }
    } catch (err) {
      console.error("❌ Lỗi khi thêm vào giỏ hàng:", err);
      setToast({ show: true, message: "Đã xảy ra lỗi khi thêm vào giỏ hàng!", type: "error" });
    }
  };


  if (loading) return <p className="text-center mt-40">Đang tải dữ liệu...</p>;
  if (!shop)
    return <p className="text-center mt-40">Không tìm thấy cửa hàng</p>;

  // 🔧 Gom menu theo category
  const groupedMenu = menu.reduce((acc, item) => {
    const cat = item.category || "Khác";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  // 💰 Tính tổng giá giỏ hàng
  const totalPrice = cartItems.reduce((sum, item) => sum + Number(item.line_total || 0), 0);

  return (
    <div
      style={{
        backgroundColor: "#fff",
        minHeight: "100vh",
        position: "relative",
        paddingBottom: cartCount > 0 ? "95px" : "0", // Thêm padding khi có giỏ hàng
      }}
    >
      {/* Header */}
      <div style={{ position: "relative" }}>
        <img
          src={shop.avatar_url || "/default-avatar.png"}
          alt={shop.shop_name}
          style={{ width: "100%", height: "260px", objectFit: "cover" }}
        />
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            backgroundColor: "rgba(255,255,255,0.8)",
            borderRadius: "50%",
            border: "none",
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          <ChevronLeft />
        </motion.button>
      </div>

      {/* Info */}
      <div style={{ padding: "1.5rem" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: "700" }}>
          {shop.shop_name}
        </h1>
        <p style={{ color: "#666", marginTop: 6 }}>
          {shop.description || "Chưa có mô tả"}
        </p>

        {/* Rating + distance + time */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginTop: "0.8rem",
            color: "#555",
          }}
        >
          <span style={{ display: "flex", alignItems: "center" }}>
            <Star fill="#fbbf24" color="#fbbf24" size={18} />
            <span style={{ marginLeft: 4 }}>
              {Number(shop.rating || 0).toFixed(1)}
            </span>
          </span>
          <span>•</span>
          <MapPin size={16} />
          <span>2.1 km</span>
          <span>•</span>
          <Clock size={16} />
          <span>25–30 phút</span>
        </div>

        {/* Follow button */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={async () => {
            try {
              // ✅ Log bước đầu tiên
              console.log("🧠 [DEBUG] Follow button clicked!");
              console.log("👉 isFollowing:", isFollowing);
              console.log("👉 shop.user_id:", shop.user_id);

              const endpoint = isFollowing
                ? "http://localhost:5000/api/follows/unfollow"
                : "http://localhost:5000/api/follows/follow";

              console.log("🌐 [DEBUG] Sending request to:", endpoint);

              const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // ⚡ để gửi cookie session
                body: JSON.stringify({ shopUserId: shop.user_id }),
              });

              // ✅ Log response cơ bản
              console.log("📡 [DEBUG] Response status:", res.status);
              const text = await res.text();
              console.log("📦 [DEBUG raw body]:", text);

              // ✅ Parse JSON cẩn thận
              let data = {};
              try {
                data = JSON.parse(text);
              } catch (err) {
                console.warn("⚠️ [DEBUG] Không parse được JSON:", err);
              }

              console.log("✅ [DEBUG] Parsed response data:", data);

              // ✅ Kiểm tra kết quả
              if (res.ok && data.success) {
                console.log("🎉 [DEBUG] Follow/unfollow thành công!");
                setIsFollowing(!isFollowing);
              } else {
                console.warn(
                  "⚠️ [DEBUG] Follow/unfollow thất bại:",
                  data.message
                );
              }
            } catch (err) {
              console.error("❌ [DEBUG] Lỗi khi gọi API follow/unfollow:", err);
            }
          }}
          style={{
            width: "100%",
            marginTop: 20,
            padding: "12px 0",
            border: "none",
            borderRadius: 12,
            fontWeight: 600,
            color: isFollowing ? "#222" : "#fff",
            background: isFollowing
              ? "#f3f4f6"
              : "linear-gradient(90deg, #5EAD1D 0%, #54A312 100%)",
            boxShadow: "0 3px 8px rgba(255,107,53,0.3)",
          }}
        >
          <AnimatePresence mode="wait">
            {isFollowing ? (
              <motion.div key="f" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                <UserCheck size={18} /> Đã theo dõi
              </motion.div>
            ) : (
              <motion.div key="u" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                <UserPlus size={18} /> Theo dõi cửa hàng
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            marginTop: 24,
            borderBottom: "1px solid #eee",
          }}
        >
          {["videos", "menu"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                padding: "12px 0",
                border: "none",
                background: "transparent",
                fontWeight: 600,
                borderBottom: activeTab === tab ? "2px solid #5EAD1D" : "none",
                color: activeTab === tab ? "#5EAD1D" : "#333",
              }}
            >
              {tab === "videos" ? "Video" : "Thực đơn"}
            </button>
          ))}
        </div>

        {/* Videos */}
        {activeTab === "videos" && (
          <div
            style={{
              marginTop: 20,
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 14,
            }}
          >
            {videos.length === 0 ? (
              <p
                style={{
                  gridColumn: "span 2",
                  textAlign: "center",
                  color: "#888",
                }}
              >
                Chưa có video nào
              </p>
            ) : (
              videos.map((v) => (
                <div
                  key={v.video_id}
                  style={{
                    position: "relative",
                    borderRadius: 12,
                    overflow: "hidden",
                    backgroundColor: "#000",
                  }}
                >
                  {/* ✅ Nếu có video_url (TikTok mp4) thì render video */}
                  {v.video_url ? (
                    <video
                      src={v.video_url}
                      controls
                      playsInline
                      style={{
                        width: "100%",
                        height: "220px",
                        objectFit: "cover",
                        backgroundColor: "#000",
                      }}
                      onError={(e) => {
                        console.warn("❌ Lỗi load video:", e);
                        e.target.poster = "/default-thumbnail.jpg";
                      }}
                    />
                  ) : (
                    // ✅ Nếu không có video_url thì fallback ảnh
                    <img
                      src={v.thumbnail_url || "/default-thumbnail.jpg"}
                      alt={v.title}
                      style={{
                        width: "100%",
                        height: "220px",
                        objectFit: "cover",
                      }}
                      onError={(e) => (e.target.src = "/default-thumbnail.jpg")}
                    />
                  )}

                  {/* 🔤 Tiêu đề + view/like overlay */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 8,
                      left: 8,
                      color: "white",
                      textShadow: "0 1px 3px rgba(0,0,0,0.6)",
                    }}
                  >
                    <p style={{ fontWeight: 600 }}>{v.title}</p>
                    {(v.views_count || v.likes_count) && (
                      <div style={{ display: "flex", gap: 10, fontSize: 12 }}>
                        {v.views_count && (
                          <>
                            <Eye size={14} /> {v.views_count}
                          </>
                        )}
                        {v.likes_count && (
                          <>
                            <Heart size={14} /> {v.likes_count}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Menu */}
        {activeTab === "menu" && (
          <div style={{ marginTop: 20 }}>
            {Object.entries(groupedMenu).map(([category, items]) => (
              <div key={category} style={{ marginBottom: 24 }}>
                <h3
                  style={{
                    color: "#5EAD1D",
                    fontWeight: 700,
                    fontSize: 18,
                    marginBottom: 10,
                  }}
                >
                  {category}
                </h3>
                {items.map((item) => (
                  <div
                    key={item.product_id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: "10px 0",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <img
                      src={item.image_url || "/default-food.jpg"}
                      alt={item.name}
                      style={{
                        width: 80,
                        height: 80,
                        objectFit: "cover",
                        borderRadius: 12,
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        navigate("/customer/food-detail", {
                          state: {
                            foodId: item.product_id,
                            foodName: item.name,
                            foodPrice: item.price,
                            foodDescription: item.description,
                            foodImage: item.image_url,
                            shopId: shop.id,
                          },
                        })
                      }
                    />
                    <div
                      style={{ flex: 1, cursor: "pointer" }}
                      onClick={() =>
                        navigate("/customer/food-detail", {
                          state: {
                            foodId: item.product_id,
                            foodName: item.name,
                            foodPrice: item.price,
                            foodDescription: item.description,
                            foodImage: item.image_url,
                            shopId: shop.id,
                          },
                        })
                      }
                    >
                      <h4 style={{ fontWeight: 600 }}>{item.name}</h4>
                      <p style={{ fontSize: 14, color: "#777" }}>
                        {item.description}
                      </p>
                      <div style={{ marginTop: 4 }}>
                        <span
                          style={{
                            color: "#5EAD1D",
                            fontWeight: 700,
                            fontSize: 16,
                          }}
                        >
                          {Number(item.price).toLocaleString("vi-VN")}đ
                        </span>
                      </div>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAddToCart(item)}
                      style={{
                        border: "1.5px solid #5EAD1D",
                        borderRadius: "10px",
                        width: 42,
                        height: 28,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#fff",
                        color: "#5EAD1D",
                        fontSize: 18,
                        fontWeight: 600,
                        lineHeight: "0",
                        cursor: "pointer",
                        boxShadow: "0 1px 3px rgba(255,107,53,0.1)",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#fff5f0")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#fff")
                      }
                    >
                      +
                    </motion.button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🛒 Floating Cart */}
      <FloatingCart
        items={cartItems}
        totalQuantity={cartCount}
        totalPrice={totalPrice}
      />

      {/* 🍞 Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
        duration={2000}
      />
    </div>
  );
}
