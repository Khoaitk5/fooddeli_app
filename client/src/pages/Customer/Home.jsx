import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/shared/Navbar";
import HeartIcon from "../../components/shared/HeartIcon";
import CommentIcon from "../../components/shared/CommentIcon";
import ShareIcon from "../../components/shared/ShareIcon";
import SearchIcon from "../../components/shared/SearchIcon";
import TabItem from "../../components/role-specific/Customer/TabItem.jsx";
import MessagePopup from "../../components/shared/MessagePopup";

// Utility function to format counts (e.g., 1200 -> "1.2K")
const formatCount = (num) => {
  if (num >= 1000000)
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return num.toString();
};

// Default share count
const SHARE_COUNT_DEFAULT = "132.5K";

const Home = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState({});
  const [likedVideos, setLikedVideos] = useState(new Set());
  const [likeCounts, setLikeCounts] = useState({});
  const videoRefs = useRef([]);
  const [activeTab, setActiveTab] = useState("suggestion");
  const [showMessagePopup, setShowMessagePopup] = useState(false);

  // Fetch videos based on user location
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        if (!navigator.geolocation) {
          console.error("Geolocation not supported");
          return;
        }

        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;

            const response = await fetch(
              `http://localhost:5000/api/videos/feed/nearby?lat=${lat}&lng=${lng}`
            );
            const data = await response.json();

            if (data.success) {
              setVideos(data.data);

              // Check like status for each video
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
                  console.warn("Like check failed:", err);
                }
              });

              await Promise.all(checkPromises);
            } else {
              console.error("Failed to fetch videos:", data.message);
            }
          },
          (err) => {
            console.error("Geolocation error:", err);
          },
          { enableHighAccuracy: true }
        );
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchVideos();
  }, []);

  // Auto-play videos using Intersection Observer
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

  // Styles
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

  // Handle like/unlike video
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

        // Update likes count
        setLikeCounts((prev) => ({
          ...prev,
          [videoIndex]: (video.likes_count || 0) + (isLiked ? -1 : 1),
        }));
      } else {
        console.warn("Like/unlike failed:", data.message);
      }
    } catch (err) {
      console.error("API error:", err);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      videoRefs.current.forEach((video) => {
        if (video) video.pause();
      });
    };
  }, []);

  return (
    <>
      <div
        style={{
          height: "100%",
          width: "100%",
          overflow: "hidden",
          position: "relative",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            height: "93.75vh",
            overflowY: "auto",
            scrollSnapType: "y mandatory",
          }}
        >
          {videos.map((video, index) => (
            <section
              key={index}
              style={{
                position: "relative",
                height: "93.75vh",
                width: "100%",
                scrollSnapAlign: "start",
                backgroundColor: "black",
              }}
            >
              <video
                ref={(el) => (videoRefs.current[index] = el)}
                src={video.video_url}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: "100%",
                  width: "100%",
                  objectFit: "cover",
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
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                  }}
                >
                  <div
                    style={{
                      borderRadius: "50%",
                      height: "3rem",
                      width: "3rem",
                      borderBottom: "2px solid white",
                    }}
                  ></div>
                </div>
              )}

              {/* Overlay gradient */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background:
                    "linear-gradient(to top, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.3) 30%, transparent 50%, rgba(0, 0, 0, 0.2) 85%, rgba(0, 0, 0, 0.4) 100%)",
                  pointerEvents: "none",
                }}
              />

              {/* Tabs */}
              <div
                style={{
                  position: "absolute",
                  top: "2vh",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  gap: "15px",
                }}
              >
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
              <div
                style={{
                  position: "absolute",
                  top: "2vh",
                  right: "4.8vw",
                }}
              >
                <SearchIcon onClick={() => navigate("/customer/search")} />
              </div>

              {/* Author */}
              <div
                style={{
                  position: "absolute",
                  top: "74.5vh",
                  left: "2.78vw",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <div
                  style={{
                    color: "white",
                    fontSize: "1.7rem",
                    fontWeight: "700",
                    fontFamily: "Be Vietnam Pro",
                    textShadow: "0 2px 8px rgba(0, 0, 0, 0.8)",
                    letterSpacing: "-0.3px",
                  }}
                >
                  {video.shop_name || "Nhà hàng"}
                </div>
                <div
                  style={{
                    width: "1.2rem",
                    height: "1.2rem",
                    borderRadius: "50%",
                    backgroundColor: "#1DA1F2",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.8rem",
                    color: "white",
                    fontWeight: "bold",
                  }}
                  title="Đã xác thực"
                >
                  ✓
                </div>
              </div>

              {/* Caption */}
              <div
                style={{
                  ...captionTextStyle,
                  position: "absolute",
                  left: "2.78vw",
                  top: "78.25vh",
                  width: "81.94vw",
                }}
              >
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "500",
                    lineHeight: "1.4",
                    textShadow: "0 2px 8px rgba(0, 0, 0, 0.8)",
                  }}
                >
                  {video.title || "Video món ăn hấp dẫn 😋"}
                </div>
                <div
                  style={{
                    fontSize: "1.35rem",
                    fontWeight: "600",
                    marginTop: "0.4rem",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    backgroundColor: "rgba(254, 86, 33, 0.9)",
                    padding: "0.3rem 0.7rem",
                    borderRadius: "1rem",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  <span style={{ fontSize: "1.2rem" }}>⭐</span>
                  <span>{video.shop_rating?.toFixed(1) || "0.0"}</span>
                </div>
              </div>

              {/* Profile and Icons Container */}
              <div
                style={{
                  position: "absolute",
                  top: "56.75vh",
                  right: "1.94vw",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "1.875vh",
                }}
              >
                {/* Profile */}
                <div
                  style={{
                    position: "relative",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    if (video.shop_id) {
                      navigate("/customer/restaurant-details", {
                        state: { shopId: video.shop_id },
                      });
                    } else {
                      console.warn("No shop_id found:", video);
                    }
                  }}
                >
                  <img
                    style={{
                      width: "4.8rem",
                      height: "4.8rem",
                      borderRadius: "50%",
                      border: "2.5px solid white",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
                      objectFit: "cover",
                    }}
                    src={video.shop_avatar || "/default-avatar.png"}
                    alt="Restaurant profile"
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-0.5rem",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "1.8rem",
                      height: "1.8rem",
                      borderRadius: "50%",
                      backgroundColor: "#FE5621",
                      border: "2px solid white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      color: "white",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    +
                  </div>
                </div>

                {/* Icons */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "1.875vh",
                  }}
                >
                  {/* Like */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "0.5vh",
                    }}
                  >
                    <div
                      style={{
                        cursor: "pointer",
                        transition: "transform 0.2s ease",
                      }}
                      onClick={(e) => handleHeartClick(index, e)}
                      onMouseDown={(e) => {
                        e.currentTarget.style.transform = "scale(0.9)";
                      }}
                      onMouseUp={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      <HeartIcon
                        fill={likedVideos.has(index) ? "#FF3E5B" : "white"}
                        style={{ 
                          cursor: "pointer",
                          filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4))",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        ...countStyle,
                        fontWeight: "700",
                        fontSize: "1.3rem",
                      }}
                    >
                      {formatCount(
                        likeCounts[index] !== undefined
                          ? likeCounts[index]
                          : video.likes_count || 0
                      )}
                    </div>
                  </div>

                  {/* Comment */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "0.5vh",
                    }}
                  >
                    <div
                      style={{
                        cursor: "pointer",
                        transition: "transform 0.2s ease",
                      }}
                      onClick={() => setShowMessagePopup(true)}
                      onMouseDown={(e) => {
                        e.currentTarget.style.transform = "scale(0.9)";
                      }}
                      onMouseUp={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      <CommentIcon
                        style={{
                          filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4))",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        ...countStyle,
                        fontWeight: "700",
                        fontSize: "1.3rem",
                      }}
                    >
                      {formatCount(video.comments_count || 0)}
                    </div>
                  </div>

                  {/* Share */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "0.5vh",
                    }}
                  >
                    <div
                      style={{
                        cursor: "pointer",
                        transition: "transform 0.2s ease",
                      }}
                      onMouseDown={(e) => {
                        e.currentTarget.style.transform = "scale(0.9)";
                      }}
                      onMouseUp={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      <ShareIcon
                        style={{
                          filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4))",
                        }}
                      />
                    </div>
                  </div>
                </div>
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