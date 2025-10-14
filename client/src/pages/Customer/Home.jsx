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
import { createClient } from "@supabase/supabase-js";
import TabItem from "../../components/role-specific/Customer/TabItem.jsx";
import MessagePopup from "../../components/shared/MessagePopup";

const supabase = createClient(
  "https://xyngruphcelumtjlmzud.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5bmdydXBoY2VsdW10amxtenVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1NzIyOTUsImV4cCI6MjA3MzE0ODI5NX0.dOpfK9jEzARQJbBmzLjTZ4wtSENsz57Wmu13oP5A6og"
);

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

  useEffect(() => {
    const fetchVideos = async () => {
      const { data, error } = await supabase.storage
        .from("videos")
        .list("user-videos", {
          sortBy: { column: "created_at", order: "desc" },
        });
      if (data) {
        setVideos(data);
      }
    };
    fetchVideos();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          const index = videoRefs.current.indexOf(video);
          if (entry.isIntersecting) {
            // Pause all other videos
            videoRefs.current.forEach((v, i) => {
              if (v && i !== index) v.pause();
            });
            video.play().catch(() => {}); // Ignore play errors
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

  const statusStyle = {
    color: "white",
    fontSize: "1.8rem",
    fontFamily: "Proxima Nova",
    fontWeight: "700",
    wordWrap: "break-word",
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
              src={
                supabase.storage
                  .from("videos")
                  .getPublicUrl(`user-videos/${video.name}`).data.publicUrl
              }
              className="absolute inset-0 h-full w-full object-cover" // 👈 đổi contain -> cover
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
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Follow & Suggestions Tabs */}
            <div className="absolute top-[2vh] w-full flex justify-center gap-[15px]">
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

            {/* Search Icon */}
            <div className="absolute top-[2vh] right-[4.8vw]">
              <SearchIcon onClick={() => navigate('/customer/search')} />
            </div>

            {/* Profile Image */}
            <div className="absolute top-[47.625vh] right-[1.94vw]">
              <img
                style={{
                  width: "4.8rem",
                  height: "4.8rem",
                  borderRadius: 9999,
                  cursor: "pointer",
                }}
                src="/KFC_logo.png"
                onClick={() => navigate("/customer/restaurant/kfc")}
                alt="Restaurant profile"
              />
            </div>

            {/* Author Name */}
            <div className="absolute top-[63.75vh] left-[2.78vw]">
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  justifyContent: "center",
                  display: "flex",
                  flexDirection: "column",
                  color: "white",
                  fontSize: "1.7rem",
                  fontFamily: 'Be Vietnam Pro',
                  fontWeight: "600",
                  wordWrap: "break-word",
                }}
              >
                KFC Việt Nam
              </div>
            </div>

            {/* Caption */}
            <div className="absolute left-[2.78vw] top-[67.5vh]">
              <div
                style={{
                  width: "71.94vw",
                  justifyContent: "center",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <span
                  style={{
                    color: "white",
                    fontSize: "1.5rem",
                    fontFamily: 'Be Vietnam Pro',
                    fontWeight: "400",
                    wordWrap: "break-word",
                  }}
                >
                  Gà rán giòn tan, quyện thêm xốt mắm tỏi đậm đà, cay cay, ngọt
                  ngọt, thơm nồng nàn từ tỏi và ớt. 😉
                  <br />
                </span>
                <span
                  style={{
                    color: "white",
                    fontSize: "1.5rem",
                    fontFamily: 'Be Vietnam Pro',
                    fontWeight: "600",
                    wordWrap: "break-word",
                  }}
                >
                  #fyp #kfc #gaxotmamtoi
                </span>
              </div>
            </div>

            {/* Heart Icon and Count */}
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
                {formatCount(likeCounts[index] || 0)}
              </div>
            </div>

            {/* Comment Icon */}
            <div className="absolute top-[65vh] right-[4.72vw]">
              <CommentIcon onClick={() => setShowMessagePopup(true)} />
            </div>

            {/* Comment Count */}
            <div className="absolute top-[69.5vh] right-[4.86vw]">
              <div style={countStyle}>100K</div>
            </div>

            {/* Bookmark Icon and Count */}
            <div
              className="absolute top-[73.25vh] right-[5.56vw] flex flex-col items-center"
              style={{ gap: "1.25vh" }}
            >
              <BookmarkIcon
                fill={bookmarkedVideos.has(index) ? "#F9CE13" : "white"}
                onClick={(e) => handleBookmarkClick(index, e)}
                style={{ cursor: "pointer" }}
              />
              <div style={countStyle}>
                {formatCount(bookmarkCounts[index] || 0)}
              </div>
            </div>

            {/* Share Icon */}
            <div className="absolute top-[81.125vh] right-[4.72vw]">
              <ShareIcon />
            </div>

            {/* Share Count */}
            <div className="absolute top-[85.75vh] right-[3.61vw]">
              <div style={countStyle}>132,5K</div>
            </div>

            {/* Product Cart */}
            <div className="absolute top-[80.5vh] left-[2.78vw]">
              <ProductCart />
            </div>
          </section>
        ))}
      </div>
      <MessagePopup isVisible={showMessagePopup} onClose={() => setShowMessagePopup(false)} />
      <Navbar />
    </div>
  );
};

export default Home;
