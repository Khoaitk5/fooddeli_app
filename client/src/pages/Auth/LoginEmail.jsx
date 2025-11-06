import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SubmitButton from "@/components/shared/SubmitButton";
import BackArrow from "@/components/shared/BackArrow";
import InputFrame from "@/components/shared/InputFrame";
import MiniLogo from "@/components/shared/MiniLogo";
import { auth } from "@/firebase/firebaseConfig";
import { sendSignInLinkToEmail } from "firebase/auth";
import FooterBar from "@/components/shared/FooterBar";

const LoginEmail = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  // Common styles
  const labelStyle = {
    justifyContent: "center",
    display: "flex",
    flexDirection: "column",
    fontSize: "1.5rem",
    fontWeight: "500",
    wordWrap: "break-word",
  };

  const activeLabelStyle = {
    ...labelStyle,
    color: "#000000", // Black for active
  };

  const inactiveLabelStyle = {
    ...labelStyle,
    color: "#868686", // Gray for inactive
  };

  const outlineStyle = {
    position: "absolute",
    top: "4vh",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 1,
  };

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

  const isValidEmail =
    email &&
    (email.toLowerCase().endsWith("@gmail.com") ||
      email.toLowerCase().endsWith("@outlook.com") ||
      email.toLowerCase().endsWith("@hotmail.com"));

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        background: "#fff",
      }}
    >
      {/* Header Group */}
      <div
        style={{
          position: "absolute",
          top: "2.88vh",
          left: 0,
          right: 0,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Back Arrow */}
        <div
          style={{
            position: "absolute",
            left: "5.85vw",
            cursor: "pointer",
          }}
          onClick={() => navigate("/login")}
        >
          <BackArrow />
        </div>

        {/* Logo */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <MiniLogo></MiniLogo>
        </div>
      </div>

      {/* Phone Link */}
      <div
        style={{
          position: "absolute",
          top: "27.97vh",
          left: "50%",
          transform: "translateX(-50%)",
          cursor: "pointer",
          color: "#408308",
          fontSize: "1.2rem",
          fontWeight: "700",
          wordWrap: "break-word",
          zIndex: 10,
        }}
        onClick={() => navigate("/login/phone")}
      >
        Đăng nhập bằng điện thoại
      </div>

      {/* Login Title */}
      <div
        style={{
          position: "absolute",
          top: "8.79vh",
          zIndex: 10,
          left: "5.33vw",
        }}
      >
        <div
          style={{
            color: "#363A33",
            fontSize: "2.5rem",
            fontWeight: "700",
            wordWrap: "break-word",
            maxWidth: "80vw",
          }}
        >
          Đăng nhập vào tài khoản của bạn
        </div>
      </div>

      <div id="recaptcha-container" style={{ display: "none" }}></div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          position: "absolute",
          left: "50%",
          top: "20vh",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <InputFrame
          isFocused={isFocused}
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={(e) => {
              if (e.key === " ") e.preventDefault();
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
              top: "24vh",
              left: "50%",
              transform: "translateX(-50%)",
              width: "267px",
              color: "green",
              textAlign: "center",
            }}
          >
            {success}
          </div>
        )}
      </form>
      <SubmitButton
        isValid={isValidEmail}
        style={{
          position: "fixed",
          bottom: "9.335vh",
          left: "50%",
          transform: "translateX(-50%)",
        }}
        onClick={handleSubmit}
      >
        Tiếp tục
      </SubmitButton>
      <FooterBar onClick={() => navigate("/register")} />
    </div>
  );
};

export default LoginEmail;
