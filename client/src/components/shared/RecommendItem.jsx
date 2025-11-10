const RecommendItem = ({ image, title, distance }) => {
  return (
    <div
      style={{
        width: "26.94vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Ảnh */}
      <img
        style={{
          width: "26.94vw",
          aspectRatio: "1 / 1",
          borderRadius: '1.4rem',
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
          fontSize: "1.3rem",
          fontWeight: "500",
          overflowWrap: "break-word",
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
          fontWeight: "500",
        }}
      >
        {distance}
      </div>
    </div>
  );
};

export default RecommendItem;
