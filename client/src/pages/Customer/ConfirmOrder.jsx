// File: src/pages/Customer/ConfirmOrder.jsx (Phiên bản hoàn chỉnh)

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BackArrow from "../../components/shared/BackArrow";
import LocationIcon from "../../components/shared/LocationIcon";
import ClockIcon2 from "../../components/shared/ClockIcon2";
import PaymentIcon from "../../components/shared/PaymentIcon";
import TagIcon from "../../components/shared/TagIcon";
import CardIcon from "../../components/shared/CardIcon";
import PlusIcon from "../../components/shared/PlusIcon";
import MinusIcon from "../../components/shared/MinusIcon";
import AddressSelector from "../../components/role-specific/Customer/AddressSelector";
import axios from "axios";
import { useOrder } from "../../contexts/OrderContext";
import { useAddress } from "../../contexts/AddressContext";

// --- Styles cho Modal ---
const modalStyles = {
  backdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
    backdropFilter: "blur(4px)",
  },
  content: {
    background: "white",
    padding: "2.5rem 2rem",
    borderRadius: "1.6rem",
    width: "85vw",
    maxWidth: "340px",
    textAlign: "center",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.25)",
  },
  text: {
    fontSize: "1.5rem",
    color: "#1A1A1A",
    marginBottom: "2rem",
    lineHeight: 1.5,
    fontWeight: "500",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    gap: "1rem",
  },
  button: {
    padding: "1.2rem 0",
    flex: 1,
    borderRadius: "12px",
    border: "none",
    fontSize: "1.4rem",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  buttonCancel: {
    border: "2px solid #E0E0E0",
    background: "white",
    color: "#666",
  },
  buttonConfirm: {
    background: "linear-gradient(90deg, #FE5621 0%, #EE4D2D 100%)",
    color: "white",
    boxShadow: "0 4px 12px rgba(254, 86, 33, 0.3)",
  },
};
// --- Hết Styles Modal ---

// Format tiền
const formatPrice = (price) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);

