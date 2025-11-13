import React, { useState, useEffect } from "react";
import ReportForm from "./ReportForm";

const MessagePopup = ({ isVisible, onClose, videoId }) => {
  const [showReportForm, setShowReportForm] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [newComment, setNewComment] = useState("");

  // 🔥 ALWAYS call hooks – no early return before this
  useEffect(() => {
    if (!isVisible || !videoId) return;   // ✅ check ở đây

    const fetchComments = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/video-comments/video/${videoId}`
        );
        const data = await res.json();

        if (data.success) {
          setReviews(
            data.data.map((c) => ({
              userName: c.username,
              reviewText: c.content,
              timeAgo: "vừa xong",
              avatarSrc: c.avatar_url || "https://placehold.co/40x40",
            }))
          );
          setReviewCount(data.data.length);
        }
      } catch (err) {
        console.log("Fetch comments error:", err);
      }
    };

    fetchComments();
  }, [isVisible, videoId]);   // ✅ thêm isVisible vào deps

const submitComment = async () => {
  if (!newComment.trim() || !videoId) return;

  try {
    const res = await fetch("http://localhost:5000/api/video-comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        video_id: videoId,
        content: newComment,
      }),
    });

    const data = await res.json();

    if (data.success) {
      // Xóa ô input
      setNewComment("");

      // THÊM COMMENT MỚI VÀO UI NGAY
      setReviews((prev) => [
        {
          userName: data.data.username || "Bạn",
          reviewText: data.data.content,
          timeAgo: "vừa xong",
          avatarSrc: data.data.avatar_url || "https://placehold.co/40x40",
        },
        ...prev,
      ]);

      // Tăng tổng số bình luận
      setReviewCount((prev) => prev + 1);
    } else {
      console.log("Error creating comment:", data.message);
    }
  } catch (err) {
    console.log("API error:", err);
  }
};


  // ✅ BÂY GIỜ MỚI ĐƯỢC RETURN SỚM
  if (!isVisible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "flex-end",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          height: "58.5vh",
          background: "white",
          borderTopLeftRadius: "16px",
          borderTopRightRadius: "16px",
          display: "flex",
          flexDirection: "column",
          padding: "16px",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            textAlign: "center",
            fontSize: "1.4rem",
            fontWeight: 600,
            marginBottom: "10px",
            position: "relative",
          }}
        >
          {reviewCount} bình luận
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              background: "none",
              border: "none",
              fontSize: "1.3rem",
            }}
          >
            ✖
          </button>
        </div>

        {/* COMMENT LIST */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            paddingRight: "5px",
          }}
        >
          {reviews.map((review, index) => (
            <div
              key={index}
              style={{
                marginBottom: "16px",
                display: "flex",
                gap: "12px",
              }}
            >
              <img
                src={review.avatarSrc}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                }}
              />

              <div>
                <div
                  style={{
                    fontWeight: "600",
                    fontSize: "1.1rem",
                    marginBottom: "3px",
                  }}
                >
                  {review.userName}
                </div>

                <div style={{ fontSize: "1.25rem", marginBottom: "4px" }}>
                  {review.reviewText}
                </div>

                <div style={{ fontSize: "1rem", color: "#888" }}>
                  {review.timeAgo}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* INPUT COMMENT */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            borderTop: "1px solid #ddd",
            paddingTop: "10px",
          }}
        >
          <input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Viết bình luận..."
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "1.2rem",
            }}
          />

          <button
            onClick={submitComment}
            style={{
              padding: "12px 16px",
              background: "#FE5621",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "1.2rem",
            }}
          >
            Gửi
          </button>
        </div>
      </div>

      <ReportForm
        isVisible={showReportForm}
        onClose={() => setShowReportForm(false)}
      />
    </div>
  );
};

export default MessagePopup;
