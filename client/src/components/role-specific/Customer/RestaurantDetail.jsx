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
   const [routeInfo, setRouteInfo] = useState({ distance: null, duration: null });
  const [routeLoading, setRouteLoading] = useState(true);

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

  // Hàm tính toán khoảng cách và thời gian
  const fetchRoute = async (shopData) => {
  if (!shopData?.address?.lat_lon?.lat || !shopData?.address?.lat_lon?.lon) {
    console.warn("⚠️ Thiếu lat/lon của shop:", shopData?.address?.lat_lon);
    setRouteLoading(false);
    setRouteInfo({ distance: "N/A", duration: "N/A" });
    return;
  }

  setRouteLoading(true);

  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      });
    });

    const userLat = position.coords.latitude;
    const userLon = position.coords.longitude;
    const shopLat = Number(shopData.address.lat_lon.lat);
    const shopLon = Number(shopData.address.lat_lon.lon);

    const res = await fetch("http://localhost:5000/api/shipper/route-info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        originLat: shopLat,
        originLon: shopLon,
        destLat: userLat,
        destLon: userLon,
      }),
    });

    const data = await res.json();
    console.log("📍 [route-info] response:", data);

    if (res.ok && data?.success && data?.data) {
     const distanceRaw = data?.data?.distance_km ?? data?.data?.distanceKm;
 const durationRaw = data?.data?.duration_sec ?? data?.data?.durationSec;
 const distanceNum = Number(distanceRaw);
 const durationNum = Number(durationRaw);
 if (Number.isFinite(distanceNum) && Number.isFinite(durationNum)) {
   setRouteInfo({
  distance: distanceNum, // 👈 trả về số luôn (km)
  duration: Math.max(1, Math.round(durationNum / 60)),
});
 } else {
   console.warn("⚠️ Dữ liệu route không hợp lệ:", data?.data);
   setRouteInfo({ distance: "N/A", duration: "N/A" });
 }
    } else {
      console.warn("⚠️ API route-info không success:", data);
      setRouteInfo({ distance: "N/A", duration: "N/A" });
    }
  } catch (err) {
    console.error("❌ Lỗi khi tính toán quãng đường:", err);
    setRouteInfo({ distance: "N/A", duration: "N/A" });
  } finally {
    setRouteLoading(false);
  }
};


  // 📍 Fetch route info (distance & duration)
  useEffect(() => {
    // Chỉ gọi khi có dữ liệu shop
    console.log("📍 [0] useEffect[shop] được kích hoạt. Dữ liệu shop hiện tại:", shop);
    if (shop) {
      fetchRoute(shop);
    }
  }, [shop]); // Chạy lại khi có dữ liệu shop
  
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
        backgroundColor: "#FAFAFA",
        minHeight: "100vh",
        position: "relative",
        paddingBottom: cartCount > 0 ? "95px" : "0",
      }}
    >
      {/* Header Image */}
      <div style={{ position: "relative" }}>
        <div
          style={{
            width: "100%",
            height: "280px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <img
            src={shop.avatar_url || "/default-avatar.png"}
            alt={shop.shop_name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          {/* Gradient overlay */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "120px",
              background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)",
            }}
          />
        </div>
        
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            backgroundColor: "rgba(255,255,255,0.95)",
            borderRadius: "50%",
            border: "none",
            width: 44,
            height: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            cursor: "pointer",
          }}
        >
          <ChevronLeft size={24} strokeWidth={2.5} />
        </motion.button>
      </div>

      {/* Shop Info Card */}
      <div
        style={{
          margin: "0 4.17vw",
          marginTop: "-40px",
          background: "white",
          borderRadius: "1.6rem",
          padding: "2rem 1.5rem",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "700",
            color: "#1A1A1A",
            marginBottom: "0.5rem",
          }}
        >
          {shop.shop_name}
        </h1>
        <p
          style={{
            color: "#666",
            fontSize: "1.3rem",
            lineHeight: "1.6",
            marginBottom: "1rem",
          }}
        >
          {shop.description || "Chưa có mô tả"}
        </p>

        {/* Stats Row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
            padding: "1rem 0",
            borderTop: "1px solid #F0F0F0",
            borderBottom: "1px solid #F0F0F0",
            marginTop: "1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "#FFF5F0",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
            }}
          >
            <Star fill="#FE5621" color="#FE5621" size={18} />
            <span style={{ fontWeight: "600", color: "#FE5621", fontSize: "1.4rem" }}>
              {Number(shop.rating || 0).toFixed(1)}
            </span>
          </div>
          
          {routeLoading ? (
            <div style={{ color: "#999", fontSize: "1.3rem" }}>Đang tính toán...</div>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#666", fontSize: "1.3rem" }}>
                <MapPin size={16} strokeWidth={2} />
                <span>{routeInfo.distance ? `${routeInfo.distance} km` : "N/A"}</span>
              </div>
              
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#666", fontSize: "1.3rem" }}>
                <Clock size={16} strokeWidth={2} />
                <span>{routeInfo.duration || "N/A"}</span>
              </div>
            </>
          )}
        </div>

        {/* Follow button */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={async () => {
            try {
              const endpoint = isFollowing
                ? "http://localhost:5000/api/follows/unfollow"
                : "http://localhost:5000/api/follows/follow";

              const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ shopUserId: shop.user_id }),
              });

              const text = await res.text();
              let data = {};
              try {
                data = JSON.parse(text);
              } catch (err) {
                console.warn("⚠️ Không parse được JSON:", err);
              }

              if (res.ok && data.success) {
                setIsFollowing(!isFollowing);
              }
            } catch (err) {
              console.error("❌ Lỗi khi gọi API follow/unfollow:", err);
            }
          }}
          style={{
            width: "100%",
            marginTop: "1.5rem",
            padding: "1.4rem 0",
            border: isFollowing ? "2px solid #E0E0E0" : "none",
            borderRadius: "12px",
            fontWeight: "700",
            fontSize: "1.4rem",
            color: isFollowing ? "#666" : "#fff",
            background: isFollowing
              ? "white"
              : "linear-gradient(90deg, #FE5621 0%, #EE4D2D 100%)",
            boxShadow: isFollowing ? "none" : "0 4px 12px rgba(254, 86, 33, 0.3)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            transition: "all 0.3s ease",
          }}
        >
          <AnimatePresence mode="wait">
            {isFollowing ? (
              <motion.div
                key="f"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <UserCheck size={20} strokeWidth={2.5} />
                <span>Đã theo dõi</span>
              </motion.div>
            ) : (
              <motion.div
                key="u"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <UserPlus size={20} strokeWidth={2.5} />
                <span>Theo dõi cửa hàng</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Tabs */}
      <div
        style={{
          background: "white",
          margin: "1.5rem 4.17vw 0",
          borderRadius: "1.2rem",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        <div style={{ display: "flex" }}>
          {["videos", "menu"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                padding: "1.4rem 0",
                border: "none",
                background: activeTab === tab ? "#FFF5F0" : "transparent",
                fontWeight: "700",
                fontSize: "1.4rem",
                color: activeTab === tab ? "#FE5621" : "#666",
                cursor: "pointer",
                transition: "all 0.3s ease",
                position: "relative",
              }}
            >
              {tab === "videos" ? "Video" : "Thực đơn"}
              {activeTab === tab && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: "20%",
                    right: "20%",
                    height: "3px",
                    background: "#FE5621",
                    borderRadius: "3px 3px 0 0",
                  }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content Container */}
      <div style={{ padding: "0 4.17vw", marginTop: "1.5rem" }}>

        {/* Videos */}
        {activeTab === "videos" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "1rem",
            }}
          >
            {videos.length === 0 ? (
              <div
                style={{
                  gridColumn: "span 2",
                  textAlign: "center",
                  padding: "3rem 0",
                  color: "#999",
                  fontSize: "1.3rem",
                }}
              >
                Chưa có video nào
              </div>
            ) : (
              videos.map((v) => (
                <motion.div
                  key={v.video_id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    position: "relative",
                    borderRadius: "1.2rem",
                    overflow: "hidden",
                    backgroundColor: "#000",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                >
                  {v.video_url ? (
                    <video
                      src={v.video_url}
                      controls
                      playsInline
                      style={{
                        width: "100%",
                        height: "240px",
                        objectFit: "cover",
                        backgroundColor: "#000",
                      }}
                      onError={(e) => {
                        console.warn("❌ Lỗi load video:", e);
                        e.target.poster = "/default-thumbnail.jpg";
                      }}
                    />
                  ) : (
                    <img
                      src={v.thumbnail_url || "/default-thumbnail.jpg"}
                      alt={v.title}
                      style={{
                        width: "100%",
                        height: "240px",
                        objectFit: "cover",
                      }}
                      onError={(e) => (e.target.src = "/default-thumbnail.jpg")}
                    />
                  )}

                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)",
                      padding: "2rem 1rem 1rem",
                      color: "white",
                    }}
                  >
                    <p
                      style={{
                        fontWeight: "600",
                        fontSize: "1.2rem",
                        marginBottom: "0.5rem",
                        textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                      }}
                    >
                      {v.title}
                    </p>
                    {(v.views_count || v.likes_count) && (
                      <div
                        style={{
                          display: "flex",
                          gap: "1rem",
                          fontSize: "1.1rem",
                          alignItems: "center",
                        }}
                      >
                        {v.views_count && (
                          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                            <Eye size={14} />
                            <span>{v.views_count}</span>
                          </div>
                        )}
                        {v.likes_count && (
                          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                            <Heart size={14} />
                            <span>{v.likes_count}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* Menu */}
        {activeTab === "menu" && (
          <div>
            {Object.entries(groupedMenu).map(([category, items]) => (
              <div key={category} style={{ marginBottom: "2rem" }}>
                <div
                  style={{
                    background: "white",
                    padding: "1rem 1.5rem",
                    borderRadius: "1rem",
                    marginBottom: "1rem",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  <h3
                    style={{
                      color: "#FE5621",
                      fontWeight: "700",
                      fontSize: "1.6rem",
                      margin: 0,
                    }}
                  >
                    {category}
                  </h3>
                </div>
                
                <div
                  style={{
                    background: "white",
                    borderRadius: "1.2rem",
                    overflow: "hidden",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  }}
                >
                  {items.map((item, index) => (
                    <motion.div
                      key={item.product_id}
                      whileHover={{ backgroundColor: "#FAFAFA" }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1.2rem",
                        padding: "1.2rem",
                        borderBottom: index < items.length - 1 ? "1px solid #F5F5F5" : "none",
                        transition: "background-color 0.2s ease",
                      }}
                    >
                      <img
                        src={item.image_url || "/default-food.jpg"}
                        alt={item.name}
                        style={{
                          width: "90px",
                          height: "90px",
                          objectFit: "cover",
                          borderRadius: "1.2rem",
                          cursor: "pointer",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        }}
                        onClick={() =>
                          navigate("/customer/food-detail", {
                            state: {
                              foodId: item.product_id,
                              foodName: item.name,
                              foodPrice: item.price,
                              foodDescription: item.description,
                              foodImage: item.image_url,
                              shopId: shop?.id ?? shop?.shop_id,
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
                        <h4
                          style={{
                            fontWeight: "700",
                            fontSize: "1.4rem",
                            color: "#1A1A1A",
                            marginBottom: "0.4rem",
                          }}
                        >
                          {item.name}
                        </h4>
                        <p
                          style={{
                            fontSize: "1.2rem",
                            color: "#888",
                            marginBottom: "0.6rem",
                            lineHeight: "1.4",
                          }}
                        >
                          {item.description}
                        </p>
                        <span
                          style={{
                            color: "#FE5621",
                            fontWeight: "700",
                            fontSize: "1.5rem",
                          }}
                        >
                          {Number(item.price).toLocaleString("vi-VN")}đ
                        </span>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => handleAddToCart(item)}
                        style={{
                          background: "linear-gradient(135deg, #FE5621 0%, #EE4D2D 100%)",
                          border: "none",
                          borderRadius: "12px",
                          width: "44px",
                          height: "44px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "2rem",
                          fontWeight: "600",
                          cursor: "pointer",
                          boxShadow: "0 4px 12px rgba(254, 86, 33, 0.3)",
                        }}
                      >
                        +
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
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
        distance={routeInfo.distance}
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
