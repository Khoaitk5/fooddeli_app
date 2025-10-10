import React from "react";
import {
  Box,
  Typography,
  Stack,
  Card,
  LinearProgress,
  Button,
  Fade,
  Slide,
  Avatar,
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
  TrendingUp,
  EmojiEvents,
  Speed,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  
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
    <Box sx={{ 
      minHeight: "100vh",
      background: "linear-gradient(135deg, #fff5f2 0%, #f0f9ff 100%)",
      pb: 12
    }}>
      {/* Header với gradient đẹp */}
      <Slide direction="down" in timeout={600}>
        <Box
          sx={{
            background: "linear-gradient(135deg, #ff6b35 0%, #ff5722 100%)",
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
            color: "#fff",
            p: 3,
            mb: 3,
            boxShadow: "0 16px 48px rgba(255,107,53,0.25)",
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              width: 250,
              height: 250,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              transform: 'translate(30%, -30%)'
            }
          }}
        >
          <Stack direction="row" spacing={2.5} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
            <Avatar
              src="https://cdn-icons-png.flaticon.com/512/201/201818.png"
              alt="avatar"
              sx={{
                width: 88,
                height: 88,
                border: "4px solid rgba(255,255,255,0.3)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
              }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>
                {shipper.name}
              </Typography>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  background: 'rgba(255,255,255,0.25)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2.5,
                  px: 1.5,
                  py: 0.5,
                  border: '1px solid rgba(255,255,255,0.3)'
                }}>
                  <Star sx={{ fontSize: 18, color: "#fde047" }} />
                  <Typography sx={{ fontWeight: 700, fontSize: 16 }}>{shipper.rating}</Typography>
                </Box>
                <Box
                  sx={{
                    background: "linear-gradient(135deg, #fde047 0%, #facc15 100%)",
                    color: "#78350f",
                    fontSize: 13,
                    px: 1.75,
                    py: 0.5,
                    borderRadius: 2.5,
                    fontWeight: 800,
                    boxShadow: '0 4px 12px rgba(253,224,71,0.3)'
                  }}
                >
                  {shipper.rank} 💎
                </Box>
              </Stack>
              <Typography sx={{ fontSize: 13, opacity: 0.9, fontWeight: 500 }}>
                Tham gia {shipper.joinDate}
              </Typography>
            </Box>
          </Stack>

          <Stack sx={{ mt: 3, position: 'relative', zIndex: 1 }} spacing={1.25}>
            {[
              { icon: <Phone />, text: shipper.phone },
              { icon: <Email />, text: shipper.email },
              { icon: <LocationOn />, text: shipper.location }
            ].map((item, idx) => (
              <Stack key={idx} direction="row" alignItems="center" spacing={1.5} sx={{
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: 3,
                px: 2,
                py: 1.25,
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                {React.cloneElement(item.icon, { sx: { fontSize: 20 } })}
                <Typography sx={{ fontWeight: 500 }}>{item.text}</Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
      </Slide>

      {/* Container content */}
      <Box sx={{ px: 2.5 }}>
        {/* Thống kê nhanh - Cải thiện design */}
        <Fade in timeout={800}>
          <Stack direction="row" spacing={2} mb={2.5}>
            {[
              { label: "Đơn hôm nay", value: shipper.todayOrders, icon: <LocalShipping />, gradient: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)", color: "#1d4ed8" },
              { label: "Thu nhập hôm nay", value: shipper.todayIncome, icon: <MonetizationOn />, gradient: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)", color: "#16a34a" },
            ].map((item, idx) => (
              <Card
                key={idx}
                sx={{
                  flex: 1,
                  p: 2.5,
                  borderRadius: 4,
                  background: item.gradient,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                  border: '1px solid rgba(0,0,0,0.05)',
                  transition: 'transform 0.2s ease',
                  '&:hover': { transform: 'translateY(-4px)' }
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
                  <Typography sx={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>
                    {item.label}
                  </Typography>
                  <Box sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 2,
                    background: 'rgba(255,255,255,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: item.color
                  }}>
                    {React.cloneElement(item.icon, { sx: { fontSize: 20 } })}
                  </Box>
                </Stack>
                <Typography sx={{ fontWeight: 900, fontSize: 24, color: item.color }}>
                  {item.value}
                </Typography>
              </Card>
            ))}
          </Stack>
        </Fade>

        {/* Đánh giá & Hoàn thành */}
        <Fade in timeout={1000}>
          <Stack direction="row" spacing={2} mb={2.5}>
            {[
              { label: "Đánh giá TB", value: shipper.avgRating, icon: <Star />, gradient: "linear-gradient(135deg, #fef3c7 0%, #fde047 100%)", color: "#ca8a04" },
              { label: "Hoàn thành", value: shipper.completionRate, icon: <Speed />, gradient: "linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)", color: "#c2410c" },
            ].map((item, idx) => (
              <Card
                key={idx}
                sx={{
                  flex: 1,
                  p: 2.5,
                  borderRadius: 4,
                  background: item.gradient,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                  border: '1px solid rgba(0,0,0,0.05)',
                  transition: 'transform 0.2s ease',
                  '&:hover': { transform: 'translateY(-4px)' }
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
                  <Typography sx={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>
                    {item.label}
                  </Typography>
                  <Box sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 2,
                    background: 'rgba(255,255,255,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: item.color
                  }}>
                    {React.cloneElement(item.icon, { sx: { fontSize: 20 } })}
                  </Box>
                </Stack>
                <Typography sx={{ fontWeight: 900, fontSize: 24, color: item.color }}>
                  {item.value}
                </Typography>
              </Card>
            ))}
          </Stack>
        </Fade>

        {/* Cấp độ - Đẹp hơn */}
        <Fade in timeout={1200}>
          <Card
            sx={{
              p: 3,
              borderRadius: 4,
              mb: 2.5,
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
              background: "linear-gradient(135deg, #fff 0%, #fafafa 100%)",
              border: '1px solid rgba(0,0,0,0.05)',
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: 18, color: "#ff6b35", mb: 0.5 }}>
                  Cấp độ Shipper
                </Typography>
                <Typography sx={{ fontSize: 13, color: "#6b7280" }}>
                  Hoàn thành thêm 25 đơn để lên cấp
                </Typography>
              </Box>
              <Box sx={{
                width: 52,
                height: 52,
                borderRadius: 3,
                background: "linear-gradient(135deg, #fef3c7 0%, #fde047 100%)",
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 26,
                boxShadow: '0 4px 12px rgba(253,224,71,0.3)'
              }}>
                🏆
              </Box>
            </Stack>
            
            <Stack direction="row" justifyContent="space-between" mb={1}>
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#374151" }}>{shipper.rank}</Typography>
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#6b7280" }}>{shipper.nextRank}</Typography>
            </Stack>
            
            <Box sx={{ position: 'relative' }}>
              <LinearProgress
                variant="determinate"
                value={shipper.progress}
                sx={{
                  height: 12,
                  borderRadius: 6,
                  background: "#e5e7eb",
                  "& .MuiLinearProgress-bar": {
                    background: "linear-gradient(90deg, #ff6b35 0%, #ff5722 100%)",
                    borderRadius: 6,
                  },
                }}
              />
              <Typography sx={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: 11,
                fontWeight: 800,
                color: '#fff',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)'
              }}>
                {shipper.progress}%
              </Typography>
            </Box>
          </Card>
        </Fade>

        {/* Thành tích & Stats - Modern design */}
        <Stack direction="row" spacing={2} mb={2.5}>
          <Fade in timeout={1400}>
            <Card sx={{
              flex: 1,
              p: 3,
              borderRadius: 4,
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
              background: "linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%)",
              border: '1px solid rgba(255,107,53,0.1)',
            }}>
              <Typography sx={{ fontWeight: 800, fontSize: 16, color: "#c2410c", mb: 2 }}>
                🏆 Thành tích
              </Typography>
              <Stack direction="row" justifyContent="space-around">
                {[
                  { icon: "🏆", label: "Top" },
                  { icon: "⚡", label: "Nhanh" },
                  { icon: "💎", label: "1000+" },
                ].map((item, idx) => (
                  <Box key={idx} textAlign="center">
                    <Box sx={{ 
                      fontSize: 32,
                      width: 56,
                      height: 56,
                      borderRadius: 3,
                      background: 'rgba(255,255,255,0.7)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 0.75,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                    }}>
                      {item.icon}
                    </Box>
                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#92400e" }}>
                      {item.label}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Card>
          </Fade>

          <Fade in timeout={1600}>
            <Card sx={{
              flex: 1,
              p: 3,
              borderRadius: 4,
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
              background: "linear-gradient(135deg, #f0f9ff 0%, #dbeafe 100%)",
              border: '1px solid rgba(59,130,246,0.1)',
            }}>
              <Typography sx={{ fontWeight: 800, fontSize: 16, color: "#1d4ed8", mb: 2 }}>
                📊 Tổng quan
              </Typography>
              <Stack spacing={1.5}>
                {[
                  { label: "Tổng đơn", value: shipper.totalOrders, color: "#ff6b35" },
                  { label: "Thu nhập", value: shipper.totalIncome, color: "#16a34a" },
                  { label: "5 sao", value: shipper.fiveStars, color: "#ca8a04" },
                ].map((item, idx) => (
                  <Stack key={idx} direction="row" justifyContent="space-between" alignItems="center">
                    <Typography sx={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>
                      {item.label}
                    </Typography>
                    <Typography sx={{ fontSize: 16, fontWeight: 900, color: item.color }}>
                      {item.value}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Card>
          </Fade>
        </Stack>

        {/* Navigation buttons - Modern design */}
        <Stack spacing={2}>
          {[
            { label: "Lịch sử giao hàng", icon: <LocalShipping />, route: "/shipper/history", gradient: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)", color: "#1d4ed8" },
            { label: "Thu nhập & Rút tiền", icon: <MonetizationOn />, route: "/shipper/wallet", gradient: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)", color: "#16a34a" },
            { label: "Thống kê hiệu suất", icon: <Insights />, route: "/shipper/earnings", gradient: "linear-gradient(135deg, #fef3c7 0%, #fde047 100%)", color: "#ca8a04" },
            { label: "Cài đặt tài khoản", icon: <Settings />, route: "/shipper/settings", gradient: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)", color: "#4b5563" },
          ].map((item, index) => (
            <Button
              key={index}
              fullWidth
              onClick={() => item.route && navigate(item.route)}
              sx={{
                justifyContent: "flex-start",
                textTransform: "none",
                background: item.gradient,
                border: '1px solid rgba(0,0,0,0.05)',
                color: item.color,
                borderRadius: 4,
                fontWeight: 700,
                py: 2,
                px: 3,
                gap: 2,
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                transition: 'all 0.2s ease',
                "&:hover": { 
                  transform: 'translateY(-2px)',
                  boxShadow: "0 8px 20px rgba(0,0,0,0.1)"
                },
              }}
            >
              {React.cloneElement(item.icon, { sx: { fontSize: 24 } })}
              <Typography sx={{ fontWeight: 700, fontSize: 15 }}>
                {item.label}
              </Typography>
            </Button>
          ))}

          {/* Nút chuyển sang Customer */}
          <Button
            fullWidth
            startIcon={<SwapHoriz />}
            sx={{
              mt: 2,
              background: "linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)",
              border: "2px solid #c084fc",
              borderRadius: 4,
              color: "#7c3aed",
              fontWeight: 800,
              textTransform: "none",
              py: 2,
              fontSize: 15,
              boxShadow: "0 4px 12px rgba(124,58,237,0.2)",
              transition: 'all 0.2s ease',
              "&:hover": {
                transform: 'translateY(-2px)',
                boxShadow: "0 8px 20px rgba(124,58,237,0.3)",
              },
            }}
          >
            Chuyển sang Customer
          </Button>

          {/* Nút đăng xuất */}
          <Button
            fullWidth
            startIcon={<Logout />}
            sx={{
              color: "#ef4444",
              fontWeight: 700,
              textTransform: "none",
              py: 1.75,
              fontSize: 15,
              borderRadius: 4,
              "&:hover": { 
                background: "#fef2f2",
                color: "#dc2626"
              },
            }}
          >
            Đăng xuất
          </Button>

          <Typography align="center" sx={{ color: "#9ca3af", fontSize: 12, mt: 2, fontWeight: 500 }}>
            Shipper App v1.0.0 🚀
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
};

export default Profile;
