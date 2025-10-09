import React from "react";
import {
  Box,
  Typography,
  Stack,
  Card,
  LinearProgress,
  Button,
} from "@mui/material";
import {
  Star,
  Phone,
  Email,
  LocationOn,
  LocalShipping,
  MonetizationOn,
  Insights,
  Settings,
  SwapHoriz,
  Logout,
} from "@mui/icons-material";

const Profile = () => {
  const shipper = {
    name: "Nguyễn Văn Shipper",
    joinDate: "Tháng 3, 2023",
    phone: "0901234567",
    email: "shipper@example.com",
    location: "Quận 1, TP.HCM",
    rating: 4.8,
    rank: "Kim Cương",
    todayOrders: 12,
    todayIncome: "285Kđ",
    avgRating: 4.8,
    completionRate: "98.5%",
    progress: 75,
    nextRank: "Huyền Thoại",
    totalOrders: 1247,
    totalIncome: "45.8Mđ",
    fiveStars: 856,
  };

  return (
    <Box sx={{ p: 2, backgroundColor: "#F8F9FB", minHeight: "100vh" }}>
      {/* Header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #FF7C4B, #FF3B3B)",
          borderRadius: 3,
          color: "#fff",
          p: 2.5,
          mb: 3,
          boxShadow: "0 6px 12px rgba(255, 124, 75, 0.25)",
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            component="img"
            src="https://cdn-icons-png.flaticon.com/512/201/201818.png"
            alt="avatar"
            sx={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "#fff3",
              border: "2px solid rgba(255,255,255,0.3)",
              objectFit: "cover",
            }}
          />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {shipper.name}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Star sx={{ fontSize: 16, color: "#FFD700" }} />
              <Typography sx={{ fontWeight: 600 }}>{shipper.rating}</Typography>
              <Typography
                sx={{
                  background: "#FFD70022",
                  color: "#FFD700",
                  fontSize: 12,
                  px: 1,
                  py: 0.2,
                  borderRadius: 1,
                  fontWeight: 600,
                }}
              >
                {shipper.rank}
              </Typography>
            </Stack>
            <Typography sx={{ fontSize: 12, opacity: 0.9 }}>
              Tham gia {shipper.joinDate}
            </Typography>
          </Box>
        </Stack>

        <Stack sx={{ mt: 2.5 }} spacing={0.8}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Phone fontSize="small" /> <Typography>{shipper.phone}</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Email fontSize="small" /> <Typography>{shipper.email}</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <LocationOn fontSize="small" />{" "}
            <Typography>{shipper.location}</Typography>
          </Stack>
        </Stack>
      </Box>

      {/* --- Thống kê nhanh --- */}
      <Stack direction="row" spacing={2} mb={2}>
        <Card
          sx={{
            flex: 1,
            p: 2,
            borderRadius: 3,
            background: "#EAF3FF",
            boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
          }}
        >
          <Typography sx={{ fontSize: 13, color: "#5A6C7D" }}>
            Đơn hôm nay
          </Typography>
          <Typography sx={{ fontWeight: 700, fontSize: 20, color: "#1E293B" }}>
            {shipper.todayOrders}
          </Typography>
        </Card>

        <Card
          sx={{
            flex: 1,
            p: 2,
            borderRadius: 3,
            background: "#E8FFF2",
            boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
          }}
        >
          <Typography sx={{ fontSize: 13, color: "#5A6C7D" }}>
            Thu nhập hôm nay
          </Typography>
          <Typography sx={{ fontWeight: 700, fontSize: 20, color: "#1E293B" }}>
            {shipper.todayIncome}
          </Typography>
        </Card>
      </Stack>

      {/* --- Đánh giá & Hoàn thành --- */}
      <Stack direction="row" spacing={2} mb={2}>
        <Card
          sx={{
            flex: 1,
            p: 2,
            borderRadius: 3,
            background: "#FFF7E6",
            boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
          }}
        >
          <Typography sx={{ fontSize: 13, color: "#5A6C7D" }}>
            Đánh giá TB
          </Typography>
          <Typography sx={{ fontWeight: 700, fontSize: 20, color: "#1E293B" }}>
            {shipper.avgRating}
          </Typography>
        </Card>
        <Card
          sx={{
            flex: 1,
            p: 2,
            borderRadius: 3,
            background: "#FFF3F2",
            boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
          }}
        >
          <Typography sx={{ fontSize: 13, color: "#5A6C7D" }}>
            Hoàn thành
          </Typography>
          <Typography sx={{ fontWeight: 700, fontSize: 20, color: "#1E293B" }}>
            {shipper.completionRate}
          </Typography>
        </Card>
      </Stack>

      {/* --- Cấp độ --- */}
      <Card
        sx={{
          p: 2,
          borderRadius: 3,
          mb: 2,
          boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
        }}
      >
        <Typography sx={{ fontWeight: 600, mb: 1, color: "#FF6B3D" }}>
          Cấp độ Shipper
        </Typography>
        <Stack direction="row" justifyContent="space-between">
          <Typography sx={{ fontSize: 13 }}>{shipper.rank}</Typography>
          <Typography sx={{ fontSize: 13 }}>{shipper.nextRank}</Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={shipper.progress}
          sx={{
            height: 8,
            borderRadius: 4,
            my: 1,
            background: "#F2F2F2",
            "& .MuiLinearProgress-bar": {
              backgroundColor: "#FF7C4B",
            },
          }}
        />
        <Typography sx={{ fontSize: 12, color: "#888" }}>
          Hoàn thành thêm 25 đơn để lên cấp
        </Typography>
      </Card>

      {/* --- Thành tích nổi bật --- */}
      <Card
        sx={{
          p: 2,
          borderRadius: 3,
          mb: 2,
          boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
        }}
      >
        <Typography sx={{ fontWeight: 600, mb: 1, color: "#FF6B3D" }}>
          Thành tích nổi bật
        </Typography>
        <Stack direction="row" justifyContent="space-around" sx={{ mt: 1 }}>
          <Box textAlign="center">
            <Typography sx={{ fontSize: 28 }}>🏆</Typography>
            <Typography sx={{ fontSize: 13 }}>Top Shipper</Typography>
          </Box>
          <Box textAlign="center">
            <Typography sx={{ fontSize: 28 }}>⚡</Typography>
            <Typography sx={{ fontSize: 13 }}>Giao nhanh</Typography>
          </Box>
          <Box textAlign="center">
            <Typography sx={{ fontSize: 28 }}>💎</Typography>
            <Typography sx={{ fontSize: 13 }}>1000+ đơn</Typography>
          </Box>
        </Stack>
      </Card>

      {/* --- Thống kê tổng quan --- */}
      <Card
        sx={{
          p: 2,
          borderRadius: 3,
          mb: 3,
          boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
        }}
      >
        <Typography sx={{ fontWeight: 600, mb: 1, color: "#FF6B3D" }}>
          Thống kê tổng quan
        </Typography>

        <Stack spacing={1}>
          <Typography sx={{ fontSize: 13 }}>
            Tổng đơn hàng:{" "}
            <strong style={{ color: "#FF6B3D" }}>{shipper.totalOrders}</strong>
          </Typography>
          <Typography sx={{ fontSize: 13 }}>
            Tổng thu nhập:{" "}
            <strong style={{ color: "#2ECC71" }}>{shipper.totalIncome}</strong>
          </Typography>
          <Typography sx={{ fontSize: 13 }}>
            Đánh giá 5 sao:{" "}
            <strong style={{ color: "#FFB700" }}>{shipper.fiveStars}</strong>
          </Typography>
        </Stack>
      </Card>

      {/* --- Các nút điều hướng --- */}
      <Stack spacing={1.3}>
        {[
          { label: "Lịch sử giao hàng", icon: <LocalShipping /> },
          { label: "Thu nhập & Rút tiền", icon: <MonetizationOn /> },
          { label: "Thống kê hiệu suất", icon: <Insights /> },
          { label: "Cài đặt tài khoản", icon: <Settings /> },
        ].map((item, index) => (
          <Button
            key={index}
            variant="outlined"
            fullWidth
            sx={{
              justifyContent: "flex-start",
              textTransform: "none",
              borderColor: "#E0E0E0",
              color: "#333",
              background: "#fff",
              borderRadius: 3,
              fontWeight: 600,
              py: 1.2,
              px: 2,
              gap: 1.5,
              boxShadow: "0 3px 6px rgba(0,0,0,0.03)",
              "&:hover": { background: "#FFF7F3" },
            }}
          >
            {item.icon}
            {item.label}
          </Button>
        ))}

        {/* Nút chuyển sang Customer */}
        <Button
          fullWidth
          variant="outlined"
          startIcon={<SwapHoriz />}
          sx={{
            mt: 1,
            background: "#F2ECFF",
            borderColor: "#C9B6FF",
            borderWidth: 1.5,
            borderRadius: 3,
            color: "#5E3EC8",
            fontWeight: 700,
            textTransform: "none",
            py: 1.3,
            "&:hover": {
              background: "#E5DFFF",
            },
          }}
        >
          Chuyển sang Customer
        </Button>

        {/* Nút đăng xuất */}
        <Button
          fullWidth
          variant="text"
          startIcon={<Logout />}
          sx={{
            color: "#FF3B3B",
            fontWeight: 700,
            textTransform: "none",
            mt: 1,
            "&:hover": { background: "#FFF0F0" },
          }}
        >
          Đăng xuất
        </Button>

        <Typography align="center" sx={{ color: "#aaa", fontSize: 12, mt: 1 }}>
          Shipper App v1.0.0
        </Typography>
      </Stack>
    </Box>
  );
};

export default Profile;
