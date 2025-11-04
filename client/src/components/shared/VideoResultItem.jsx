import React, { useRef, useState, useLayoutEffect } from "react";

const VideoResultItem = ({ videos = [] }) => {
  // 👉 Nếu không có dữ liệu thật, không render gì
  if (!videos || videos.length === 0) {
    return (
      <p style={{ textAlign: "center", color: "#777", marginTop: "2rem" }}>
        Không có video phù hợp
      </p>
    );
  }

  // Hàm cắt bớt chữ (giống logic cũ)
  const renderVideoItem = (video) => {
    const [truncatedText, setTruncatedText] = useState(video.title);
    const textRef = useRef(null);

    useLayoutEffect(() => {
      if (textRef.current) {
        const element = textRef.current;
        const lineHeight =
          parseFloat(getComputedStyle(element).lineHeight) || 20;
        const maxHeight = lineHeight * 2;
        const text = video.title || "";

        element.textContent = text;

        if (element.scrollHeight > maxHeight) {
          let low = 0;
          let high = text.length;
          let best = text;

          while (low <= high) {
            const mid = Math.floor((low + high) / 2);
            const truncated = text.substring(0, mid) + "...";
            element.textContent = truncated;

            if (element.scrollHeight <= maxHeight) {
              best = truncated;
              low = mid + 1;
            } else {
              high = mid - 1;
            }
          }

          setTruncatedText(best);
        }
      }
    }, [video.title]);

    return (
      <>
        {/* Ảnh hoặc video thumbnail */}
        <img
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "46.94vw",
            height: "33.75vh",
            borderRadius: 6,
            objectFit: "cover",
          }}
          src={
            video.thumbnail_url ||
            video.video_url ||
            "https://placehold.co/169x270?text=No+Thumbnail"
          }
          alt={video.title}
        />

        {/* Tiêu đề video */}
        <div
          ref={textRef}
          style={{
            position: "absolute",
            top: "34.625vh",
            left: 0,
            width: "46.94vw",
            color: "black",
            fontSize: "1.4rem",
            fontWeight: "400",
          }}
        >
          {truncatedText}
        </div>

        {/* Avatar + Tên cửa hàng */}
        <img
          style={{
            position: "absolute",
            top: "40.5vh",
            left: 0,
            width: "5.28vw",
            height: "5.28vw",
            borderRadius: 9999,
          }}
          src={"https://placehold.co/19x19"} // 🧠 Bạn có thể thay bằng video.avatar nếu có
          alt="avatar"
        />

        <div
          style={{
            position: "absolute",
            top: "40.875vh",
            left: "7.23vw",
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
            color: "#7B7B7B",
            fontSize: "1.2rem",
            fontWeight: "400",
            wordWrap: "break-word",
          }}
        >
          {video.shopName || `Cửa hàng #${video.shop_id}`}
        </div>
      </>
    );
  };

  // ✅ Giữ nguyên cách hiển thị 2 cột (như bạn đang có)
  const rows = Math.ceil(videos.length / 2);
  const containerHeight =
    rows === 1 ? "45vh" : (rows - 1) * 47.75 + 45 + "vh";

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `::-webkit-scrollbar { display: none; }` }} />
      <div style={{ position: "relative", height: containerHeight, overflow: "auto" }}>
        {videos.map((video, index) => {
          const isLeft = index % 2 === 0;
          const left = isLeft ? "1.94vw" : undefined;
          const right = !isLeft ? "1.94vw" : undefined;
          const top = Math.floor(index / 2) * 47.75 + "vh";
          return (
            <div
              key={video.video_id || index}
              style={{
                position: "absolute",
                left: left,
                right: right,
                top: top,
                width: "46.94vw",
                height: "auto",
              }}
            >
              {renderVideoItem(video)}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default VideoResultItem;
