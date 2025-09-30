import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, TextField } from "@mui/material";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 📡 Hàm đăng nhập gọi về backend
  const handleLogin = async () => {
    if (!phone || !password) {
      alert("⚠️ Vui lòng nhập đầy đủ số điện thoại và mật khẩu!");
      return;
    }

    try {
      setLoading(true);

      // 📡 Gọi API backend
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        phone: phone,
        password: password,
      });

      if (res.data.success) {
        alert(res.data.message || "✅ Đăng nhập thành công!");

        // 📦 Lưu thông tin người dùng vào localStorage
        localStorage.setItem("user", JSON.stringify(res.data.user));

        // 📍 Điều hướng sang trang home
        navigate("/customer/home");
      } else {
        alert(res.data.message || "❌ Sai số điện thoại hoặc mật khẩu");
      }
    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      alert(
        err.response?.data?.message ||
          "❌ Không thể kết nối tới server. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFacebook = () => alert("Facebook login not implemented");
  const handleGoogle = () => alert("Google login not implemented");
  const handleGuest = () => navigate("/customer/home");

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        margin: 0,
        padding: 0,
      }}
    >
      {/* ✅ Container giữ toàn bộ UI */}
      <Box
        sx={{
          width: 360,
          height: 800,
          position: "relative",
          background: "white",
          overflow: "hidden",
          boxShadow: "0 0 20px rgba(0,0,0,0.1)",
          borderRadius: 4,
        }}
      >
        {/* Logo */}
        <Box sx={{ left: 152, top: 73, position: "absolute" }}>
          <Typography
            sx={{
              color: "#F9704B",
              fontSize: 25,
              fontWeight: "500",
              display: "inline",
            }}
          >
            Food
          </Typography>
          <Typography
            sx={{
              color: "#F9704B",
              fontSize: 25,
              fontWeight: "700",
              display: "inline",
            }}
          >
            Deli
          </Typography>
        </Box>

        {/* Title */}
        <Box
          sx={{
            width: 144,
            height: 50,
            left: 107,
            top: 202,
            position: "absolute",
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
            color: "#EF5126",
            fontSize: 29,
            fontWeight: "700",
            wordWrap: "break-word",
          }}
        >
          Đăng nhập
        </Box>

        {/* 📱 Ô nhập Số điện thoại */}
        <TextField
          label="Số điện thoại"
          variant="outlined"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          fullWidth
          sx={{
            position: "absolute",
            top: 280,
            left: 46,
            width: 267,
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
            },
          }}
        />

        {/* 🔒 Ô nhập Mật khẩu */}
        <TextField
          label="Mật khẩu"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          sx={{
            position: "absolute",
            top: 340,
            left: 46,
            width: 267,
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
            },
          }}
        />

        {/* ✅ Nút đăng nhập */}
        <Button
          onClick={handleLogin}
          disabled={loading}
          sx={{
            width: 267,
            height: 50,
            left: 46,
            top: 410,
            position: "absolute",
            background: "#F9704B",
            borderRadius: 9999,
            textTransform: "none",
            color: "white",
            fontWeight: "600",
            fontSize: 14,
            "&:hover": { background: "#EF5126" },
          }}
        >
          {loading ? "⏳ Đang đăng nhập..." : "Đăng nhập"}
        </Button>

        {/* Hoặc đăng nhập bằng */}
        <Typography
          sx={{
            position: "absolute",
            top: 480,
            left: 0,
            width: "100%",
            textAlign: "center",
            fontSize: 13,
            color: "#999",
          }}
        >
          — hoặc đăng nhập bằng —
        </Typography>

        {/* Facebook button */}
        <Button
          onClick={handleFacebook}
          sx={{
            width: 267,
            height: 43,
            left: 46,
            top: 510,
            position: "absolute",
            background: "white",
            borderRadius: 12,
            border: "0.8px solid #D0D1D3",
            textTransform: "none",
            justifyContent: "flex-start",
            paddingLeft: "18px",
            "&:hover": { background: "white" },
          }}
        >
          <Typography
            sx={{
              color: "#161823",
              fontSize: 13,
              fontWeight: "600",
              marginLeft: "16px",
            }}
          >
            Tiếp tục với Facebook
          </Typography>
        </Button>

        {/* Google button */}
        <Button
          onClick={handleGoogle}
          sx={{
            width: 267,
            height: 43,
            left: 46,
            top: 560,
            position: "absolute",
            background: "white",
            borderRadius: 12,
            border: "0.8px solid #D0D1D3",
            textTransform: "none",
            justifyContent: "flex-start",
            paddingLeft: "18px",
            "&:hover": { background: "white" },
          }}
        >
          <Typography
            sx={{
              color: "#161823",
              fontSize: 13,
              fontWeight: "600",
              marginLeft: "16px",
            }}
          >
            Tiếp tục với Google
          </Typography>
        </Button>

        {/* Guest button */}
        <Button
          onClick={handleGuest}
          sx={{
            width: 267,
            height: 50,
            left: 46,
            top: 630,
            position: "absolute",
            background: "#F9704B",
            boxShadow: "0px -1px 33.7px rgba(0, 0, 0, 0.25)",
            borderRadius: 9999,
            textTransform: "none",
            "&:hover": { background: "#F9704B" },
          }}
        >
          <Typography sx={{ color: "white", fontSize: 13, fontWeight: "600" }}>
            Tiếp tục với tư cách là khách
          </Typography>
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
