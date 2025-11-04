// Import necessary components from shared folder
import CartIcon from "@/components/shared/CartIcon";
import Navbar from "@/components/shared/Navbar";
import RestaurantCard from "../../components/role-specific/Customer/RestaurantCard";
import { useNavigate } from "react-router-dom";
import { useOrder } from "../../contexts/OrderContext";

// Functional component for the Discover page
const Discover = () => {
  const navigate = useNavigate();
  const { totalQuantity } = useOrder();
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

  // Array of restaurant data
  const restaurants = [
    {
      id: 1,
      name: "Phúc Long - 114 Xô Viết Nghệ Tĩnh",
      imageUrl: "https://upload.urbox.vn/strapi/phuc_long_5_c188a69da5.jpg",
      rating: 4.8,
      reviewCount: 256,
      salesCount: "1.2k+",
      distance: "2.3 km",
    },
    {
      id: 2,
      name: "Starbucks - Vincom Đà Nẵng",
      imageUrl:
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400",
      rating: 4.6,
      reviewCount: 189,
      salesCount: "890+",
      distance: "1.8 km",
    },
    {
      id: 3,
      name: "Highlands Coffee - Trần Phú",
      imageUrl:
        "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400",
      rating: 4.7,
      reviewCount: 342,
      salesCount: "2.1k+",
      distance: "3.1 km",
    },
    {
      id: 4,
      name: "The Coffee House - Nguyễn Văn Linh",
      imageUrl:
        "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=400",
      rating: 4.5,
      reviewCount: 198,
      salesCount: "756+",
      distance: "4.2 km",
    },
  ];

  // The component returns a JSX structure for rendering
  return (
    <div style={{ marginBottom: "12vh", paddingTop: "12vh" }}>
      {/* Styling for the input placeholder text */}
      <style>
        {`
          input::placeholder {
            color: rgba(0, 0, 0, 0.25) !important; // Set placeholder color with high priority
          }
        `}
      </style>
      {/* Header section with gradient background */}
      <div
        style={{
          width: "100%",
          height: "12vh",
          position: "fixed",
          background: "linear-gradient(180deg, #2bcdd2, #fff)", // Vertical gradient from blue to white
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
            onClick={() => navigate("/customer/confirm-order")}
          />
          {totalQuantity > 0 && (
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
              {totalQuantity}
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
        {categories.map((category) => (
          <div
            key={category.id} // Unique key for each item in the list
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.625vh",
            }}
          >
            {/* Category image */}
            <img
              src={category.image}
              style={{
                width: "5.7rem",
                height: "5.7rem",
                borderRadius: "50%", // Circular image
                objectFit: "cover", // Ensure the image covers the area
              }}
            />
            {/* Category title */}
            <div
              style={{
                fontSize: "1rem",
                color: "#000",
                fontWeight: 500,
                width: "5.7rem",
                textAlign: "center",
                wordWrap: "break-word", // Wrap long words
              }}
            >
              {category.title}
            </div>
          </div>
        ))}
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
        Gần tôi!
      </div>

      {/* Restaurant Cards */}
      <div
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
        {restaurants.map((restaurant, index) => (
          <div key={restaurant.id} onClick={() => navigate(`/customer/shop/${restaurant.id}`)} style={{ cursor: "pointer" }}>
            <RestaurantCard
              style={{
                flexShrink: 0,
                width: "13.7rem", // Kích thước gốc của thẻ
              }}
              name={restaurant.name}
              imageUrl={restaurant.imageUrl}
              rating={restaurant.rating}
              reviewCount={restaurant.reviewCount}
              salesCount={restaurant.salesCount}
              distance={restaurant.distance}
            />
          </div>
        ))}
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

      {/* Best Seller Restaurant Cards */}
      <div
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
        {restaurants.map((restaurant, index) => (
          <div key={`bestseller-${restaurant.id}`} onClick={() => navigate(`/customer/shop/${restaurant.id}`)} style={{ cursor: "pointer" }}>
            <RestaurantCard
              style={{
                flexShrink: 0,
                width: "13.7rem", // Kích thước gốc của thẻ
              }}
              name={restaurant.name}
              imageUrl={restaurant.imageUrl}
              rating={restaurant.rating}
              reviewCount={restaurant.reviewCount}
              salesCount={restaurant.salesCount}
              distance={restaurant.distance}
            />
          </div>
        ))}
      </div>

      {/* Navigation bar at the bottom */}
      <Navbar />
    </div>
  );
};

// Export the component for use in other parts of the application
export default Discover;
