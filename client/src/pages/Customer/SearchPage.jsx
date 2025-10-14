import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackArrow from "../../components/shared/BackArrow";
import RecentSearchItem from "../../components/shared/RecentSearchItem";
import SuggestSearchItem from "../../components/shared/SuggestSearchItem";
import RecommendItem from "../../components/shared/RecommendItem";
import SearchTitle from "../../components/shared/SearchTitle";
import ClearIcon from "../../components/shared/ClearIcon";

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const recentSearches = [
    "phúc long",
    "bánh trung thu highlands",
    "Highlands Coffee",
  ];
  const suggestSearches = ["Gà Ủ Muối", "Bun Dau Mam Tom", "Mcdonald's", "Kfc"];

  // Đã thêm các món ăn để ví dụ gợi ý được chính xác
  const allItems = [
    { title: "Gà Ủ Muối", image: "/gaumuoi.webp", distance: "1.5km" },
    { title: "Gà Rán", image: "/garan.jpg", distance: "0.9km" },
    { title: "Gà Chiên", image: "/gachien.jpg", distance: "1.1km" },
    { title: "Gạo Nếp", image: "/gaonep.jpg", distance: "3.0km" },
    { title: "Bún Đậu Cuối Ngõ", image: "/bundau.jpg", distance: "0.4km" },
    { title: "Highlands Coffee", image: "/highland.png", distance: "1.2km" },
    { title: "Phúc Long", image: "/phuclong.jpg", distance: "0.8km" },
    { title: "Sà Bì Chưởng", image: "/sabichuong.jpg", distance: "2.1km" },
    { title: "Lotteria", image: "/lotteria.png", distance: "0.6km" },
    { title: "KFC", image: "https://upload.wikimedia.org/wikipedia/sco/thumb/b/bf/KFC_logo.svg/2048px-KFC_logo.svg.png", distance: "0.9km" },
    { title: "Tocotoco", image: "/tocotoco.webp", distance: "2.0km" },
    { title: "Mcdonald's", image: "/mc.jpg", distance: "1.8km" },
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      const filtered = allItems.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  // Hàm để render văn bản với phần trùng khớp được in đậm
  const renderSuggestionText = (title, query) => {
    const index = title.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) {
      return <span>{title}</span>;
    }
    const preMatch = title.substring(0, index);
    const match = title.substring(index, index + query.length);
    const postMatch = title.substring(index + query.length);
    return (
      <span>
        {preMatch}
        <b style={{ fontWeight: '900' }}>{match}</b>
        {postMatch}
      </span>
    );
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div>
        {/* Back Arrow */}
        <div
          style={{
            position: "absolute",
            top: "7.125vh",
            left: "6.67vw",
            zIndex: 15,
          }}
        >
          <BackArrow onClick={() => navigate(-1)} />
        </div>

        {/* Custom Div */}
        <div
          style={{
            position: "absolute",
            top: "5.625vh",
            left: "13.35vw",
            width: "79.44vw",
            height: "4.5vh",
            background: "#F5F5F5",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            placeholder="Bạn có muốn ăn gì không?"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            style={{
              flex: 1,
              marginLeft: "3.33vw",
              marginRight: "3.33vw",
              color: "#3B3B3B",
              fontSize: "1.4rem",
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontWeight: "400",
              border: "none",
              outline: "none",
              background: "transparent",
            }}
          />
          {searchQuery && (
            <div style={{ marginRight: "3.33vw" }}>
              <ClearIcon onClick={() => {
                setSearchQuery("");
                setSearchResults([]); // Xóa cả kết quả tìm kiếm
              }} />
            </div>
          )}
        </div>
      </div>

      {searchQuery ? (
        /* PHẦN ĐÃ SỬA: Hiển thị danh sách gợi ý tìm kiếm */
        <div
          style={{
            position: "absolute",
            top: "12vh",
            left: 0,
            width: "100%",
            paddingTop: '1vh'
          }}
        >
          {searchResults.length > 0 ? (
            searchResults.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "1.5vh 5.28vw",
                  cursor: "pointer",
                }}
              >
                <div style={{ marginRight: '4vw', display: 'flex', alignItems: 'center' }}>
                  {/* Icon kính lúp */}
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 21L16.65 16.65" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div style={{
                    color: "#3B3B3B",
                    fontSize: "1.6rem",
                    fontFamily: "'Be Vietnam Pro', sans-serif",
                }}>
                  {renderSuggestionText(item.title, searchQuery)}
                </div>
              </div>
            ))
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "3rem 1rem",
                color: "#666",
                fontSize: "1.2rem",
                fontFamily: "'Be Vietnam Pro', sans-serif",
              }}
            >
              Không tìm thấy kết quả cho "{searchQuery}"
            </div>
          )}
        </div>
      ) : (
        /* PHẦN GIỮ NGUYÊN: Hiển thị khi chưa có nội dung tìm kiếm */
        <>
          <SearchTitle
            style={{
              position: "absolute",
              left: "5.28vw",
              top: "13.25vh",
            }}
          >
            Đã tìm kiếm gần đây
          </SearchTitle>

          <div
            style={{
              position: "absolute",
              top: "18.625vh",
              left: "5.28vw",
              width: "90vw",
              display: "flex",
              flexWrap: "wrap",
              gap: "1.875vh 2.78vw",
            }}
          >
            {recentSearches.map((text, idx) => (
              <RecentSearchItem key={idx} text={text} />
            ))}
          </div>

          <SearchTitle
            style={{
              position: "absolute",
              left: "5.28vw",
              top: "31.875vh",
            }}
          >
            Gợi ý tìm kiếm
          </SearchTitle>

          <div
            style={{
              position: "absolute",
              top: "37.25vh",
              left: "5.28vw",
              width: "90vw",
              display: "flex",
              flexWrap: "wrap",
              gap: "1.875vh 2.78vw",
            }}
          >
            {suggestSearches.map((text, idx) => (
              <SuggestSearchItem key={idx} text={text} />
            ))}
          </div>

          <SearchTitle
            style={{
              position: "absolute",
              left: "5.28vw",
              top: "50.5vh",
            }}
          >
            Được đề xuất
          </SearchTitle>
          <div
            style={{
              position: "absolute",
              top: "55.875vh",
              left: 0,
              width: "100%",
              display: "grid",
              gridTemplateColumns: "repeat(3, 26.94vw)",
              justifyContent: "center",
              columnGap: "2.78vw",
              rowGap: "2.5vh",
            }}
          >
            <RecommendItem
              image="/bundau.jpg"
              title="Bún Đậu Cuối Ngõ"
              distance="0.4km"
            />
            <RecommendItem
              image="/highland.png"
              title="Highlands Coffee"
              distance="1.2km"
            />
            <RecommendItem
              image="/phuclong.jpg"
              title="Phúc Long"
              distance="0.8km"
            />
            <RecommendItem
              image="/sabichuong.jpg"
              title="Sà Bì Chưởng"
              distance="2.1km"
            />
            <RecommendItem
              image="/lotteria.png"
              title="Lotteria"
              distance="0.6km"
            />
            <RecommendItem
              image="https://upload.wikimedia.org/wikipedia/sco/thumb/b/bf/KFC_logo.svg/2048px-KFC_logo.svg.png"
              title="KFC"
              distance="0.9km"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default SearchPage;