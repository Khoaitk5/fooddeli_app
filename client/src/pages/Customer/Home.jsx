import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/shared/Navbar";
import HeartIcon from "../../components/shared/HeartIcon";
import CommentIcon from "../../components/shared/CommentIcon";
import BookmarkIcon from "../../components/shared/BookmarkIcon";
import ShareIcon from "../../components/shared/ShareIcon";
import SearchIcon from "../../components/shared/SearchIcon";
// Sử dụng tên ProductCardForVideo từ file mới, nhưng import gốc là ProductCart
import ProductCardForVideo from "../../components/role-specific/Customer/ProductCardForVideo.jsx"; 
import { pxW, pxH } from "../../utils/scale.js"; // Giữ lại import này nếu style inline vẫn cần. Tuy nhiên tôi sẽ loại bỏ nó ở JSX để dùng vh/vw
import TabItem from "../../components/role-specific/Customer/TabItem.jsx";
import MessagePopup from "../../components/shared/MessagePopup";

// 🔹 Utility function to format counts (e.g., 1200 -> "1.2K") - Lấy từ file mới
const formatCount = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + "M";
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + "K";
  return num.toString();
};

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

  // 🔹 Fetch video list từ Backend (lọc theo vị trí user) - LOGIC GỐC
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

              // ✅ Kiểm tra tym cho từng video (song song)
              const checkPromises = data.data.map(async (video, index) => {
                try {
                  const res = await fetch(
                    "http://localhost:5000/api/video-likes/check",
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      credentials: "include",
                      body: JSON.stringify({ video_id: video.video_id }),
                    }
                  );

                  const result = await res.json();
                  if (result.success && result.liked) {
                    setLikedVideos((prev) => new Set(prev).add(index));
                  }
                } catch (err) {
                  console.warn("⚠️ Lỗi khi kiểm tra like video:", err);
                }
              });

              await Promise.all(checkPromises);
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

  // 🔹 Auto-play video theo Intersection Observer - LOGIC GỐC
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

  // 🔹 Styles (Kết hợp từ hai file)
  const statusStyle = {
    color: "white",
    fontSize: "1.8rem",
    fontWeight: "700",
    wordWrap: "break-word",
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
  
  const captionTextStyle = {
    color: "white",
    fontFamily: "Be Vietnam Pro",
    textShadow: "0 1px 3px rgba(0, 0, 0, 0.8)",
  };

  // 🔹 Xử lý Like - LOGIC GỐC (gọi API)
  const handleHeartClick = async (videoIndex, e) => {
    e.stopPropagation();
    e.preventDefault();

    const video = videos[videoIndex];
    if (!video || !video.video_id) return;

    const isLiked = likedVideos.has(videoIndex);
    const endpoint = isLiked
      ? "http://localhost:5000/api/video-likes/unlike"
      : "http://localhost:5000/api/video-likes/like";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ video_id: video.video_id }),
      });

      const data = await res.json();
      if (data.success) {
        setLikedVideos((prev) => {
          const newSet = new Set(prev);
          if (isLiked) newSet.delete(videoIndex);
          else newSet.add(videoIndex);
          return newSet;
        });

        // ✅ Cập nhật likes_count thực tế
        setLikeCounts((prev) => ({
          ...prev,
          [videoIndex]: (video.likes_count || 0) + (isLiked ? -1 : 1),
        }));
      } else {
        console.warn("⚠️ Lỗi khi tym:", data.message);
      }
    } catch (err) {
      console.error("❌ Lỗi khi gọi API like/unlike:", err);
    }
  };

  // 🔹 Xử lý Bookmark - LOGIC GỐC (cập nhật UI, không có API trong code gốc)
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
          [videoIndex]: Math.max(
            (prevCounts[videoIndex] !== undefined
              ? prevCounts[videoIndex]
              : video.bookmark_counts || 0) - 1,
            0
          ),
        }));
      } else {
        newBookmarked.add(videoIndex);
        setBookmarkCounts((prevCounts) => ({
          ...prevCounts,
          [videoIndex]:
            (prevCounts[videoIndex] !== undefined
              ? prevCounts[videoIndex]
              : video.bookmark_counts || 0) + 1,
        }));
      }
      return newBookmarked;
    });
  };
  
  // 🔹 Cleanup khi component unmount
  useEffect(() => {
    return () => {
      videoRefs.current.forEach((video) => {
        if (video) video.pause();
      });
    };
  }, []);

  // Giá trị mặc định cho count Share và Review (Comment) từ file mới
  const shareCountDefault = "132.5K"; 
  
  return (
    <>
      <div
        style={{
          // Thay thế h-[${pxH(800)}] w-[${pxW(360)}]
          height: "100%",
          width: "100%",
          overflow: 'hidden',
          position: 'relative',
          margin: '0 auto'
        }}
      >
        <div style={{
          height: '93.75vh',
          overflowY: 'auto',
          scrollSnapType: 'y mandatory'
        }}>
          {videos.map((video, index) => (
            <section
              key={index}
              style={{
                position: 'relative',
                height: '93.75vh',
                width: '100%',
                scrollSnapAlign: 'start',
                backgroundColor: 'black'
              }}
            >
              <video
                ref={(el) => (videoRefs.current[index] = el)}
                src={video.video_url} // Dùng video.video_url từ API gốc
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: '100%',
                  width: '100%',
                  objectFit: 'cover'
                }}
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
                  if (video.paused) {
                    video.play();
                  } else {
                    video.pause();
                  }
                }}
                onError={(e) => console.error("Video load error:", e)}
              />
              {loadingVideos[index] && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)'
                }}>
                  <div style={{
                    borderRadius: '50%',
                    height: '3rem',
                    width: '3rem',
                    borderBottom: '2px solid white'
                  }}></div>
                </div>
              )}

              {/* Overlay gradient */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent, transparent)',
                pointerEvents: 'none'
              }} />

              {/* Tabs */}
              <div style={{
                position: 'absolute',
                top: '2vh',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                gap: '15px'
              }}>
                <TabItem
                  label="Đã follow"
                  isActive={activeTab === "follow"}
                  onClick={() => setActiveTab("follow")}
                  statusStyle={statusStyle}
                />
                <TabItem
                  label="Đề xuất"
                  isActive={activeTab === "suggestion"}
                  onClick={() => setActiveTab("suggestion")}
                  statusStyle={statusStyle}
                />
              </div>

              {/* Search */}
              <div style={{
                position: 'absolute',
                top: '2vh',
                right: '4.8vw'
              }}>
                <SearchIcon onClick={() => navigate("/customer/search")} />
              </div>

              {/* Profile */}
              <div style={{
                position: 'absolute',
                top: '47.625vh',
                right: '1.94vw'
              }}>
                <img
                  style={{
                    width: "4.8rem",
                    height: "4.8rem",
                    borderRadius: 9999,
                    cursor: "pointer",
                  }}
                  src={video.shop_avatar || "/default-avatar.png"} // Dùng video.shop_avatar
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
              <div style={{
                position: 'absolute',
                top: '63.75vh', // Vị trí mới
                left: '2.78vw', // Vị trí mới
                color: 'white',
                fontSize: '1.7rem',
                fontWeight: '600',
                fontFamily: 'Be Vietnam Pro'
              }}>
                {video.shop_name || "Nhà hàng"}
              </div>

              {/* Caption */}
              <div style={{
                ...captionTextStyle, 
                position: 'absolute',
                left: '2.78vw', 
                top: '67.5vh',
                width: "81.94vw"
              }}>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: '400'
                }}>
                  {video.title || "Video món ăn hấp dẫn 😋"} 
                </div>
                {/* Hiển thị Rating như logic gốc, style opacity 0.9 */}
                <div style={{ fontSize: "1.4rem", opacity: 0.9, fontWeight: 700 }}>
                  ⭐ {video.shop_rating?.toFixed(1) || 0}
                </div>
              </div>

              {/* Icons */}
              {/* Like */}
              <div
                style={{
                  position: 'absolute',
                  top: '56.875vh',
                  right: '4.72vw',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1.25vh'
                }}
              >
                <HeartIcon
                  fill={likedVideos.has(index) ? "#FF3E5B" : "white"}
                  onClick={(e) => handleHeartClick(index, e)}
                  style={{ cursor: "pointer" }}
                />
                <div style={countStyle}>
                  {formatCount(
                    likeCounts[index] !== undefined
                      ? likeCounts[index]
                      : video.likes_count || 0
                  )}
                </div>
              </div>

              {/* Comment */}
              <div style={{
                position: 'absolute',
                top: '65vh', 
                right: '4.72vw'
              }}>
                <CommentIcon onClick={() => setShowMessagePopup(true)} />
              </div>
              <div style={{
                position: 'absolute',
                top: '69.5vh', 
                right: '4.86vw'
              }}>
                {/* Dùng video.comments_count từ API gốc */}
                <div style={countStyle}>{formatCount(video.comments_count || 0)}</div>
              </div>

              {/* Bookmark */}
              <div
                style={{
                  position: 'absolute',
                  top: '73.25vh', 
                  right: '5.56vw',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1.25vh'
                }}
              >
                <BookmarkIcon
                  fill={bookmarkedVideos.has(index) ? "#F9CE13" : "white"}
                  onClick={(e) => handleBookmarkClick(index, e)}
                  style={{ cursor: "pointer" }}
                />
                <div style={countStyle}>
                  {/* Dùng bookmarkCounts[index] || video.bookmark_counts || 0 */}
                  {formatCount(
                    bookmarkCounts[index] !== undefined
                      ? bookmarkCounts[index]
                      : video.bookmark_counts || 0
                  )}
                </div>
              </div>

              {/* Share */}
              <div style={{
                position: 'absolute',
                top: '81.125vh', 
                right: '4.72vw'
              }}>
                <ShareIcon />
              </div>
              <div style={{
                position: 'absolute',
                top: '85.75vh', 
                right: '3.61vw'
              }}>
                {/* Dùng giá trị mặc định từ file mới */}
                <div style={countStyle}>{shareCountDefault}</div>
              </div>

              {/* Product Card */}
              <div style={{
                position: 'absolute',
                top: '80.5vh', 
                left: '2.78vw'
              }}>
                {/* Dùng ProductCardForVideo (từ file mới) thay cho ProductCart (từ file gốc) */}
                <ProductCardForVideo />
              </div>
            </section>
          ))}
        </div>
      </div>

      <MessagePopup
        isVisible={showMessagePopup}
        onClose={() => setShowMessagePopup(false)}
      />
      <Navbar />
    </>
  );
};

export default Home;