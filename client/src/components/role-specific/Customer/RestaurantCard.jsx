import VerifyIcon from "./VerifyIcon";
import StarIcon from "@/components/shared/StarIcon";
import FoodIcon from "../../shared/FoodIcon";
import DeliveryTimeIcon from "../../shared/DeliveryTimeIcon";

const RestaurantCard = ({
  style,
  restaurant, // Thêm prop restaurant object
  name,
  avatar_url,
  rating = 5,
  reviewCount = 13,
  salesCount = "200+",
  distance = "10.1 km",
  orientation = "vertical", // Thêm prop mới
}) => {
  // Nếu có restaurant object, sử dụng data từ đó
  const displayName = restaurant?.name || name;
  const displayAvatarUrl = restaurant?.avatar_url || avatar_url;
  const displayRating = restaurant?.rating || rating;
  const displayReviewCount = restaurant?.reviewCount || reviewCount;
  const displaySalesCount = restaurant?.salesCount || salesCount;
  const displayDistance = restaurant?.distance || distance;
  const isHorizontal = orientation === "horizontal";

  // --- 1. Định nghĩa các style động ---

  // Style cho container chính
  const containerStyle = {
    display: "flex",
    // Nếu là horizontal thì xếp ngang, không thì xếp dọc
    flexDirection: isHorizontal ? "row" : "column",
    gap: isHorizontal ? "1rem" : "0",
    // Chiều ngang thì full width (để fill <div> bọc nó), chiều dọc thì width cố định
    width: isHorizontal ? "100%" : "13.7rem",
    ...style, // Áp dụng style bên ngoài truyền vào
  };

  // Style cho ảnh
  const imageStyle = {
    width: isHorizontal ? "130px" : "13.7rem",
    height: isHorizontal ? "130px" : "13.7rem",
    borderRadius: "1rem",
    objectFit: "cover",
    flexShrink: 0,
  };

  // Style cho phần "info" (chữ)
  const infoContainerStyle = {
    flex: 1, // Chiếm hết không gian còn lại khi horizontal
    display: "flex",
    flexDirection: "column",
    justifyContent: isHorizontal ? "space-between" : "flex-start",
    paddingTop: isHorizontal ? "0.3rem" : "0",
  };

  // --- 2. Render JSX ---
  return (
    <div style={containerStyle}>
      {/* PHẦN ẢNH */}
      <img
        src={
          displayAvatarUrl ||
          "https://upload.urbox.vn/strapi/phuc_long_5_c188a69da5.jpg"
        }
        style={imageStyle}
        alt={displayName}
      />

      {/* PHẦN THÔNG TIN */}
      <div style={infoContainerStyle}>
        {/* Tên & Verify Icon */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            marginTop: isHorizontal ? "0" : "1vh",
            gap: isHorizontal ? "0.5rem" : "0.83vw", // Sử dụng gap từ layout horizontal
          }}
        >
          <VerifyIcon
            width={isHorizontal ? "1.2rem" : undefined}
            height={isHorizontal ? "1.2rem" : undefined}
            style={{
              flexShrink: 0,
              marginTop: isHorizontal ? "0.2rem" : 0,
            }}
          />
          <div
            style={{
              // Bỏ width cố định khi horizontal
              width: isHorizontal ? "auto" : "13.7rem",
              color: "black",
              fontSize: isHorizontal ? "1.1rem" : "1.2rem",
              fontWeight: isHorizontal ? 600 : 500,
              wordWrap: "break-word",
              lineHeight: isHorizontal ? "1.3" : "normal",
              // Bỏ marginLeft khi horizontal vì đã dùng gap
              marginLeft: isHorizontal ? 0 : "0.83vw",
            }}
          >
            {displayName}
          </div>
        </div>

        {/* --- Info Block (Chứa rating, sales, distance) --- */}

        {/* Layout GỐC (Vertical) */}
        {!isHorizontal && (
          <>
            {/* Dòng 1: Rating, Sales */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "3px",
                marginTop: "0.5vh",
              }}
            >
              <StarIcon width="0.9rem" height="0.9rem" />
              <div
                style={{
                  color: "#555555",
                  fontSize: "1.2rem",
                  fontWeight: "600",
                }}
              >
                {displayRating}
              </div>
              <div
                style={{
                  color: "#555555",
                  fontSize: "1rem",
                  fontWeight: "400",
                }}
              >
                ({displayReviewCount})
              </div>
              <div style={{ marginLeft: "2.5vw" }}>
                <FoodIcon />
              </div>
              <div
                style={{
                  color: "#555555",
                  fontSize: "1.1rem",
                  fontWeight: "400",
                  marginLeft: "0.5vw",
                }}
              >
                {displaySalesCount}
              </div>
            </div>
            {/* Dòng 2: Distance */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "0.5vh",
              }}
            >
              <DeliveryTimeIcon />
              <div
                style={{
                  color: "#555555",
                  fontSize: "1.1rem",
                  fontWeight: "400",
                  marginLeft: "0.5vw",
                }}
              >
                {displayDistance}
              </div>
            </div>
          </>
        )}

        {/* Layout MỚI (Horizontal) - Gộp cả 3 vào 1 dòng */}
        {isHorizontal && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.8rem",
              marginTop: "0.5rem",
              flexWrap: "wrap", // Cho phép xuống dòng nếu không đủ chỗ
            }}
          >
            {/* Rating */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
              }}
            >
              <StarIcon width="0.85rem" height="0.85rem" />
              <span
                style={{
                  color: "#555",
                  fontSize: "0.95rem",
                  fontWeight: "600",
                }}
              >
                {displayRating}
              </span>
              <span style={{ color: "#888", fontSize: "0.85rem" }}>
                ({displayReviewCount})
              </span>
            </div>

            {/* Sales count (Dùng lại FoodIcon) */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
              }}
            >
              {/* Sử dụng icon component thay vì SVG inline */}
              <FoodIcon width="0.9rem" height="0.9rem" />
              <span style={{ color: "#555", fontSize: "0.9rem" }}>
                {displaySalesCount}
              </span>
            </div>

            {/* Distance (Dùng lại DeliveryTimeIcon) */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
              }}
            >
              {/* Sử dụng icon component thay vì SVG inline */}
              <DeliveryTimeIcon width="0.75rem" height="0.9rem" />
              <span style={{ color: "#555", fontSize: "0.9rem" }}>
                {displayDistance}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantCard;
