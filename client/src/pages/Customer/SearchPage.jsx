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

  const allItems = [
    { title: "Bún Đậu Cuối Ngõ", image: "/bundau.jpg", distance: "0.4km" },
    { title: "Highlands Coffee", image: "/highland.png", distance: "1.2km" },
    { title: "Phúc Long", image: "/phuclong.jpg", distance: "0.8km" },
    { title: "Sà Bì Chưởng", image: "/sabichuong.jpg", distance: "2.1km" },
    { title: "Lotteria", image: "/lotteria.png", distance: "0.6km" },
    { title: "KFC", image: "/KFC_logo.png", distance: "0.9km" },
    { title: "Gà Ủ Muối", image: "/gaumuoi.webp", distance: "1.5km" },
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
              fontFamily: "TikTok Sans",
              fontWeight: "400",
              border: "none",
              outline: "none",
              background: "transparent",
            }}
          />
          {searchQuery && (
            <div style={{ marginRight: "3.33vw" }}>
              <ClearIcon onClick={() => setSearchQuery("")} />
            </div>
          )}
        </div>
      </div>

      {searchQuery ? (
        /* Search Results */
        <div
          style={{
            position: "absolute",
            top: "13.25vh",
            left: "5.28vw",
            width: "90vw",
            display: "grid",
            gridTemplateColumns: "repeat(3, 26.94vw)",
            justifyContent: "center",
            columnGap: "2.78vw",
            rowGap: "2.5vh",
          }}
        >
          {searchResults.length > 0 ? (
            searchResults.map((item, idx) => (
              <RecommendItem
                key={idx}
                image={item.image}
                title={item.title}
                distance={item.distance}
              />
            ))
          ) : (
            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "3rem 1rem",
                color: "#666",
                fontSize: "1.2rem",
                fontFamily: "TikTok Sans",
              }}
            >
              Không tìm thấy kết quả cho "{searchQuery}"
            </div>
          )}
        </div>
      ) : (
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
              image="/KFC_logo.png"
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
