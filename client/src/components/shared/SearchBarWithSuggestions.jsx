import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SearchBarWithSuggestions = ({ isScrolled }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [products, setProducts] = useState([]);

  // Hàm chuyển đổi tiếng Việt có dấu sang không dấu
  const removeVietnameseTones = (str) => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  };

  // Fetch products cho suggestions
  useEffect(() => {
    const fetchProducts = async () => {
      const API_BASE_URL =
        import.meta.env?.VITE_API_URL || "http://localhost:5000/api";
      try {
        const response = await axios.get(`${API_BASE_URL}/products/available`, {
          withCredentials: true,
          timeout: 5000,
        });
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const searchQueryLower = searchQuery.toLowerCase();
      const searchQueryNoTone = removeVietnameseTones(searchQueryLower);

      const filtered = products.filter((product) => {
        const productNameLower = product.name.toLowerCase();
        const productNameNoTone = removeVietnameseTones(productNameLower);

        // So sánh cả phiên bản có dấu và không dấu
        return productNameLower.includes(searchQueryLower) ||
               productNameNoTone.includes(searchQueryNoTone);
      });

      // Loại bỏ duplicate tên món ăn và sắp xếp theo độ relevant
      const uniqueSuggestions = [];
      const seenNames = new Set();

      // Ưu tiên món ăn có tên match chính xác ở đầu (cả có dấu và không dấu)
      const exactMatches = filtered.filter(product => {
        const productNameLower = product.name.toLowerCase();
        const productNameNoTone = removeVietnameseTones(productNameLower);
        return productNameLower === searchQueryLower ||
               productNameNoTone === searchQueryNoTone;
      });

      const partialMatches = filtered.filter(product => {
        const productNameLower = product.name.toLowerCase();
        const productNameNoTone = removeVietnameseTones(productNameLower);
        return !(productNameLower === searchQueryLower ||
                 productNameNoTone === searchQueryNoTone);
      });

      // Kết hợp và loại bỏ duplicate
      [...exactMatches, ...partialMatches].forEach(product => {
        if (!seenNames.has(product.name.toLowerCase())) {
          seenNames.add(product.name.toLowerCase());
          uniqueSuggestions.push(product);
        }
      });

      // Transform products để hiển thị thông tin phù hợp
      const transformedSuggestions = uniqueSuggestions.slice(0, 5).map(product => ({
        id: product.product_id,
        name: product.name,
      }));

      setSuggestions(transformedSuggestions);
      setShowSuggestions(transformedSuggestions.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, products]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSuggestions && !event.target.closest('.search-container')) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSuggestions]);

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/customer/search-results?query=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.name);
    setShowSuggestions(false);
    window.location.href = `/customer/search-results?query=${encodeURIComponent(suggestion.name)}`;
  };

  return (
    <div
      className="search-container"
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
        padding: "0 41px",
        fontSize: "1.4rem",
        color: "rgba(0, 0, 0, 0.25)",
        fontWeight: 500,
        boxShadow: "0 4px 12px rgba(254, 86, 33, 0.2)",
        lineHeight: "5.125vh",
        fontFamily: "Be Vietnam Pro",
        display: "flex",
        alignItems: "center",
        transition: "all 0.3s ease",
      }}
    >
      <input
        type="text"
        placeholder="Bạn đang thèm gì nào?"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleSearchKeyDown}
        onFocus={() => {
          if (searchQuery.trim() && suggestions.length > 0) {
            setShowSuggestions(true);
          }
        }}
        style={{
          flex: 1,
          border: "none",
          outline: "none",
          background: "transparent",
          fontSize: "1.4rem",
          color: "#000",
          fontWeight: 500,
          fontFamily: "Be Vietnam Pro",
        }}
      />

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "100%", // Hiển thị ngay dưới search bar
            left: 0,
            right: 0,
            width: "100%",
            maxWidth: "600px",
            backgroundColor: "#fff",
            borderRadius: "1rem",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            zIndex: 6000, // Tăng z-index để đảm bảo hiển thị trên tất cả
            maxHeight: "300px",
            overflowY: "auto",
            pointerEvents: "auto",
            marginTop: "0.5rem", // Khoảng cách nhỏ giữa search bar và dropdown
          }}
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.id}
              onMouseDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleSuggestionClick(suggestion);
              }}
              style={{
                padding: "1rem 1.5rem",
                cursor: "pointer",
                borderBottom: index < suggestions.length - 1 ? "1px solid #f0f0f0" : "none",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8f9fa")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <div style={{ marginRight: "0.5rem", display: "flex", alignItems: "center" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 21L16.65 16.65" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "1.1rem", fontWeight: "500", color: "#333" }}>
                  {suggestion.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBarWithSuggestions;