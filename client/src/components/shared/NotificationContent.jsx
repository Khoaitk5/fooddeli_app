import React from "react";

const NotificationContent = ({ isNotificationActive, notifications = [], chats = [] }) => {
  if (isNotificationActive) {
    return (
      <div style={{ padding: "-1vh 6.11vw 2vh" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2vh" }}>
          {notifications.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4vh", color: "#999" }}>
              Chưa có thông báo nào
            </div>
          ) : (
            notifications.map((notification, index) => (
              <div
                key={notification.id || index}
                style={{
                  background: "white",
                  borderRadius: "12px",
                  padding: "3vw",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <div style={{ fontSize: "1.4rem", fontWeight: "600", marginBottom: "1vh" }}>
                  {notification.title}
                </div>
                <div style={{ fontSize: "1.2rem", color: "#666", marginBottom: "1vh" }}>
                  {notification.body}
                </div>
                <div style={{ fontSize: "1rem", color: "#999" }}>
                  {notification.time}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  } else {
    return (
      <div style={{ padding: "-1vh 6.11vw 2vh" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2vh" }}>
          {chats.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4vh", color: "#999" }}>
              Chưa có cuộc trò chuyện nào
            </div>
          ) : (
            chats.map((chat, index) => (
              <div
                key={chat.id || index}
                style={{
                  background: "white",
                  borderRadius: "12px",
                  padding: "3vw",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <div style={{ fontSize: "1.4rem", fontWeight: "600", marginBottom: "1vh" }}>
                  {chat.sender}
                </div>
                <div style={{ fontSize: "1.2rem", color: "#666", marginBottom: "1vh" }}>
                  {chat.message}
                </div>
                <div style={{ fontSize: "1rem", color: "#999" }}>
                  {chat.time}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }
};

export default NotificationContent;