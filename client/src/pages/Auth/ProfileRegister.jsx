import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MiniLogo from "@/components/shared/MiniLogo";
import FooterBar from "@/components/shared/FooterBar";
import BackArrow from "@/components/shared/BackArrow";

const ProfileRegister = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Nhận dữ liệu từ các bước trước (RegisterPhone, RegisterEmail, AddAddress)
  const phoneFromState = location.state?.phone || "";
  const passwordFromState = location.state?.password || "";
  const addressFromState = location.state?.address || "";
  const usernameFromState = location.state?.username || "";
  const fullnameFromState = location.state?.fullname || "";
  const emailFromState = location.state?.email || "";

  // ✅ Xác định luồng xử lý
  const isPhoneFlow = !!phoneFromState;
  const isGoogleFlow = !phoneFromState && !passwordFromState;

  // ✅ State lưu thông tin người dùng
  const [form, setForm] = useState({
    username: usernameFromState,
    fullname: fullnameFromState,
    email: emailFromState,
    address: addressFromState,
    phone: phoneFromState,
    password: passwordFromState,
  });

  // ✅ Cập nhật lại địa chỉ khi quay lại từ AddAddress
  useEffect(() => {
    if (location.state?.address) {
      setForm((prev) => ({
        ...prev,
        address: location.state.address,
      }));
    }
  }, [location.state?.address]);

  // ✅ Nếu là đăng nhập bằng Google → lấy từ localStorage
  useEffect(() => {
    if (isGoogleFlow) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setForm((prev) => ({
          ...prev,
          email: user.email || prev.email,
          fullname: user.full_name || prev.fullname,
          username: user.username || user.email?.split("@")[0] || "",
        }));
      }
    }
  }, [isGoogleFlow]);

  const [focusedField, setFocusedField] = useState("");

  const styles = {
    wrapper: {
      height: "100vh",
      background: "#ffffff",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "16px 16px 120px",
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
    topBar: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "12px 0 16px",
      minHeight: "44px",
    },
    backButton: {
      position: "absolute",
      left: 0,
      top: "50%",
      transform: "translateY(-50%)",
      width: "44px",
      height: "44px",
      borderRadius: "14px",
      border: "1.5px solid rgba(0, 0, 0, 0.12)",
      background: "#FFFFFF",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "18px",
      color: "#000000",
      cursor: "pointer",
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
      fontWeight: 700,
      fontFamily: "Be Vietnam Pro",
      color: "#161823",
      marginBottom: "10px",
      position: "relative",
      zIndex: 1,
    },
    subtitle: {
      textAlign: "center",
      color: "rgba(22, 24, 35, 0.65)",
      fontSize: "15px",
      lineHeight: 1.6,
      marginBottom: "32px",
      position: "relative",
      zIndex: 1,
    },
    sectionLabel: {
      fontSize: "13px",
      fontWeight: 600,
      fontFamily: "Be Vietnam Pro",
      color: "#161823",
      marginBottom: "8px",
      position: "relative",
      zIndex: 1,
    },
    inputWrapper: {
      borderRadius: "18px",
      height: "56px",
      padding: "0 18px",
      display: "flex",
      alignItems: "center",
      background: "#FAFAFA",
      border: "1.5px solid rgba(22, 24, 35, 0.08)",
      transition: "all 0.2s ease",
      position: "relative",
      zIndex: 1,
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
      marginTop: "6px",
      marginBottom: "18px",
    },
    addressContent: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      gap: "6px",
    },
    addressPlaceholder: {
      fontSize: "14px",
      color: "rgba(22, 24, 35, 0.45)",
    },
    addressText: {
      fontSize: "15px",
      color: "#161823",
      lineHeight: 1.45,
    },
    addressAction: {
      fontSize: "12px",
      fontWeight: 600,
      color: "#EF5126",
    },
    primaryButton: {
      width: "100%",
      height: "54px",
      borderRadius: "999px",
      border: "none",
      marginTop: "24px",
      background: "linear-gradient(120deg, #FE5621, #FD4E1E)",
      color: "#ffffff",
      fontSize: "16px",
      fontWeight: 700,
      cursor: "pointer",
      boxShadow: "0 15px 28px rgba(253, 78, 30, 0.25)",
    },
  };

  const getInputWrapperStyle = (field, options = {}) => {
    const { readOnly = false } = options;
    return {
      ...styles.inputWrapper,
      border:
        focusedField === field && !readOnly
          ? "1.5px solid #EF5126"
          : styles.inputWrapper.border,
      boxShadow:
        focusedField === field && !readOnly
          ? "0 0 0 3px rgba(239, 81, 38, 0.1)"
          : "none",
      cursor: readOnly ? "not-allowed" : "text",
      background: readOnly ? "#F0F0F0" : styles.inputWrapper.background,
    };
  };

  const renderAddress = () => {
    if (!form.address) return "";

    const addressData = form.address;

    if (typeof addressData === "object" && addressData.address_line) {
      const line = addressData.address_line;
      return [line.detail, line.ward, line.district, line.city]
        .filter(Boolean)
        .join(", ");
    }

    if (typeof addressData === "object") {
      return [addressData.detail, addressData.ward, addressData.district, addressData.city]
        .filter(Boolean)
        .join(", ");
    }

    return addressData;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Chuyển sang trang thêm địa chỉ
  const goToAddAddress = () => {
    navigate("/address/add", { state: { ...form } });
  };

  // ✅ Gửi dữ liệu đăng ký
  const handleSubmit = async () => {
    const { username, fullname, email, address, phone, password } = form;

    if (!username || !fullname || !email || !address || !phone) {
      alert("⚠️ Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      let response;

      if (isGoogleFlow) {
        // 🔹 Người dùng Google → cập nhật hồ sơ
        response = await fetch("http://localhost:5000/api/users/me", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ username, fullname, email, address, phone }),
        });
      } else {
        // 🔹 Người dùng mới → đăng ký
        console.log("📤 Địa chỉ gửi lên backend:", address);
        response = await fetch("http://localhost:5000/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username,
            fullname,
            email,
            address,
            phone,
            password,
          }),
        });
      }

      const data = await response.json();
      console.log("📡 Phản hồi backend:", data);

      if (!response.ok) throw new Error(data.message || "Đăng ký thất bại");

      alert("🎉 Hồ sơ đã được hoàn tất!");
      navigate("/customer/home");
    } catch (err) {
      console.error("❌ Lỗi:", err.message);
      alert(err.message || "Đăng ký thất bại. Vui lòng thử lại!");
    }
  };

  return (
    <>
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <div style={styles.topBar}>
            <button type="button" style={styles.backButton} onClick={() => navigate(-1)}>
              <BackArrow width="12px" height="18px" />
            </button>
            <div style={styles.logoWrap}>
              <MiniLogo />
            </div>
          </div>
          <div style={styles.title}>Hoàn tất hồ sơ</div>
          <div style={{ height: "8px" }} />

          <div style={styles.sectionLabel}>Tên đăng nhập</div>
          <div style={getInputWrapperStyle("username")}>
            <input
              type="text"
              name="username"
              placeholder="Nhập tên đăng nhập"
              value={form.username}
              onChange={handleChange}
              onFocus={() => setFocusedField("username")}
              onBlur={() => setFocusedField("")}
              style={styles.input}
            />
          </div>

          <div style={{ ...styles.sectionLabel, marginTop: "22px" }}>Họ và tên</div>
          <div style={getInputWrapperStyle("fullname")}>
            <input
              type="text"
              name="fullname"
              placeholder="Nhập họ và tên"
              value={form.fullname}
              onChange={handleChange}
              onFocus={() => setFocusedField("fullname")}
              onBlur={() => setFocusedField("")}
              style={styles.input}
            />
          </div>

          <div style={{ ...styles.sectionLabel, marginTop: "22px" }}>Email</div>
          <div
            style={getInputWrapperStyle("email", {
              readOnly: isGoogleFlow || !isPhoneFlow,
            })}
          >
            <input
              type="email"
              name="email"
              placeholder="Email của bạn"
              value={form.email}
              onChange={handleChange}
              readOnly={isGoogleFlow || !isPhoneFlow}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField("")}
              style={{
                ...styles.input,
                color:
                  isGoogleFlow || !isPhoneFlow
                    ? "rgba(22, 24, 35, 0.45)"
                    : styles.input.color,
              }}
            />
          </div>

          <div style={{ ...styles.sectionLabel, marginTop: "22px" }}>Địa chỉ giao hàng</div>
          <div
            style={{
              ...styles.inputWrapper,
              alignItems: "flex-start",
              padding: "14px 18px",
              cursor: "pointer",
            }}
            onClick={goToAddAddress}
          >
            <div style={styles.addressContent}>
              {renderAddress() ? (
                <span style={styles.addressText}>{renderAddress()}</span>
              ) : (
                <span style={styles.addressPlaceholder}>
                  Chưa có địa chỉ. Nhấn để thêm mới.
                </span>
              )}
              <span style={styles.addressAction}>Thêm / chỉnh sửa</span>
            </div>
            <span
              style={{
                fontSize: "18px",
                color: "#EF5126",
                marginLeft: "12px",
              }}
            >
              ➜
            </span>
          </div>

          <div style={{ ...styles.sectionLabel, marginTop: "22px" }}>Số điện thoại</div>
          <div
            style={getInputWrapperStyle("phone", {
              readOnly: isPhoneFlow,
            })}
          >
            <input
              type="tel"
              name="phone"
              placeholder="Nhập số điện thoại"
              value={form.phone}
              onChange={handleChange}
              readOnly={isPhoneFlow}
              onFocus={() => setFocusedField("phone")}
              onBlur={() => setFocusedField("")}
              style={{
                ...styles.input,
                color: isPhoneFlow ? "rgba(22, 24, 35, 0.45)" : styles.input.color,
              }}
            />
          </div>
          {isPhoneFlow && (
            <p style={styles.helper}>Số điện thoại đã được xác minh ở bước trước.</p>
          )}

          <button type="button" style={styles.primaryButton} onClick={handleSubmit}>
            Hoàn tất đăng ký
          </button>
        </div>
      </div>

      <FooterBar
        text1="Bạn đã có tài khoản?"
        text2="Đăng nhập"
        onClick={() => navigate("/login")}
      />
    </>
  );
}

export default ProfileRegister;
