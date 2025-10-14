import React from "react";
import { pxW, pxH } from "../../utils/scale.js";
import StarIcon from "../../components/shared/StarIcon";
import HeartIcon2 from "../../components/shared/HeartIcon2";
import MoreIcon from "../../components/shared/MoreIcon";

const MessagePopup = ({ isVisible, onClose, reviewCount = 10, reviews = [
  {
    userName: "someone",
    reviewText: "ngon lắm nha, phần này siêu nhiều, 2 người ăn không hết đâu",
    timeAgo: "6 tiếng trước",
    likeCount: 461,
    avatarSrc: "https://placehold.co/33x33",
    imageSrc: null,
    rating: 5
  },
  {
    userName: "user2",
    reviewText: "Đồ ăn rất ngon, phục vụ nhanh chóng!",
    timeAgo: "2 giờ trước",
    likeCount: 123,
    avatarSrc: "https://placehold.co/34x34",
    imageSrc: null,
    rating: 4
  },
  {
    userName: "foodie123",
    reviewText: "Giá cả hợp lý, sẽ quay lại lần sau.",
    timeAgo: "1 ngày trước",
    likeCount: 89,
    avatarSrc: "https://placehold.co/35x35",
    imageSrc: null,
    rating: 5
  }
] }) => {
  if (!isVisible) return null;

  const primaryTextStyle = {
    color: "#151923",
    fontSize: "1.515rem",
    fontWeight: "400",
    wordWrap: "break-word",
  };

  const secondaryTextStyle = {
    color: "#8A8B8F",
    fontSize: "1.1rem",
    fontWeight: "400",
    wordWrap: "break-word",
  };

  const titleTextStyle = {
    textAlign: "center",
    color: "#151923",
    fontSize: "1.32rem",
    fontWeight: "600",
    wordWrap: "break-word",
  };

  const userNameStyle = {
    justifyContent: "center",
    display: "flex",
    flexDirection: "column",
    color: "#8A8B8F",
    fontSize: "1.303rem",
    fontWeight: "500",
    wordWrap: "break-word",
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "flex-end",
        zIndex: 1000,
      }}
      onClick={onClose} // Close on overlay click
    >
      <div
        style={{
          width: "100%",
          height: "58.5vh",
          background: "white",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          position: "relative",
          padding: "20px",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "2.125vh",
            right: "3.89vw",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          <svg
            width="1.2rem"
            height="1.2rem"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M4.78781 6L0.125515 1.3377C-0.0418382 1.17034 -0.0418382 0.898968 0.125515 0.731611L0.731643 0.125524C0.899 -0.0418415 1.17033 -0.0418415 1.33773 0.125524L5.99998 4.78783L10.6623 0.125524C10.8296 -0.0418415 11.101 -0.0418415 11.2684 0.125524L11.8744 0.731611C12.0419 0.898968 12.0419 1.17034 11.8744 1.3377L7.2122 6L11.8744 10.6623C12.0419 10.8297 12.0419 11.101 11.8744 11.2684L11.2684 11.8745C11.101 12.0418 10.8296 12.0418 10.6623 11.8745L5.99998 7.21218L1.33773 11.8745C1.17033 12.0418 0.899 12.0418 0.731643 11.8745L0.125515 11.2684C-0.0418382 11.101 -0.0418382 10.8297 0.125515 10.6623L4.78781 6Z"
              fill="#151923"
            />
          </svg>
        </button>

        <div
          style={{
            ...titleTextStyle,
            position: "absolute",
            top: "2vh",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          {reviewCount} đánh giá
        </div>

        {reviews.map((review, index) => {
          const baseHeight = review.imageSrc ? 32 : 16; // approximate height in vh
          const offset = reviews.slice(0, index).reduce((acc, r) => acc + (r.imageSrc ? 32 : 16), 0);
          return (
            <>
              <img
                style={{
                  position: "absolute",
                  top: `calc(6.625vh + ${offset}vh)`,
                  left: "3.33vw",
                  width: "9.17vw",
                  height: "9.17vw",
                  borderRadius: 9999,
                }}
                src={review.avatarSrc}
              />

              <div
                style={{
                  ...userNameStyle,
                  position: "absolute",
                  top: `calc(6.625vh + ${offset}vh)`,
                  left: "15vw",
                }}
              >
                {review.userName}
              </div>

              <div
                style={{
                  position: "absolute",
                  top: `calc(6.625vh + ${offset}vh)`,
                  right: "5.17vw",
                }}
              >
                <MoreIcon />
              </div>

              {review.imageSrc && (
                <div
                  style={{
                    position: "absolute",
                    top: `calc(12vh + ${offset}vh)`,
                    left: "3.33vw",
                    width: "32.5vw",
                    height: "32.5vw",
                    backgroundImage: `url(${review.imageSrc})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderRadius: 14,
                  }}
                />
              )}

              <div
                style={{
                  ...primaryTextStyle,
                  position: "absolute",
                  top: `calc(${review.imageSrc ? 27.875 : 12}vh + ${offset}vh)`,
                  left: "3.33vw",
                  width: "84.14vw",
                }}
              >
                {review.reviewText}
              </div>

              <div
                style={{
                  position: "absolute",
                  top: `calc(9.25vh + ${offset}vh)`,
                  left: "15vw",
                  gap: "0.56vw",
                  display: "flex",
                }}
              >
                {Array.from({ length: 5 }, (_, i) => (
                  <StarIcon key={i} fill={i < review.rating ? "#FFD700" : "#D9D9D9"} />
                ))}
              </div>

              <div
                style={{
                  ...secondaryTextStyle,
                  position: "absolute",
                  top: `calc(9.125vh + ${offset}vh)`,
                  left: "34.72vw",
                }}
              >
                {review.timeAgo}
              </div>

              <div
                style={{
                  position: "absolute",
                  top: `calc(${review.imageSrc ? 30.75 : 14.875}vh + ${offset}vh)`,
                  right: "12.22vw",
                }}
              >
                <HeartIcon2 />
              </div>

              <div
                style={{
                  ...secondaryTextStyle,
                  position: "absolute",
                  top: `calc(${review.imageSrc ? 30.625 : 14.75}vh + ${offset}vh)`,
                  right: "5.56vw",
                }}
              >
                {review.likeCount}
              </div>
            </>
          );
        })}
      </div>
    </div>
  );
};

export default MessagePopup;
