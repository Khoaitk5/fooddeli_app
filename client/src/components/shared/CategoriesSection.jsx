const CategoriesSection = ({ selectedCategory, onCategoryClick }) => {
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

  return (
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
              onClick={() => onCategoryClick(category.title)}
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
  );
};

export default CategoriesSection;