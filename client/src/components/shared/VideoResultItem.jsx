import React, { useRef, useState, useLayoutEffect } from "react";

const VideoResultItem = ({}) => {
  const videos = [
    {
      videoTitle: "🔥Combo 3 miếng gà + khoai + 2 Pepsi CHỈ 89k",
      ownerName: "KFC Việt Nam",
      videoSrc: "https://placehold.co/169x270",
      avatarSrc: "https://placehold.co/19x19"
    },
    {
      videoTitle: "🍔Burger siêu ngon chỉ 50k",
      ownerName: "McDonald's VN",
      videoSrc: "https://placehold.co/169x270",
      avatarSrc: "https://placehold.co/19x19"
    },
    {
      videoTitle: "🍕Pizza hải sản tươi ngon",
      ownerName: "Domino's Pizza",
      videoSrc: "https://placehold.co/169x270",
      avatarSrc: "https://placehold.co/19x19"
    },
    {
      videoTitle: "🥤Trà sữa trân châu đường đen",
      ownerName: "Gong Cha",
      videoSrc: "https://placehold.co/169x270",
      avatarSrc: "https://placehold.co/19x19"
    }
  ];

  const renderVideoItem = (video, left, top) => {
    const [truncatedText, setTruncatedText] = useState(video.videoTitle);
    const textRef = useRef(null);

    useLayoutEffect(() => {
      if (textRef.current) {
        const element = textRef.current;
        const lineHeight = parseFloat(getComputedStyle(element).lineHeight) || 20;
        const maxHeight = lineHeight * 2;
        const text = video.videoTitle;

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
    }, [video.videoTitle]);

    return (
      <>
        <img
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "46.94vw",
            height: "33.75vh",
            borderRadius: 6,
          }}
          src={video.videoSrc}
        />

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

        <img
          style={{
            position: "absolute",
            top: "40.5vh",
            left: 0,
            width: "5.28vw",
            height: "5.28vw",
            borderRadius: 9999,
          }}
          src={video.avatarSrc}
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
          {video.ownerName}
        </div>
      </>
    );
  };

  const rows = Math.ceil(videos.length / 2);
  const containerHeight = rows === 1 ? '45vh' : (rows - 1) * 47.75 + 45 + 'vh';

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `::-webkit-scrollbar { display: none; }`}} />
      <div style={{ position: 'relative', height: containerHeight, overflow: 'auto' }}>
      {videos.map((video, index) => {
        const isLeft = index % 2 === 0;
        const left = isLeft ? '1.94vw' : undefined;
        const right = !isLeft ? '1.94vw' : undefined;
        const top = Math.floor(index / 2) * 47.75 + 'vh';
        return (
          <div key={index} style={{ position: 'absolute', left: left, right: right, top: top, width: '46.94vw', height: 'auto' }}>
            {renderVideoItem(video)}
          </div>
        );
      })}
    </div>
    </>
  );
};

export default VideoResultItem;
