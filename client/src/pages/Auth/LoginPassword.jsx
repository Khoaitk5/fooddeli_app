import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BackArrow from "@/components/shared/BackArrow";
import HelpPopup from "@/components/shared/HelpPopup";
import { pxW, pxH } from "../../utils/scale.js";

const LoginPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 📞 Nhận số điện thoại từ OTP hoặc LoginPhone
  const phone = location.state?.phone || "";

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showHelpPopup, setShowHelpPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Gửi yêu cầu đăng nhập tới backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phone || !password) {
      alert("⚠️ Vui lòng nhập đầy đủ số điện thoại và mật khẩu");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/auth/login-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });

      const data = await res.json();
      console.log("📡 Phản hồi từ backend:", data);

      if (!res.ok || !data.success) {
        throw new Error(data.message || "❌ Sai số điện thoại hoặc mật khẩu");
      }

      // ✅ Lưu thông tin user và token nếu backend trả về
      if (data.token) localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("🎉 Đăng nhập thành công!");
      navigate("/customer/home");
    } catch (err) {
      console.error("❌ Lỗi đăng nhập:", err.message);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const buttonBackground =
    password.length > 0 ? "rgba(249, 112, 75, 1)" : "rgba(249, 112, 75, 0.5)";

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
          width: pxW(360),
          height: pxH(800),
          position: "relative",
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        {/* 🔙 Back Arrow */}
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

        {/* 🧑‍💻 Title */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "119px",
            transform: "translateX(-50%)",
            textAlign: "center",
            width: "100%",
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
            Nhập mật khẩu
          </span>
        </div>

        {/* 📞 Hiển thị số điện thoại nếu có */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "150px",
            transform: "translateX(-50%)",
            width: "302px",
          }}
        >
          <div
            style={{
              width: "302px",
              height: "50px",
              background: "#F2F2F2",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              padding: "0 16px",
              color: "#555",
              fontSize: 16,
              fontFamily: 'Be Vietnam Pro',
              fontWeight: "600",
            }}
          >
            📞 {phone || "Không có số điện thoại"}
          </div>
        </div>

        {/* 🔐 Password Input */}
        <form
          onSubmit={handleSubmit}
          style={{
            position: "absolute",
            left: "50%",
            top: "220px",
            transform: "translateX(-50%)",
            width: "302px",
          }}
        >
          <div
            style={{
              width: "302px",
              height: "50px",
              background: "#F2F2F2",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              padding: "0 16px",
            }}
          >
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                outline: "none",
                backgroundColor: "transparent",
                color: "black",
                fontSize: 16,
                fontFamily: 'Be Vietnam Pro',
                fontWeight: "400",
              }}
            />
            <button
              type="button"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              onClick={() => setShowPassword(!showPassword)}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color: "#868686",
                padding: "6px 4px",
                fontSize: 13,
                fontFamily: 'Be Vietnam Pro',
                fontWeight: "600",
              }}
            >
              {showPassword ? "Ẩn" : "Hiện"}
            </button>
          </div>
        </form>

        {/* ❓ Help Link */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "290px",
            transform: "translateX(-50%)",
            textAlign: "center",
            width: "100%",
          }}
        >
          <span
            style={{
              color: "black",
              fontSize: 14,
              fontFamily: 'Be Vietnam Pro',
              fontWeight: "700",
              textDecoration: "underline",
              cursor: "pointer",
            }}
            onClick={() => setShowHelpPopup(true)}
          >
            Bạn cần trợ giúp đăng nhập?
          </span>
        </div>

        {/* ▶️ Continue Button */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "746px",
            transform: "translateX(-50%)",
            width: "269px",
            height: "43px",
          }}
        >
          <button
            onClick={handleSubmit}
            disabled={password.length === 0 || loading}
            style={{
              width: "100%",
              height: "100%",
              background: buttonBackground,
              borderRadius: "9999px",
              border: "none",
              cursor:
                password.length > 0 && !loading ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}
          >
            <span
              style={{
                color: "white",
                fontSize: 13,
                fontFamily: 'Be Vietnam Pro',
                fontWeight: "600",
                whiteSpace: "nowrap",
              }}
            >
              {loading ? "🔄 Đang xử lý..." : "Tiếp tục"}
            </span>
          </button>
        </div>
      </div>

      {/* 📦 Help Popup */}
      <HelpPopup
        isOpen={showHelpPopup}
        onClose={() => setShowHelpPopup(false)}
      />
    </div>
  );
};

export default LoginPassword;