// 📍 Tính khoảng cách giữa 2 tọa độ theo công thức Haversine (km)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Bán kính Trái đất (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

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
  
  const [addressSelectorOpen, setAddressSelectorOpen] = useState(false);
  const { currentAddress, setCurrentAddress } = useAddress();
  const [note, setNote] = useState("");
  const { paymentMethodName, setPaymentMethodName } = useOrder();
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

  const [currentUser, setCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [shopInfo, setShopInfo] = useState(null);
  const [deliveryDistance, setDeliveryDistance] = useState(null);
  const [canDeliver, setCanDeliver] = useState(true);
  const [distanceError, setDistanceError] = useState(null);
  
  // Format contact info từ user data (chỉ tên và số điện thoại)
  const contactInfo = currentUser?.full_name && currentUser?.phone
    ? `${currentUser.full_name} | ${currentUser.phone}`
    : "Chưa có thông tin liên hệ";

  // Fetch current user from database
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/me", {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          setCurrentUser(data.user);
        } else {
          // Nếu không có session, redirect to login
          console.warn("⚠️ Session không hợp lệ:", data);
          navigate("/login");
        }
      } catch (err) {
        console.error("Lỗi fetch user:", err);
        navigate("/login");
      } finally {
        setLoadingUser(false);
      }
    };

    fetchCurrentUser();
  }, [navigate]);

  // Check số điện thoại khi component mount
  useEffect(() => {
    if (!loadingUser && currentUser && !currentUser.phone) {
      alert("Vui lòng cập nhật số điện thoại trước khi đặt hàng");
      navigate("/customer/profile");
    }
  }, [currentUser, loadingUser, navigate]);

  // Địa chỉ đã được quản lý bởi AddressContext, không cần fetch riêng

  // Sync payment method from localStorage to context on mount
  useEffect(() => {
    const savedPayment = localStorage.getItem("selectedPaymentMethod");
    if (savedPayment && savedPayment !== paymentMethodName) {
      setPaymentMethodName(savedPayment);
    }
  }, [paymentMethodName, setPaymentMethodName]);

  // Fetch thông tin shop
  useEffect(() => {
    const fetchShopInfo = async () => {
      if (!shop_id) return;
      
      try {
        const res = await axios.get(`http://localhost:5000/api/shops/${shop_id}`, {
          withCredentials: true,
        });
        
        if (res.data?.success) {
          setShopInfo(res.data.data);
          console.log('📍 Shop info:', res.data.data);
        }
      } catch (err) {
        console.error('❌ Error fetching shop info:', err);
      }
    };
    
    fetchShopInfo();
  }, [shop_id]);

  // Kiểm tra khoảng cách khi có đủ thông tin
  useEffect(() => {
    const checkDeliveryDistance = () => {
      if (!shopInfo?.address?.lat_lon || !currentAddress?.lat_lon) {
        console.log('⚠️ Chưa có đủ thông tin tọa độ để kiểm tra khoảng cách');
        return;
      }
      
      const shopLat = Number(shopInfo.address.lat_lon.lat);
      const shopLon = Number(shopInfo.address.lat_lon.lon);
      const userLat = Number(currentAddress.lat_lon.lat);
      const userLon = Number(currentAddress.lat_lon.lon);
      
      if (!shopLat || !shopLon || !userLat || !userLon) {
        console.warn('⚠️ Tọa độ không hợp lệ');
        setDistanceError('Không thể xác định khoảng cách giao hàng');
        setCanDeliver(false);
        return;
      }
      
      const distance = calculateDistance(shopLat, shopLon, userLat, userLon);
      setDeliveryDistance(distance);
      
      const MAX_DELIVERY_DISTANCE_KM = 5;
      
      console.log('📍 Khoảng cách giao hàng:', {
        distance: distance.toFixed(2) + ' km',
        shopCoords: { lat: shopLat, lon: shopLon },
        userCoords: { lat: userLat, lon: userLon },
        canDeliver: distance <= MAX_DELIVERY_DISTANCE_KM
      });
      
      if (distance > MAX_DELIVERY_DISTANCE_KM) {
        setCanDeliver(false);
        setDistanceError(
          `Khoảng cách giao hàng quá xa (${distance.toFixed(1)}km). ` +
          `Chúng tôi chỉ giao hàng trong bán kính ${MAX_DELIVERY_DISTANCE_KM}km`
        );
      } else {
        setCanDeliver(true);
        setDistanceError(null);
      }
    };
    
    checkDeliveryDistance();
  }, [shopInfo, currentAddress]);

  // Format địa chỉ hiển thị
  const formatAddress = (addr) => {
    if (!addr || !addr.address_line) return "Chưa có địa chỉ giao hàng";
    const { detail, ward, province } = addr.address_line;
    return `${detail}, ${ward}, ${province}`;
  };

  // Xử lý khi chọn địa chỉ mới
  const handleSelectAddress = (address) => {
    console.log('🔄 Address selected:', address);
    setCurrentAddress(address);
    setAddressSelectorOpen(false);
  };

  // --- Styles cho PaymentDetails ---
  const paymentStyles = {
    paymentDetailsContainer: {
      marginLeft: "auto",
      marginRight: "auto",
      marginTop: "2.5vh",
      width: "91.67vw",
      background: "white",
      borderRadius: "1.6rem",
      padding: "2rem 1.5rem",
      boxShadow: "0 2px 12px rgba(0, 0, 0, 0.06)",
    },
    paymentTitle: {
      color: "#1A1A1A",
      fontSize: "1.5rem",
      fontWeight: "700",
      marginBottom: "1.5rem",
    },
    paymentRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "1.2rem",
    },
    paymentLabel: {
      color: "#666",
      fontSize: "1.3rem",
      fontWeight: "500",
    },
    paymentValue: {
      color: "#1A1A1A",
      fontSize: "1.3rem",
      fontWeight: "600",
    },
    paymentTotalLabel: {
      color: "#1A1A1A",
      fontSize: "1.5rem",
      fontWeight: "700",
    },
    paymentTotalValue: {
      color: "#FE5621",
      fontSize: "1.7rem",
      fontWeight: "700",
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

  // Nếu đang loading user
  if (loadingUser) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p style={{ fontSize: "1.2rem", color: "#555" }}>Đang tải...</p>
      </div>
    );
  }

  // ==========================
  // 🔘 Nút "Đặt đơn"
  // ==========================
  const handleConfirmOrder = async () => {
    // Check số điện thoại trước khi đặt hàng
    if (!currentUser?.phone) {
      alert("Vui lòng cập nhật số điện thoại trước khi đặt hàng");
      navigate("/customer/profile");
      return;
    }

    // 📍 Kiểm tra khoảng cách giao hàng
    if (!canDeliver) {
      alert(distanceError || "Khoảng cách giao hàng quá xa. Vui lòng chọn cửa hàng gần hơn");
      return;
    }

    if (!currentAddress?.lat_lon?.lat || !currentAddress?.lat_lon?.lon) {
      alert("Địa chỉ giao hàng chưa có tọa độ. Vui lòng cập nhật lại địa chỉ");
      return;
    }

    if (paymentMethodName === "Chuyển khoản") {
      try {
        const res = await fetch("http://localhost:5000/api/payments/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderCode: Date.now(),
            amount: 5000, // test, có thể đổi thành totalPrice
            description: JSON.stringify({
              user_id: currentUser?.id,
              shop_id,
              address_id: currentAddress?.address_id, // 📍 Thêm address_id
              delivery_address: currentAddress ? JSON.stringify(currentAddress) : null,
              items: cartItems.map((i) => ({
                product_id: i.product_id,
                quantity: i.quantity,
                unit_price: i.unit_price,
              })),
            }),
            metadata: JSON.stringify({
              user_id: currentUser?.id,
              shop_id,
              address_id: currentAddress?.address_id, // 📍 Thêm address_id
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
              address_id: currentAddress?.address_id, // 📍 Thêm address_id để backend dùng đúng địa chỉ
              delivery_address: currentAddress ? JSON.stringify(currentAddress) : null,
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
          
          // Xóa các sản phẩm đã đặt từ giỏ hàng
          try {
            for (const item of cartItems) {
              await fetch(`http://localhost:5000/api/cart/items`, {
                method: "DELETE",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ itemId: item.id }),
              });
            }
            console.log("✅ Đã xóa sản phẩm đã đặt khỏi giỏ hàng");
          } catch (err) {
            console.error("❌ Lỗi xóa sản phẩm khỏi giỏ hàng:", err);
          }
          
          navigate("/customer/order-success", {
            state: { 
              shop_id, 
              shop_name, 
              totalPrice, 
              paymentMethod: paymentMethodName,
              order_id: data.order?.id || data.order?.order_id,
            },
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
        backgroundColor: "#FAFAFA",
        minHeight: "100vh",
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
          zIndex: 10,
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        }}
      >
        <BackArrow
          style={{
            position: "absolute",
            top: "50%",
            left: "4.17vw",
            transform: "translateY(-50%)",
            cursor: "pointer",
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
          <div style={{ color: "#1A1A1A", fontSize: "1.7rem", fontWeight: 700 }}>
            Thanh toán
          </div>
          <div style={{ color: "#666", fontSize: "1.2rem", fontWeight: 500, marginTop: "0.2rem" }}>
            {shop_name}
          </div>
        </div>
      </div>

      {/* Thông tin giao hàng */}
      <div
        style={{
          background: "white",
          borderRadius: "1.6rem",
          margin: "2.5vh auto",
          padding: "1.5rem",
          width: "91.67vw",
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
          <LocationIcon style={{ marginTop: "0.2rem" }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: "1.4rem", color: "#1A1A1A", marginBottom: "0.5rem" }}>
              {formatAddress(currentAddress)}
            </div>
            <div style={{ color: "#888", fontSize: "1.2rem" }}>{contactInfo}</div>
          </div>
          <div
            onClick={() => setAddressSelectorOpen(true)}
            style={{
              color: "#FE5621",
              fontWeight: 700,
              fontSize: "1.3rem",
              cursor: "pointer",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = "0.7"}
            onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
          >
            Sửa
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.8rem",
            marginTop: "1.2rem",
            paddingTop: "1.2rem",
            borderTop: "1px solid #F5F5F5",
            color: "#666",
            fontSize: "1.3rem",
          }}
        >
          <ClockIcon2 />
          <span>
            Giao nhanh
            {deliveryDistance !== null && ` • ${deliveryDistance.toFixed(1)}km`}
          </span>
        </div>
        
        {/* Cảnh báo khoảng cách */}
        {!canDeliver && distanceError && (
          <div
            style={{
              marginTop: "1rem",
              padding: "1rem",
              background: "#FEF3F2",
              border: "1px solid #FEE4E2",
              borderRadius: "8px",
              display: "flex",
              alignItems: "flex-start",
              gap: "0.8rem",
            }}
          >
            <span style={{ fontSize: "1.4rem" }}>⚠️</span>
            <div>
              <div style={{ color: "#B42318", fontSize: "1.3rem", fontWeight: "600", marginBottom: "0.3rem" }}>
                Không thể giao hàng
              </div>
              <div style={{ color: "#B42318", fontSize: "1.2rem", lineHeight: "1.5" }}>
                {distanceError}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AddressSelector Modal */}
      <AddressSelector
        isOpen={addressSelectorOpen}
        onClose={() => setAddressSelectorOpen(false)}
        onSelectAddress={handleSelectAddress}
        currentAddress={currentAddress}
      />

      {/* Danh sách món */}
      <div
        style={{
          background: "white",
          borderRadius: "1.6rem",
          margin: "2.5vh auto",
          width: "91.67vw",
          paddingBottom: "1rem",
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            padding: "1.5rem 1.5rem 1rem",
          }}
        >
          <div
            style={{
              color: "#1A1A1A",
              fontSize: "1.5rem",
              fontWeight: "700",
            }}
          >
            Tóm tắt đơn
          </div>

          <div
            style={{
              color: "#FE5621",
              fontSize: "1.3rem",
              fontWeight: "700",
              cursor: "pointer",
            }}
            onClick={() =>
              navigate("/customer/restaurant-details", {
                state: { shop_id: shop_id },
              })
            }
          >
            + Thêm món
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
                padding: "1.2rem 1.5rem",
                borderBottom: cartItems[cartItems.length - 1].id !== item.id ? "1px solid #F5F5F5" : "none",
                transition: "background-color 0.2s ease",
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#FAFAFA"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
            >
              <img
                src={item.product_image || "/default-food.jpg"}
                alt={item.product_name}
                style={{
                  width: "5.5rem",
                  height: "5.5rem",
                  borderRadius: "1.2rem",
                  objectFit: "cover",
                  marginRight: "1rem",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
              />
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <div
                  style={{
                    color: "#1A1A1A",
                    fontSize: "1.4rem",
                    fontWeight: "700",
                  }}
                >
                  {item.product_name}
                </div>
                <div
                  style={{
                    color: "#FE5621",
                    fontSize: "1.4rem",
                    fontWeight: "700",
                  }}
                >
                  {formatPrice(item.unit_price)}
                </div>
              </div>
              <div
                style={{
                  minWidth: "90px",
                  height: "36px",
                  borderRadius: "12px",
                  border: "2px solid #FE5621",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0 0.8rem",
                  background: "white",
                }}
              >
                <MinusIcon
                  style={{ cursor: "pointer", transition: "transform 0.2s ease" }}
                  onClick={handleDecreaseClick}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.2)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                />
                <span style={{ fontSize: "1.4rem", fontWeight: "700", color: "#1A1A1A" }}>
                  {item.quantity}
                </span>
                <PlusIcon
                  style={{ cursor: "pointer", transition: "transform 0.2s ease" }}
                  onClick={handleIncreaseClick}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.2)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
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
        <div style={paymentStyles.paymentRow}>
          <div style={paymentStyles.paymentLabel}>
            Tổng giá món ({totalQuantity} món)
          </div>
          <div style={paymentStyles.paymentValue}>
            {formatPrice(totalItemPrice)}
          </div>
        </div>

        {/* Row 2: Phí giao hàng */}
        <div style={paymentStyles.paymentRow}>
          <div style={paymentStyles.paymentLabel}>Phí giao hàng</div>
          <div style={paymentStyles.paymentValue}>{formatPrice(shippingFee)}</div>
        </div>

        {/* Row 3: Giảm giá món ăn */}
        {foodDiscount > 0 && (
          <div style={paymentStyles.paymentRow}>
            <div style={paymentStyles.paymentLabel}>Giảm giá món ăn</div>
            <div style={{ ...paymentStyles.paymentValue, color: "#16A34A" }}>
              -{formatPrice(foodDiscount)}
            </div>
          </div>
        )}

        {/* Row 4: Giảm giá vận chuyển */}
        {shippingDiscount > 0 && (
          <div style={paymentStyles.paymentRow}>
            <div style={paymentStyles.paymentLabel}>Giảm giá vận chuyển</div>
            <div style={{ ...paymentStyles.paymentValue, color: "#16A34A" }}>
              -{formatPrice(shippingDiscount)}
            </div>
          </div>
        )}

        {/* Row 5: Tổng thanh toán */}
        <div style={{ ...paymentStyles.paymentRow, marginTop: "0.5rem", paddingTop: "1rem", borderTop: "2px dashed #F0F0F0" }}>
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
          background: "white",
          boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.1)",
          borderTopLeftRadius: "2rem",
          borderTopRightRadius: "2rem",
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          padding: "1.5rem 0",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            padding: "0 4.17vw",
            marginBottom: "1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.8rem",
              cursor: "pointer",
              padding: "0.8rem 1.2rem",
              borderRadius: "10px",
              transition: "background-color 0.2s ease",
            }}
            onClick={() => navigate("/customer/payment-method")}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#F5F5F5"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            {paymentMethodName === "Tiền mặt" ? (
              <PaymentIcon height="1.4rem" width="1.4rem" />
            ) : (
              <CardIcon height="1.4rem" width="1.4rem" />
            )}
            <div
              style={{
                color: "#1A1A1A",
                fontSize: "1.3rem",
                fontWeight: "600",
              }}
            >
              {paymentMethodName}
            </div>
          </div>

          <div
            style={{
              width: "2px",
              height: "2.5rem",
              background: "#E0E0E0",
            }}
          />
          
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.8rem",
              cursor: "pointer",
              padding: "0.8rem 1.2rem",
              borderRadius: "10px",
              transition: "background-color 0.2s ease",
            }}
            onClick={() => navigate("/customer/add-coupon")}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#F5F5F5"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <TagIcon height="1.4rem" width="1.4rem" />
            <div
              style={{
                color: "#1A1A1A",
                fontSize: "1.3rem",
                fontWeight: "600",
              }}
            >
              {couponCount > 0 ? `${couponCount} mã` : "Ưu đãi"}
            </div>
          </div>
        </div>

        {/* Nút đặt đơn */}
        <div
          style={{
            width: "87.78vw",
            margin: "0 auto",
            padding: "1.4rem",
            background: canDeliver 
              ? "linear-gradient(90deg, #FE5621 0%, #EE4D2D 100%)"
              : "#CCCCCC",
            borderRadius: "12px",
            cursor: canDeliver ? "pointer" : "not-allowed",
            boxShadow: canDeliver 
              ? "0 4px 16px rgba(254, 86, 33, 0.35)"
              : "0 2px 8px rgba(0, 0, 0, 0.1)",
            transition: "all 0.3s ease",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            opacity: canDeliver ? 1 : 0.6,
          }}
          onClick={canDeliver ? handleConfirmOrder : undefined}
          onMouseEnter={(e) => {
            if (canDeliver) {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(254, 86, 33, 0.45)";
            }
          }}
          onMouseLeave={(e) => {
            if (canDeliver) {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(254, 86, 33, 0.35)";
            }
          }}
        >
          <div
            style={{
              color: "white",
              fontSize: "1.6rem",
              fontWeight: "700",
            }}
          >
            {canDeliver ? "Đặt đơn" : "Không thể giao hàng"}
          </div>
          <div
            style={{
              color: "white",
              fontSize: "1.6rem",
              fontWeight: "700",
            }}
          >
            {canDeliver && formatPrice(totalPrice)}
          </div>
        </div>
      </div>
    </div>
  );
}