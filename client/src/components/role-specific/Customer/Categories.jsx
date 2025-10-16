import theme from "../../../styles/theme";
import { useState, useEffect } from "react";

export default function Categories() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [categories, setCategories] = useState([]);

  // 🔹 Gọi API để lấy danh mục từ backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products/categories");
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
    "Thức ăn": {
      image:
        "https://images.unsplash.com/photo-1600891963939-a8d3d8f3c09a",
      bgColor: "#fff7ed",
    },
    "Đồ uống": {
      image:
        "https://images.unsplash.com/photo-1670468642364-6cacadfb7bb0",
      bgColor: "#fce7f3",
    },
    "Tráng miệng": {
      image:
        "https://images.unsplash.com/photo-1565958011705-44e211c07f4c",
      bgColor: "#f3e8ff",
    },
    "Khác": {
      image:
        "https://images.unsplash.com/photo-1606787366850-de6330128bfc",
      bgColor: "#dcfce7",
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
