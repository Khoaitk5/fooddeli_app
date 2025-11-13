import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin } from "lucide-react";
import { OrderStatusTimeline } from "@/components/role-specific/Customer/OrderStatusTimeline";
import { DeliveryPersonCard } from "@/components/role-specific/Customer/DeliveryPersonCard";
import { OrderDetailsCard } from "@/components/role-specific/Customer/OrderDetailsCard";
import { DeliveryAddressCard } from "@/components/role-specific/Customer/DeliveryAddressCard";
import "../../styles/OrderTrackingResponsive.css";

export default function OrderTracking() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🧠 Fetch order từ DB
  const fetchOrder = async (signal) => {
  try {
    const res = await fetch("http://localhost:5000/api/orders/get", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_id: Number(orderId) }),
      signal,
    });

    const data = await res.json();
    console.log("📦 API trả về:", data);

    if (data.order) {
      // ✅ Gộp dữ liệu order + details
      setOrder({
        ...data.order,
        details: data.details || [], // đảm bảo luôn có mảng
      });
      console.log("✅ Đơn hàng đã load:", data.order.order_id);
    } else {
      console.warn("⚠️ Không tìm thấy đơn hàng:", data);
    }
  } catch (err) {
    if (err.name === "AbortError") return; // tránh log khi bị hủy request
    console.error("❌ Lỗi khi fetch đơn hàng:", err);
  } finally {
    setLoading(false);
  }
};


  // 🧠 Gọi lần đầu
  useEffect(() => {
    if (!orderId) return;
    const controller = new AbortController();
    fetchOrder(controller.signal);
    return () => controller.abort();
  }, [orderId]);

  // 🔁 Polling mỗi 5s
  useEffect(() => {
    if (!orderId) return;
    const interval = setInterval(() => {
      const controller = new AbortController();
      fetchOrder(controller.signal);
      setTimeout(() => controller.abort(), 4500); // cleanup nhẹ
    }, 5000);
    return () => clearInterval(interval);
  }, [orderId]);

  // 🆕 Khi đơn hàng completed, chuyển đến đánh giá shipper
  // useEffect(() => {
  //   if (order && order.status === 'completed') {
  //     // Kiểm tra xem đã đánh giá shipper chưa
  //     const checkShipperReview = async () => {
  //       try {
  //         const API_BASE_URL = import.meta.env?.VITE_API_URL || "http://localhost:5000/api";
  //         const response = await fetch(`${API_BASE_URL}/reviews/shipper/${order.shipper_id}/stats`, {
  //           credentials: 'include'
  //         });
  //         const result = await response.json();
          
  //         // Nếu chưa có review nào từ user này cho shipper này
  //         const userReviews = result.data?.reviews?.filter(r => r.reviewer_id === order.user_id) || [];
          
  //         if (userReviews.length === 0) {
  //           // Chuyển đến đánh giá shipper
  //           navigate('/customer/shipper-review', {
  //             state: {
  //               orderId: order.order_id,
  //               shipperName: order.shipper_name,
  //               shipperAvatar: order.shipper_avatar,
  //               shopName: order.shop_name,
  //               shopAvatar: order.shop_image,
  //               userId: order.user_id,
  //             }
  //           });
  //         }
  //       } catch (error) {
  //         console.error('Error checking shipper review:', error);
  //       }
  //     };
      
  //     checkShipperReview();
  //   }
  // }, [order, navigate]);

  if (loading) return <div style={{ padding: "2rem" }}>⏳ Đang tải đơn hàng...</div>;
  if (!order) return <div style={{ padding: "2rem" }}>❌ Không tìm thấy đơn hàng!</div>;

  // Đảm bảo order.details là array
  if (!order.details) {
    order.details = [];
  }

  // map dữ liệu cho các component con (an toàn)
// --- Shipper info ---
const driverData = {
  name: order.shipper_name || "Chưa có shipper",
  rating: order.shipper_rating || 4.9,
  vehicle: order.shipper_vehicle || "Xe máy",
  avatar: order.shipper_avatar || "https://cdn-icons-png.flaticon.com/512/1995/1995574.png",
  phone: order.shipper_phone || "Chưa cập nhật",
};
// --- helper ---
const formatAddress = (addr) => {
  if (!addr) return "Không có địa chỉ";
  try {
    const parsed =
      typeof addr === "string" ? JSON.parse(addr) : addr;
    return [
      parsed.detail,
      parsed.ward,
      parsed.district,
      parsed.city,
    ]
      .filter(Boolean)
      .join(", ");
  } catch (e) {
    return addr; // fallback nếu không parse được
  }
};

// --- Order info ---
const orderData = {
  orderId: order.order_id,
  restaurant: order.shop_name || "Quán chưa xác định",
  items: Array.isArray(order.details)
    ? order.details.map((item) => ({
        name: item.product_name,
        quantity: item.quantity,
        price: item.unit_price,
        image: item.product_image,
      }))
    : [],
  total: Number(order.total_price || 0),
  status: order.status,
  paymentMethod: order.payment_method,
  createdAt: new Date(order.created_at).toLocaleString("vi-VN"),
};

  const statusMap = {
    pending: "waiting",
    cooking: "preparing",
    shipping: "delivering",
    completed: "delivered",
  };

  const currentStatus = statusMap[order.status] || "waiting";

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#f5f5f5",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        maxWidth: "500px",
        margin: "0 auto",
        boxShadow: "0 0 2rem rgba(0,0,0,0.1)",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(90deg, #5EAD1D 0%, #54A312 100%)",
          padding: "2rem 1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "1.5rem",
          boxShadow: "0 0.125rem 0.5rem rgba(238, 77, 45, 0.3)",
        }}
      >
        <button
          style={{
            width: "4rem",
            height: "4rem",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.2)",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            backdropFilter: "blur(10px)",
          }}
          onClick={() => navigate("/customer/orders")}
        >
          <ArrowLeft size={32} color="#fff" strokeWidth={2.5} />
        </button>
        <div>
          <h1
            style={{
              margin: 0,
              color: "#fff",
              fontSize: "1.75rem",
              fontWeight: "700",
            }}
          >
            {order.status === "completed" ? "Đơn hàng đã giao" : "Đơn hàng đang giao"}
          </h1>
          <div
            style={{
              fontSize: "1.125rem",
              color: "rgba(255, 255, 255, 0.9)",
              marginTop: "0.375rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <MapPin size={20} />
            <span>{order.distance_km ? `Cách bạn ${order.distance_km} km` : "Đang xử lý..."}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
        <div style={{ background: "#fff", marginBottom: "1rem" }}>
          <OrderStatusTimeline currentStatus={currentStatus} />
        </div>

        <DeliveryPersonCard driver={driverData} />

        <DeliveryAddressCard
  pickup={formatAddress(order.shop_address)}
  delivery={formatAddress(order.delivery_address) || "Địa chỉ của bạn"}
  estimatedTime={order.estimated_time || "Đang cập nhật"}
/>

        <OrderDetailsCard order={orderData} />
      </div>
    </div>
  );
}
