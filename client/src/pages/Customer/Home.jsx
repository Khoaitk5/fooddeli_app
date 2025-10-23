import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/shared/Navbar";
import HeartIcon from "../../components/shared/HeartIcon";
import CommentIcon from "../../components/shared/CommentIcon";
import BookmarkIcon from "../../components/shared/BookmarkIcon";
import ShareIcon from "../../components/shared/ShareIcon";
import SearchIcon from "../../components/shared/SearchIcon";
import ProductCardForVideo from "../../components/role-specific/Customer/ProductCardForVideo.jsx";
import TabItem from "../../components/role-specific/Customer/TabItem.jsx";
import MessagePopup from "../../components/shared/MessagePopup";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase/firebaseConfig";

// 🔹 Utility function to format counts (e.g., 1200 -> "1.2K")
const formatCount = (count) => {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return count.toString();
};

const Home = ({ reviewCount = "100K", shareCount = "132,5K" }) => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState({});
  const [visibleVideos, setVisibleVideos] = useState(new Set([0, 1, 2])); // Chỉ load 3 video đầu tiên
  const [likedVideos, setLikedVideos] = useState(new Set());
  const [likeCounts, setLikeCounts] = useState({});
  const [bookmarkedVideos, setBookmarkedVideos] = useState(new Set());
  const [bookmarkCounts, setBookmarkCounts] = useState({});
  const videoRefs = useRef([]);
  const [activeTab, setActiveTab] = useState("suggestion");
  const [showMessagePopup, setShowMessagePopup] = useState(false);
  const scrollTimeoutRef = useRef(null);

  // 🔹 Hàm lấy thông tin shop từ video
  const getShopDataFromVideo = (videoName) => {
    const name = videoName.toLowerCase();

    // 🔹 KFC videos - phân biệt theo món ăn
    if (name.includes('kfc')) {
      if (name.includes('garan') || name.includes('chicken')) {
        return {
          shopName: "KFC Việt Nam",
          shopAvatar: "https://upload.wikimedia.org/wikipedia/sco/thumb/b/bf/KFC_logo.svg/1200px-KFC_logo.svg.png",
          shopRoute: "/customer/restaurant/kfc",
          caption: {
            text: "Gà rán giòn tan, quyện thêm xốt mắm tỏi đậm đà, cay cay, ngọt ngọt, thơm nồng nàn từ tỏi và ớt. 😉",
            hashtags: "#fyp #kfc #gaxotmamtoi"
          }
        };
      } else if (name.includes('burger') || name.includes('sandwich')) {
        return {
          shopName: "KFC Việt Nam",
          shopAvatar: "https://upload.wikimedia.org/wikipedia/sco/thumb/b/bf/KFC_logo.svg/1200px-KFC_logo.svg.png",
          shopRoute: "/customer/restaurant/kfc",
          caption: {
            text: "Burger KFC với lớp thịt gà giòn tan, rau tươi và sốt đặc trưng. Hương vị tuyệt đỉnh! 🍔",
            hashtags: "#fyp #kfc #burgerkfc"
          }
        };
      } else {
        // Default KFC caption
        return {
          shopName: "KFC Việt Nam",
          shopAvatar: "https://upload.wikimedia.org/wikipedia/sco/thumb/b/bf/KFC_logo.svg/1200px-KFC_logo.svg.png",
          shopRoute: "/customer/restaurant/kfc",
          caption: {
            text: "Đặt món KFC yêu thích của bạn ngay hôm nay! Giao hàng tận nơi với chất lượng đảm bảo. 🍗",
            hashtags: "#fyp #kfc #fooddelivery"
          }
        };
      }
    }

    // 🔹 Lotteria videos - phân biệt theo món ăn
    else if (name.includes('lotteria')) {
      if (name.includes('burger') || name.includes('sandwich')) {
        return {
          shopName: "Lotteria Việt Nam",
          shopAvatar: "/lotteria_logo.png",
          shopRoute: "/customer/restaurant/lotteria",
          caption: {
            text: "Burger thơm ngon với thịt bò tươi, rau xanh và sốt đặc biệt. Thử ngay hôm nay! 🍔",
            hashtags: "#fyp #lotteria #burger"
          }
        };
      } else if (name.includes('ga') || name.includes('chicken')) {
        return {
          shopName: "Lotteria Việt Nam",
          shopAvatar: "/lotteria_logo.png",
          shopRoute: "/customer/restaurant/lotteria",
          caption: {
            text: "Cánh gà giòn Lotteria với gia vị đặc trưng. Vừa giòn vừa ngon, ăn hoài không chán! 🍗",
            hashtags: "#fyp #lotteria #gachien"
          }
        };
      } else {
        // Default Lotteria caption
        return {
          shopName: "Lotteria Việt Nam",
          shopAvatar: "/lotteria_logo.png",
          shopRoute: "/customer/restaurant/lotteria",
          caption: {
            text: "Lotteria - Hương vị Mỹ tại Việt Nam. Đặt hàng ngay để thưởng thức các món ăn hấp dẫn!",
            hashtags: "#fyp #lotteria #fastfood"
          }
        };
      }
    }

    // 🔹 Default shop
    else {
      return {
        shopName: "Shop Demo",
        shopAvatar: "/default_shop.png",
        shopRoute: "/customer/restaurant/demo",
        caption: {
          text: "Món ăn ngon đang chờ bạn khám phá! Hãy thử ngay để cảm nhận hương vị tuyệt vời.",
          hashtags: "#fyp #food #delicious"
        }
      };
    }
  };

  // 🔹 Hàm load thêm videos khi scroll
  const loadMoreVideos = (currentIndex) => {
    const nextBatch = [];
    for (let i = currentIndex + 1; i <= currentIndex + 2 && i < videos.length; i++) { // Load 2 video một lần
      nextBatch.push(i);
    }
    if (nextBatch.length > 0) {
      setVisibleVideos(prev => {
        const newVisible = new Set([...prev, ...nextBatch]);
        // Giới hạn tối đa 10 videos trong memory
        if (newVisible.size > 10) {
          const toRemove = Array.from(newVisible).slice(0, newVisible.size - 10);
          toRemove.forEach(index => {
            // Pause và remove video refs cho videos cũ
            if (videoRefs.current[index]) {
              videoRefs.current[index].pause();
              videoRefs.current[index] = null;
            }
          });
          return new Set(Array.from(newVisible).slice(-10));
        }
        return newVisible;
      });
    }
  };

  // 🔹 Fetch video list từ Firebase Storage
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const folderRef = ref(storage, "videos/shop_video/");
        const res = await listAll(folderRef);
        const videoData = await Promise.all(
          res.items.slice(0, 10).map(async (itemRef) => { // Giới hạn 10 video đầu tiên
            const url = await getDownloadURL(itemRef);
            // 🔹 Tạo dữ liệu shop cho mỗi video (có thể lấy từ filename hoặc database)
            const shopData = getShopDataFromVideo(itemRef.name);
            return { 
              name: itemRef.name, 
              url,
              shopName: shopData.shopName,
              shopAvatar: shopData.shopAvatar,
              shopRoute: shopData.shopRoute,
              caption: shopData.caption
            };
          })
        );
        setVideos(videoData.reverse()); // hiển thị video mới nhất trước
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
    fetchVideos();
  }, []);

  // 🔹 Xử lý auto-play theo Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          const index = videoRefs.current.indexOf(video);
          if (entry.isIntersecting) {
            // Pause các video khác
            videoRefs.current.forEach((v, i) => {
              if (v && i !== index) v.pause();
            });
            video.play().catch(() => {});

            // 🔹 Load thêm videos khi scroll gần đến video cuối cùng đang hiển thị
            const maxVisibleIndex = Math.max(...Array.from(visibleVideos));
            if (index >= maxVisibleIndex - 1) { // Trigger khi cách video cuối 1 video
              if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
              scrollTimeoutRef.current = setTimeout(() => {
                loadMoreVideos(maxVisibleIndex);
              }, 200); // Debounce 200ms
            }
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.5, rootMargin: '100px' } // Thêm rootMargin để load sớm hơn
    );

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      videoRefs.current.forEach((video) => {
        if (video) observer.unobserve(video);
      });
    };
  }, [videos, visibleVideos]);

  // 🔹 Styles
  const statusStyle = {
    color: "white",
    fontSize: "1.8rem",
    fontWeight: "700",
    wordWrap: "break-word",
  };

  const countStyle = {
    textAlign: "center",
    color: "white",
    fontSize: "1.2rem",
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

  // 🔹 Cleanup khi component unmount
  useEffect(() => {
    return () => {
      // Pause tất cả videos khi component unmount
      videoRefs.current.forEach((video) => {
        if (video) video.pause();
      });
      // Clear timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <div
        style={{
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
        {videos
          .map((video, originalIndex) => ({ video, originalIndex }))
          .filter(({ originalIndex }) => visibleVideos.has(originalIndex))
          .map(({ video, originalIndex }) => (
          <section
            key={originalIndex}
            style={{
              position: 'relative',
              height: '93.75vh',
              width: '100%',
              scrollSnapAlign: 'start',
              backgroundColor: 'black'
            }}
          >
            <video
              ref={(el) => (videoRefs.current[originalIndex] = el)}
              src={video.url}
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
              preload={visibleVideos.has(originalIndex) ? "metadata" : "none"}
              onLoadStart={() =>
                setLoadingVideos((prev) => ({ ...prev, [originalIndex]: true }))
              }
              onCanPlay={() =>
                setLoadingVideos((prev) => ({ ...prev, [originalIndex]: false }))
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
            {loadingVideos[originalIndex] && (
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
                src={video.shopAvatar}
                onClick={() => navigate(video.shopRoute)}
                alt="Restaurant profile"
              />
            </div>

            {/* Author */}
            <div style={{
              position: 'absolute',
              top: '63.75vh',
              left: '2.78vw',
              color: 'white',
              fontSize: '1.7rem',
              fontWeight: '600',
              fontFamily: 'Be Vietnam Pro'
            }}>
              {video.shopName}
            </div>

            {/* Caption */}
            <div style={{
              position: 'absolute',
              left: '2.78vw',
              top: '67.5vh',
              color: 'white',
              width: "81.94vw"
            }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: '400'
              }}>
                {video.caption.text}
              </div>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: '600'
              }}>{video.caption.hashtags}</div>
            </div>

            {/* Icons */}
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
                fill={likedVideos.has(originalIndex) ? "#FF3E5B" : "white"}
                onClick={(e) => handleHeartClick(originalIndex, e)}
                style={{ cursor: "pointer" }}
              />
              <div style={countStyle}>{formatCount(likeCounts[originalIndex] || 0)}</div>
            </div>

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
            <div style={countStyle}>{reviewCount}</div>
            </div>

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
                fill={bookmarkedVideos.has(originalIndex) ? "#F9CE13" : "white"}
                onClick={(e) => handleBookmarkClick(originalIndex, e)}
                style={{ cursor: "pointer" }}
              />
              <div style={countStyle}>
                {formatCount(bookmarkCounts[originalIndex] || 0)}
              </div>
            </div>

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
              <div style={countStyle}>{shareCount}</div>
            </div>

            {/* Product Card */}
            <div style={{
              position: 'absolute',
              top: '80.5vh',
              left: '2.78vw'
            }}>
              <ProductCardForVideo />
            </div>
          </section>
        ))}
        {/* Loading indicator khi đang load thêm videos */}
        {visibleVideos.size < videos.length && (
          <div style={{
            height: '93.75vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'black',
            color: 'white',
            fontSize: '1.2rem'
          }}>
            Đang tải thêm videos...
          </div>
        )}
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
