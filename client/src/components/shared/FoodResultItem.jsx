import React from "react";
import BadgeIcon from "./BadgeIcon";
import StarIcon from "./StarIcon";

const FoodResults = ({
  storeName,
  storeImage,
  rating,
  reviewCount,
  dishCategory,
  deliveryTime,
  promotions = [],
  dishes = [],
}) => {
  const dish = dishes[0];
  return (
    <div style={{ position: "relative", paddingBottom: "34vh" }}>
      {/* Ảnh cửa hàng */}
      <img
        src={dish?.image || storeImage || "https://placehold.co/101x101"}
        alt={dish?.name}
        style={{
          position: "absolute",
          left: "4.17vw",
          top: "0",
          width: "28.06vw",
          height: "28.06vw",
          borderRadius: 14,
          objectFit: "cover",
        }}
      />

      {/* Biểu tượng shop */}
      <div style={{ position: "absolute", top: "0.26vh", left: "36.4vw" }}>
        <BadgeIcon />
      </div>

      {/* Tên cửa hàng */}
      <div
        style={{
          position: "absolute",
          left: "40.84vw",
          top: "0",
          fontSize: "1.4rem",
          fontWeight: "600",
        }}
      >
        {storeName}
      </div>

      {/* Đánh giá */}
      <div style={{ position: "absolute", top: "3.875vh", left: "36.39vw" }}>
        <StarIcon />
      </div>
      <div
        style={{
          position: "absolute",
          top: "3.75vh",
          left: "41.39vw",
          fontSize: "1.2rem",
          color: "#444",
        }}
      >
        {rating} ({reviewCount}) • {dishCategory}
      </div>

      {/* Thời gian giao */}
      <div
        style={{
          position: "absolute",
          top: "7.125vh",
          left: "36.39vw",
          color: "#999",
          fontSize: "1.1rem",
        }}
      >
        {deliveryTime}
      </div>

      {/* Giá và món */}
      <div
        style={{
          position: "absolute",
          top: "14.5vh",
          left: "4.17vw",
          width: "91.67vw",
          display: "flex",
          gap: "3vw",
          overflowX: "auto",
        }}
      >
        {dishes.map((d, i) => (
          <div key={i} style={{ width: "25vw", flexShrink: 0 }}>
            <img
              src={d.image}
              alt={d.name}
              style={{
                width: "25.83vw",
                height: "25.83vw",
                borderRadius: 14,
                objectFit: "cover",
              }}
            />
            <div
              style={{
                fontSize: "1.4rem",
                fontWeight: "500",
                textAlign: "center",
                marginTop: "1vh",
              }}
            >
              {d.price}
            </div>
            <div
              style={{
                fontSize: "1.3rem",
                color: "#333",
                textAlign: "center",
              }}
            >
              {d.name}
            </div>
          </div>
        ))}
      </div>

      {/* Gạch ngăn */}
      <div
        style={{
          position: "absolute",
          top: "36.75vh",
          left: "4.17vw",
          width: "91.67vw",
          height: "1px",
          background: "#E7E7E7",
        }}
      />
    </div>
  );
};

export default FoodResults;
