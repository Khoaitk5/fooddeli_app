import React from "react";
import { MapPin, Clock, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OngoingOrderCard = ({ order, cardMargin }) => {
  const navigate = useNavigate();

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "1.25rem",
        overflow: "hidden",
        marginBottom: cardMargin,
        boxShadow: "0 0.125rem 1rem rgba(0, 0, 0, 0.06)",
      }}
    >
      {/* Header */}
      <div style={{ padding: "1.25rem", borderBottom: "0.0625rem solid #f5f5f5" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "0.5rem",
          }}
        >
          <div style={{ flex: 1 }}>
            <h3
              style={{
                margin: 0,
                fontSize: "1.5rem",
                fontWeight: "700",
                color: "#333",
                marginBottom: "0.25rem",
              }}
            >
              {order.restaurant}
            </h3>
            <div
              style={{
                fontSize: "1.125rem",
                color: "#999",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              <MapPin size={14} strokeWidth={2} />
              {order.restaurantAddress}
            </div>
          </div>
          <div
            style={{
              background: order.status === "Đang giao hàng" ? "#fff7ed" : "#f0fdf4",
              color: order.status === "Đang giao hàng" ? "#ea580c" : "#FE5621",
              padding: "0.375rem 0.75rem",
              borderRadius: "0.5rem",
              fontSize: "1.375rem",
              fontWeight: "500",
              whiteSpace: "nowrap",
              marginLeft: "0.75rem",
            }}
          >
            {order.status}
          </div>
        </div>
        <div
          style={{
            fontSize: "1.125rem",
            color: "#666",
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
          }}
        >
          <Clock size={14} strokeWidth={2} />
          Dự kiến {order.estimatedTime}
        </div>
      </div>

      {/* Nội dung đơn hàng */}
      <div style={{ padding: "1.25rem", borderBottom: "0.0625rem solid #f5f5f5" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
          {/* Ảnh quán to bên trái */}
          <div
            style={{
              width: "7rem",
              height: "7rem",
              borderRadius: "1rem",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <img
              src={
                order.shop_image ||
                "https://cdn-icons-png.flaticon.com/512/1046/1046784.png"
              }
              alt={order.restaurant}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>

          {/* Danh sách món */}
          <div style={{ flex: 1 }}>
            {order.items?.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.5rem",
                }}
              >
                <img
                  src={
                    item.image ||
                    item.product_image ||
                    "https://cdn-icons-png.flaticon.com/512/857/857681.png"
                  }
                  alt={item.name}
                  style={{
                    width: "2.75rem",
                    height: "2.75rem",
                    borderRadius: "0.5rem",
                    objectFit: "cover",
                  }}
                />
                <span
                  style={{
                    fontSize: "1.375rem",
                    color: "#444",
                  }}
                >
                  {item.quantity}x {item.name}
                </span>
              </div>
            ))}
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                color: "#FE5621",
                marginTop: "0.5rem",
              }}
            >
              {formatPrice(order.total)}
            </div>
          </div>
        </div>
      </div>

      {/* Nút theo dõi */}
      <div style={{ padding: "1.25rem" }}>
        <button
          onClick={() => navigate(`/customer/order-tracking/${order.id}`)}
          style={{
            width: "100%",
            padding: "1.125rem",
            background: "linear-gradient(90deg, #FE5621 0%, #EE4D2D 100%)",
            border: "none",
            borderRadius: "0.75rem",
            color: "#fff",
            fontSize: "1.375rem",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            boxShadow: "0 0.25rem 0.75rem rgba(254, 86, 33, 0.3)",
            transition: "all 0.2s",
          }}
        >
          Theo dõi đơn hàng
          <ChevronRight size={20} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};

export default OngoingOrderCard;
