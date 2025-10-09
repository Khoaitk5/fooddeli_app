import React, { useState } from "react";
import Navbar from "../../components/shared/Navbar";
import { useNavigate } from "react-router-dom";

const styles = {
  absoluteCenter: {
    position: "absolute",
    justifyContent: "center",
    display: "flex",
    flexDirection: "column",
    wordWrap: "break-word",
  },
  tikTokFont: {
    fontFamily: "TikTok Sans",
  },
  buttonBase: {
    background: "white",
    borderRadius: 8,
    border: "1px #E8EBE6 solid",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  textBase: {
    justifyContent: "center",
    display: "flex",
    flexDirection: "column",
    wordWrap: "break-word",
  },
};

function TabSwitch({ active, onChange }) {
  const textStyle = {
    justifyContent: "center",
    display: "flex",
    flexDirection: "column",
    color: "var(--Colors-Typography-500, #363A33)",
    fontSize: "1.5rem",
    fontFamily: "TikTok Sans",
    fontWeight: "600",
    wordWrap: "break-word",
    position: "relative",
    zIndex: 10,
  };

  return (
    <div className="bg-transparent rounded-[8px] h-[49px] flex p-1 w-full">
      <button
        onClick={() => onChange("coming")}
        className={
          active === "coming"
            ? "relative flex-1 rounded-[6px] text-[14px] text-[#363a33] font-semibold leading-none"
            : "relative flex-1 text-[14px] text-[#91958e] leading-none"
        }
      >
        <div style={textStyle}>Đang đến</div>
        {active === "coming" && (
          <div></div>
        )}
      </button>
      <button
        onClick={() => onChange("delivered")}
        className={
          active === "delivered"
            ? "flex-1 rounded-[6px] text-[14px] text-[#363a33] font-semibold leading-none"
            : "flex-1 text-[14px] text-[#91958e] leading-none"
        }
      >
        <div style={textStyle}>Đã giao</div>
      </button>
    </div>
  );
}

function OrderCard() {
  const navigate = useNavigate();
  return (
    <div className="mt-4">
      <img
        style={{
          ...styles.absoluteCenter,
          top: "20.16vh",
          left: "5.28vw",
          width: "18.13vw",
          height: "8.16vh",
          borderRadius: 8,
        }}
        src="https://placehold.co/65x65"
      />
      <div
        style={{
          ...styles.absoluteCenter,
          ...styles.tikTokFont,
          left: "27.58vw",
          top: "21.66vh",
          color: "black",
          fontSize: "1.5rem",
          fontWeight: "700",
        }}
      >
        Lotteria
      </div>
      <div
        style={{
          ...styles.absoluteCenter,
          ...styles.tikTokFont,
          top: "21.91vh",
          right: "5.28vw",
          color: "#6B6E82",
          fontSize: "1.4rem",
          fontWeight: "400",
          textDecoration: "underline",
        }}
      >
        #162432
      </div>
      <div
        style={{
          ...styles.absoluteCenter,
          ...styles.tikTokFont,
          top: "25.07vh",
          left: "27.5vw",
          color: "black",
          fontSize: "1.2rem",
          fontWeight: "600",
        }}
      >
        69.000 ₫
      </div>
      <div
        style={{
          ...styles.absoluteCenter,
          ...styles.tikTokFont,
          top: "25.07vh",
          right: "5.28vw",
          color: "#6B6E82",
          fontSize: "1.2rem",
          fontWeight: "400",
        }}
      >
        1 món
      </div>
      <div
        style={{
          ...styles.absoluteCenter,
          top: "29.81vh",
          left: "5.28vw",
          width: "89.44vw",
          height: "5vh",
          ...styles.buttonBase,
        }}
        onClick={() => navigate("/customer/order-tracking")}
      >
        <div
          style={{
            ...styles.textBase,
            color: "black",
            fontSize: "1.5rem",
            fontFamily: "TikTok Sans",
            fontWeight: "600",
          }}
        >
          Theo dõi đơn hàng
        </div>
      </div>
    </div>
  );
}

function DeliveredCard() {
  return (
    <div className="mt-4">
      <div className="flex items-center gap-3">
        <img
          style={{
            ...styles.absoluteCenter,
            top: "20.16vh",
            left: "5.28vw",
            width: "18.13vw",
            height: "8.16vh",
            borderRadius: 8,
          }}
          src="https://placehold.co/65x65"
        />
        <div className="flex-1">
          <div
            style={{
              ...styles.absoluteCenter,
              ...styles.tikTokFont,
              left: "27.58vw",
              top: "21.66vh",
              color: "black",
              fontSize: "1.5rem",
              fontWeight: "700",
            }}
          >
            Lotteria
          </div>
          <div
            style={{
              ...styles.absoluteCenter,
              ...styles.tikTokFont,
              top: "21.91vh",
              right: "5.28vw",
              color: "#6B6E82",
              fontSize: "1.4rem",
              fontWeight: "400",
              textDecoration: "underline",
            }}
          >
            #162432
          </div>
          <div className="mt-1 flex items-center justify-between text-[12px]">
            <div className="flex items-center gap-3 text-[#6b6e82]">
              <div
                style={{
                  ...styles.absoluteCenter,
                  ...styles.tikTokFont,
                  top: "25.07vh",
                  left: "27.5vw",
                  color: "black",
                  fontSize: "1.2rem",
                  fontWeight: "600",
                }}
              >
                69.000 ₫
              </div>
              <span className="h-[16px] w-px bg-[#e8ebe6]"></span>
              <div
                style={{
                  ...styles.absoluteCenter,
                  ...styles.tikTokFont,
                  top: "25.03vh",
                  right: "25vw",
                  color: "#6B6E82",
                  fontSize: "1.2rem",
                  fontWeight: "400",
                }}
              >
                03/10/2025, 12:30
              </div>
            </div>
            <div
              style={{
                ...styles.absoluteCenter,
                ...styles.tikTokFont,
                top: "25.07vh",
                right: "5.28vw",
                color: "#6B6E82",
                fontSize: "1.2rem",
                fontWeight: "400",
              }}
            >
              1 món
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          ...styles.absoluteCenter,
          top: "29.82vh",
          left: "8.06vw",
          width: "36.94vw",
          height: "5vh",
          ...styles.buttonBase,
        }}
      >
        <div
          style={{
            ...styles.textBase,
            color: "#363a33",
            fontSize: "1.5rem",
            fontFamily: "TikTok Sans",
            fontWeight: "600",
          }}
        >
          Đặt lại
        </div>
      </div>
      <div
        style={{
          ...styles.absoluteCenter,
          top: "29.82vh",
          right: "8.06vw",
          width: "36.94vw",
          height: "5vh",
          ...styles.buttonBase,
        }}
      >
        <div
          style={{
            ...styles.textBase,
            color: "#363a33",
            fontSize: "1.5rem",
            fontFamily: "TikTok Sans",
            fontWeight: "600",
          }}
        >
          Đánh giá
        </div>
      </div>
    </div>
  );
}

