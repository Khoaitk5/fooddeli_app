import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SubmitButton from "@/components/shared/SubmitButton";
import BackArrow from "@/components/shared/BackArrow";
import OutlineBorder from "@/components/shared/OutlineBorder";
import InputFrame from "@/components/shared/InputFrame";
import BlackOutline from "@/components/shared/BlackOutline";
import { auth } from "@/firebase/firebaseConfig";
import { sendSignInLinkToEmail } from "firebase/auth";

const LoginEmail = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // 📤 Gửi liên kết xác thực qua email
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const normalizedEmail = email.trim().toLowerCase();

    if (
      !normalizedEmail ||
      !(
        normalizedEmail.endsWith("@gmail.com") ||
        normalizedEmail.endsWith("@outlook.com") ||
        normalizedEmail.endsWith("@hotmail.com")
      )
    ) {
      setError("📧 Vui lòng nhập email hợp lệ từ Gmail, Outlook hoặc Hotmail.");
      return;
    }

    const actionCodeSettings = {
      url: "http://localhost:5173/finishSignIn", // đổi thành domain thật khi deploy
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, normalizedEmail, actionCodeSettings);
      window.localStorage.setItem("emailForSignIn", normalizedEmail);
      setSuccess("✅ Liên kết đăng nhập đã được gửi! Kiểm tra email của bạn.");
    } catch (err) {
      console.error("❌ Lỗi gửi email:", err.code, err.message);
      setError("Không thể gửi email. Vui lòng thử lại sau.");
    }
  };

  const handleEmailChange = (e) => {
    let value = e.target.value.replace(/\s/g, "");
    value = value.replace(/[^a-zA-Z0-9@._-]/g, "");
    setEmail(value.toLowerCase());
  };

  const buttonBackground =
    email &&
    (email.toLowerCase().endsWith("@gmail.com") ||
      email.toLowerCase().endsWith("@outlook.com") ||
      email.toLowerCase().endsWith("@hotmail.com"))
      ? "rgba(249, 112, 75, 1)"
      : "rgba(249, 112, 75, 0.5)";

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
        {/* 📍 Title */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "44.5px",
            transform: "translateX(-50%)",
          }}
        >
          <span
            style={{
              color: "black",
              fontSize: 16,
              fontFamily: "TikTok Sans",
              fontWeight: "700",
              wordWrap: "break-word",
            }}
          >
            Đăng nhập
          </span>
        </div>

        {/* ⬅️ Back Arrow */}
        <div
          style={{
            position: "absolute",
            left: "12px",
            top: "43px",
            cursor: "pointer",
          }}
          onClick={() => navigate("/login")}
        >
          <BackArrow />
        </div>

        {/* 📞 Phone Label */}
        <div
          style={{
            position: "absolute",
            left: "71px",
            top: "91px",
            cursor: "pointer",
          }}
          onClick={() => navigate("/login/phone")}
        >
          <div
            style={{
              justifyContent: "center",
              display: "flex",
              flexDirection: "column",
              color: "#868686",
              fontSize: 14,
              fontFamily: "TikTok Sans",
              fontWeight: "500",
              wordWrap: "break-word",
            }}
          >
            Điện thoại
          </div>
        </div>

        {/* 📧 Email Label */}
        <div
          style={{
            position: "absolute",
            right: "71.5px",
            top: "91px",
          }}
        >
          <div
            style={{
              justifyContent: "center",
              display: "flex",
              flexDirection: "column",
              color: "#868686",
              fontSize: 14,
              fontFamily: "TikTok Sans",
              fontWeight: "500",
              wordWrap: "break-word",
            }}
          >
            Email
          </div>
        </div>

        {/* 🟧 Outline */}
        <div
          style={{
            position: "absolute",
            top: "115px",
            left: 0,
          }}
        >
          <OutlineBorder />
        </div>

        {/* ⬛ Black Outline */}
        <div
          style={{
            position: "absolute",
            top: "115px",
            right: "29px",
          }}
        >
          <BlackOutline width="123px" />
        </div>

        {/* 📤 Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            position: "absolute",
            left: "50%",
            top: "137px",
            transform: "translateX(-50%)",
            width: "267px",
          }}
        >
          <InputFrame>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
              onKeyDown={(e) => {
                if (e.key === " ") e.preventDefault();
              }}
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                fontSize: "14px",
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

          {success && (
            <div
              style={{
                position: "absolute",
                top: "210px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "267px",
                color: "green",
              }}
            >
              {success}
            </div>
          )}

          <SubmitButton
            style={{ background: buttonBackground, marginTop: "565px" }}
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
                fontSize: 13,
                fontFamily: "TikTok Sans",
                fontWeight: "600",
                wordWrap: "break-word",
              }}
            >
              Gửi liên kết đăng nhập
            </div>
          </SubmitButton>
        </form>
      </div>
    </div>
  );
};

export default LoginEmail;
