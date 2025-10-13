import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useNavigate, useLocation } from "react-router-dom";

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

  // ✅ Khi thay đổi input
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
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#f5f5f5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: 360,
          minHeight: 700,
          background: "white",
          padding: 4,
          borderRadius: 4,
          boxShadow: "0 0 20px rgba(0,0,0,0.1)",
        }}
      >
        <Typography
          variant="h5"
          sx={{ mb: 3, color: "#EF5126", textAlign: "center" }}
        >
          📝 Hoàn tất hồ sơ
        </Typography>

        {/* Username */}
        <TextField
          label="Username"
          name="username"
          value={form.username}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />

        {/* Họ và tên */}
        <TextField
          label="Họ và tên"
          name="fullname"
          value={form.fullname}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />

        {/* Email */}
        <TextField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          InputProps={{
            readOnly: isGoogleFlow || !isPhoneFlow,
          }}
        />

        {/* Địa chỉ */}
        <TextField
          label="Địa chỉ"
          name="address"
          value={
            typeof form.address === "object" && form.address.address_line
              ? `${form.address.address_line.detail || ""}${
                  form.address.address_line.ward
                    ? ", " + form.address.address_line.ward
                    : ""
                }${
                  form.address.address_line.district
                    ? ", " + form.address.address_line.district
                    : ""
                }${
                  form.address.address_line.city
                    ? ", " + form.address.address_line.city
                    : ""
                }`
              : typeof form.address === "object"
              ? `${form.address.detail || ""}${
                  form.address.ward ? ", " + form.address.ward : ""
                }${
                  form.address.district ? ", " + form.address.district : ""
                }${
                  form.address.city ? ", " + form.address.city : ""
                }`
              : form.address || ""
          }
          fullWidth
          sx={{ mb: 3 }}
          onClick={goToAddAddress}
          InputProps={{
            readOnly: true,
            sx: { cursor: "pointer" },
            endAdornment: (
              <InputAdornment position="end">
                <ChevronRightIcon sx={{ color: "#A9ADA5" }} />
              </InputAdornment>
            ),
          }}
        />

        {/* Số điện thoại */}
        <TextField
          label="Số điện thoại"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 3 }}
          InputProps={{
            readOnly: isPhoneFlow,
          }}
        />

        {/* Nút hoàn tất */}
        <Button
          fullWidth
          variant="contained"
          sx={{
            background: "#F9704B",
            "&:hover": { background: "#EF5126" },
            textTransform: "none",
            fontWeight: 600,
          }}
          onClick={handleSubmit}
        >
          Hoàn tất đăng ký
        </Button>
      </Box>
    </Box>
  );
};

export default ProfileRegister;
