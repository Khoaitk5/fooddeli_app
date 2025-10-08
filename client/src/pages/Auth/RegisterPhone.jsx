import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/shared/Logo";
import FooterBar from "@/components/shared/FooterBar";
import { auth } from "@/firebase/firebaseConfig";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const RegisterPhone = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [otpVerified, setOtpVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Chuẩn hoá số điện thoại (+84)
  const formatPhoneNumber = (raw) => {
    const cleaned = raw.replace(/\s+/g, "");
    if (cleaned.startsWith("0")) {
      return "+84" + cleaned.substring(1);
    }
    return cleaned;
  };

  // ✅ Gửi OTP
  const sendOTP = async () => {
    if (!phone) {
      alert("📱 Vui lòng nhập số điện thoại.");
      return;
    }
    if (!/^0\d{9}$/.test(phone)) {
      alert("⚠️ Số điện thoại không hợp lệ. Hãy nhập đủ 10 số và bắt đầu bằng 0.");
      return;
    }

    try {
      setLoading(true);
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
          size: "invisible",
        });
      }

      const formattedPhone = formatPhoneNumber(phone);
      const result = await signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier);
      setConfirmationResult(result);
      alert("📨 Mã OTP đã được gửi về số điện thoại của bạn!");
    } catch (err) {
      console.error(err);
      alert("❌ Gửi OTP thất bại. Vui lòng kiểm tra số điện thoại.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Tự động xác minh khi OTP đủ 6 số
  const handleOtpChange = async (value) => {
    setOtp(value);
    if (value.length === 6 && confirmationResult) {
      try {
        setLoading(true);
        const result = await confirmationResult.confirm(value);
        console.log("✅ OTP xác minh thành công:", result.user);
        setOtpVerified(true);
        alert("✅ OTP hợp lệ! Bạn có thể đặt mật khẩu.");
      } catch (err) {
        console.error(err);
        alert("❌ Mã OTP không đúng hoặc đã hết hạn.");
      } finally {
        setLoading(false);
      }
    }
  };

  // ✅ Sang trang tiếp theo
const handleNext = () => {
  if (!otpVerified) {
    alert("⚠️ Bạn cần xác minh OTP trước khi tiếp tục.");
    return;
  }
  if (password.trim().length < 6) {
    alert("🔑 Mật khẩu phải có ít nhất 6 ký tự.");
    return;
  }

  const formattedPhone = formatPhoneNumber(phone); // ✅ chuyển số sang +84 trước khi gửi
  navigate("/ProfileRegister", { state: { phone: formattedPhone, password } });
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
          <div
            style={{
              color: "#161823",
              fontSize: 13,
              fontFamily: "TikTok Sans",
              fontWeight: "600",
            }}
          >
            Số điện thoại
          </div>

          <div
            style={{
              color: "rgba(22, 24, 35, 0.75)",
              fontSize: 11,
              fontFamily: "IBM Plex Sans",
              fontWeight: "600",
              cursor: "pointer",
            }}
            onClick={() => navigate("/register/email")}
          >
            Đăng ký bằng email
          </div>
        </div>

        {/* Phone Input */}
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
            placeholder="Số điện thoại (vd: 090...)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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
              fontFamily: "TikTok Sans",
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
                  fontFamily: "TikTok Sans",
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
                fontFamily: "TikTok Sans",
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
              fontFamily: "TikTok Sans",
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
              fontFamily: "TikTok Sans",
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
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default RegisterPhone;
