import React, { useState, useEffect } from "react";
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
  CircularProgress,
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
import { getCurrentUser, getOrdersByShipperId, getMyShipperScore } from "../../api/userApi";

// Helper function để format ngày tham gia
const formatJoinDate = (dateString) => {
  if (!dateString) return "Chưa có";
  const date = new Date(dateString);
  const months = [
    "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
    "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
  ];
  return `${months[date.getMonth()]}, ${date.getFullYear()}`;
};

// Helper function để format tiền
const formatCurrency = (amount) => {
  if (!amount || amount === 0) return "0đ";
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}Mđ`;
  } else if (amount >= 1000) {
    return `${(amount / 1000).toFixed(0)}Kđ`;
  }
  return `${amount.toFixed(0)}đ`;
};

// Helper function để kiểm tra xem ngày có phải hôm nay không (xử lý offset Việt Nam +7 giờ)
const isToday = (dateString) => {
  if (!dateString) {
    console.log("⚠️ [isToday] dateString is null/undefined");
    return false;
  }
  
  try {
    // Parse UTC datetime từ backend
    const utcDate = new Date(dateString);
    
    // DB lưu UTC, nhưng cần so sánh với giờ Việt Nam (UTC+7)
    // Lấy hôm nay theo giờ Việt Nam (hiện tại)
    const vietnamOffset = 7 * 60 * 60 * 1000; // 7 giờ
    
    // Ngày DB đã convert sang Việt Nam
    const dbDateVN = new Date(utcDate.getTime() + vietnamOffset);
    
    // Hôm nay Việt Nam
    const nowVN = new Date(new Date().getTime() + vietnamOffset);
    
    // Hôm qua Việt Nam (vì DB có thể lưu từ hôm qua do UTC chậm hơn)
    const yesterdayVN = new Date(nowVN.getTime() - 24 * 60 * 60 * 1000);
    
    // So sánh ngày
    const dbYear = dbDateVN.getUTCFullYear();
    const dbMonth = dbDateVN.getUTCMonth() + 1;
    const dbDate = dbDateVN.getUTCDate();
    
    const todayYear = nowVN.getUTCFullYear();
    const todayMonth = nowVN.getUTCMonth() + 1;
    const todayDate = nowVN.getUTCDate();
    
    const yesterdayYear = yesterdayVN.getUTCFullYear();
    const yesterdayMonth = yesterdayVN.getUTCMonth() + 1;
    const yesterdayDate = yesterdayVN.getUTCDate();
    
    // Nếu DB date là hôm nay HOẶC hôm qua (do offset) → coi như hôm nay
    const isMatch = 
      (dbYear === todayYear && dbMonth === todayMonth && dbDate === todayDate) ||
      (dbYear === yesterdayYear && dbMonth === yesterdayMonth && dbDate === yesterdayDate);
    
    console.log(`📅 [isToday] dateString=${dateString}`);
    console.log(`📅 [isToday] DB VN: ${dbYear}-${String(dbMonth).padStart(2,'0')}-${String(dbDate).padStart(2,'0')}`);
    console.log(`📅 [isToday] Today VN: ${todayYear}-${String(todayMonth).padStart(2,'0')}-${String(todayDate).padStart(2,'0')}`);
    console.log(`📅 [isToday] Yesterday VN: ${yesterdayYear}-${String(yesterdayMonth).padStart(2,'0')}-${String(yesterdayDate).padStart(2,'0')}`);
    console.log(`📅 [isToday] match=${isMatch}`);
    
    return isMatch;
  } catch (error) {
    console.error("❌ [isToday] Lỗi parse date:", dateString, error);
    return false;
  }
};

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [shipperData, setShipperData] = useState(null);
  
  useEffect(() => {
    const fetchShipperData = async () => {
      try {
        setLoading(true);
        const res = await getCurrentUser();
        
        if (!res?.success || !res?.user) {
          console.error("❌ Không thể lấy thông tin user");
          return;
        }
        
        const user = res.user;
        const shipperProfile = user.shipper_profile;
        
        if (!shipperProfile || !shipperProfile.id) {
          console.error("❌ Không tìm thấy shipper_profile");
          return;
        }
        
        const shipperId = shipperProfile.id;

        // Gọi API để lấy orders của shipper
        const ordersRes = await getOrdersByShipperId(shipperId, { limit: 100 });
        
        // Kiểm tra response format
        if (!ordersRes || !ordersRes.success) {
          console.error("❌ [Profile] API không trả về success:", ordersRes);
        }
        
        // API đã filter chỉ trả về orders completed
        const allOrders = ordersRes?.success ? (ordersRes.data || []) : [];
        console.log("📦 [Profile] Tất cả orders completed nhận được:", allOrders.length);
        console.log("📦 [Profile] Chi tiết orders:", allOrders);
        
        // Lọc orders hôm nay (dựa vào updated_at - thời điểm hoàn thành đơn)
        const todayOrders = allOrders.filter(order => {
          // Dùng updated_at vì đó là thời điểm shipper hoàn thành đơn (status = 'completed')
          const dateToCheck = order.updated_at || order.created_at;
          if (!dateToCheck) {
            console.log(`⚠️ [Profile] Order ${order.order_id} không có updated_at và created_at`);
            return false;
          }
          const isTodayResult = isToday(dateToCheck);
          console.log(`📅 [Profile] Order ${order.order_id}: updated_at=${order.updated_at}, isToday=${isTodayResult}`);
          return isTodayResult;
        });
        
        console.log("📅 [Profile] Orders completed hôm nay:", todayOrders.length);
        console.log("📅 [Profile] Chi tiết orders hôm nay:", todayOrders);

        // Lấy điểm & xếp hạng shipper
        const scoreRes = await getMyShipperScore();
        let totalPoints = 0;
        let completedOrders = 0;
        let rank = null;
        let totalShippers = 0;

        if (scoreRes?.success && scoreRes.data) {
          totalPoints = Number(scoreRes.data.total_points || 0);
          completedOrders = Number(scoreRes.data.completed_orders || 0);
          rank = scoreRes.data.rank ?? null;
          totalShippers = Number(scoreRes.data.total_shippers || 0);
        }
        
        // Tính tổng thu nhập hôm nay (tất cả orders đã là completed rồi)
        const todayIncome = todayOrders.reduce((sum, order) => {
          // Ưu tiên shipper_earn, nếu không có thì dùng delivery_fee
          const earn = parseFloat(order.shipper_earn) || parseFloat(order.delivery_fee) || 0;
          console.log(`💰 [Profile] Order ${order.order_id}: shipper_earn=${order.shipper_earn}, delivery_fee=${order.delivery_fee}, earn=${earn}`);
          return sum + earn;
        }, 0);
        
        console.log("💰 [Profile] Tổng thu nhập hôm nay:", todayIncome);
        console.log("💰 [Profile] Formatted income:", formatCurrency(todayIncome));
        
        // Lấy địa chỉ từ addresses
        const primaryAddress = user.addresses?.find(addr => addr.is_primary) || user.addresses?.[0];
        const location = primaryAddress?.address_line?.address || "Chưa cập nhật";
        
        // Lấy avatar, nếu null thì dùng default
        const avatar = user.avatar_url || "https://cdn-icons-png.flaticon.com/512/201/201818.png";
        
        // Format dữ liệu để hiển thị
        setShipperData({
          name: user.full_name || user.username || "Shipper",
          joinDate: formatJoinDate(shipperProfile.created_at || user.created_at),
          phone: user.phone || "Chưa cập nhật",
          email: user.email || "Chưa cập nhật",
          location: location,
          avatar: avatar,
          rating: user.rating,
          vehicleType: shipperProfile.vehicle_type || "Chưa cập nhật",
          vehicleNumber: shipperProfile.vehicle_number || "Chưa cập nhật",
          status: shipperProfile.status || "pending",
          onlineStatus: shipperProfile.online_status || "offline",
          todayOrders: todayOrders.length || 0,
          todayIncome: todayIncome > 0 ? formatCurrency(todayIncome) : "0đ",
          scorePoints: totalPoints,
          scoreRank: rank,
          scoreTotalShippers: totalShippers,
          completedOrders,
        });
      } catch (error) {
        console.error("❌ Lỗi khi lấy thông tin shipper:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchShipperData();
  }, []);
  
  if (loading) {
    return (
      <Box sx={{ 
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #fff5f2 0%, #f0f9ff 100%)",
      }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (!shipperData) {
    return (
      <Box sx={{ 
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #fff5f2 0%, #f0f9ff 100%)",
        p: 3
      }}>
        <Typography color="error">
          Không thể tải thông tin shipper. Vui lòng thử lại sau.
        </Typography>
      </Box>
    );
  }
  
  const computeRankLabel = (numericRank) => {
    if (!numericRank || !Number.isFinite(Number(numericRank))) return "Mới";
    const n = Number(numericRank);
    if (n <= 10) return "Top";
    if (n <= 50) return "Bạc";
    if (n <= 200) return "Đồng";
    return "Mới";
  };

  const shipper = {
    ...shipperData,
    rank: computeRankLabel(shipperData.scoreRank),
    avgRating: shipperData.rating,
    completionRate: shipperData.completedOrders
      ? `${Math.min(100, shipperData.completedOrders)}%`
      : "0%",
    progress: shipperData.scorePoints
      ? Math.max(0, Math.min(100, Math.round((shipperData.scorePoints % 100) || 0)))
      : 0,
    nextRank: "Đồng",
    totalOrders: shipperData.completedOrders || 0,
    totalIncome: shipperData.todayIncome || "0đ",
    fiveStars: 0,
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
              src={shipper.avatar}
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
                  <Typography sx={{ fontWeight: 700, fontSize: 16 }}>
                    {shipper.rating !== "Chưa có" ? shipper.rating : "N/A"}
                  </Typography>
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

        {/* 📊 Tổng quan - hiển thị các chỉ số chính */}
        <Fade in timeout={1200}>
          <Card
            sx={{
              p: 3,
              borderRadius: 4,
              mb: 2.5,
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
              background: "linear-gradient(135deg, #f0f9ff 0%, #dbeafe 100%)",
              border: "1px solid rgba(59,130,246,0.1)",
            }}
          >
            <Typography sx={{ fontWeight: 800, fontSize: 16, color: "#1d4ed8", mb: 2 }}>
              Tổng quan
            </Typography>

            {/* Các ô thống kê dạng thẻ với icon tròn */}
            <Stack spacing={2}>
              <Stack direction="row" spacing={2}>
                {[ 
                  {
                    icon: <LocalShipping sx={{ fontSize: 20 }} />,
                    label: "Đơn hoàn thành",
                    value: shipper.totalOrders,
                    bg: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
                    iconBg: "#1d4ed8",
                  },
                  {
                    icon: <MonetizationOn sx={{ fontSize: 20 }} />,
                    label: "Thu nhập hôm nay",
                    value: shipper.todayIncome,
                    bg: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
                    iconBg: "#16a34a",
                  },
                ].map((item, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      p: 1.75,
                      borderRadius: 3,
                      background: item.bg,
                      boxShadow: "0 6px 16px rgba(15,23,42,0.08)",
                      border: "1px solid rgba(148,163,184,0.25)",
                      gap: 1.5,
                    }}
                  >
                    <Box
                      sx={{
                        width: 38,
                        height: 38,
                        borderRadius: "999px",
                        backgroundColor: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: item.iconBg,
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>
                        {item.label}
                      </Typography>
                      <Typography sx={{ fontSize: 18, fontWeight: 900, color: "#0f172a", mt: 0.25 }}>
                        {item.value}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>

              <Stack direction="row" spacing={2}>
                {[ 
                  {
                    icon: <EmojiEvents sx={{ fontSize: 20 }} />,
                    label: "Tổng điểm",
                    value: shipper.scorePoints || 0,
                    bg: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                    iconBg: "#ca8a04",
                  },
                  {
                    icon: <Insights sx={{ fontSize: 20 }} />,
                    label: "Xếp hạng",
                    value: shipper.scoreRank ? `#${shipper.scoreRank}/${shipper.scoreTotalShippers || 0}` : "Chưa xếp hạng",
                    bg: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
                    iconBg: "#b91c1c",
                  },
                ].map((item, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      p: 1.75,
                      borderRadius: 3,
                      background: item.bg,
                      boxShadow: "0 6px 16px rgba(15,23,42,0.08)",
                      border: "1px solid rgba(148,163,184,0.25)",
                      gap: 1.5,
                    }}
                  >
                    <Box
                      sx={{
                        width: 38,
                        height: 38,
                        borderRadius: "999px",
                        backgroundColor: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: item.iconBg,
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>
                        {item.label}
                      </Typography>
                      <Typography sx={{ fontSize: 18, fontWeight: 900, color: "#0f172a", mt: 0.25 }}>
                        {item.value}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Stack>
          </Card>
        </Fade>

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
            onClick={() => navigate('/customer/home')}
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
