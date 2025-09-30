import React, { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    if (!phone || !otp || !password) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    alert(`📱 SĐT: ${phone}\n📩 Mã xác nhận: ${otp}\n🔐 Mật khẩu: ${password}`);
    navigate("/register/profile");
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
      {/* Container chính */}
      <Box
        sx={{
          width: 360,
          height: 800,
          background: "white",
          position: "relative",
          overflow: "hidden",
          borderRadius: 4,
          boxShadow: "0 0 20px rgba(0,0,0,0.1)",
        }}
      >
        {/* Logo */}
        <Box sx={{ position: "absolute", top: 73, left: 152 }}>
          <Typography sx={{ color: "#F9704B", fontSize: 25, fontWeight: 500, display: "inline" }}>
            Food
          </Typography>
          <Typography sx={{ color: "#F9704B", fontSize: 25, fontWeight: 700, display: "inline" }}>
            Deli
          </Typography>
        </Box>

        {/* Tiêu đề */}
        <Typography
          sx={{
            position: "absolute",
            top: 213,
            left: 124,
            fontSize: 29,
            fontWeight: 700,
            color: "#EF5126",
            fontFamily: "TikTok Sans",
          }}
        >
          Đăng ký
        </Typography>

        {/* Ô nhập Số điện thoại */}
        <TextField
          label="Số điện thoại"
          variant="outlined"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          sx={{
            position: "absolute",
            top: 311,
            left: 63,
            width: 232,
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              background: "rgba(22, 24, 35, 0.06)",
            },
            "& .MuiInputLabel-root": {
              fontSize: 12,
            },
          }}
        />

        {/* Ô nhập mã OTP */}
        <TextField
          label="Mã xác nhận"
          variant="outlined"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          sx={{
            position: "absolute",
            top: 369,
            left: 63,
            width: 232,
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              background: "rgba(22, 24, 35, 0.06)",
            },
            "& .MuiInputLabel-root": {
              fontSize: 12,
            },
          }}
        />

        {/* Gửi mã */}
        <Button
          sx={{
            position: "absolute",
            top: 377,
            left: 240,
            fontSize: 11,
            color: "#EF5126",
            textTransform: "none",
          }}
        >
          Gửi mã
        </Button>

        {/* Ô nhập mật khẩu */}
        <TextField
          label="Mật khẩu"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{
            position: "absolute",
            top: 427,
            left: 63,
            width: 232,
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              background: "rgba(22, 24, 35, 0.06)",
            },
            "& .MuiInputLabel-root": {
              fontSize: 12,
            },
          }}
        />

        {/* Nút Tiếp */}
        <Button
          onClick={handleRegister}
          sx={{
            position: "absolute",
            top: 490,
            left: 63,
            width: 232,
            height: 43,
            borderRadius: "9999px",
            background: "#F9704B",
            color: "white",
            fontWeight: 600,
            "&:hover": { background: "#EF5126" },
          }}
        >
          Tiếp
        </Button>

        {/* Đường link chuyển sang đăng nhập */}
        <Typography
          sx={{
            position: "absolute",
            bottom: 20,
            width: "100%",
            textAlign: "center",
            fontSize: 14,
          }}
        >
          Bạn đã có tài khoản?{" "}
          <span
            style={{
              color: "#EF5126",
              fontWeight: "600",
              cursor: "pointer",
            }}
            onClick={() => navigate("/login")}
          >
            Đăng nhập
          </span>
        </Typography>
      </Box>
    </Box>
  );
};

export default Register;