export default function Order() {
  const [activeTab, setActiveTab] = useState("coming");

  return (
    <div className="bg-white pb-20">
      <div className="mx-auto max-w-[360px] px-5 pb-24 pt-5">
        <div
          style={{
            position: "absolute",
            top: "6.625vh",
            left: "50%",
            transform: "translateX(-50%)",
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
            color: "var(--Colors-Typography-500, #363A33)",
            fontSize: "1.7rem",
            fontFamily: "TikTok Sans",
            fontWeight: "700",
            wordWrap: "break-word",
          }}
        >
          Đơn hàng của tôi
        </div>
        <div
          style={{
            position: "absolute",
            top: "12.125vh",
            left: "50%",
            transform: "translateX(-50%)",
            width: "89.44vw",
            height: "6.1625vh",
            background: "#F4F7F2",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: activeTab === 'coming' ? '1.11vw' : '45.17vw',
              top: "50%",
              transform: "translateY(-50%)",
              width: "43.06vw",
              height: "5.3vh",
              background: "white",
              borderRadius: 4,
              zIndex: 1,
            }}
          />
          <TabSwitch active={activeTab} onChange={setActiveTab} />
        </div>
        {activeTab === "coming" ? <OrderCard /> : <DeliveredCard />}
      </div>
      <Navbar />
    </div>
  );
}
