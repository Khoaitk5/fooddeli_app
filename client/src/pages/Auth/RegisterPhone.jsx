import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/shared/Logo";
import FooterBar from "@/components/shared/FooterBar";
import BackArrow from "@/components/shared/BackArrow";

const RegisterPhone = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "360px",
          height: "800px",
          position: "relative",
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        {/* Logo */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            transform: "translateX(-50%)",
            marginTop: "71.13px",
          }}
        >
          <Logo />
        </div>

        {/* Title */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "200px",
            transform: "translateX(-50%)",
            color: "#EF5126",
            fontSize: 29,
            fontFamily: "TikTok Sans",
            fontWeight: "700",
          }}
        >
          Đăng ký
        </div>
        {/* Phone Section */}
        <div
          style={{
            position: "absolute",
            top: "278px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "267px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/*Số điện thoại*/}
          <div
            style={{
              color: "#161823",
              fontSize: 13,
              fontFamily: "TikTok Sans",
              fontWeight: "600",
              wordWrap: "break-word",
            }}
          >
            Số điện thoại
          </div>

          {/* Đăng ký bằng email */}
          <div
            style={{
              color: "rgba(22, 24, 35, 0.75)",
              fontSize: 11,
              fontFamily: "IBM Plex Sans",
              fontWeight: "600",
              wordWrap: "break-word",
              cursor: "pointer",
            }}
            onClick={() => navigate("/register/email")}
          >
            Đăng ký bằng email
          </div>
        </div>

        {/* Phone Input Frame */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "310px",
            transform: "translateX(-50%)",
            width: "232px",
            height: "43px",
            background: "#F2F2F2",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            padding: "0 12px",
          }}
        >
          <input
            type="tel"
            placeholder="Số điện thoại"
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: 14,
              fontFamily: "TikTok Sans",
            }}
          />
        </div>

        {/* Password Section */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "370px",
            transform: "translateX(-50%)",
            width: "267px",
          }}
        >
          {/*Mật khẩu*/}
          <div
            style={{
              color: "#161823",
              fontSize: 13,
              fontFamily: "TikTok Sans",
              fontWeight: "600",
              wordWrap: "break-word",
              marginBottom: "8px",
            }}
          >
            Mật khẩu
          </div>

          {/* Password Input Frame */}
          <div
            style={{
              width: "232px",
              height: "43px",
              background: "#F2F2F2",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              overflow: "hidden",
              padding: 0,
            }}
          >
            {/* Phần nhập mã */}
            <div style={{ width: "162px", paddingLeft: 12 }}>
              <input
                type="text"
                placeholder="Nhập mã"
                style={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: 14,
                  fontFamily: "TikTok Sans",
                  color: "black",
                }}
              />
            </div>
            {/* Thanh ngăn mờ */}
            <div
              style={{
                width: 1,
                height: 28,
                background: "#E3E3E3",
                opacity: 0.7,
                margin: "0 4px",
              }}
            />
            {/* Nút gửi mã */}
            <div
              style={{
                width: "70px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <button
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#B0B0B0",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                  fontFamily: "TikTok Sans",
                  wrap: "nowrap",
                }}
                type="button"
              >
                Gửi mã
              </button>
            </div>
          </div>
        </div>

        {/* Confirm Password Section */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "440px",
            transform: "translateX(-50%)",
            width: "267px",
          }}
        >
          {/*Xác nhận mật khẩu*/}
          <div
            style={{
              color: "#161823",
              fontSize: 13,
              fontFamily: "TikTok Sans",
              fontWeight: "600",
              wordWrap: "break-word",
              marginBottom: "8px",
            }}
          >
            Nhập mật khẩu
          </div>

          {/* Confirm Password Input Frame */}
          <div
            style={{
              width: "232px",
              height: "43px",
              background: "#F2F2F2",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              padding: "0 12px",
            }}
          >
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: 14,
                fontFamily: "TikTok Sans",
              }}
            />
          </div>
        </div>
        {/* Button Tiếp */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "530px", // đặt top phù hợp ngay dưới ô nhập mật khẩu
            transform: "translateX(-50%)",
            width: "232px",
            height: "43px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <button
            style={{
              width: "100%",
              height: "100%",
              background: "#F2F2F2",
              borderRadius: 28,
              border: "none",
              color: "#B0B0B0",
              fontWeight: 700,
              fontSize: 16,
              cursor: "pointer",
              fontFamily: "TikTok Sans",
            }}
            type="button"
            onClick={() => navigate("/ProfileRegister")}
          >
            Tiếp
          </button>
        </div>

        <FooterBar
          text1="Bạn đã có tài khoản?"
          text2="Đăng nhập"
          onClick={() => navigate("/login")}
        />
      </div>
    </div>
  );
};

export default RegisterPhone;
