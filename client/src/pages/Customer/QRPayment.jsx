import React, { useState, useEffect } from "react";
import BackArrow from "../../components/shared/BackArrow";
import { useNavigate } from "react-router-dom";

const QRPayment = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ position: "relative", height: "100vh", backgroundColor: "#F2F2F2" }}>
      {/* Nút test nhỏ ở góc trên phải */}
      <div
        style={{
          position: "absolute",
          top: "2vh",
          right: "3vw",
          padding: "0.5vh 1.5vw",
          backgroundColor: "#2BCDD2",
          color: "white",
          borderRadius: "0.3rem",
          fontSize: "0.8rem",
          fontWeight: "500",
          cursor: "pointer",
          textAlign: "center",
          zIndex: 10,
        }}
        onClick={() => navigate("/customer/order-success")}
      >
        Test
      </div>
      <div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: "2vh",
        }}
      >
        <BackArrow
          style={{
            position: "absolute",
            left: "5vw",
            top: "3.375vh",
            cursor: "pointer",
          }}
          onClick={() => navigate(-1)}
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "5vh",
        }}
      >
        <div
          style={{
            color: "black",
            fontSize: "1.6rem",
            fontWeight: "600",
            textAlign: "center",
            marginBottom: "3vh",
          }}
        >
          Quét mã QR để thanh toán
        </div>
        <div
          style={{
            width: "70vw",
            height: "70vw",
            maxWidth: "300px",
            maxHeight: "300px",
            backgroundColor: "#FFF",
            borderRadius: "1rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          }}
        >
          {/* Placeholder cho QR code - thay bằng ảnh thật hoặc library generate QR */}
          <div
            style={{
              fontSize: "1.2rem",
              color: "#666",
              textAlign: "center",
            }}
          >
            QR Code<br />Placeholder
          </div>
        </div>
        <div
          style={{
            color: "#666",
            fontSize: "1.4rem",
            textAlign: "center",
            marginTop: "3vh",
            padding: "0 5vw",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "500",
          }}
        >
          Powered by
          <img
            src="/payos_logo.png"
            alt="Logo"
            style={{ height: "2.5vh", marginLeft: "2.78vw" }}
          />
        </div>
        <div
          style={{
            color: timeLeft > 0 ? "#2BCDD2" : "#FF0000",
            fontSize: "1.3rem",
            fontWeight: "500",
            textAlign: "center",
            marginTop: "2vh",
          }}
        >
          {timeLeft > 0 ? `Giao dịch hết hạn sau: ${formatTime(timeLeft)}` : "Giao dịch đã hết hạn"}
        </div>
      </div>
    </div>
  );
};

export default QRPayment;