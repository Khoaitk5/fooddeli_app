import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SubmitButton from "@/components/shared/SubmitButton";
import BackArrow from "@/components/shared/BackArrow";
import OutlineBorder from "@/components/shared/OutlineBorder";
import InputFrame from "@/components/shared/InputFrame";
import BlackOutline from "@/components/shared/BlackOutline";
import { auth } from "@/firebase/firebaseConfig";
import MiniLogo from "@/components/shared/MiniLogo";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { pxW, pxH } from "../../utils/scale.js";

const LoginPhone = () => {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            console.log("✅ reCAPTCHA verified:", response);
          },
        }
      );
      window.recaptchaVerifier.render().then((widgetId) => {
        window.recaptchaWidgetId = widgetId;
        console.log("✅ reCAPTCHA widget ID:", widgetId);
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (phone.length === 10) {
      try {
        // ✅ 1. Lấy reCAPTCHA đã khởi tạo từ useEffect
        const appVerifier = window.recaptchaVerifier;

        // ✅ 2. Format số sang dạng quốc tế (+84xxxxxxxxx)
        const formattedPhone = "+84" + phone.substring(1);
        alert(`Số gửi OTP: ${formattedPhone}`);

        // ✅ 3. Gửi OTP qua Firebase
        const confirmationResult = await signInWithPhoneNumber(
          auth,
          formattedPhone,
          appVerifier
        );

        // ✅ 4. Lưu confirmationResult để xác minh OTP ở trang OTP
        window.confirmationResult = confirmationResult;

        // ✅ 5. Điều hướng sang trang nhập OTP
        navigate("/otp", { state: { phone: formattedPhone } });
      } catch (err) {
        console.error("Lỗi gửi OTP:", err.code, err.message);
        setError("Không thể gửi OTP. Vui lòng thử lại.");
      }
    } else {
      setError("Vui lòng nhập đúng số điện thoại 10 chữ số");
    }
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value;
    // Only allow digits
    value = value.replace(/\D/g, "");
    // Must start with 0
    if (value && !value.startsWith("0")) {
      value = "0" + value;
    }
    // Max 10 digits
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
    setPhone(value);
  };

  const buttonBackground =
    phone.length === 10 ? "rgba(249, 112, 75, 1)" : "rgba(249, 112, 75, 0.5)";

  return (
    <div
      style={{
        width: pxW(360),
        height: pxH(800),
        position: "relative",
        background: "white",
      }}
    >
      {/* Logo */}
      <div
        style={{
          position: "absolute",
          top: "7.09vh",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
        }}
      >
        <MiniLogo></MiniLogo>
      </div>

      {/* Back Arrow */}
      <div
        style={{
          position: "absolute",
          left: "5.85vw",
          top: "7.85vh",
          cursor: "pointer",
        }}
        onClick={() => navigate("/login")}
      >
        <BackArrow />
      </div>

      {/* Phone Label */}
      <div
        style={{
          position: "absolute",
          left: "19.72vw",
          top: "12.98vh",
        }}
      >
        <div
          style={{
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
            color: "#868686",
            fontSize: "1.4rem",
            fontFamily: "TikTok Sans",
            fontWeight: "500",
            wordWrap: "break-word",
          }}
        >
          Điện thoại
        </div>
        <div
          style={{
            position: "absolute",
            top: "3.02vh",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1,
          }}
        >
          <BlackOutline />
        </div>
      </div>

      {/* Email Label */}
      <div
        style={{
          position: "absolute",
          right: "19.86vw",
          top: "12.98vh",
          cursor: "pointer",
        }}
        onClick={() => navigate("/login/email")}
      >
        <div
          style={{
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
            color: "#868686",
            fontSize: "1.4rem",
            fontFamily: "TikTok Sans",
            fontWeight: "500",
            wordWrap: "break-word",
          }}
        >
          Email
        </div>
      </div>

      {/* Outline Border */}
      <div
        style={{
          position: "absolute",
          top: "16vh",
        }}
      >
        <OutlineBorder />
      </div>

      <div id="recaptcha-container" style={{ display: "none" }}></div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          position: "absolute",
          left: "50%",
          top: "18.75vh",
          transform: "translateX(-50%)",
        }}
      >
        <InputFrame>
          <input
            type="tel"
            placeholder="Số điện thoại"
            value={phone}
            onChange={handlePhoneChange}
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              fontSize: "1.4rem",
              fontWeight: "400",
              fontFamily: "TikTok Sans",
              color: "#aaaaae",
              backgroundColor: "transparent",
            }}
          />
        </InputFrame>
        {error && (
          <div
            style={{
              position: "absolute",
              top: "185px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "267px",
              color: "red",
            }}
          >
            {error}
          </div>
        )}
        <SubmitButton
          style={{
            background: buttonBackground,
            marginTop: "64.625vh",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              textAlign: "center",
              justifyContent: "center",
              display: "flex",
              flexDirection: "column",
              color: "white",
              fontSize: "1.3rem",
              fontFamily: "TikTok Sans",
              fontWeight: "600",
              wordWrap: "break-word",
            }}
          >
            Tiếp tục
          </div>
        </SubmitButton>
      </form>
    </div>
  );
};

export default LoginPhone;
