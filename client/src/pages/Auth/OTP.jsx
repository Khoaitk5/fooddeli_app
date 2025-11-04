import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BackArrow from "@/components/shared/BackArrow";
import HelpPopup from "@/components/shared/HelpPopup";
import { auth } from "@/firebase/firebaseConfig";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { OTPInput } from "input-otp";

const OTP = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [showHelpPopup, setShowHelpPopup] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const phone = location.state?.phone || "";
  const email = location.state?.email || "";
  const contact = phone || email;

  // ⏱️ Đếm ngược resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // ✅ Khởi tạo reCAPTCHA
  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      });
      window.recaptchaVerifier.render();
    }
  }, []);

  // 📤 Xác minh OTP
const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  const otpCode = otp;
  if (otpCode.length !== 6) {
    setError("Vui lòng nhập đủ 6 chữ số OTP");
    return;
  }

  if (!window.confirmationResult) {
    setError("Phiên OTP đã hết hạn. Vui lòng gửi lại mã.");
    return;
  }

  try {
    const result = await window.confirmationResult.confirm(otpCode);
    const user = result.user;

    console.log("✅ Xác minh thành công:", user);

    // 🔑 Lưu session vào localStorage nếu muốn dùng sau
    const idToken = await user.getIdToken();
    localStorage.setItem("authToken", idToken);

    // 🧠 Tùy chọn: gửi token lên backend xác thực
    const res = await fetch("http://localhost:5000/api/auth/verify-phone", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: idToken }),
      credentials: "include", // ⚠️ bắt buộc để cookie lưu về
    });

    const data = await res.json();
    if (data.success) {
      navigate("/customer/home");
    } else {
      setError("Xác minh thất bại. Vui lòng thử lại.");
    }
  } catch (err) {
    console.error("❌ Lỗi xác minh OTP:", err.code, err.message);
    setError(err.message || "OTP không chính xác hoặc đã hết hạn.");
  }
};



  // 📥 Nhập OTP từng ô
  // Removed old handlers, using OTPInput

  // 🔁 Gửi lại OTP
  const resendOtp = async () => {
    try {
      const appVerifier = window.recaptchaVerifier;
      const formattedPhone = phone.startsWith("+84")
        ? phone.replace(/\s/g, "")
        : "+84" + phone.substring(1);

      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      window.confirmationResult = confirmationResult;
      setCountdown(60);
      setError("");
      console.log("✅ Gửi lại OTP thành công");
    } catch (err) {
      console.error("❌ Lỗi gửi lại OTP:", err.code, err.message);
      setError("Không thể gửi lại OTP. Vui lòng thử lại.");
    }
  };

  // 🔁 Auto focus ô cuối cùng mỗi khi otp thay đổi
  // Removed, handled by OTPInput

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
        {/* 📍 Tiêu đề */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "119px",
            transform: "translateX(-50%)",
          }}
        >
          <span
            style={{
              color: "black",
              fontSize: 28,
              fontFamily: 'Be Vietnam Pro',
              fontWeight: "700",
              whiteSpace: "nowrap",
            }}
          >
            Nhập mã gồm 6 chữ số
          </span>
        </div>

        {/* 📱 Thông báo số/email */}
        <div
          style={{
            position: "absolute",
            left: "33px",
            top: "168px",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <span
            style={{
              color: "#868686",
              fontSize: 12.5,
              fontFamily: 'Be Vietnam Pro',
              fontWeight: "400",
              marginRight: "4px",
            }}
          >
            Mã của bạn đã được gửi đến
          </span>
          <span
            style={{
              color: "#868686",
              fontSize: 12.5,
              fontFamily: 'Be Vietnam Pro',
              fontWeight: "600",
            }}
          >
            {contact}
          </span>
        </div>

        {/* ⬅️ Nút quay lại */}
        <div
          style={{
            position: "absolute",
            left: "12px",
            top: "43px",
            cursor: "pointer",
          }}
          onClick={() => navigate(-1)}
        >
          <BackArrow />
        </div>

        {/* 📤 Form OTP */}
        <form
          onSubmit={handleSubmit}
          style={{
            position: "absolute",
            left: "50%",
            top: "206px",
            transform: "translateX(-50%)",
            width: "300px",
          }}
        >
          <OTPInput
            maxLength={6}
            value={otp}
            onChange={setOtp}
            containerClassName="flex items-center gap-3 has-disabled:opacity-50"
            render={({ slots }) => (
              <div style={{ display: "flex", gap: "6px", justifyContent: "center", marginBottom: "16px" }}>
                {slots.map((slot, idx) => (
                  <Slot key={idx} {...slot} />
                ))}
              </div>
            )}
          />

          {error && <div style={{ color: "red", marginBottom: "16px" }}>{error}</div>}

          {/* 🔁 Gửi lại mã */}
          <div
            style={{
              textAlign: "left",
              width: "100%",
              paddingLeft: "4px",
              fontSize: 14,
              fontFamily: 'Be Vietnam Pro',
              fontWeight: "500",
              cursor: countdown === 0 ? "pointer" : "default",
              marginBottom: "24px",
            }}
            onClick={countdown === 0 ? resendOtp : undefined}
          >
            Gửi lại mã{countdown > 0 ? ` ${countdown}s` : ""}
          </div>

          {/* ✅ Nút xác minh */}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "14px",
              background: "#F9704B",
              color: "white",
              fontSize: 16,
              fontWeight: "600",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Xác minh OTP
          </button>

          {/* ❓ Trợ giúp đăng nhập */}
          <div
            style={{
              marginTop: "24px",
              textAlign: "left",
              cursor: "pointer",
            }}
            onClick={() => setShowHelpPopup(true)}
          >
            <span
              style={{
                color: "#000",
                fontSize: 14,
                fontFamily: 'Be Vietnam Pro',
                fontWeight: "600",
              }}
            >
              Bạn cần trợ giúp đăng nhập?
            </span>
          </div>
        </form>

        <div id="recaptcha-container"></div>
      </div>

      {/* 📦 Popup trợ giúp */}
      <HelpPopup
        isOpen={showHelpPopup}
        onClose={() => setShowHelpPopup(false)}
        phone={phone} // ✅ truyền state phone để giữ khi chuyển sang mật khẩu
      />
    </div>
  );
};

function Slot(props) {
  return (
    <div
      style={{
        width: "45px",
        height: "48px",
        background: "#F2F2F2",
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: props.isActive ? "2px solid #F9704B" : "1px solid #ccc",
        transition: "border-color 0.2s",
      }}
    >
      {props.char !== null && <div style={{ fontSize: 24, fontWeight: "600", color: "black" }}>{props.char}</div>}
    </div>
  );
}

export default OTP;
