import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MiniLogo from "@/components/shared/MiniLogo";
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
  const [focusedField, setFocusedField] = useState("");

  const styles = {
    wrapper: {
      height: "100vh",
      background: "#ffffff",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "16px 16px 110px",
      boxSizing: "border-box",
      overflow: "hidden",
    },
    card: {
      width: "100%",
      maxWidth: "420px",
      background: "#ffffff",
      borderRadius: "24px",
      padding: "28px 28px 38px",
      boxShadow: "none",
      position: "relative",
      overflow: "hidden",
    },
    logoWrap: {
      display: "flex",
      justifyContent: "center",
      marginBottom: "16px",
      position: "relative",
      zIndex: 1,
    },
    title: {
      textAlign: "center",
      fontSize: "28px",
      fontFamily: "Be Vietnam Pro",
      fontWeight: 700,
      color: "#161823",
      marginBottom: "6px",
      position: "relative",
      zIndex: 1,
    },
    sectionHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "12px",
      position: "relative",
      zIndex: 1,
    },
    label: {
      fontWeight: 600,
      fontSize: "13px",
      color: "#161823",
    },
    switchButton: {
      background: "transparent",
      border: "none",
      color: "#EF5126",
      fontSize: "12px",
      fontWeight: 600,
      cursor: "pointer",
      textDecoration: "underline",
    },
    inputWrapper: {
      borderRadius: "18px",
      height: "56px",
      padding: "0 18px",
      display: "flex",
      alignItems: "center",
      background: "#FAFAFA",
      transition: "all 0.2s ease",
      position: "relative",
      zIndex: 1,
      border: "1.5px solid rgba(22, 24, 35, 0.08)",
    },
    input: {
      flex: 1,
      border: "none",
      outline: "none",
      background: "transparent",
      fontSize: "15px",
      fontFamily: "Be Vietnam Pro",
      color: "#161823",
    },
    helper: {
      fontSize: "12px",
      color: "rgba(22, 24, 35, 0.55)",
      marginTop: "8px",
      lineHeight: 1.4,
      position: "relative",
      zIndex: 1,
    },
    divider: {
      width: "1px",
      height: "60%",
      background: "rgba(22, 24, 35, 0.12)",
    },
    otpButton: {
      border: "none",
      background: "rgba(239, 81, 38, 0.08)",
      color: "#EF5126",
      fontWeight: 600,
      fontSize: "13px",
      padding: "0 18px",
      height: "100%",
      cursor: "pointer",
      transition: "opacity 0.2s ease",
    },
    primaryButton: {
      width: "100%",
      marginTop: "32px",
      height: "52px",
      borderRadius: "999px",
      border: "none",
      background: "linear-gradient(120deg, #FE5621, #FD4E1E)",
      color: "#ffffff",
      fontSize: "16px",
      fontWeight: 700,
      cursor: "pointer",
      boxShadow: "0 12px 24px rgba(253, 78, 30, 0.25)",
      transition: "opacity 0.2s ease",
      position: "relative",
      zIndex: 1,
    },
    primaryButtonDisabled: {
      background: "rgba(22, 24, 35, 0.08)",
      color: "rgba(22, 24, 35, 0.45)",
      boxShadow: "none",
      cursor: "not-allowed",
    },
  };

  const getInputWrapper = (field, options = {}) => {
    const { disabled = false, style: extraStyle = {} } = options;
    const baseBorder = disabled
      ? "1.5px solid rgba(22, 24, 35, 0.05)"
      : focusedField === field
      ? "1.5px solid #EF5126"
      : "1.5px solid rgba(22, 24, 35, 0.08)";

    return {
      ...styles.inputWrapper,
      border: baseBorder,
      background: disabled ? "#F0F0F0" : styles.inputWrapper.background,
      cursor: disabled ? "not-allowed" : "text",
      boxShadow:
        !disabled && focusedField === field
          ? "0 0 0 3px rgba(239, 81, 38, 0.1)"
          : "none",
      ...extraStyle,
    };
  };

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
    <>
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <div style={styles.logoWrap}>
            <MiniLogo />
          </div>
          <div style={styles.title}>Tạo tài khoản</div>
          <div style={{ height: "8px" }} />

          <div style={styles.sectionHeader}>
            <span style={styles.label}>Số điện thoại</span>
            <button
              type="button"
              style={styles.switchButton}
              onClick={() => navigate("/register/email")}
            >
              Đăng ký bằng email
            </button>
          </div>
          <div style={getInputWrapper("phone")}>
            <input
              type="tel"
              placeholder="Ví dụ: 090xxxxxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onFocus={() => setFocusedField("phone")}
              onBlur={() => setFocusedField("")}
              style={styles.input}
            />
          </div>

          <div style={{ marginTop: "20px" }}>
            <div style={styles.sectionHeader}>
              <span style={styles.label}>Mã OTP</span>
              <span style={{ fontSize: "12px", color: "rgba(22, 24, 35, 0.55)" }}>
                {otpVerified ? "Đã xác minh" : "Gửi mã để xác thực"}
              </span>
            </div>
            <div style={getInputWrapper("otp", { style: { padding: 0 } })}>
              <input
                type="text"
                placeholder="Nhập mã gồm 6 chữ số"
                value={otp}
                onChange={(e) => handleOtpChange(e.target.value)}
                maxLength={6}
                onFocus={() => setFocusedField("otp")}
                onBlur={() => setFocusedField("")}
                style={{ ...styles.input, padding: "0 18px" }}
              />
              <div style={styles.divider} />
              <button
                type="button"
                style={{
                  ...styles.otpButton,
                  opacity: loading ? 0.6 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
                onClick={sendOTP}
                disabled={loading}
              >
                {loading ? "Đang gửi..." : "Gửi mã"}
              </button>
            </div>
            <p style={styles.helper}>Mã xác thực đã gửi qua SMS.</p>
          </div>

          <div style={{ marginTop: "20px" }}>
            <div style={styles.sectionHeader}>
              <span style={styles.label}>Mật khẩu</span>
            </div>
            <div style={getInputWrapper("password", { disabled: !otpVerified })}>
              <input
                type="password"
                placeholder="Tối thiểu 6 ký tự"
                disabled={!otpVerified}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField("")}
                style={{
                  ...styles.input,
                  color: !otpVerified ? "rgba(24, 36, 10, 0.45)" : "#162110",
                }}
              />
            </div>
            {!otpVerified && (
              <p style={styles.helper}>Xác minh OTP trước khi tạo mật khẩu.</p>
            )}
          </div>

          <button
            type="button"
            style={{
              ...styles.primaryButton,
              marginTop: "20px",
              ...(!otpVerified ? styles.primaryButtonDisabled : {}),
            }}
            onClick={handleNext}
            disabled={!otpVerified}
          >
            Tiếp tục
          </button>
        </div>
      </div>

      <FooterBar
        text1="Bạn đã có tài khoản?"
        text2="Đăng nhập"
        onClick={() => navigate("/login")}
      />

      {/* 📌 Bắt buộc có container cho reCAPTCHA */}
      <div id="recaptcha-container"></div>
    </>
  );
};

export default RegisterPhone;
