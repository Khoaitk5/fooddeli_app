import React from "react";
import { useNavigate } from "react-router-dom";
import CloseIcon from "../../components/shared/CloseIcon";

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <div style={{ position: "relative", height: "100vh", backgroundColor: "#F2F2F2" }}>
      <div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: "2vh",
        }}
      >
        <CloseIcon
          style={{
            position: "absolute",
            left: "5vw",
            top: "3.375vh",
            cursor: "pointer",
          }}
          onClick={() => navigate('/customer/home')}
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "10vh",
        }}
      >
        <div
          style={{
            fontSize: "2rem",
            fontWeight: "700",
            color: "#2BCDD2",
            textAlign: "center",
            marginBottom: "5vh",
          }}
        >
          🎉 Tuyệt vời!
        </div>
        <div
          style={{
            fontSize: "1.4rem",
            fontWeight: "600",
            color: "black",
            textAlign: "center",
            marginBottom: "8vh",
            padding: "0 5vw",
          }}
        >
          Đơn hàng của bạn đã được đặt.
        </div>
        <div
          style={{
            width: "87.78vw",
            height: "6.375vh",
            background: "#2BCDD2",
            borderRadius: 999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            fontSize: "1.4rem",
            fontWeight: "700",
            cursor: "pointer",
            position: "absolute",
            bottom: "3vh",
            left: "50%",
            transform: "translateX(-50%)",
          }}
          onClick={() => navigate('/customer/order-tracking')}
        >
          Theo dõi đơn hàng
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;