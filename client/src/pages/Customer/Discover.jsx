import Navbar from "@/components/shared/Navbar";
import CarouselBanner from "@/components/shared/CarouselBanner";
import CategoriesSection from "@/components/shared/CategoriesSection";
import RestaurantList from "@/components/shared/RestaurantList";
import HeaderSection from "@/components/shared/HeaderSection";
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
    id: shop.shop_profile_id || shop.id,
    name: shop.shop_name || "Chưa có tên",
    avatar_url:
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
      <HeaderSection isScrolled={isScrolled} cartCount={cartCount} />

      <div
        style={{
          zIndex: isScrolled ? 998 : 3000, // Tăng lên cao hơn dropdown suggestions
          position: "relative",
          transition: "z-index 0s",
        }}
      >
        <CarouselBanner />
      </div>
      <CategoriesSection
        selectedCategory={selectedCategory}
        onCategoryClick={handleCategoryClick}
      />
      {selectedCategory ? (
        <RestaurantList
          restaurants={filteredRestaurants}
          loading={loading}
          error={error}
          title={selectedCategory}
          showClearFilter={true}
          onClearFilter={() => setSelectedCategory(null)}
          orientation="vertical"
        />
      ) : (
        <>
          <RestaurantList
            restaurants={restaurants}
            loading={loading}
            error={error}
            title="Gần tôi!"
            orientation="horizontal"
          />
          <RestaurantList
            restaurants={restaurants}
            loading={loading}
            error={error}
            title="Bán chạy"
            orientation="horizontal"
          />
        </>
      )}
      <Navbar />
    </div>
  );
};

export default Discover;
