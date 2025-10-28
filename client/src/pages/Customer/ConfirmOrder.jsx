import React from "react";
import BackArrow from "@/components/shared/BackArrow.jsx";
import TagVoucherIcon from "@/components/shared/TagVoucherIcon.jsx";

export default function Payment() {
  return (
    <div style={{ backgroundColor: "#f5f5f5", height: "100vh" }}>
      {/* Header Section */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "8vh",
          borderRadius: "0px 0px 8px 8px",
          backgroundColor: "#fff",
        }}
      >
        <BackArrow
          style={{
            position: "absolute",
            width: "2.34vw",
            height: "1.875vh",
            top: "3.5vh",
            left: "6.67vw",
          }}
          onClick={() => window.history.back()}
        />
        <div
          style={{
            position: "absolute",
            top: "3vh",
            left: "14.44vw",
            color: "black",
            fontSize: "1.8rem",
            fontWeight: "400",
          }}
        >
          Xác nhận đơn hàng
        </div>
      </div>
      {/* End Header Section */}

      {/* Address Section */}
      <div>
        <div
          style={{
            width: "100%",
            height: "10.75vh",
            marginTop: "0.875vh",
            background: "white",
            borderRadius: "1rem",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "3rem",
              height: "3rem",
              background: "#FBF1F2",
              borderRadius: 9999,
              top: "3.625vh",
              left: "3.89vw",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "3vh",
              left: "15.28vw",
              color: "black",
              fontSize: "1.25rem",
              fontWeight: "500",
            }}
          >
            6-C16 Lê Đức Thọ
          </div>
          <div
            style={{
              position: "absolute",
              top: "5.75vh",
              left: "15.28vw",
              color: "#3D3D3D",
              fontSize: "1.25rem",
              fontWeight: "400",
            }}
          >
            Nguyễn Chí Vương | 0778579293
          </div>
        </div>
      </div>
      {/* End Address Section */}

      {/* Order Summary Section */}
      <div>
        <div
          style={{
            width: "100%",
            height: "17vh",
            marginTop: "0.875vh",
            background: "white",
            borderRadius: "1rem",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "2.5vh",
              left: "4.17vw",
              color: "black",
              fontSize: "1.7rem",
              fontWeight: "400",
            }}
          >
            Tóm tắt đơn hàng
          </div>
          <div
            style={{
              position: "absolute",
              top: "2.75vh",
              right: "4.17vw",
              color: "#105EB3",
              fontSize: "1.5rem",
              fontWeight: "500",
            }}
          >
            Thêm món
          </div>
          <div
            style={{
              position: "absolute",
              width: "5.1rem",
              height: "5.1rem",
              background: "#D9D9D9",
              borderRadius: "1.4rem",
              top: "8.125vh",
              left: "4.17vw",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "8.125vh",
              left: "21.39vw",
              color: "black",
              fontSize: "1.3rem",
              fontWeight: "400",
            }}
          >
            Cơm Má Đùi Góc Tư
          </div>
          <div
            style={{
              position: "absolute",
              top: "12.5vh",
              left: "21.39vw",
              color: "#3D3D3D",
              fontSize: "1.3rem",
              fontWeight: "400",
            }}
          >
            60.000
          </div>
          <div
            style={{
              position: "absolute",
              width: "18.33vw",
              height: "3.625vh",
              borderRadius: 14,
              border: "1px #247950 solid",
              top: "10.875vh",
              right: "4.17vw",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "1vw",
                top: "50%",
                transform: "translateY(-50%)",
                color: "black",
                fontSize: "1.5rem",
                fontWeight: "600",
              }}
            >
              -
            </div>
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                color: "black",
                fontSize: "1.1rem",
                fontWeight: "600",
              }}
            >
              1
            </div>
            <div
              style={{
                position: "absolute",
                right: "1vw",
                top: "50%",
                transform: "translateY(-50%)",
                color: "black",
                fontSize: "1.5rem",
                fontWeight: "600",
              }}
            >
              +
            </div>
          </div>
        </div>
      </div>
      {/* End Order Summary Section */}

      {/* Voucher Section */}
      <div
        style={{
          width: "100%",
          height: "13.875vh",
          marginTop: "0.875vh",
          background: "white",
          borderRadius: "1rem",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "2.5vh",
            left: "4.17vw",
            color: "black",
            fontSize: "1.7rem",
            fontWeight: "400",
          }}
        >
          Áp dụng ưu đãi và giảm giá
        </div>
        <TagVoucherIcon
          style={{
            position: "absolute",
            top: "9.25vh",
            left: "6.67vw",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "9.125vh",
            left: "16.94vw",
            color: "#3D3D3D",
            fontSize: "1.4rem",
            fontWeight: "400",
          }}
        >
          Ưu đãi
        </div>
      </div>
      {/* End Voucher Section */}

      <div
        style={{
          width: "100%",
          height: "13.75vh",
          marginTop: "0.875vh",
          background: "white",
          borderRadius: "1rem",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "2.5vh",
            left: "4.17vw",
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
            color: "black",
            fontSize: "1.7rem",
            fontWeight: "400",
            wordWrap: "break-word",
          }}
        >
          Thông tin thanh toán
        </div>
        <div
          style={{
            position: "absolute",
            top: "2.75vh",
            right: "4.17vw",
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
            color: "#0266D5",
            fontSize: "1.5rem",
            fontWeight: "500",
            wordWrap: "break-word",
          }}
        >
          Xem tất cả
        </div>
        <div
          style={{
            position: "absolute",
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
            color: "#3D3D3D",
            fontSize: "1.4rem",
            fontWeight: "400",
            wordWrap: "break-word",
            top: "8.375vh"
          }}
        >
          Zalopay •••• 9293
        </div>
      </div>
    </div>
  );
}
