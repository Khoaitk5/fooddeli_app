const RecommendItem = ({ image, title, distance }) => {
  return (
    <div
      style={{
        width: "26.94vw", // 👈 ~97px khi base 360px
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Ảnh */}
      <img
        style={{
          width: "26.94vw",
          aspectRatio: "1 / 1", // 👈 luôn vuông
          borderRadius: 14,
          objectFit: "cover",
        }}
        src={image || "https://placehold.co/97x97"}
        alt={title}
      />

      {/* Tên */}
      <div
        style={{
          marginTop: "1vh",
          width: "100%",
          textAlign: "center",
          color: "black",
          fontSize: "1.4rem",
          fontFamily: "TikTok Sans",
          fontWeight: "500",
          overflowWrap: "break-word", // 👈 tốt hơn cho responsive
          lineHeight: 1.3,
        }}
      >
        {title}
      </div>

      {/* Khoảng cách */}
      <div
        style={{
          marginTop: "0.5vh",
          width: "100%",
          textAlign: "center",
          color: "#60635E",
          fontSize: "1.1rem",
          fontFamily: "TikTok Sans",
          fontWeight: "500",
        }}
      >
        {distance}
      </div>
    </div>
  );
};

export default RecommendItem;
