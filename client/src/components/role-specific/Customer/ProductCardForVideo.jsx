import StarIcon from '../../shared/StarIcon';

const ProductCardForVideo = ({ name = "1 Miếng Gà Xốt Mắm Tỏi", imageSrc = "https://static.kfcvietnam.com.vn/images/items/lg/1PCS.jpg?v=gXDAeg", originalPrice = "₫50.000", currentPrice = "40.000 ₫", rating = "4.8", salesCount = "Bán 1M trực tuyến" }) => {
  return (
    <div
      style={{
        width: "76.39vw",
        height: "10vh",
        background: "white",
        borderRadius: "0.8rem",
        position: "relative",
      }}
    >
      <img
        style={{
          width: "20vw",
          height: "9vh",
          borderRadius: "0.6rem",
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          left: "1.11vw",
        }}
        src={imageSrc}
      />
      <div
        style={{
          justifyContent: "center",
          display: "flex",
          flexDirection: "column",
          color: "black",
          fontSize: "1.1rem",
          fontWeight: "500",
          wordWrap: "break-word",
          position: "absolute",
          top: "0.5vh",
          left: "22.5vw",
        }}
      >
        {name}
      </div>
      <div
        style={{
          position: "absolute",
          top: "2.875vh",
          left: "22.5vw",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <StarIcon width="1rem" height="1rem" fill="#868686" />
        <div
          style={{
            color: "#868686",
            fontSize: "1rem",
            fontWeight: "400",
            wordWrap: "break-word",
          }}
        >
          {rating} | {salesCount}
        </div>
      </div>
      <div
        style={{
          justifyContent: "center",
          display: "flex",
          flexDirection: "column",
          color: "#D3D1D8",
          fontSize: "0.9rem",
          fontWeight: "400",
          textDecoration: "line-through",
          wordWrap: "break-word",
          position: "absolute",
          top: "5.125vh",
          left: "22.5vw",
        }}
      >
        {originalPrice}
      </div>
      <div
        style={{
          justifyContent: "center",
          display: "flex",
          flexDirection: "column",
          position: "absolute",
          top: "7.25vh",
          left: "22.5vw",
        }}
      >
        <span
          style={{
            color: "#ED4E30",
            fontSize: "1.5rem",
            fontWeight: "600",
            wordWrap: "break-word",
          }}
        >
          {currentPrice}
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "0.375vh",
          left: "48.78vw",
          right: "1.5vw",
          height: "3vh",
          display: "flex",
        }}
      >
        <div
          style={{
            width: "8.89vw",
            height: "100%",
            background: "#FDEFEF",
            borderTopLeftRadius: 6,
            borderBottomLeftRadius: 6,
          }}
        />
        <div
          style={{
            flex: 1,
            height: "100%",
            background: "#ED4E30",
            borderTopRightRadius: 6,
            borderBottomRightRadius: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              justifyContent: "center",
              display: "flex",
              flexDirection: "column",
              color: "white",
              fontSize: '1.1rem',
              fontWeight: "500",
              wordWrap: "break-word",
            }}
          >
            Mua ngay
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardForVideo;
