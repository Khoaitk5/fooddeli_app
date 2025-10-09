import React, { useState, useEffect } from "react";
import Navbar from "../../components/shared/Navbar";
import CustomerNotificationIcon from "../../components/role-specific/Customer/CustomerNotificationIcon";
import { pxW, pxH } from "../../utils/scale.js";

const styles = {
  absoluteCenter: {
    position: "absolute",
    justifyContent: "center",
    display: "flex",
    flexDirection: "column",
    wordWrap: "break-word",
  },
  tikTokFont: {
    fontFamily: "TikTok Sans",
  },
  notificationCard: {
    background: "white",
    borderRadius: 12,
    marginBottom: pxH(12),
    cursor: "pointer",
    width: "89.33vw",
    height: "11.08vh",
    position: "absolute",
    top: "13.36vh",
    left: "50%",
    transform: "translateX(-50%)",
  },
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const mockNotifications = [
      {
        id: 1,
        title: "Order Out for Delivery!",
        body: "Your food is on the move! Track your order for real-time updates.",
        is_read: false,
        created_at: "5 mins ago",
      },
    ];
    setNotifications(mockNotifications);
  }, []);

  const formatTime = (dateString) => {
    if (typeof dateString === 'string' && (dateString.includes('ago') || dateString.includes('trước'))) {
      return dateString;
    }

    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Vừa xong";
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} ngày trước`;
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, is_read: true } : notif
      )
    );
  };

  return (
    <div className="bg-white pb-20">
      <Navbar />
      <div className="mx-auto max-w-[360px] px-5 pb-24 pt-5">
        {/* Header */}
        <div
          style={{
            position: "absolute",
            top: "6.625vh",
            left: "50%",
            transform: "translateX(-50%)",
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
            color: "var(--Colors-Typography-500, #363A33)",
            fontSize: "1.7rem",
            fontFamily: "TikTok Sans",
            fontWeight: "700",
            wordWrap: "break-word",
          }}
        >
          Thông báo
        </div>

        {/* Notifications List */}
        <div>
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500" style={styles.tikTokFont}>
                Chưa có thông báo nào
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                style={styles.notificationCard}
                onClick={() => markAsRead(notification.id)}
              >
                <div style={{display: 'flex', alignItems: 'flex-start', gap: '4.27vw'}}>
                  <div style={{
                    width: '12.8vw',
                    height: '5.76vh',
                    backgroundColor: '#F4F7F2',
                    borderRadius: '50%',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <CustomerNotificationIcon />
                  </div>

                  <div style={{flex: 1}}>
                    <div className="mb-2">
                      <div style={{color: '#363A33', fontSize: '1.5rem', fontFamily: 'TikTok Sans', fontWeight: '600', wordWrap: 'break-word'}}>
                        {notification.title}
                      </div>
                    </div>

                    <div style={{color: '#60655C', fontSize: '1.2rem', fontFamily: 'TikTok Sans', fontWeight: '400', wordWrap: 'break-word', marginBottom: '0.5vh'}}>
                      {notification.body}
                    </div>

                    <div style={{color: '#60655C', fontSize: '1.2rem', fontFamily: 'TikTok Sans', fontWeight: '600', wordWrap: 'break-word'}}>
                      {formatTime(notification.created_at)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;