import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/shared/MiniLogo";
import FooterBar from "@/components/shared/FooterBar";
import InputFrame from "@/components/shared/InputFrame";
import SubmitButton from "@/components/shared/SubmitButton";
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
  const [isFocused, setIsFocused] = useState(false);

  // ✅ Chuẩn hoá số điện thoại (+84)
  const formatPhoneNumber = (raw) => {
    const cleaned = raw.replace(/\s+/g, "");
    if (cleaned.startsWith("0")) {
      return "+84" + cleaned.substring(1);
    }
    return cleaned;
  };

  // 📤 Gửi OTP
  const sendOTP = async () => {
    if (!phone) {
      alert("📱 Vui lòng nhập số điện thoại.");
      return;
    }
    if (!/^0\d{9}$/.test(phone)) {
      alert(
        "⚠️ Số điện thoại không hợp lệ. Hãy nhập đủ 10 số và bắt đầu bằng 0."
      );
      return;
    }

    try {
      setLoading(true);

      // ✅ Bước 1: Kiểm tra số điện thoại trong DB
      const checkRes = await fetch(
        "http://localhost:5000/api/auth/check-phone",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: formatPhoneNumber(phone) }),
        }
      );
      const checkData = await checkRes.json();

      // ⚠️ Nếu số điện thoại ĐÃ tồn tại thì KHÔNG cho đăng ký
      if (checkData.success) {
        alert(
          "⚠️ Số điện thoại này đã được đăng ký. Vui lòng đăng nhập thay vì đăng ký mới!"
        );
        setLoading(false);
        return;
      }

      // ✅ Nếu chưa có trong DB → gửi OTP qua Firebase
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          { size: "invisible" }
        );
      }

      const formattedPhone = formatPhoneNumber(phone);
      const result = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        window.recaptchaVerifier
      );
      setConfirmationResult(result);

      setOtp("");
      setOtpVerified(false);
      alert("📨 Mã OTP đã được gửi về số điện thoại của bạn!");
    } catch (err) {
      console.error("❌ Lỗi gửi OTP:", err);
      alert("❌ Gửi OTP thất bại. Vui lòng kiểm tra số điện thoại.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Tự động xác minh khi OTP đủ 6 số
  const handleOtpChange = async (value) => {
    setOtp(value); // ✅ luôn cập nhật OTP nhập vào

    if (value.length === 6 && confirmationResult && !otpVerified) {
      try {
        setLoading(true);
        const result = await confirmationResult.confirm(value);
        console.log("✅ OTP xác minh thành công:", result.user);
        setOtpVerified(true);
        alert("✅ OTP hợp lệ! Bạn có thể đặt mật khẩu.");
      } catch (err) {
        console.error(err);
        alert("❌ Mã OTP không đúng hoặc đã hết hạn.");
        setOtpVerified(false);
      } finally {
        setLoading(false);
      }
    }
  };

  // ✅ Điều hướng sang trang ProfileRegister
  const handleNext = () => {
    if (!otpVerified) {
      alert("⚠️ Bạn cần xác minh OTP trước khi tiếp tục.");
      return;
    }
    if (password.trim().length < 6) {
      alert("🔑 Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    const formattedPhone = formatPhoneNumber(phone);
    navigate("/ProfileRegister", {
      state: { phone: formattedPhone, password },
    });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
      }}
    >
      {/* 📱 Logo */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "2.82vh",
          transform: "translateX(-50%)",
        }}
      >
        <Logo />
      </div>

      {/* 📝 Tiêu đề */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "200px",
          transform: "translateX(-50%)",
          color: "#363a33",
          fontSize: "3.2rem",
          fontWeight: "bold",
        }}
      >
        Đăng ký
      </div>

      {/* 📞 Nhập số điện thoại */}
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

      {/* 📥 Ô nhập số điện thoại */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "310px",
          transform: "translateX(-50%)",
        }}
      >
        <InputFrame isFocused={isFocused}>
          <input
            type="tel"
            placeholder="Số điện thoại (vd: 090...)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={{
              border: "none",
              outline: "none",
              fontSize: "1.5rem",
            }}
          />
        </InputFrame>
      </div>

      {/* 🔐 OTP Section */}
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
            {loading ? "..." : "Gửi mã"}
          </button>
        </div>
      </div>

      {/* 🔑 Password Section */}
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

      {/* ▶️ Nút tiếp */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "79.54vh",
          transform: "translateX(-50%)",
        }}
      >
        <SubmitButton onClick={handleNext} isValid={otpVerified} type="button">
          Tiếp
        </SubmitButton>
      </div>

      <FooterBar
        text1="Bạn đã có tài khoản?"
        text2="Đăng nhập"
        onClick={() => navigate("/login")}
      />

      {/* 📌 Bắt buộc có container cho reCAPTCHA */}
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default RegisterPhone;
