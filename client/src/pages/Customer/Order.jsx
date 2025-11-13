import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/shared/Navbar";
import OrderHeader from "../../components/shared/OrderHeader";
import OngoingOrderCard from "../../components/shared/OngoingOrderCard";
import CompletedOrderCard from "../../components/shared/CompletedOrderCard";
import EmptyState from "../../components/shared/EmptyState";

function OrdersPage({
  isMobile = false,
  isTablet = false,
  onTrackOrder = () => {},
}) {
  const [activeTab, setActiveTab] = useState("ongoing");
  const [ongoingOrders, setOngoingOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const intervalRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = currentUser?.id;

  // 🧠 Helper format địa chỉ JSON -> Chuỗi dễ đọc
  const formatAddress = (address) => {
    if (!address) return "Chưa có địa chỉ";
    try {
      const obj = typeof address === "string" ? JSON.parse(address) : address;
      const parts = [obj.detail, obj.ward, obj.district, obj.city].filter(
        Boolean
      );
      return parts.join(", ");
    } catch {
      return String(address);
    }
  };

  // 🧠 Helper chọn ảnh đại diện đơn hàng
  const getOrderImage = (order) => {
    const productWithImage = order.details?.find((d) => d.product_image);
    return (
      productWithImage?.product_image ||
      "https://cdn-icons-png.flaticon.com/512/3075/3075977.png"
    );
  };

  // ✅ Gọi API lấy danh sách đơn hàng từ DB
  const fetchOrders = async (signal) => {
    if (!userId) return;
    try {
      const res = await fetch("http://localhost:5000/api/orders/list-mine", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
        signal,
      });

      const data = await res.json();
      console.log("📦 API /list-mine trả về:", data);

      if (data.message === "Unsupported role or missing identifiers") {
        console.warn("⚠️ Backend không nhận ra user_id.");
        setOngoingOrders([]);
        setCompletedOrders([]);
        setLoading(false);
        return;
      }

      const orders = data.items || data.data?.orders || [];

      // 🔸 Đơn đang xử lý
      const ongoing = orders
        .filter((o) => ["pending", "cooking", "shipping"].includes(o.status))
        .map((order) => ({
          id: order.order_id,
          restaurant: order.shop_name || "Quán chưa rõ",
          restaurantAddress:
            formatAddress(order.shop_address) || "Địa chỉ quán chưa có",
          status:
            order.status === "pending"
              ? "Đang chờ xác nhận"
              : order.status === "cooking"
              ? "Đang chuẩn bị"
              : order.status === "shipping"
              ? "Đang giao hàng"
              : "Không xác định",
          estimatedTime: order.estimated_time || "Đang cập nhật",
          total: Number(order.total_price || 0),
          items:
            order.details?.map((d) => ({
              name: d.product_name,
              quantity: d.quantity,
              price: d.unit_price,
              image: d.product_image, // ✅ Ảnh món thật
            })) || [],
          shop_image: order.shop_image || null, // ✅ thêm dòng này
          image: order.shop_image || getOrderImage(order), // ✅ ưu tiên ảnh quán // ✅ Ảnh đại diện đơn hàng
        }));

      // 🔹 Đơn đã hoàn tất
      const completed = orders
        .filter((o) => ["completed", "cancelled"].includes(o.status))
        .map((order) => ({
          id: order.order_id,
          restaurant: order.shop_name || "Quán chưa rõ",
          restaurantAddress:
            formatAddress(order.shop_address) || "Địa chỉ quán chưa có",
          deliveredAt: order.updated_at || "Vừa xong",
          total: Number(order.total_price || 0),
          items:
            order.details?.map((d) => ({
              name: d.product_name,
              quantity: d.quantity,
              price: d.unit_price,
              image: d.product_image,
            })) || [],
          shop_image: order.shop_image || null,
          image: order.shop_image || getOrderImage(order),
          // Thêm thông tin cho đánh giá
          shipperId: order.shipper_id,
          shopId: order.shop_id,
          userId: order.user_id,
          shipperName: order.shipper_name,
          shipperAvatar: order.shipper_avatar,
          rated: false, // sẽ được cập nhật trong CompletedOrderCard
        }));

      setOngoingOrders(ongoing);
      setCompletedOrders(completed);
    } catch (err) {
      if (err.name !== "AbortError")
        console.error("❌ Lỗi khi fetch đơn hàng:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🧠 Gọi khi load trang
  useEffect(() => {
    const controller = new AbortController();
    fetchOrders(controller.signal);
    return () => controller.abort();
  }, [userId]);

  // 🔄 Polling 5s
  useEffect(() => {
    if (!userId) return;
    intervalRef.current = setInterval(() => {
      const controller = new AbortController();
      fetchOrders(controller.signal);
      setTimeout(() => controller.abort(), 4500);
    }, 5000);

    return () => clearInterval(intervalRef.current);
  }, [userId]);

  const padding = "2rem";
  const cardMargin = "1.25rem";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <OrderHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        ongoingOrders={ongoingOrders}
        completedOrders={completedOrders}
        padding={padding}
      />

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          padding: padding,
          paddingBottom: "9rem",
          background: "#f5f5f5",
        }}
      >
        {loading ? (
          <EmptyState message="Đang tải đơn hàng từ máy chủ..." />
        ) : activeTab === "ongoing" ? (
          ongoingOrders.length > 0 ? (
            ongoingOrders.map((order) => (
              <OngoingOrderCard
                key={order.id}
                order={order}
                cardMargin={cardMargin}
              />
            ))
          ) : (
            <EmptyState message="Chưa có đơn hàng nào đang giao" />
          )
        ) : completedOrders.length > 0 ? (
          completedOrders.map((order) => (
            <CompletedOrderCard
              key={order.id}
              order={order}
              cardMargin={cardMargin}
            />
          ))
        ) : (
          <EmptyState message="Chưa có đơn hàng nào đã giao" />
        )}
      </div>

      <Navbar isProfilePage={false} />
    </div>
  );
}

export default OrdersPage;
