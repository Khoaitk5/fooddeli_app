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

  // ✅ Lấy state truyền từ RegisterPhone hoặc RegisterEmail
  const phoneFromState = location.state?.phone || "";
  const passwordFromState = location.state?.password || "";
  const addressFromState = location.state?.address || "";
  const usernameFromState = location.state?.username || "";
  const fullnameFromState = location.state?.fullname || "";
  const emailFromState = location.state?.email || "";

  const [form, setForm] = useState({
    username: usernameFromState,
    fullname: fullnameFromState,
    email: emailFromState,
    address: addressFromState,
    phone: phoneFromState,
    password: passwordFromState,
  });

  // ✅ Kiểm tra có phải luồng đăng ký bằng số điện thoại hay không
  const isPhoneFlow = !!phoneFromState;

  // ✅ Cập nhật form nếu state thay đổi
  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      phone: phoneFromState || prev.phone,
      address: addressFromState || prev.address,
      username: usernameFromState || prev.username,
      fullname: fullnameFromState || prev.fullname,
      email: emailFromState || prev.email,
      password: passwordFromState || prev.password,
    }));
  }, [
    phoneFromState,
    addressFromState,
    usernameFromState,
    fullnameFromState,
    emailFromState,
    passwordFromState,
  ]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Submit form đăng ký
  const handleSubmit = async () => {
    const { username, fullname, email, address, phone, password } = form;

    console.log("📩 Dữ liệu gửi đi:", {
      username,
      fullname,
      email,
      address,
      phone,
      password,
    });

    if (!username || !fullname || !email || !address || !phone || !password) {
      alert("⚠️ Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("📧 Email không hợp lệ!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
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

      const data = await response.json();
      console.log("📡 Phản hồi từ backend:", data);

      if (!response.ok) {
        throw new Error(data.message || "Đăng ký thất bại");
      }

      console.log("✅ Đăng ký thành công:", data);
      alert("🎉 Tài khoản đã được tạo thành công!");
      navigate("/customer/home");
    } catch (err) {
      console.error("❌ Lỗi đăng ký:", err.message);
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
            readOnly: !isPhoneFlow, // ✅ chỉ cho nhập nếu là RegisterPhone
          }}
        />

        {/* Địa chỉ */}
        <TextField
          label="Địa chỉ"
          name="address"
          value={form.address}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 3 }}
          onClick={() => navigate("/address/add", { state: { form } })}
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
          required
          sx={{ mb: 3 }}
          InputProps={{
            readOnly: isPhoneFlow, // ✅ chỉ khóa nếu đi từ RegisterPhone
          }}
        />

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
