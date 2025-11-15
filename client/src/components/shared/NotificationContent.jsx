import React from "react";
import { Bell, Clock } from "lucide-react";

const ACCENT = "#FE5621";

const formatNotificationTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const NotificationContent = ({ notifications = [] }) => {
  const hasNotifications = Array.isArray(notifications) && notifications.length > 0;

  return (
    <div style={{ padding: "0 1.3rem 2.5rem", width: "100%" }}>
      {!hasNotifications ? (
        <div
          style={{
            padding: "2.5rem 0 4rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
            color: "#94A3B8",
          }}
        >
          <div
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "20px",
              background: "rgba(254, 86, 33, 0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Bell size={28} color={ACCENT} strokeWidth={2.4} />
          </div>
          <div style={{ fontSize: "1.5rem", fontWeight: 600 }}>Chưa có thông báo</div>
          <div style={{ fontSize: "1.2rem", textAlign: "center", maxWidth: "260px" }}>
            Bạn sẽ thấy thông báo về đơn hàng và ưu đãi của FoodDeli tại đây.
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.3rem" }}>
          {notifications.map((notification, index) => {
            const key = notification.id || `${notification.created_at}-${index}`;
            const timeText =
              notification.time || formatNotificationTime(notification.created_at);
            const isUnread = notification.is_read === false;

            return (
              <article
                key={key}
                style={{
                  background: "white",
                  borderRadius: "20px",
                  padding: "1.4rem 1.5rem 1.2rem",
                  boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)",
                  border: "1px solid rgba(148, 163, 184, 0.15)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.9rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "1rem",
                    alignItems: "flex-start",
                  }}
                >
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "14px",
                        background: isUnread
                          ? "linear-gradient(135deg, #FF8A50 0%, #FE5621 100%)"
                          : "rgba(254, 86, 33, 0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Bell size={18} color={isUnread ? "white" : ACCENT} strokeWidth={2.4} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                      <div
                        style={{
                          fontSize: "1.45rem",
                          fontWeight: isUnread ? 700 : 600,
                          color: "#0F172A",
                        }}
                      >
                        {notification.title || "Thông báo"}
                      </div>
                      <div style={{ fontSize: "1.25rem", color: "#475569", lineHeight: 1.4 }}>
                        {notification.body}
                      </div>
                    </div>
                  </div>
                  {isUnread && (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "999px",
                        padding: "0.2rem 0.75rem",
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        color: ACCENT,
                        background: "rgba(254, 86, 33, 0.12)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Mới
                    </span>
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "1.1rem",
                    color: "#94A3B8",
                  }}
                >
                  <Clock size={15} color="#94A3B8" strokeWidth={2.2} />
                  <span>{timeText}</span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotificationContent;