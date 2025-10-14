import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SubmitButton from "@/components/shared/SubmitButton";
import BackArrow from "@/components/shared/BackArrow";
import OutlineBorder from "@/components/shared/OutlineBorder";
import InputFrame from "@/components/shared/InputFrame";
import BlackOutline from "@/components/shared/BlackOutline";
import MiniLogo from "@/components/shared/MiniLogo";
import { auth } from "@/firebase/firebaseConfig";
import { sendSignInLinkToEmail } from "firebase/auth";
import { pxW, pxH } from "../../utils/scale.js";

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
            fontSize: "1.4rem",
            fontFamily: 'Be Vietnam Pro',
            fontWeight: "500",
            wordWrap: "break-word",
          }}
        >
          Điện thoại
        </div>
      </div>

      {/* Email Label */}
      <div
        style={{
          position: "absolute",
          right: "19.86vw",
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
            fontFamily: 'Be Vietnam Pro',
            fontWeight: "500",
            wordWrap: "break-word",
          }}
        >
          Email
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

      {/* Outline Border */}
      <div
        style={{
          position: "absolute",
          top: "16vh",
        }}
      >
        <OutlineBorder />
      </div>

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
              fontSize: "1.4rem",
              fontWeight: "400",
              fontFamily: 'Be Vietnam Pro',
              color: "#aaaaae",
              backgroundColor: "transparent",
            }}
          />
        </InputFrame>

        {error && (
          <div
            style={{
              position: "absolute",
              top: "22vh",
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
              top: "24vh",
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
              fontFamily: 'Be Vietnam Pro',
              fontWeight: "600",
              wordWrap: "break-word",
            }}
          >
            Gửi liên kết đăng nhập
          </div>
        </SubmitButton>
      </form>
    </div>
  );
};

export default LoginEmail;
