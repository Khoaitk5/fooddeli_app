import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { searchAll } from "@/api/searchApi";
import BackArrow from "../../../components/shared/BackArrow";
import ClearIcon from "../../../components/shared/ClearIcon";
import FilterIcon from "../../../components/shared/FilterIcon";
import SortIcon from "../../../components/shared/SortIcon";
import DownArrow from "../../../components/shared/DownArrow";
import TagIcon from "../../../components/shared/TagIcon";
import FoodResults from "../../shared/FoodResultItem";
import VideoResults from "../../shared/VideoResultItem";
import AccountResultItem from "../../shared/AccountResultItem";

const SearchResults = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get("query") || "";

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [activeTab, setActiveTab] = useState("food");
  const [products, setProducts] = useState([]);
  const [videos, setVideos] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔍 Gọi API khi có query (tự động chạy lại nếu query thay đổi)
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!queryParam.trim()) return;
      setLoading(true);
      try {
        const res = await searchAll(queryParam);
        console.log("✅ API SearchAll Response:", res);
        if (res?.success) {
          setProducts(res.products || []);
          setVideos(res.videos || []);
          setAccounts(res.accounts || []);
        } else {
          setProducts([]);
          setVideos([]);
          setAccounts([]);
        }
      } catch (error) {
        console.error("❌ Lỗi khi tìm kiếm:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSearchResults();
  }, [queryParam]);

  // 📌 Khi người dùng nhấn Enter → cập nhật URL và fetch kết quả mới
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() === "") return;
    setSearchParams({ query: searchQuery });
  };

  // 📌 Khi người dùng nhấn nút X → xóa input và kết quả
  const handleClear = () => {
    setSearchQuery("");
    setSearchParams({});
    setProducts([]);
    setVideos([]);
    setAccounts([]);
  };

  // --- UI phần tab ---
  const getTabColor = (tabName) => (activeTab === tabName ? "black" : "#8A8B8F");

  const tabStyle = {
    position: "absolute",
    top: "7.75vh",
    justifyContent: "center",
    display: "flex",
    flexDirection: "column",
    fontSize: "1.4rem",
    fontFamily: "Be Vietnam Pro",
    fontWeight: "600",
    cursor: "pointer",
    zIndex: 2,
  };

  const tabs = [
    { id: "food", label: "Đồ ăn", left: "10vw" },
    { id: "video", label: "Video", left: "40.83vw" },
    { id: "account", label: "Tài khoản", left: "71.94vw" },
  ];

  const getActiveTabIndicatorStyle = () => {
    const base = {
      position: "absolute",
      top: "11.5vh",
      height: "100%",
      outline: "2px black solid",
      outlineOffset: "-1px",
      zIndex: 3,
    };
    if (activeTab === "account") return { ...base, right: "0vw", width: "37.5vw" };
    if (activeTab === "video") return { ...base, left: "31.39vw", width: "31.11vw" };
    return { ...base, left: "0vw", width: "31.11vw" };
  };

  return (
    <div style={{ position: "relative" }}>
      {/* ====== THANH SEARCH ====== */}
      <div style={{ position: "absolute", top: "1.625vh", left: "15.28vw" }}>
        <div
          style={{
            position: "absolute",
            top: "1.5vh",
            left: "-8.61vw",
            zIndex: 15,
          }}
        >
          <BackArrow onClick={() => navigate(-1)} />
        </div>

        <form
          onSubmit={handleSearchSubmit}
          style={{
            position: "relative",
            width: "79.4vw",
            height: "4.5vh",
            background: "#F5F5F5",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            paddingLeft: "2vw",
          }}
        >
          <input
            type="text"
            placeholder="Tìm kiếm món ăn, video hoặc tài khoản..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: "1.4rem",
              color: "#333",
            }}
          />
          {searchQuery && (
            <div
              style={{
                position: "absolute",
                right: "3.61vw",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
            >
              <ClearIcon onClick={handleClear} />
            </div>
          )}
        </form>
      </div>

      {/* ====== TABS ====== */}
      {tabs.map((tab) => (
        <div
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          style={{ ...tabStyle, left: tab.left, color: getTabColor(tab.id) }}
        >
          {tab.label}
        </div>
      ))}

      {/* Active Tab Indicator */}
      <div style={getActiveTabIndicatorStyle()} />

      {/* Separator */}
      <div
        style={{
          position: "absolute",
          top: "11.5vh",
          left: "0",
          right: "0",
          width: "100%",
          height: "100%",
          outline: "0.3px #E7E7E7 solid",
          outlineOffset: "-0.15px",
          zIndex: 1,
        }}
      />

      {/* ====== FILTER BAR (Đồ ăn) ====== */}
      {activeTab === "food" && (
        <div
          style={{
            position: "absolute",
            top: "13.375vh",
            left: "0",
            right: "0",
            width: "100%",
            height: "4.125vh",
            display: "flex",
            gap: "2.22vw",
            overflowX: "auto",
            padding: "0 4.17vw",
            boxSizing: "border-box",
          }}
          className="scrollbar-hide"
        >
          <div
            style={{
              minWidth: "12.22vw",
              height: "100%",
              borderRadius: 16,
              border: "1px #B3B3B3 solid",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              cursor: "pointer",
            }}
          >
            <FilterIcon />
          </div>
          <div
            style={{
              minWidth: "34.72vw",
              height: "100%",
              borderRadius: 16,
              border: "1px #B3B3B3 solid",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              position: "relative",
              cursor: "pointer",
            }}
          >
            <SortIcon />
            <span style={{ marginLeft: 6, fontSize: "1.3rem" }}>Lọc theo</span>
            <DownArrow style={{ marginLeft: 4 }} />
          </div>
          <div
            style={{
              minWidth: "37.22vw",
              height: "100%",
              borderRadius: 16,
              border: "1px #B3B3B3 solid",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              position: "relative",
              cursor: "pointer",
            }}
          >
            <TagIcon />
            <span style={{ marginLeft: 6, fontSize: "1.3rem" }}>Khuyến mãi</span>
          </div>
        </div>
      )}

      {/* ====== KẾT QUẢ TÌM KIẾM ====== */}
      <div
        style={{
          position: "absolute",
          top: activeTab === "food" ? "19vh" : "13.375vh",
          left: "0",
          right: "0",
          width: "100%",
          height:
            activeTab === "food"
              ? "calc(100vh - 19vh)"
              : "calc(100vh - 13.375vh)",
          overflowY: "auto",
          boxSizing: "border-box",
        }}
        className="scrollbar-hide"
      >
        {/* ===== ĐỒ ĂN ===== */}
        {activeTab === "food" && (
          <>
            {loading ? (
              <p style={{ textAlign: "center", color: "#777", marginTop: "2rem" }}>
                Đang tải dữ liệu...
              </p>
            ) : products.length > 0 ? (
              products.map((food) => (
                <FoodResults
                  key={food.product_id}
                  storeName={`Cửa hàng #${food.shop_id}`}
                  storeImage={food.image_url}
                  rating={"4.5"}
                  reviewCount={"50"}
                  dishCategory={food.category}
                  deliveryTime="30 phút"
                  dishes={[
                    {
                      id: food.product_id,
                      name: food.name,
                      price: `${Number(food.price).toLocaleString()}đ`,
                      image: food.image_url,
                    },
                  ]}
                />
              ))
            ) : (
              <p style={{ textAlign: "center", color: "#777", marginTop: "2rem" }}>
                Không tìm thấy sản phẩm phù hợp
              </p>
            )}
          </>
        )}

        {/* ===== VIDEO ===== */}
        {activeTab === "video" && (
          <>
            {loading ? (
              <p style={{ textAlign: "center", color: "#777", marginTop: "2rem" }}>
                Đang tải dữ liệu...
              </p>
            ) : videos.length > 0 ? (
              <VideoResults videos={videos} />
            ) : (
              <p style={{ textAlign: "center", color: "#777", marginTop: "2rem" }}>
                Không có video phù hợp
              </p>
            )}
          </>
        )}

        {/* ===== TÀI KHOẢN ===== */}
        {activeTab === "account" && (
          <>
            {loading ? (
              <p style={{ textAlign: "center", color: "#777", marginTop: "2rem" }}>
                Đang tải dữ liệu...
              </p>
            ) : accounts.length > 0 ? (
              accounts.map((acc) => (
                <AccountResultItem
                  key={acc.id}
                  avatar={acc.avatar_url}
                  name={acc.full_name || acc.username}
                  email={acc.email}
                  role={acc.role}
                />
              ))
            ) : (
              <p style={{ textAlign: "center", color: "#777", marginTop: "2rem" }}>
                Không có tài khoản phù hợp
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
