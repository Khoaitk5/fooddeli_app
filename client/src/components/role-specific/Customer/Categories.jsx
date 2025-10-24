import theme from "../../../styles/theme";
import { useState, useEffect } from "react";

export default function Categories() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [categories, setCategories] = useState([]);

  // 🔹 Gọi API để lấy danh mục từ backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/products/categories"
        );
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Lỗi khi tải danh mục:", err);
      }
    };
    fetchCategories();
  }, []);


  // 🔹 Gắn sẵn ảnh và màu FE (BE chỉ gửi name)
  const categoryStyleMap = {
    Combo: {
      image:
        "https://firebasestorage.googleapis.com/v0/b/fooddeli-6d394.firebasestorage.app/o/images%2Fcategories%2Fcombo.jpg?alt=media&token=76fd243e-c2e1-4e01-85ba-85ce710c2499",
      bgColor: "#dcfce7",
    },
    "Đồ uống": {
      image:
        "https://firebasestorage.googleapis.com/v0/b/fooddeli-6d394.firebasestorage.app/o/images%2Fcategories%2Fdrinks.jpg?alt=media&token=06c97145-4b18-40bd-ad24-71de14155a1d",
      bgColor: "#fce7f3",
    },
    "Thức ăn": {
      image:
        "https://firebasestorage.googleapis.com/v0/b/fooddeli-6d394.firebasestorage.app/o/images%2Fcategories%2Ffood.jpg?alt=media&token=6662a500-34e5-4e5d-b0e2-f91f094003e8",
      bgColor: "#fff7ed",
    },
    "Tráng miệng": {
      image:
        "https://firebasestorage.googleapis.com/v0/b/fooddeli-6d394.firebasestorage.app/o/images%2Fcategories%2Fdessert.jpg?alt=media&token=289b3d12-bdf3-44a0-ab8b-24076825fa83",
      bgColor: "#f3e8ff",
    },
    Khác: {
      image: "https://images.unsplash.com/photo-1606787366850-de6330128bfc",
      bgColor: "#e0f2fe",
    },
  };

  const styles = {
    container: {
      padding: `${theme.spacing.xl} ${theme.spacing.lg}`,
      background: "linear-gradient(to bottom, #ffffff, #f9fafb80)",
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: theme.spacing.xl,
    },
    title: {
      fontSize: theme.fontSize.xl,
      fontWeight: "500",
      color: theme.colors.text.primary,
    },
    viewAllButton: {
      color: theme.colors.primary,
      fontSize: theme.fontSize.sm,
      backgroundColor: "#fff7ed",
      padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
      borderRadius: theme.borderRadius.xl,
      border: "none",
      cursor: "pointer",
      transition: `background-color ${theme.transition.fast}`,
    },
    scrollContainer: {
      display: "flex",
      gap: theme.spacing.xl,
      overflowX: "auto",
      paddingBottom: theme.spacing.sm,
      WebkitOverflowScrolling: "touch",
      scrollbarWidth: "none",
      msOverflowStyle: "none",
    },
    categoryItem: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: theme.spacing.md,
      minWidth: "5.5rem",
      cursor: "pointer",
    },
    iconContainer: (bgColor, isHovered) => ({
      width: "5rem",
      height: "5rem",
      backgroundColor: bgColor,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: isHovered ? theme.shadow.xl : theme.shadow.lg,
      padding: "0.65rem",
      border: `2px solid ${theme.colors.white}`,
      transition: `all ${theme.transition.normal}`,
      transform: isHovered
        ? "translateY(-0.5rem) scale(1.08)"
        : "translateY(0) scale(1)",
    }),
    categoryImage: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      borderRadius: "50%",
      mixBlendMode: "multiply",
    },
    categoryName: (isHovered) => ({
      fontSize: theme.fontSize.xs,
      textAlign: "center",
      color: isHovered ? theme.colors.primary : theme.colors.text.primary,
      transition: `color ${theme.transition.fast}`,
    }),
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Danh mục</h2>
        <button
          style={styles.viewAllButton}
          onClick={() => alert("🚧 Tính năng 'Xem tất cả' sẽ ra mắt sớm!")}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#fed7aa")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#fff7ed")}
        >
          Xem tất cả
        </button>
      </div>

      {/* Nếu chưa tải xong thì hiện loading */}
      {!categories.length ? (
        <p style={{ textAlign: "center", color: theme.colors.text.secondary }}>
          Đang tải danh mục...
        </p>
      ) : (
        <div style={styles.scrollContainer}>
          {categories.slice(0, 4).map((category, index) => {
            const styleInfo =
              categoryStyleMap[category.name] || categoryStyleMap["Khác"];
            return (
              <div
                key={index}
                style={styles.categoryItem}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  style={styles.iconContainer(
                    styleInfo.bgColor,
                    hoveredIndex === index
                  )}
                >
                  <img
                    src={styleInfo.image}
                    alt={category.name}
                    style={styles.categoryImage}
                  />
                </div>
                <span style={styles.categoryName(hoveredIndex === index)}>
                  {category.name}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
