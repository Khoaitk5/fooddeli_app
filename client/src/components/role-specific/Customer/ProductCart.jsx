import React from 'react';
import StarIcon from '../../shared/StarIcon';

const ProductCart = () => {
  return (
    <div
      style={{
        width: "76.39vw",
        height: "10vh",
        background: "white",
        borderRadius: 8,
        position: "relative",
      }}
    >
      <img
        style={{
          width: "20vw",
          height: "9vh",
          borderRadius: 4,
          position: "absolute",
          top: "0.5vh",
          left: "1.11vw",
        }}
        src="/1PCS.jpg"
      />
      <div
        style={{
          justifyContent: "center",
          display: "flex",
          flexDirection: "column",
          color: "black",
          fontSize: "1.1rem",
          fontFamily: "TikTok Sans",
          fontWeight: "500",
          wordWrap: "break-word",
          position: "absolute",
          top: "0.5vh",
          left: "22.5vw",
        }}
      >
        1 Miếng Gà Xốt Mắm Tỏi
      </div>
      <div
        style={{
          width: "33.06vw",
          height: "1.875vh",
          background: "#FDEEE7",
          borderRadius: 4,
          position: "absolute",
          top: "2.5vh",
          left: "22.5vw",
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
            color: "black",
            fontSize: "1rem",
            fontFamily: "TikTok Sans",
            fontWeight: "400",
            wordWrap: "break-word",
          }}
        >
          Flash Sale 12:00:00
        </div>
      </div>
      <div
        style={{
          justifyContent: "center",
          display: "flex",
          flexDirection: "column",
          color: "#868686",
          fontSize: "1rem",
          fontFamily: "TikTok Sans",
          fontWeight: "400",
          wordWrap: "break-word",
          position: "absolute",
          top: "4.625vh",
          left: "25.56vw",
        }}
      >
        4.8 | Bán 1M trực tuyến
      </div>
      <div
        style={{
          position: "absolute",
          top: "4.875vh",
          left: "22.5vw",
        }}
      >
        <StarIcon />
      </div>
      <div
        style={{
          justifyContent: "center",
          display: "flex",
          flexDirection: "column",
          color: "#D3D1D8",
          fontSize: "0.9rem",
          fontFamily: "TikTok Sans",
          fontWeight: "400",
          textDecoration: "line-through",
          wordWrap: "break-word",
          position: "absolute",
          top: "6.375vh",
          left: "22.5vw",
        }}
      >
        ₫50.000
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
            fontFamily: "TikTok Sans",
            fontWeight: "600",
            wordWrap: "break-word",
          }}
        >
          40.000 ₫
        </span>
      </div>
      <div
        style={{
          width: "17.22vw",
          height: "3vh",
          background: "#ED4E30",
          borderTopRightRadius: 6,
          borderBottomRightRadius: 6,
          position: "absolute",
          right: "0.83vw",
          bottom: "0.375vh",
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
            fontFamily: "TikTok Sans",
            fontWeight: "500",
            wordWrap: "break-word",
          }}
        >
          Mua ngay
        </div>
      </div>
      <div
        style={{
          width: "8.89vw",
          height: "3vh",
          background: "#FDEFEF",
          borderTopLeftRadius: 6,
          borderBottomLeftRadius: 6,
          position: "absolute",
          left: "49.44vw",
          bottom: "0.375vh",
        }}
      />
    </div>
  );
};

export default ProductCart;
