import React, { useState, useEffect, useMemo, useCallback } from "react";
import Navbar from "../../components/shared/Navbar";
import NotificationContent from "../../components/shared/NotificationContent";
import { Bell } from "lucide-react";
import {
  getMyNotifications,
  markAllNotificationsAsRead,
} from "../../api/notificationApi";

const hideScrollbarStyles = `
  .hide-scrollbar {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  
  .tab-button {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .tab-button:active {
    transform: scale(0.97);
  }
`;

const FILTERS = [
  { key: "all", label: "Tất cả" },
  { key: "unread", label: "Chưa đọc" },
];

const ORDER_STATUS_SEQUENCE = ["pending", "cooking", "shipping", "completed", "cancelled"];

const STATUS_META = {
  pending: {
    label: "Chờ xác nhận",
    color: "#d97706",
    pillBg: "rgba(248, 180, 0, 0.14)",
    title: (orderLabel) => `${orderLabel} đang chờ xác nhận`,
    description: (orderLabel) => `${orderLabel} đã được ghi nhận và chờ cửa hàng phê duyệt.`,
  },
  cooking: {
    label: "Đang chế biến",
    color: "#0ea5e9",
    pillBg: "rgba(14,165,233,0.14)",
    title: (orderLabel) => `${orderLabel} đang được chế biến`,
    description: () => "Đội ngũ bếp đang chuẩn bị món ăn cho bạn.",
  },
  shipping: {
    label: "Đang giao hàng",
    color: "#2563eb",
    pillBg: "rgba(37,99,235,0.14)",
    title: (orderLabel) => `${orderLabel} đang được giao`,
    description: () => "Shipper đang trên đường tới địa chỉ của bạn.",
  },
  completed: {
    label: "Hoàn tất",
    color: "#16a34a",
    pillBg: "rgba(22,163,74,0.14)",
    title: (orderLabel) => `${orderLabel} đã giao thành công`,
    description: () => "Chúc bạn ngon miệng! Đừng quên đánh giá trải nghiệm nhé.",
  },
  cancelled: {
    label: "Đã huỷ",
    color: "#dc2626",
    pillBg: "rgba(220,38,38,0.14)",
    title: (orderLabel) => `${orderLabel} đã bị huỷ`,
    description: () => "Đơn hàng đã bị huỷ. Vui lòng kiểm tra lại chi tiết hoặc đặt lại đơn khác.",
  },
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [markingAll, setMarkingAll] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const normalizeNotifications = useCallback((items = []) => {
    return items.map((item) => {
      const rawStatus =
        item?.status ||
        item?.order_status ||
        item?.orderStatus ||
        item?.meta?.status ||
        item?.metadata?.status ||
        item?.payload?.status;

      const orderId =
        item?.order_id ||
        item?.orderId ||
        item?.order_code ||
        item?.orderCode ||
        item?.meta?.order_id ||
        item?.metadata?.order_id;

      const orderLabel = orderId ? `Đơn #${orderId}` : "Đơn hàng";

      if (rawStatus && STATUS_META[rawStatus]) {
        const meta = STATUS_META[rawStatus];
        return {
          ...item,
          status_key: rawStatus,
          title: meta.title(orderLabel),
          body: meta.description(orderLabel),
          status_meta: meta,
          order_label: orderLabel,
        };
      }

      return {
        ...item,
        status_key: rawStatus,
        order_label: orderLabel,
      };
    });
  }, []);

  const dispatchNavbarRefresh = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("notifications-refresh"));
    }
  };

  const handleMarkAllAsRead = async () => {
    if (markingAll || notifications.length === 0) return;
    setMarkingAll(true);
    setActionMessage("");
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((item) => ({ ...item, is_read: true })));
      setActionMessage("Đã đánh dấu tất cả thông báo.");
      dispatchNavbarRefresh();
    } catch (err) {
      console.error("❌ Lỗi markAllNotificationsAsRead:", err);
      setActionMessage(
        err?.response?.data?.message || "Không thể cập nhật trạng thái."
      );
    } finally {
      setMarkingAll(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchNotifications = async () => {
      try {
        const res = await getMyNotifications();
        const items = res?.data || [];
        if (!Array.isArray(items)) {
          throw new Error("Dữ liệu thông báo không hợp lệ.");
        }
        if (isMounted) {
          setNotifications(normalizeNotifications(items));
        }
      } catch (err) {
        console.error("❌ Lỗi khi lấy thông báo:", err);
        if (isMounted) {
          setError(
            err?.response?.data?.message ||
              "Không thể tải danh sách thông báo."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchNotifications();

    return () => {
      isMounted = false;
    };
  }, [normalizeNotifications]);

  const filteredNotifications = useMemo(() => {
    let list = notifications;
    if (activeFilter === "unread") {
      list = list.filter((item) => item?.is_read === false);
    }
    return list;
  }, [notifications, activeFilter]);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#FAFAFA" }}>
      <style>{hideScrollbarStyles}</style>
      
      {/* Fixed Header */}
      <div style={{ flexShrink: 0, backgroundColor: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
        <div
          style={{
            position: "relative",
            height: "15vh",
            background: "linear-gradient(135deg, #FE5621 0%, #FF7A50 100%)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "2.2vh",
              left: "6.11vw",
              right: "6.11vw",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div
                style={{
                  width: "2.8rem",
                  height: "2.8rem",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Bell size={18} color="white" strokeWidth={2.5} />
              </div>
              <div
                style={{
                  color: "white",
                  fontSize: "2.2rem",
                  fontWeight: "600",
                  letterSpacing: "-0.5px",
                  textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                Thông báo
              </div>
            </div>

            <button
              onClick={handleMarkAllAsRead}
              disabled={markingAll || notifications.length === 0}
              style={{
                padding: "0.55rem 1rem",
                borderRadius: "999px",
                border: "none",
                background:
                  markingAll || notifications.length === 0
                    ? "rgba(255,255,255,0.55)"
                    : "rgba(255,255,255,0.9)",
                color: "#FE5621",
                fontSize: "0.95rem",
                fontWeight: 600,
                letterSpacing: "-0.1px",
                boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
                cursor:
                  markingAll || notifications.length === 0 ? "not-allowed" : "pointer",
                transition: "transform 0.2s ease, opacity 0.2s ease",
                opacity: markingAll ? 0.7 : 1,
              }}
            >
              {markingAll ? "Đang xử lý..." : "Đánh dấu đã đọc"}
            </button>
          </div>

          {/* Filter Tabs */}
          <div
            style={{
              position: "absolute",
              top: "8.2vh",
              left: "6.11vw",
              right: "6.11vw",
              display: "flex",
              padding: "0.35rem",
              backgroundColor: "rgba(255,255,255,0.18)",
              borderRadius: "1.1rem",
              backdropFilter: "blur(10px)",
              gap: "0.4rem",
            }}
          >
            {FILTERS.map((filter) => {
              const isActive = activeFilter === filter.key;
              return (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className="tab-button"
                  style={{
                    flex: 1,
                    height: "4.3vh",
                    borderRadius: "0.85rem",
                    border: "none",
                    background: isActive ? "white" : "transparent",
                    color: isActive ? "#FE5621" : "rgba(255,255,255,0.9)",
                    fontSize: "1.23rem",
                    fontWeight: 600,
                    letterSpacing: "-0.2px",
                    boxShadow: isActive ? "0 4px 12px rgba(0,0,0,0.15)" : "none",
                    cursor: isActive ? "default" : "pointer",
                  }}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {actionMessage && (
        <div
          style={{
            textAlign: "center",
            fontSize: "0.95rem",
            fontWeight: 500,
            color: actionMessage.includes("không") ? "#f97316" : "#16a34a",
            marginTop: "0.4rem",
          }}
        >
          {actionMessage}
        </div>
      )}

      {/* Scrollable Content */}
      <div 
        className="hide-scrollbar" 
        style={{ 
          flex: 1, 
          overflowY: "auto", 
          paddingBottom: "80px",
          paddingTop: "1rem",
        }}
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: "4vh", color: "#999" }}>
            Đang tải thông báo...
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "4vh", color: "#f04438" }}>
            {error}
          </div>
        ) : (
          <NotificationContent notifications={filteredNotifications} />
        )}
      </div>

      <Navbar />
    </div>
  );
};

export default Notifications;
