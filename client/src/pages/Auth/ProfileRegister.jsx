import React, { useState } from "react";
import { Box, Typography, TextField, Button, InputAdornment } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useNavigate } from "react-router-dom";

const ProfileDetails = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    fullname: "",
    email: "",
    address: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const { username, fullname, email, address } = form;
    if (!username || !fullname || !email || !address) {
      alert("⚠️ Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    console.log("✅ Dữ liệu người dùng:", form);
    alert("Đăng ký hoàn tất! 🎉");
    navigate("/customer/home"); // Chuyển sang trang chính sau khi hoàn tất profile
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

        <TextField
          label="Username"
          name="username"
          value={form.username}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Họ và tên"
          name="fullname"
          value={form.fullname}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Địa chỉ"
          name="address"
          value={form.address}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 3 }}
          onClick={() => navigate('/address/add')}
          InputProps={{
            readOnly: true,
            sx: { cursor: 'pointer' },
            endAdornment: (
              <InputAdornment position="end">
                <ChevronRightIcon sx={{ color: '#A9ADA5' }} />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Số điện thoại"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 3 }}
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

export default ProfileDetails;
