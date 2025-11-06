// Import necessary components from shared folder
import CartIcon from "@/components/shared/CartIcon";
import Navbar from "@/components/shared/Navbar";
import RestaurantCard from "../../components/role-specific/Customer/RestaurantCard";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";

// Functional component for the Discover page
const Discover = () => {
  const navigate = useNavigate();
  const { cartCount } = useCart(); // Lấy số lượng từ backend cart

  // State cho danh sách shops
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]); // Shops được filter
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null); // Category được chọn

  // An array of category objects, each with an id, image URL, and title
  const categories = [
    {
      id: 1,
      image:
        "https://kissanrestaurant.com/wp-content/uploads/2024/04/burgers.jpeg",
      title: "Đồ Ăn Nhanh", // Fast Food
    },
    {
      id: 2,
      image:
        "https://media.loveitopcdn.com/24813/thumb/com-tron-kimchi-hancook.jpg",
      title: "Cơm - Xôi", // Rice - Sticky Rice
    },
    {
      id: 3,
      image:
        "https://annamrestaurant.co.uk/wp-content/uploads/2024/11/3796d7_e97173ffd4d34268a68404e492b4255bmv2.webp",
      title: "Bún - Phở - Mỳ", // Noodles
    },
    {
      id: 4,
      image:
        "https://gongcha.com.vn/wp-content/uploads/2018/06/Hinh-Web-OKINAWA-LATTE.png",
      title: "Trà Sữa - Cà Phê", // Milk Tea - Coffee
    },
  ];

  // ✅ Hàm transform shop - tối ưu bằng cách tách riêng
  const transformShopData = (shop) => ({
    id: shop.id || shop.shop_profile_id,
    name: shop.shop_name || "Chưa có tên",
    imageUrl: shop.shop_image || shop.avatar_url || "https://upload.urbox.vn/strapi/phuc_long_5_c188a69da5.jpg",
    rating: shop.avg_review_rating && shop.avg_review_rating > 0
      ? Number(shop.avg_review_rating).toFixed(1)
      : (shop.rating ? Number(shop.rating).toFixed(1) : "5.0"),
    reviewCount: shop.review_count || 0,
    salesCount: shop.completed_orders ? `${shop.completed_orders}+` : "0+",
    distance: "N/A",
  });

  // Fetch danh sách shops từ API - Tối ưu hóa
  useEffect(() => {
    const fetchShops = async () => {
      const API_BASE_URL = import.meta.env?.VITE_API_URL || "http://localhost:5000/api";
      
      try {
        setLoading(true);
        setError(null);

        // ✅ Xác định endpoint dựa trên category
        const endpoint = selectedCategory
          ? `${API_BASE_URL}/shops/by-food-type?foodType=${encodeURIComponent(selectedCategory)}`
          : `${API_BASE_URL}/shops/list`;

        // ✅ Gọi API một lần duy nhất
        const response = await axios.get(endpoint, {
          withCredentials: true,
          timeout: 5000, // ✅ Thêm timeout 5s
        });

        // ✅ Kiểm tra và transform data
        if (response.data.success && Array.isArray(response.data.data)) {
          const transformedShops = response.data.data.map(transformShopData);
          
          // ✅ Set state dựa trên category
          if (selectedCategory) {
            setFilteredRestaurants(transformedShops);
          } else {
            setRestaurants(transformedShops);
          }
        } else {
          selectedCategory ? setFilteredRestaurants([]) : setRestaurants([]);
        }
      } catch (err) {
        console.error("❌ Lỗi khi fetch shops:", err);
        setError(err.code === 'ECONNABORTED' ? "Kết nối quá chậm" : "Không thể tải danh sách cửa hàng");
        selectedCategory ? setFilteredRestaurants([]) : setRestaurants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [selectedCategory]); // Re-fetch khi selectedCategory thay đổi

  // Handler khi click vào category
  const handleCategoryClick = (categoryTitle) => {
    if (selectedCategory === categoryTitle) {
      // Nếu click vào category đang chọn, bỏ filter (hiển thị tất cả)
      setSelectedCategory(null);
    } else {
      // Chọn category mới
      setSelectedCategory(categoryTitle);
    }
  };

  // The component returns a JSX structure for rendering
  return (
    <div style={{ marginBottom: "12vh", paddingTop: "12vh" }}>
      {/* Styling for the input placeholder text */}
      <style>
        {`
          input::placeholder {
            color: rgba(0, 0, 0, 0.25) !important; // Set placeholder color with high priority
          }
          
          /* Ẩn scrollbar nhưng vẫn giữ chức năng scroll */
          .hide-scrollbar {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none;  /* Chrome, Safari and Opera */
          }
        `}
      </style>
      {/* Header section with gradient background */}
      <div
        style={{
          width: "100%",
          height: "12vh",
          position: "fixed",
          background: "linear-gradient(180deg, #5EAD1D, #fff)", // Vertical gradient from blue to white
          top: 0,
          left: 0,
          zIndex: 1000,
        }}
      >
        {/* Delivery location label */}
        <div
          style={{
            top: "0.625vh",
            left: "5vw",
            position: "absolute",
            fontSize: "1rem",
            fontWeight: 600,
            color: "#fff",
          }}
        >
          Giao đến
        </div>
        {/* Delivery address */}
        <div
          style={{
            position: "absolute",
            fontSize: "1.4rem",
            color: "#fff",
            marginTop: "2.375vh",
            left: "5vw",
            fontWeight: 700,
          }}
        >
          Trường Đại Học FPT Đà Nẵng
        </div>
        {/* Cart icon with positioning */}
        <div style={{ position: "relative" }}>
          <CartIcon
            style={{
              position: "absolute",
              top: "1.5vh",
              right: "5vw",
            }}
            
            onClick={() => navigate("/customer/cart")}
          />
          {cartCount > 0 && (
            <div
              style={{
                position: "absolute",
                top: "0.5vh",
                right: "3vw",
                backgroundColor: "#FF0000",
                color: "white",
                borderRadius: "50%",
                width: "1.5rem",
                height: "1.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.8rem",
                fontWeight: "bold",
                zIndex: 1,
              }}
            >
              {cartCount}
            </div>
          )}
        </div>
        {/* Search display field */}
        <div
          style={{
            width: "91.67vw",
            height: "5.125vh",
            position: "absolute",
            borderRadius: "2rem",
            backgroundColor: "#fff",
            top: "5.875vh",
            left: "50%",
            transform: "translateX(-50%)",
            border: "none",
            padding: "0 0 0 41px",
            fontSize: "1.4rem",
            color: "rgba(0, 0, 0, 0.25)",
            fontWeight: 500,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            lineHeight: "5.125vh",
            fontFamily: "Be Vietnam Pro",
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => navigate("/customer/search")}
        >
          Bạn đang thèm gì nào?
        </div>
      </div>
      {/* Section to display food categories */}
      <div
        style={{
          padding: "20px",
          display: "flex",
          gap: "10vw",
          justifyContent: "center",
        }}
      >
        {/* Map over the categories array to render each category */}
        {categories.map((category) => {
          const isSelected = selectedCategory === category.title;

          return (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.title)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.625vh",
                cursor: "pointer",
                transition: "all 0.3s ease",
                opacity: selectedCategory && !isSelected ? 0.5 : 1,
                transform: isSelected ? "scale(1.05)" : "scale(1)",
              }}
            >
              {/* Category image with border when selected */}
              <div style={{
                position: "relative",
                width: "5.7rem",
                height: "5.7rem",
              }}>
                <img
                  src={category.image}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: isSelected ? "3px solid #FF6B35" : "3px solid transparent",
                    boxShadow: isSelected ? "0 4px 12px rgba(255, 107, 53, 0.3)" : "none",
                  }}
                />
                {/* Checkmark icon when selected */}
                {isSelected && (
                  <div style={{
                    position: "absolute",
                    top: "-5px",
                    right: "-5px",
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    backgroundColor: "#FF6B35",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}>
                    ✓
                  </div>
                )}
              </div>
              {/* Category title */}
              <div
                style={{
                  fontSize: "1rem",
                  color: isSelected ? "#FF6B35" : "#000",
                  fontWeight: isSelected ? 600 : 500,
                  width: "5.7rem",
                  textAlign: "center",
                  wordWrap: "break-word",
                }}
              >
                {category.title}
              </div>
            </div>
          );
        })}
      </div>

      {/* Khi có filter: Chỉ hiển thị danh sách shops được filter */}
      {selectedCategory ? (
        <>
          {/* Header với filter info */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginTop: "3.125vh",
            marginLeft: "4.17vw",
            marginRight: "4.17vw",
          }}>
            <div
              style={{
                color: "black",
                fontSize: "1.7rem",
                fontWeight: "600",
                wordWrap: "break-word",
              }}
            >
              {selectedCategory}
            </div>
            <button
              onClick={() => setSelectedCategory(null)}
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
              onMouseEnter={(e) => e.target.style.backgroundColor = "#E55A2B"}
              onMouseLeave={(e) => e.target.style.backgroundColor = "#FF6B35"}
            >
              ✕ Xóa bộ lọc
            </button>
          </div>

          {/* Filtered Restaurant Cards - Vertical List Layout (Mobile Style) */}
          <div
            style={{
              marginTop: "2vh",
              paddingLeft: "4.17vw",
              paddingRight: "4.17vw",
            }}
          >
            {loading ? (
              <div style={{
                width: "100%",
                textAlign: "center",
                padding: "2rem",
                color: "#666",
                fontSize: "1.4rem",
              }}>
                Đang tải danh sách cửa hàng...
              </div>
            ) : error ? (
              <div style={{
                width: "100%",
                textAlign: "center",
                padding: "2rem",
                color: "#ff4444",
                fontSize: "1.4rem",
              }}>
                {error}
              </div>
            ) : filteredRestaurants.length === 0 ? (
              <div style={{
                width: "100%",
                textAlign: "center",
                padding: "2rem",
                color: "#666",
                fontSize: "1.4rem",
              }}>
                Không có cửa hàng nào trong danh mục này
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                }}
              >
                {filteredRestaurants.map((restaurant) => (
                  <div
                    key={restaurant.id}
                    onClick={() => navigate("/customer/restaurant-details", {
                      state: { shopId: restaurant.id }
                    })}
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      gap: "1rem",
                      padding: "0.5rem",
                      borderRadius: "0.5rem",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f5f5f5"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    {/* Ảnh shop bên trái */}
                    <img
                      src={restaurant.imageUrl || "https://upload.urbox.vn/strapi/phuc_long_5_c188a69da5.jpg"}
                      alt={restaurant.name}
                      style={{
                        width: "130px",
                        height: "130px",
                        borderRadius: "1rem",
                        objectFit: "cover",
                        flexShrink: 0,
                      }}
                    />

                    {/* Thông tin shop bên phải */}
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        paddingTop: "0.3rem",
                      }}
                    >
                      {/* Tên shop với verified icon */}
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                        <svg
                          width="1.2rem"
                          height="1.2rem"
                          viewBox="0 0 15 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          style={{ flexShrink: 0, marginTop: "0.2rem" }}
                        >
                          <path
                            d="M9.09298 0.967562L8.92614 0.733888C8.22714 -0.244629 6.77289 -0.244629 6.0739 0.733888L5.90706 0.967562C5.53799 1.4842 4.9184 1.76085 4.28739 1.69074L3.54342 1.60808C2.42721 1.48405 1.48405 2.42721 1.60808 3.54342L1.69074 4.28739C1.76085 4.9184 1.4842 5.53799 0.967562 5.90706L0.733888 6.0739C-0.244629 6.77289 -0.244629 8.22714 0.733888 8.92614L0.967562 9.09298C1.4842 9.46207 1.76085 10.0817 1.69074 10.7127L1.60808 11.4566C1.48405 12.5728 2.42721 13.516 3.54342 13.3919L4.28739 13.3093C4.9184 13.2392 5.53799 13.5158 5.90706 14.0325L6.0739 14.2661C6.77289 15.2446 8.22714 15.2446 8.92614 14.2661L9.09298 14.0325C9.46207 13.5158 10.0817 13.2392 10.7127 13.3093L11.4566 13.3919C12.5728 13.516 13.516 12.5728 13.3919 11.4566L13.3093 10.7127C13.2392 10.0817 13.5158 9.46207 14.0325 9.09298L14.2661 8.92614C15.2446 8.22714 15.2446 6.77289 14.2661 6.0739L14.0325 5.90706C13.5158 5.53799 13.2392 4.9184 13.3093 4.28739L13.3919 3.54342C13.516 2.42721 12.5728 1.48405 11.4566 1.60808L10.7127 1.69074C10.0817 1.76085 9.46207 1.4842 9.09298 0.967562Z"
                            fill="#5EAD1D"
                          />
                          <path
                            d="M4.87109 7.50003L6.46493 9.09387C6.55256 9.1815 6.69469 9.1815 6.78232 9.09387L10.1287 5.7475"
                            stroke="white"
                            strokeWidth="1.33"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div
                          style={{
                            color: "black",
                            fontSize: "1.1rem",
                            fontWeight: "600",
                            lineHeight: "1.3",
                          }}
                        >
                          {restaurant.name}
                        </div>
                      </div>

                      {/* Rating, Sales count và Distance - Tất cả trên 1 dòng */}
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.8rem",
                        marginTop: "0.5rem",
                        flexWrap: "wrap"
                      }}>
                        {/* Rating */}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                          <svg width="0.85rem" height="0.85rem" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 0L8.5716 4.83688H13.6574L9.5429 7.82624L11.1145 12.6631L7 9.67376L2.8855 12.6631L4.4571 7.82624L0.342604 4.83688H5.4284L7 0Z" fill="#FFA928"/>
                          </svg>
                          <span style={{ color: "#555", fontSize: "0.95rem", fontWeight: "600" }}>
                            {restaurant.rating}
                          </span>
                          <span style={{ color: "#888", fontSize: "0.85rem" }}>
                            ({restaurant.reviewCount})
                          </span>
                        </div>

                        {/* Sales count */}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                          <svg width="0.9rem" height="0.9rem" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 0C6.41775 0 4.87103 0.469192 3.55544 1.34824C2.23985 2.22729 1.21447 3.47672 0.608967 4.93853C0.00346629 6.40034 -0.15496 8.00887 0.153721 9.56072C0.462403 11.1126 1.22433 12.538 2.34315 13.6569C3.46197 14.7757 4.88743 15.5376 6.43928 15.8463C7.99113 16.155 9.59966 15.9965 11.0615 15.391C12.5233 14.7855 13.7727 13.7602 14.6518 12.4446C15.5308 11.129 16 9.58225 16 8C15.9977 5.87897 15.1541 3.84547 13.6543 2.34568C12.1545 0.845886 10.121 0.00229405 8 0ZM8 14.6667C6.68146 14.6667 5.39253 14.2757 4.2962 13.5431C3.19987 12.8106 2.34539 11.7694 1.84081 10.5512C1.33622 9.33305 1.2042 7.99261 1.46143 6.69948C1.71867 5.40635 2.35361 4.21831 3.28596 3.28596C4.21831 2.35361 5.40635 1.71867 6.69948 1.46143C7.99261 1.2042 9.33305 1.33622 10.5512 1.84081C11.7694 2.34539 12.8106 3.19987 13.5431 4.2962C14.2757 5.39253 14.6667 6.68146 14.6667 8C14.6647 9.76752 13.9617 11.4621 12.7119 12.7119C11.4621 13.9617 9.76752 14.6647 8 14.6667Z" fill="#555555"/>
                            <path d="M11.3333 7.33333H8.66667V4C8.66667 3.82319 8.59643 3.65362 8.47141 3.5286C8.34638 3.40357 8.17681 3.33333 8 3.33333C7.82319 3.33333 7.65362 3.40357 7.5286 3.5286C7.40357 3.65362 7.33333 3.82319 7.33333 4V8C7.33333 8.17681 7.40357 8.34638 7.5286 8.4714C7.65362 8.59643 7.82319 8.66667 8 8.66667H11.3333C11.5101 8.66667 11.6797 8.59643 11.8047 8.4714C11.9298 8.34638 12 8.17681 12 8C12 7.82319 11.9298 7.65362 11.8047 7.5286C11.6797 7.40357 11.5101 7.33333 11.3333 7.33333Z" fill="#555555"/>
                          </svg>
                          <span style={{ color: "#555", fontSize: "0.9rem" }}>
                            {restaurant.salesCount}
                          </span>
                        </div>

                        {/* Distance */}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                          <svg width="0.75rem" height="0.9rem" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 0C2.68629 0 0 2.68629 0 6C0 9.31371 6 14 6 14C6 14 12 9.31371 12 6C12 2.68629 9.31371 0 6 0ZM6 8C4.89543 8 4 7.10457 4 6C4 4.89543 4.89543 4 6 4C7.10457 4 8 4.89543 8 6C8 7.10457 7.10457 8 6 8Z" fill="#555555"/>
                          </svg>
                          <span style={{ color: "#555", fontSize: "0.9rem" }}>
                            {restaurant.distance}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Khi KHÔNG có filter: Hiển thị section "Gần tôi!" và "Bán chạy" */}
          <div
            style={{
              color: "black",
              fontSize: "1.7rem",
              fontWeight: "600",
              wordWrap: "break-word",
              marginTop: "3.125vh",
              marginLeft: "4.17vw",
            }}
          >
            Gần tôi!
          </div>

          {/* Restaurant Cards - Horizontal Scroll */}
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
            {loading ? (
              <div style={{
                width: "100%",
                textAlign: "center",
                padding: "2rem",
                color: "#666",
                fontSize: "1.4rem",
              }}>
                Đang tải danh sách cửa hàng...
              </div>
            ) : error ? (
              <div style={{
                width: "100%",
                textAlign: "center",
                padding: "2rem",
                color: "#ff4444",
                fontSize: "1.4rem",
              }}>
                {error}
              </div>
            ) : restaurants.length === 0 ? (
              <div style={{
                width: "100%",
                textAlign: "center",
                padding: "2rem",
                color: "#666",
                fontSize: "1.4rem",
              }}>
                Chưa có cửa hàng nào
              </div>
            ) : (
              restaurants.map((restaurant) => (
                <div
                  key={restaurant.id}
                  onClick={() => navigate("/customer/restaurant-details", {
                    state: { shopId: restaurant.id }
                  })}
                  style={{ cursor: "pointer" }}
                >
                  <RestaurantCard
                    style={{
                      flexShrink: 0,
                      width: "13.7rem",
                    }}
                    name={restaurant.name}
                    imageUrl={restaurant.imageUrl}
                    rating={restaurant.rating}
                    reviewCount={restaurant.reviewCount}
                    salesCount={restaurant.salesCount}
                    distance={restaurant.distance}
                  />
                </div>
              ))
            )}
          </div>

          {/* Best Seller Section */}
          <div
            style={{
              color: "black",
              fontSize: "1.7rem",
              fontWeight: "600",
              wordWrap: "break-word",
              marginTop: "3.125vh",
              marginLeft: "4.17vw",
            }}
          >
            Bán chạy
          </div>

          {/* Best Seller Restaurant Cards */}
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
            {loading ? (
              <div style={{
                width: "100%",
                textAlign: "center",
                padding: "2rem",
                color: "#666",
                fontSize: "1.4rem"
              }}>
                Đang tải danh sách cửa hàng...
              </div>
            ) : error ? (
              <div style={{
                width: "100%",
                textAlign: "center",
                padding: "2rem",
                color: "#ff4444",
                fontSize: "1.4rem"
              }}>
                {error}
              </div>
            ) : restaurants.length === 0 ? (
              <div style={{
                width: "100%",
                textAlign: "center",
                padding: "2rem",
                color: "#666",
                fontSize: "1.4rem"
              }}>
                Chưa có cửa hàng nào
              </div>
            ) : (
              restaurants.map((restaurant) => (
                <div 
                  key={`bestseller-${restaurant.id}`} 
                  onClick={() => navigate("/customer/restaurant-details", {
                    state: { shopId: restaurant.id }
                  })} 
                  style={{ cursor: "pointer" }}
                >
                  <RestaurantCard
                    style={{
                      flexShrink: 0,
                      width: "13.7rem",
                    }}
                    name={restaurant.name}
                    imageUrl={restaurant.imageUrl}
                    rating={restaurant.rating}
                    reviewCount={restaurant.reviewCount}
                    salesCount={restaurant.salesCount}
                    distance={restaurant.distance}
                  />
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* Navigation bar at the bottom */}
      <Navbar />
    </div>
  );
};

// Export the component for use in other parts of the application
export default Discover;
