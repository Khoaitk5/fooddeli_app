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

  // ✅ Lấy dữ liệu từ RegisterPhone / RegisterEmail / AddAddress
  const phoneFromState = location.state?.phone || "";
  const passwordFromState = location.state?.password || "";
  const addressFromState = location.state?.address || "";
  const usernameFromState = location.state?.username || "";
  const fullnameFromState = location.state?.fullname || "";
  const emailFromState = location.state?.email || "";

  // ✅ Khởi tạo form với dữ liệu từ state nếu có
  const [form, setForm] = useState({
    username: usernameFromState,
    fullname: fullnameFromState,
    email: emailFromState,
    address: addressFromState,
    phone: phoneFromState,
    password: passwordFromState,
  });

  // ✅ Kiểm tra luồng đăng ký (đi từ số điện thoại hay email)
  const isPhoneFlow = !!phoneFromState;

  // ✅ Cập nhật form mỗi khi location.state thay đổi
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

  // 📥 Cập nhật khi nhập từng trường
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Điều hướng sang trang thêm địa chỉ — truyền nguyên form để giữ lại khi quay về
  const goToAddAddress = () => {
    navigate("/address/add", { state: { ...form } });
  };

  // ✅ Submit form đăng ký
  const handleSubmit = async () => {
    const { username, fullname, email, address, phone, password } = form;

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
            readOnly: !isPhoneFlow, // ✅ nếu đi từ RegisterPhone thì được nhập email
          }}
        />

        {/* Địa chỉ */}
        <TextField
          label="Địa chỉ"
          name="address"
          value={
            typeof form.address === "object" && form.address !== null
              ? `${form.address.detail || ""}${
                  form.address.detail &&
                  (form.address.ward || form.address.city)
                    ? ", "
                    : ""
                }${form.address.ward || ""}${
                  form.address.ward && form.address.city ? ", " : ""
                }${form.address.city || ""}`
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
            readOnly: isPhoneFlow, // ✅ nếu đi từ RegisterPhone thì khoá
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
