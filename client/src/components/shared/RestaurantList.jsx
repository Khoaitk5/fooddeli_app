import { useNavigate } from "react-router-dom";
import RestaurantCard from "../role-specific/Customer/RestaurantCard";

const RestaurantList = ({
  restaurants,
  loading,
  error,
  title,
  showClearFilter = false,
  onClearFilter,
  orientation = "vertical"
}) => {
  const navigate = useNavigate();

  const handleRestaurantClick = (restaurantId) => {
    navigate("/customer/restaurant-details", {
      state: { shopId: restaurantId },
    });
  };

  if (loading) {
    return (
      <div
        style={{
          width: "100%",
          textAlign: "center",
          padding: "2rem",
          color: "#666",
          fontSize: "1.4rem",
        }}
      >
        Đang tải danh sách cửa hàng...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          width: "100%",
          textAlign: "center",
          padding: "2rem",
          color: "#ff4444",
          fontSize: "1.4rem",
        }}
      >
        {error}
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div
        style={{
          width: "100%",
          textAlign: "center",
          padding: "2rem",
          color: "#666",
          fontSize: "1.4rem",
        }}
      >
        {title ? `Không có cửa hàng nào trong danh mục này` : "Chưa có cửa hàng nào"}
      </div>
    );
  }

  const renderHeader = () => {
    if (!title) return null;

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginTop: "3.125vh",
          marginLeft: "4.17vw",
          marginRight: "4.17vw",
        }}
      >
        <div
          style={{
            color: "black",
            fontSize: "1.7rem",
            fontWeight: "600",
            wordWrap: "break-word",
          }}
        >
          {title}
        </div>
        {showClearFilter && (
          <button
            onClick={onClearFilter}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#FF6B35",
              color: "white",
              border: "none",
              borderRadius: "20px",
              fontSize: "0.9rem",
              fontWeight: "500",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#E55A2B")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#FF6B35")}
          >
            Xóa bộ lọc
          </button>
        )}
      </div>
    );
  };

  const renderList = () => {
    if (orientation === "horizontal") {
      return (
        <div
          className="hide-scrollbar"
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "3.05vw",
            marginTop: "2vh",
            paddingLeft: "5vw",
            paddingRight: "5vw",
            overflowX: "auto",
          }}
        >
          {restaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              onClick={() => handleRestaurantClick(restaurant.id)}
              style={{ cursor: "pointer" }}
            >
              <RestaurantCard
                style={{
                  flexShrink: 0,
                }}
                restaurant={restaurant}
              />
            </div>
          ))}
        </div>
      );
    }

    return (
      <div
        style={{
          marginTop: "2vh",
          paddingLeft: "4.17vw",
          paddingRight: "4.17vw",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          {restaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              onClick={() => handleRestaurantClick(restaurant.id)}
              style={{
                cursor: "pointer",
                padding: "0.5rem",
                borderRadius: "0.5rem",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#f5f5f5")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <RestaurantCard
                orientation="horizontal"
                restaurant={restaurant}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {renderHeader()}
      {renderList()}
    </>
  );
};

export default RestaurantList;