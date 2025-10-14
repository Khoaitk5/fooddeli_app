import React from "react";
import { useNavigate } from "react-router-dom";

const HelpPopup = ({ isOpen, onClose, phone }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleOptionClick = (path, extraState = {}) => {
    onClose();
    navigate(path, { state: extraState });
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px 12px 0 0",
          width: "360px",
          maxWidth: "100vw",
          height: "300px",
          position: "relative",
        }}
      >
        {/* Header */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "18px",
            transform: "translateX(-50%)",
            textAlign: "center",
          }}
        >
          <span
            style={{
              color: "#868686",
              fontSize: "12px",
              fontFamily: 'Be Vietnam Pro',
              fontWeight: "600",
            }}
          >
            Chọn một tùy chọn đăng nhập
          </span>
        </div>

        {/* Option 1: Chuyển sang dùng email */}
        <div
          style={optionStyle(50)}
          onClick={() => handleOptionClick("/login/email")}
        >
          <span style={optionText}>Chuyển sang dùng email</span>
        </div>

        {/* Option 2: Chuyển sang dùng mật khẩu */}
        <div
          style={optionStyle(110)}
          onClick={() => handleOptionClick("/login/password", { phone })}
        >
          <span style={optionText}>Chuyển sang dùng mật khẩu</span>
        </div>

        {/* Option 3: Khôi phục tài khoản */}
        <div
          style={optionStyle(170)}
          onClick={() => alert("📢 Tính năng khôi phục tài khoản sắp có!")}
        >
          <span style={optionText}>Khôi phục tài khoản của bạn</span>
        </div>

        {/* Option 4: Hủy */}
        <div
          style={optionStyle(230)}
          onClick={onClose}
        >
          <span style={{ ...optionText, fontWeight: "400" }}>Hủy</span>
        </div>
      </div>
    </div>
  );
};

// 🧩 Style helper
const optionStyle = (top) => ({
  position: "absolute",
  left: "50%",
  top: `${top}px`,
  transform: "translateX(-50%)",
  textAlign: "center",
  cursor: "pointer",
  padding: "16px 20px",
  width: "calc(100% - 40px)",
  transition: "background-color 0.2s ease",
});
const optionText = {
  color: "black",
  fontSize: "16px",
  fontFamily: 'Be Vietnam Pro',
  fontWeight: "600",
};

export default HelpPopup;
