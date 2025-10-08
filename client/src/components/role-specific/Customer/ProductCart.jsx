import React from 'react';
import StarIcon from '../../shared/StarIcon';

const ProductCart = () => {
  return (
    <div
      style={{
        width: "275px",
        height: "80px",
        background: "white",
        borderRadius: 8,
        position: "relative",
      }}
    >
      <img
        style={{
          width: "72px",
          height: "72px",
          borderRadius: 4,
          position: "absolute",
          top: "4px",
          left: "4px",
        }}
        src="/1PCS.jpg"
      />
      <div
        style={{
          justifyContent: "center",
          display: "flex",
          flexDirection: "column",
          color: "black",
          fontSize: 11,
          fontFamily: "TikTok Sans",
          fontWeight: "500",
          wordWrap: "break-word",
          position: "absolute",
          top: "4px",
          left: "81px",
        }}
      >
        1 Miếng Gà Xốt Mắm Tỏi
      </div>
      <div
        style={{
          width: "119px",
          height: "15px",
          background: "#FDEEE7",
          borderRadius: 4,
          position: "absolute",
          top: "20px",
          left: "81px",
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
            fontSize: 10,
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
          fontSize: 10,
          fontFamily: "TikTok Sans",
          fontWeight: "400",
          wordWrap: "break-word",
          position: "absolute",
          top: "37px",
          left: "92px",
        }}
      >
        4.8 | Bán 1M trực tuyến
      </div>
      <div
        style={{
          position: "absolute",
          top: "31px",
          left: "81px",
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
          fontSize: 9,
          fontFamily: "TikTok Sans",
          fontWeight: "400",
          textDecoration: "line-through",
          wordWrap: "break-word",
          position: "absolute",
          top: "51px",
          left: "81px",
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
          top: "58px",
          left: "81px",
        }}
      >
        <span
          style={{
            color: "#ED4E30",
            fontSize: 15,
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
          width: "62px",
          height: "24px",
          background: "#ED4E30",
          borderTopRightRadius: 6,
          borderBottomRightRadius: 6,
          position: "absolute",
          right: "3px",
          bottom: "3px",
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
            fontSize: 11,
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
          width: "32px",
          height: "24px",
          background: "#FDEFEF",
          borderTopLeftRadius: 6,
          borderBottomLeftRadius: 6,
          position: "absolute",
          left: "178px",
          bottom: "3px",
        }}
      />
    </div>
  );
};

export default ProductCart;
