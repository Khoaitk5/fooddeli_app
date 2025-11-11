import CartIcon from "@/components/shared/CartIcon";
import Navbar from "@/components/shared/Navbar";
import RestaurantCard from "../../components/role-specific/Customer/RestaurantCard";
import FloatingAd from "@/components/shared/FloatingAd";
import CarouselBanner from "@/components/shared/CarouselBanner";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { useState, useEffect } from "react";
import axios from "axios";
const Discover = () => {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const categories = [
    {
      id: 1,
      image:
        "https://kissanrestaurant.com/wp-content/uploads/2024/04/burgers.jpeg",
      title: "Đồ Ăn Nhanh",
    },
    {
      id: 2,
      image:
        "https://media.loveitopcdn.com/24813/thumb/com-tron-kimchi-hancook.jpg",
      title: "Cơm - Xôi",
    },
    {
      id: 3,
      image:
        "https://annamrestaurant.co.uk/wp-content/uploads/2024/11/3796d7_e97173ffd4d34268a68404e492b4255bmv2.webp",
      title: "Bún - Phở - Mỳ",
    },
    {
      id: 4,
      image:
        "https://gongcha.com.vn/wp-content/uploads/2018/06/Hinh-Web-OKINAWA-LATTE.png",
      title: "Trà Sữa - Cà Phê",
    },
  ];
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const transformShopData = (shop) => ({
    id: shop.id || shop.shop_profile_id,
    name: shop.shop_name || "Chưa có tên",
    imageUrl:
      shop.shop_image ||
      shop.avatar_url ||
      "https://upload.urbox.vn/strapi/phuc_long_5_c188a69da5.jpg",
    rating:
      shop.avg_review_rating && shop.avg_review_rating > 0
        ? Number(shop.avg_review_rating).toFixed(1)
        : shop.rating
        ? Number(shop.rating).toFixed(1)
        : "5.0",
    reviewCount: shop.review_count || 0,
    salesCount: shop.completed_orders ? `${shop.completed_orders}+` : "0+",
    distance: "N/A",
  });
  useEffect(() => {
    const fetchShops = async () => {
      const API_BASE_URL =
        import.meta.env?.VITE_API_URL || "http://localhost:5000/api";
      try {
        setLoading(true);
        setError(null);
        const endpoint = selectedCategory
          ? `${API_BASE_URL}/shops/by-food-type?foodType=${encodeURIComponent(
              selectedCategory
            )}`
          : `${API_BASE_URL}/shops/list`;
        const response = await axios.get(endpoint, {
          withCredentials: true,
          timeout: 5000,
        });
        if (response.data.success && Array.isArray(response.data.data)) {
          const transformedShops = response.data.data.map(transformShopData);
          if (selectedCategory) {
            setFilteredRestaurants(transformedShops);
          } else {
            setRestaurants(transformedShops);
          }
        } else {
          selectedCategory ? setFilteredRestaurants([]) : setRestaurants([]);
        }
      } catch (err) {
        console.error("Error fetching shops:", err);
        setError(
          err.code === "ECONNABORTED"
            ? "Kết nối quá chậm"
            : "Không thể tải danh sách cửa hàng"
        );
        selectedCategory ? setFilteredRestaurants([]) : setRestaurants([]);
      } finally {
        setLoading(false);
      }
    };
    fetchShops();
  }, [selectedCategory]);
  const handleCategoryClick = (categoryTitle) => {
    setSelectedCategory(
      selectedCategory === categoryTitle ? null : categoryTitle
    );
  };
  return (
    <div style={{ marginBottom: "12vh", paddingTop: "12vh" }}>
      <style>
        {`
          input::placeholder {
            color: rgba(0, 0, 0, 0.25) !important;
          }
          
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }

          @keyframes slideInRight {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>
      <div
        style={{
          width: "100%",
          height: isScrolled ? "calc(5.125vh + 1.5rem)" : "calc(12vh + 90px)",
          position: "fixed",
          background: isScrolled
            ? "#FE5621"
            : "linear-gradient(180deg, #FE5621 0%, #FF7A50 50%, rgba(255, 255, 255, 0) 100%)",
          top: 0,
          left: 0,
          zIndex: 999,
          pointerEvents: "none",
          transition: "all 0.3s ease",
        }}
      />
      <div
        style={{
          width: "100%",
          height: isScrolled ? "calc(5.125vh + 1.5rem)" : "12vh",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 1002,
          transition: "all 0.3s ease",
        }}
      >
        <div
          style={{
            top: "0.625vh",
            left: "5vw",
            position: "absolute",
            fontSize: "1rem",
            fontWeight: 600,
            color: "#fff",
            opacity: isScrolled ? 0 : 1,
            transition: "opacity 0.3s ease",
            pointerEvents: isScrolled ? "none" : "auto",
          }}
        >
          Giao đến
        </div>
        <div
          style={{
            position: "absolute",
            fontSize: "1.4rem",
            color: "#fff",
            marginTop: "2.375vh",
            left: "5vw",
            fontWeight: 700,
            opacity: isScrolled ? 0 : 1,
            transition: "opacity 0.3s ease",
            pointerEvents: isScrolled ? "none" : "auto",
          }}
        >
          Trường Đại Học FPT Đà Nẵng
        </div>
        <div style={{ position: "relative" }}>
          <CartIcon
            style={{
              position: "absolute",
              top: isScrolled ? "calc((5.125vh + 1.5rem - 24px) / 2)" : "1.5vh",
              right: "5vw",
              transition: "all 0.3s ease",
            }}
            onClick={() => navigate("/customer/cart")}
          />
          {cartCount > 0 && (
            <div
              style={{
                position: "absolute",
                top: isScrolled
                  ? "calc((5.125vh + 1.5rem - 24px) / 2 - 0.5rem)"
                  : "0.5vh",
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
                transition: "all 0.3s ease",
              }}
            >
              {cartCount}
            </div>
          )}
        </div>
        <div
          style={{
            width: isScrolled ? "calc(100% - 10vw - 24px - 2rem)" : "91.67vw",
            height: "5.125vh",
            position: "absolute",
            borderRadius: "2rem",
            backgroundColor: "#fff",
            top: isScrolled
              ? "calc((5.125vh + 1.5rem - 5.125vh) / 2)"
              : "5.875vh",
            left: isScrolled ? "5vw" : "50%",
            transform: isScrolled ? "none" : "translateX(-50%)",
            border: "none",
            padding: "0 0 0 41px",
            fontSize: "1.4rem",
            color: "rgba(0, 0, 0, 0.25)",
            fontWeight: 500,
            boxShadow: "0 4px 12px rgba(254, 86, 33, 0.2)",
            lineHeight: "5.125vh",
            fontFamily: "Be Vietnam Pro",
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onClick={() => navigate("/customer/search")}
        >
          Bạn đang thèm gì nào?
        </div>
      </div>
      <div
        style={{
          zIndex: isScrolled ? 998 : 1004,
          position: "relative",
          transition: "z-index 0s",
        }}
      >
        <CarouselBanner />
      </div>
      <div
        style={{
          padding: "1.5rem 4.17vw",
          backgroundColor: "#FAFAFA",
          marginTop: "1rem",
        }}
      >
        <div
          style={{
            color: "black",
            fontSize: "1.7rem",
            fontWeight: "600",
            marginBottom: "1.2rem",
          }}
        >
          Danh mục món ăn
        </div>
        <div
          style={{
            display: "flex",
            gap: "10vw",
            justifyContent: "center",
          }}
        >
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
                <div
                  style={{
                    position: "relative",
                    width: "5.7rem",
                    height: "5.7rem",
                  }}
                >
                  <img
                    src={category.image}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: isSelected
                        ? "3px solid #FF6B35"
                        : "3px solid transparent",
                      boxShadow: isSelected
                        ? "0 4px 12px rgba(255, 107, 53, 0.3)"
                        : "none",
                    }}
                  />
                  {isSelected && (
                    <div
                      style={{
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
                      }}
                    >
                      ✓
                    </div>
                  )}
                </div>
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
      </div>
      {selectedCategory ? (
        <>
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
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#E55A2B")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#FF6B35")}
            >
              Xóa bộ lọc
            </button>
          </div>
          <div
            style={{
              marginTop: "2vh",
              paddingLeft: "4.17vw",
              paddingRight: "4.17vw",
            }}
          >
            {loading ? (
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
            ) : error ? (
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
            ) : filteredRestaurants.length === 0 ? (
              <div
                style={{
                  width: "100%",
                  textAlign: "center",
                  padding: "2rem",
                  color: "#666",
                  fontSize: "1.4rem",
                }}
              >
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
                    onClick={() =>
                      navigate("/customer/restaurant-details", {
                        state: { shopId: restaurant.id },
                      })
                    }
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
            )}
          </div>
        </>
      ) : (
        <>
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
            ) : error ? (
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
            ) : restaurants.length === 0 ? (
              <div
                style={{
                  width: "100%",
                  textAlign: "center",
                  padding: "2rem",
                  color: "#666",
                  fontSize: "1.4rem",
                }}
              >
                Chưa có cửa hàng nào
              </div>
            ) : (
              restaurants.map((restaurant) => (
                <div
                  key={restaurant.id}
                  onClick={() =>
                    navigate("/customer/restaurant-details", {
                      state: { shopId: restaurant.id },
                    })
                  }
                  style={{ cursor: "pointer" }}
                >
                  <RestaurantCard
                    style={{
                      flexShrink: 0,
                    }}
                    restaurant={restaurant}
                  />
                </div>
              ))
            )}
          </div>
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
            ) : error ? (
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
            ) : restaurants.length === 0 ? (
              <div
                style={{
                  width: "100%",
                  textAlign: "center",
                  padding: "2rem",
                  color: "#666",
                  fontSize: "1.4rem",
                }}
              >
                Chưa có cửa hàng nào
              </div>
            ) : (
              restaurants.map((restaurant) => (
                <div
                  key={`bestseller-${restaurant.id}`}
                  onClick={() =>
                    navigate("/customer/restaurant-details", {
                      state: { shopId: restaurant.id },
                    })
                  }
                  style={{ cursor: "pointer" }}
                >
                  <RestaurantCard
                    style={{
                      flexShrink: 0,
                    }}
                    restaurant={restaurant}
                  />
                </div>
              ))
            )}
          </div>
        </>
      )}
      <Navbar />
      <FloatingAd />
    </div>
  );
};

export default Discover;
