import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import HeartIcon from "../../components/shared/HeartIcon";
import CommentIcon from "../../components/shared/CommentIcon";
import ShareIcon from "../../components/shared/ShareIcon";
import MessagePopup from "../../components/shared/MessagePopup";
import BackArrow from "../../components/shared/BackArrow";

// Utility function to format counts (e.g., 1200 -> "1.2K")
const formatCount = (num) => {
  if (num >= 1000000)
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return num.toString();
};

// Default share count
const SHARE_COUNT_DEFAULT = "132.5K";

const VideoDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [video, setVideo] = useState(location.state?.video);
  const [loadingVideo, setLoadingVideo] = useState(true);
  const [likedVideo, setLikedVideo] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const videoRef = useRef(null);
  const [showMessagePopup, setShowMessagePopup] = useState(false);

  // Load video and data
  useEffect(() => {
    const loadVideo = async () => {
      let currentVideo = video;
      if (!currentVideo && id) {
        try {
          const res = await fetch(`http://localhost:5000/api/videos/${id}`);
          const data = await res.json();
          if (data.success) {
            currentVideo = data.data;
            setVideo(currentVideo);
          } else {
            navigate("/customer/home");
            return;
          }
        } catch (err) {
          console.error("Fetch video failed:", err);
          navigate("/customer/home");
          return;
        }
      } else if (!currentVideo) {
        navigate("/customer/home");
        return;
      }

      // Check like status
      const checkLikeStatus = async () => {
        try {
          const res = await fetch(
            "http://localhost:5000/api/video-likes/check",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ video_id: currentVideo.video_id }),
            }
          );
          const result = await res.json();
          if (result.success) {
            setLikedVideo(result.liked);
          }
        } catch (err) {
          console.warn("Like check failed:", err);
        }
      };

      checkLikeStatus();
      setLikeCount(currentVideo.likes_count || 0);

      // Fetch comment count
      const fetchCommentCount = async () => {
        try {
          const res = await fetch(
            `http://localhost:5000/api/video-comments/video/${currentVideo.video_id}`
          );
          const cmt = await res.json();
          if (cmt.success) {
            setCommentCount(cmt.data.length);
          }
        } catch (err) {
          console.log("Fetch comment count failed:", err);
        }
      };

      fetchCommentCount();
    };

    loadVideo();
  }, [video, id, navigate]);

  // Handle share video
  const handleShare = async () => {
    if (!video) return;
    const shareUrl = `${window.location.origin}/customer/home?video=${video.video_id}`;
    const shareData = {
      title: video.title || "Video món ăn hấp dẫn",
      text: "Check out this video!",
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Share failed:", err);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copied to clipboard!");
      } catch (err) {
        console.log("Copy failed:", err);
        alert("Unable to share or copy link.");
      }
    }
  };

  // Styles
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
  const handleHeartClick = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!video || !video.video_id) return;

    const isLiked = likedVideo;
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
        setLikedVideo(!isLiked);
        setLikeCount((prev) => prev + (isLiked ? -1 : 1));
      } else {
        console.warn("Like/unlike failed:", data.message);
      }
    } catch (err) {
      console.error("API error:", err);
    }
  };

  if (!video) return null;

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
            height: "100vh",
            overflowY: "auto",
            scrollSnapType: "y mandatory",
          }}
        >
          <section
            style={{
              position: "relative",
              height: "100vh",
              width: "100%",
              scrollSnapAlign: "start",
              backgroundColor: "black",
            }}
          >
            <video
              ref={videoRef}
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
              onLoadStart={() => setLoadingVideo(true)}
              onCanPlay={() => setLoadingVideo(false)}
              onClick={(e) => {
                const videoEl = e.target;
                if (videoEl.paused) {
                  videoEl.play();
                } else {
                  videoEl.pause();
                }
              }}
              onError={(e) => console.error("Video load error:", e)}
            />
            {loadingVideo && (
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
                  "linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent, transparent)",
                pointerEvents: "none",
              }}
            />

            {/* Back Arrow */}
            <div
              style={{
                position: "absolute",
                top: "2vh",
                left: "4.8vw",
                zIndex: 10,
              }}
            >
              <BackArrow
                onClick={() => navigate(-1)}
                style={{ color: "white" }}
              />
            </div>

            {/* Author */}
            <div
              style={{
                position: "absolute",
                top: "74.5vh",
                left: "2.78vw",
                color: "white",
                fontSize: "1.7rem",
                fontWeight: "600",
                fontFamily: "Be Vietnam Pro",
              }}
            >
              {video.shop_name || "Nhà hàng"}
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
                  fontWeight: "400",
                }}
              >
                {video.title || "Video món ăn hấp dẫn 😋"}
              </div>
              <div
                style={{
                  fontSize: "1.4rem",
                  opacity: 0.9,
                  fontWeight: 700
                }}
              >
                ⭐ {video.shop_rating?.toFixed(1) || 0}
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
                    console.warn("No shop_id found:", video);
                  }
                }}
                alt="Restaurant profile"
              />

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
                    gap: "1vh",
                  }}
                >
                  <HeartIcon
                    fill={likedVideo ? "#FF3E5B" : "white"}
                    onClick={handleHeartClick}
                    style={{ cursor: "pointer" }}
                  />
                  <div style={countStyle}>
                    {formatCount(likeCount)}
                  </div>
                </div>

                {/* Comment */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "1vh",
                  }}
                >
                  <CommentIcon onClick={() => setShowMessagePopup(true)} />
                  <div style={countStyle}>
                    {formatCount(commentCount)}
                  </div>
                </div>

                {/* Share */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "1vh",
                  }}
                >
                  <div
                    style={{
                      cursor: "pointer",
                      transition: "transform 0.2s ease",
                    }}
                    onClick={handleShare}
                    onMouseDown={(e) => {
                      e.currentTarget.style.transform = "scale(0.9)";
                    }}
                    onMouseUp={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    <ShareIcon />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <MessagePopup
        isVisible={showMessagePopup}
        onClose={() => setShowMessagePopup(false)}
      />
    </>
  );
};

export default VideoDetail;