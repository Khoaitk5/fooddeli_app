import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/shared/Logo";
import FooterBar from "@/components/shared/FooterBar";

const RegisterEmail = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Gửi OTP qua backend
  const sendOTP = async () => {
    if (!email) {
      alert("📧 Vui lòng nhập email.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("⚠️ Email không hợp lệ.");
      return;
    }

    try {
      setLoading(true);

      // ✅ Bước 1: Kiểm tra email có tồn tại trong DB chưa
      const checkRes = await fetch(
        "http://localhost:5000/api/auth/check-email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const checkData = await checkRes.json();
      if (!checkData.success) {
        alert(checkData.message || "❌ Email chưa được đăng ký!");
        setLoading(false);
        return;
      }

      // ✅ Bước 2: Nếu tồn tại → gửi OTP
      const res = await fetch("http://localhost:5000/api/auth/send-otp-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (data.success) {
        setOtp("");
        setOtpVerified(false);
        alert("📨 Mã OTP đã được gửi đến email của bạn!");
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Gửi OTP thất bại.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Xác minh OTP khi nhập đủ 6 số
  const handleOtpChange = async (value) => {
    setOtp(value); // ✅ luôn cập nhật OTP nhập vào

    if (value.length === 6 && !otpVerified) {
      try {
        setLoading(true);
        const res = await fetch(
          "http://localhost:5000/api/auth/verify-otp-email",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp: value }),
          }
        );
        const data = await res.json();
        if (data.success) {
          setOtpVerified(true);
          alert("✅ OTP hợp lệ! Bạn có thể đặt mật khẩu.");
        } else {
          alert("❌ Mã OTP không đúng hoặc đã hết hạn.");
          setOtpVerified(false);
        }
      } catch (err) {
        console.error(err);
        alert("❌ Xác minh OTP thất bại.");
      } finally {
        setLoading(false);
      }
    }
  };

  // ✅ Điều hướng sang ProfileRegister
  const handleNext = () => {
    if (!otpVerified) {
      alert("⚠️ Bạn cần xác minh OTP trước khi tiếp tục.");
      return;
    }
    if (password.trim().length < 6) {
      alert("🔑 Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    // 👉 Truyền sang ProfileRegister để hoàn tất đăng ký
    navigate("/ProfileRegister", { state: { email, password } });
  };

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
            fontFamily: "Be Vietnam Pro",
            fontWeight: "700",
          }}
        >
          Đăng ký
        </div>

        {/* Email Label + Switch */}
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
          <div
            style={{
              color: "#161823",
              fontSize: 13,
              fontFamily: "Be Vietnam Pro",
              fontWeight: "600",
            }}
          >
            Email
          </div>

          <div
            style={{
              color: "rgba(22, 24, 35, 0.75)",
              fontSize: 11,
              fontFamily: "IBM Plex Sans",
              fontWeight: "600",
              cursor: "pointer",
            }}
            onClick={() => navigate("/register/phone")}
          >
            Đăng ký bằng số điện thoại
          </div>
        </div>

        {/* Email Input */}
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
            type="email"
            placeholder="Nhập email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: 14,
              fontFamily: "Be Vietnam Pro",
            }}
          />
        </div>

        {/* OTP Section */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "370px",
            transform: "translateX(-50%)",
            width: "267px",
          }}
        >
          <div
            style={{
              color: "#161823",
              fontSize: 13,
              fontFamily: "Be Vietnam Pro",
              fontWeight: "600",
              marginBottom: "8px",
            }}
          >
            Mã OTP
          </div>

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
            <div style={{ width: "162px", paddingLeft: 12 }}>
              <input
                type="text"
                placeholder="Nhập mã"
                value={otp}
                onChange={(e) => handleOtpChange(e.target.value)}
                maxLength={6}
                style={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: 14,
                  fontFamily: "Be Vietnam Pro",
                }}
              />
            </div>

            <div
              style={{
                width: 1,
                height: 28,
                background: "#E3E3E3",
                opacity: 0.7,
                margin: "0 4px",
              }}
            />

            <button
              style={{
                background: "transparent",
                border: "none",
                color: "#EF5126",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                fontFamily: "Be Vietnam Pro",
                width: "70px",
              }}
              type="button"
              onClick={sendOTP}
              disabled={loading}
            >
              Gửi mã
            </button>
          </div>
        </div>

        {/* Password Section */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "440px",
            transform: "translateX(-50%)",
            width: "267px",
          }}
        >
          <div
            style={{
              color: "#161823",
              fontSize: 13,
              fontFamily: "Be Vietnam Pro",
              fontWeight: "600",
              marginBottom: "8px",
            }}
          >
            Nhập mật khẩu
          </div>

          <div
            style={{
              width: "232px",
              height: "43px",
              background: otpVerified ? "#F2F2F2" : "#E0E0E0",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              padding: "0 12px",
            }}
          >
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              disabled={!otpVerified}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: 14,
                fontFamily: "Be Vietnam Pro",
              }}
            />
          </div>
        </div>

        {/* Button Tiếp */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "530px",
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
              background: otpVerified ? "#EF5126" : "#F2F2F2",
              borderRadius: 28,
              border: "none",
              color: otpVerified ? "white" : "#B0B0B0",
              fontWeight: 700,
              fontSize: 16,
              cursor: otpVerified ? "pointer" : "not-allowed",
              fontFamily: "Be Vietnam Pro",
            }}
            type="button"
            onClick={handleNext}
            disabled={!otpVerified}
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

export default RegisterEmail;
