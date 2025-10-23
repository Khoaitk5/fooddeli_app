import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/shared/Navbar";
import HeartIcon from "../../components/shared/HeartIcon";
import CommentIcon from "../../components/shared/CommentIcon";
import BookmarkIcon from "../../components/shared/BookmarkIcon";
import ShareIcon from "../../components/shared/ShareIcon";
import SearchIcon from "../../components/shared/SearchIcon";
import ProductCart from "../../components/role-specific/Customer/ProductCardForVideo.jsx";
import { pxW, pxH } from "../../utils/scale.js";
import TabItem from "../../components/role-specific/Customer/TabItem.jsx";
import MessagePopup from "../../components/shared/MessagePopup";

const Home = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState({});
  const [likedVideos, setLikedVideos] = useState(new Set());
  const [likeCounts, setLikeCounts] = useState({});
  const [bookmarkedVideos, setBookmarkedVideos] = useState(new Set());
  const [bookmarkCounts, setBookmarkCounts] = useState({});
  const videoRefs = useRef([]);
  const [activeTab, setActiveTab] = useState("suggestion");
  const [showMessagePopup, setShowMessagePopup] = useState(false);

  // 🔹 Fetch video list từ Backend (lọc theo vị trí user)
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        if (!navigator.geolocation) {
          console.error("Trình duyệt không hỗ trợ định vị.");
          return;
        }

        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            console.log("📍 Vị trí người dùng:", lat, lng);

            const response = await fetch(
              `http://localhost:5000/api/videos/feed/nearby?lat=${lat}&lng=${lng}`
            );
            const data = await response.json();

            if (data.success) {
              setVideos(data.data);
            } else {
              console.error("Không lấy được video:", data.message);
            }
          },
          (err) => {
            console.error("❌ Lỗi khi lấy vị trí người dùng:", err);
          },
          { enableHighAccuracy: true }
        );
      } catch (error) {
        console.error("❌ Lỗi fetch video:", error);
      }
    };

    fetchVideos();
  }, []);

  // 🔹 Auto-play video theo Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          const index = videoRefs.current.indexOf(video);
          if (entry.isIntersecting) {
            videoRefs.current.forEach((v, i) => {
              if (v && i !== index) v.pause();
            });
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => {
      videoRefs.current.forEach((video) => {
        if (video) observer.unobserve(video);
      });
    };
  }, [videos]);

  // 🔹 Styles
  const textStyle = {
    color: "white",
    fontFamily: "Be Vietnam Pro",
    textShadow: "0 1px 3px rgba(0, 0, 0, 0.8)",
  };

  const countStyle = {
    textAlign: "center",
    color: "white",
    fontSize: "1.2rem",
    fontFamily: "Proxima Nova",
    fontWeight: "600",
    wordWrap: "break-word",
    textShadow: "1px 1px 1px rgba(0, 0, 0, 0.25)",
  };

  // 🔹 Xử lý Like
  const handleHeartClick = (videoIndex, e) => {
    e.stopPropagation();
    e.preventDefault();
    setLikedVideos((prev) => {
      const newLiked = new Set(prev);
      const wasLiked = newLiked.has(videoIndex);
      if (wasLiked) {
        newLiked.delete(videoIndex);
        setLikeCounts((prevCounts) => ({
          ...prevCounts,
          [videoIndex]: Math.max((prevCounts[videoIndex] || 0) - 1, 0),
        }));
      } else {
        newLiked.add(videoIndex);
        setLikeCounts((prevCounts) => ({
          ...prevCounts,
          [videoIndex]: (prevCounts[videoIndex] || 0) + 1,
        }));
      }
      return newLiked;
    });
  };

  // 🔹 Xử lý Bookmark
  const handleBookmarkClick = (videoIndex, e) => {
    e.stopPropagation();
    e.preventDefault();
    setBookmarkedVideos((prev) => {
      const newBookmarked = new Set(prev);
      const wasBookmarked = newBookmarked.has(videoIndex);
      if (wasBookmarked) {
        newBookmarked.delete(videoIndex);
        setBookmarkCounts((prevCounts) => ({
          ...prevCounts,
          [videoIndex]: Math.max((prevCounts[videoIndex] || 0) - 1, 0),
        }));
      } else {
        newBookmarked.add(videoIndex);
        setBookmarkCounts((prevCounts) => ({
          ...prevCounts,
          [videoIndex]: (prevCounts[videoIndex] || 0) + 1,
        }));
      }
      return newBookmarked;
    });
  };

  const formatCount = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  return (
    <div
      className={`h-[${pxH(800)}] w-[${pxW(
        360
      )}] overflow-hidden relative mx-auto`}
    >
      <div className="h-[93.75vh] overflow-y-auto snap-y snap-mandatory">
        {videos.map((video, index) => (
          <section
            key={index}
            className="relative h-[93.75vh] w-full snap-start"
            style={{ backgroundColor: "black" }}
          >
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              src={video.video_url}
              className="absolute inset-0 h-full w-full object-cover"
              loop
              playsInline
              preload="metadata"
              onLoadStart={() =>
                setLoadingVideos((prev) => ({ ...prev, [index]: true }))
              }
              onCanPlay={() =>
                setLoadingVideos((prev) => ({ ...prev, [index]: false }))
              }
              onClick={(e) => {
                const video = e.target;
                if (video.paused) video.play();
                else video.pause();
              }}
              onError={(e) => console.error("Video load error:", e)}
            />
            {loadingVideos[index] && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              </div>
            )}

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

            {/* Tabs */}
            <div className="absolute top-[2vh] w-full flex justify-center gap-[15px]">
              <TabItem
                label="Đã follow"
                isActive={activeTab === "follow"}
                onClick={() => setActiveTab("follow")}
                statusStyle={textStyle}
              />
              <TabItem
                label="Đề xuất"
                isActive={activeTab === "suggestion"}
                onClick={() => setActiveTab("suggestion")}
                statusStyle={textStyle}
              />
            </div>

            {/* Search */}
            <div className="absolute top-[2vh] right-[4.8vw]">
              <SearchIcon onClick={() => navigate("/customer/search")} />
            </div>

            {/* Avatar / Profile */}
            <div className="absolute top-[47.625vh] right-[1.94vw]">
              <img
                style={{
                  width: "4.8rem",
                  height: "4.8rem",
                  borderRadius: 9999,
                  cursor: "pointer",
                }}
                src={video.shop_avatar || "/default-avatar.png"}
                onClick={() => {
                  if (video.shop_id) {
                    navigate("/customer/restaurant-details", {
                      state: { shopId: video.shop_id },
                    });
                  } else {
                    console.warn("⚠️ Không có shop_id trong video:", video);
                  }
                }}
                alt="Restaurant profile"
              />
            </div>

            {/* Author */}
            <div
              className="absolute top-[63vh] left-[3vw]"
              style={{ ...textStyle, fontSize: "1.7rem", fontWeight: 700 }}
            >
              {video.shop_name || "Nhà hàng"}
            </div>

            {/* Caption */}
            <div className="absolute left-[3vw] top-[67.5vh]" style={textStyle}>
              <div style={{ fontSize: "1.5rem" }}>
                {video.title || "Video món ăn hấp dẫn 😋"}
              </div>
              <div style={{ fontSize: "1.4rem", opacity: 0.9 }}>
                ⭐ {video.shop_rating?.toFixed(1) || 0}
              </div>
            </div>

            {/* Icons */}
            <div
              className="absolute top-[56.875vh] right-[4.72vw] flex flex-col items-center"
              style={{ gap: "1.25vh" }}
            >
              <HeartIcon
                fill={likedVideos.has(index) ? "#FF3E5B" : "white"}
                onClick={(e) => handleHeartClick(index, e)}
                style={{ cursor: "pointer" }}
              />
              <div style={countStyle}>
                {formatCount(video.likes_count || likeCounts[index] || 0)}
              </div>

              <CommentIcon onClick={() => setShowMessagePopup(true)} />
              <div style={countStyle}>
                {formatCount(video.comments_count || 0)}
              </div>

              <BookmarkIcon
                fill={bookmarkedVideos.has(index) ? "#F9CE13" : "white"}
                onClick={(e) => handleBookmarkClick(index, e)}
                style={{ cursor: "pointer" }}
              />
              <div style={countStyle}>
                {formatCount(bookmarkCounts[index] || 0)}
              </div>

              <ShareIcon />
            </div>

            {/* Product Card */}
            <div className="absolute bottom-[6vh] left-[3vw]">
              <ProductCart />
            </div>
          </section>
        ))}
      </div>

      <MessagePopup
        isVisible={showMessagePopup}
        onClose={() => setShowMessagePopup(false)}
      />
      <Navbar />
    </div>
  );
};

export default Home;
