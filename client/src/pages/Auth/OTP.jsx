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
  const [isVerifying, setIsVerifying] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const phone = location.state?.phone || "";
  const email = location.state?.email || "";
  const contact = phone || email;

  // Countdown for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Initialize reCAPTCHA
  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
        }
      );
      window.recaptchaVerifier.render();
    }
  }, []);

  // Auto verify when OTP is complete
  useEffect(() => {
    if (otp.length === 6 && !isVerifying) {
      handleVerify();
    }
  }, [otp]);

  // Verify OTP
  const handleVerify = async () => {
    setError("");
    setSuccessMessage("");
    setIsVerifying(true);

    if (!window.confirmationResult) {
      setError("Phiên OTP đã hết hạn. Vui lòng gửi lại mã.");
      setOtp("");
      setIsVerifying(false);
      return;
    }

    try {
      const result = await window.confirmationResult.confirm(otp);
      const user = result.user;

      // Save session to localStorage
      const idToken = await user.getIdToken();
      localStorage.setItem("authToken", idToken);

      // Send token to backend for verification
      const res = await fetch("http://localhost:5000/api/auth/verify-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: idToken }),
        credentials: "include",
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        setSuccessMessage("Xác minh thành công! Đang chuyển hướng...");

        setTimeout(() => {
          if (data.user.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/customer/home");
          }
        }, 1000);
      } else {
        setError("Xác minh thất bại. Vui lòng thử lại.");
        setOtp("");
        setIsVerifying(false);
      }
    } catch (err) {
      console.error("Lỗi xác minh OTP:", err.code, err.message);
      setError("Mã OTP không chính xác. Vui lòng thử lại.");
      setOtp("");
      setIsVerifying(false);
    }
  };

  // Resend OTP
  const resendOtp = async () => {
    try {
      const appVerifier = window.recaptchaVerifier;
      const formattedPhone = phone.startsWith("+84")
        ? phone.replace(/\s/g, "")
        : "+84" + phone.substring(1);

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        appVerifier
      );
      window.confirmationResult = confirmationResult;
      setCountdown(60);
      setError("");
    } catch (err) {
      console.error("Lỗi gửi lại OTP:", err.code, err.message);
      setError("Không thể gửi lại OTP. Vui lòng thử lại.");
    }
  };

  return (
    <div>
      {/* Title */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "10.625vh",
          transform: "translateX(-50%)",
        }}
      >
        <span
          style={{
            color: "black",
            fontSize: "2.8rem",
            fontWeight: "700",
            whiteSpace: "nowrap",
          }}
        >
          Nhập mã gồm 6 chữ số
        </span>
      </div>

      {/* Contact info */}
      <div
        style={{
          position: "absolute",
          left: "8.06vw",
          top: "16.75vh",
          display: "flex",
          flexDirection: "row",
          color: "#868686",
          whiteSpace: "nowrap",
        }}
      >
        <span
          style={{
            fontSize: "1.25rem",
            fontWeight: "400",
            marginRight: "1.11vw",
          }}
        >
          Mã của bạn đã được gửi đến
        </span>
        <span
          style={{
            fontSize: "1.25rem",
            fontWeight: "600",
          }}
        >
          {contact}
        </span>
      </div>

      {/* Back button */}
      <div
        style={{
          position: "absolute",
          left: "5vw",
          top: "3.375vh",
          cursor: "pointer",
        }}
        onClick={() => navigate(-1)}
      >
        <BackArrow />
      </div>

      {/* OTP Input */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "21.5vh",
          transform: "translateX(-50%)",
          width: "83.33vw",
        }}
      >
        <OTPInput
          maxLength={6}
          value={otp}
          onChange={(value) => !isVerifying && setOtp(value)}
          disabled={isVerifying}
          containerClassName="flex items-center gap-3 has-disabled:opacity-50"
          render={({ slots }) => (
            <div
              style={{
                display: "flex",
                gap: "1.67vw",
                justifyContent: "center",
                marginBottom: "2vh",
              }}
            >
              {slots.map((slot, idx) => (
                <Slot
                  key={idx}
                  {...slot}
                  isVerifying={isVerifying}
                  hasError={!!error}
                />
              ))}
            </div>
          )}
        />

        {isVerifying && (
          <div
            style={{
              color: "#408308",
              marginBottom: "2vh",
              fontSize: "1.3rem",
              textAlign: "center",
            }}
          >
            Đang xác minh...
          </div>
        )}

        {successMessage && (
          <div
            style={{
              color: "#408308",
              marginBottom: "2vh",
              fontSize: "1.3rem",
              textAlign: "center",
              fontWeight: "600",
            }}
          >
            ✓ {successMessage}
          </div>
        )}

        {error && !isVerifying && (
          <div
            style={{
              color: "#FF3B30",
              marginBottom: "2vh",
              fontSize: "1.3rem",
              textAlign: "center",
              backgroundColor: "#FFE5E5",
              padding: "1vh 2vw",
              borderRadius: "0.8rem",
            }}
          >
            {error}
          </div>
        )}

        {/* Resend code */}
        <div
          style={{
            textAlign: "left",
            width: "100%",
            paddingLeft: "1.11vw",
            fontSize: "1.4rem",
            fontWeight: "500",
            cursor: countdown === 0 && !isVerifying ? "pointer" : "default",
            marginBottom: "3vh",
            color: countdown === 0 && !isVerifying ? "#408308" : "#868686",
            transition: "color 0.3s",
          }}
          onClick={countdown === 0 && !isVerifying ? resendOtp : undefined}
        >
          {countdown === 0 ? "Gửi lại mã" : `Gửi lại mã sau ${countdown}s`}
        </div>

        {/* Help link */}
        <div
          style={{
            marginTop: "3vh",
            textAlign: "left",
            cursor: "pointer",
          }}
          onClick={() => setShowHelpPopup(true)}
        >
          <span
            style={{
              color: "#000",
              fontSize: "1.4rem",
              fontWeight: "600",
            }}
          >
            Bạn cần trợ giúp đăng nhập?
          </span>
        </div>
      </div>

      <div id="recaptcha-container" />
      <style>{`.grecaptcha-badge { visibility: hidden; }`}</style>

      {/* Help Popup */}
      <HelpPopup
        isOpen={showHelpPopup}
        onClose={() => setShowHelpPopup(false)}
        phone={phone}
      />
    </div>
  );
};

function Slot(props) {
  const getBorderColor = () => {
    if (props.hasError) return "#FF3B30";
    if (props.isActive) return "#F9704B";
    if (props.char !== null) return "#408308";
    return "#E0E0E0";
  };

  return (
    <div
      style={{
        width: "4.5rem",
        height: "4.5rem",
        background: props.hasError ? "#FFE5E5" : "#F2F2F2",
        borderRadius: "0.8rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: `0.2rem solid ${getBorderColor()}`,
        transition: "all 0.3s ease",
        opacity: props.isVerifying ? 0.6 : 1,
        transform: props.hasError ? "scale(0.95)" : "scale(1)",
      }}
    >
      {props.char !== null && (
        <div
          style={{
            fontSize: "2.4rem",
            fontWeight: "600",
            color: props.hasError ? "#FF3B30" : "#363A33",
          }}
        >
          {props.char}
        </div>
      )}
    </div>
  );
}

export default OTP;
