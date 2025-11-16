import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import { motion, AnimatePresence } from "motion/react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  getRevenueComparison,
  getTopRevenueShops,
  getTopRevenueShippers,
} from "../../api/adminApi";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import StoreIcon from "@mui/icons-material/Store";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

export default function Revenue() {
  const [comparison, setComparison] = useState([]);
  const [topShops, setTopShops] = useState([]);
  const [topShippers, setTopShippers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [cmp, shops, shippers] = await Promise.all([
          getRevenueComparison(year),
          getTopRevenueShops(year),
          getTopRevenueShippers(year),
        ]);
        setComparison(cmp || []);
        setTopShops(shops || []);
        setTopShippers(shippers || []);
      } catch (err) {
        console.error("❌ Lỗi khi lấy dữ liệu Revenue:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [year]);

  const formatMoney = (v) => {
    const num = Number(v) || 0;
    if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`;
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K`;
    return num.toFixed(0);
  };

  // Calculate totals
  const totalShopRevenue = comparison.reduce((sum, item) => sum + (Number(item.shop_revenue) || 0), 0);
  const totalShipperRevenue = comparison.reduce((sum, item) => sum + (Number(item.shipper_revenue) || 0), 0);
  const totalRevenue = totalShopRevenue + totalShipperRevenue;

  // Custom Tooltip for Chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          component={motion.div}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          sx={{
            background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
            borderRadius: "16px",
            padding: "16px 20px",
            border: "1px solid rgba(99,102,241,0.3)",
            boxShadow: "0 25px 50px rgba(15,23,42,0.6)",
            backdropFilter: "blur(12px)",
            minWidth: "200px",
          }}
        >
          <Typography
            sx={{
              color: "#a5b4fc",
              fontSize: "0.75rem",
              fontWeight: 700,
              mb: 1.5,
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            {label}
          </Typography>
          {payload.map((entry, index) => (
            <Box key={index} sx={{ mb: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: entry.color,
                    boxShadow: `0 0 8px ${entry.color}`,
                  }}
                />
                <Typography sx={{ fontSize: "0.8125rem", color: "#94a3b8", fontWeight: 500 }}>
                  {entry.name}
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontSize: "1.25rem",
                  fontWeight: 800,
                  color: "#ffffff",
                  ml: 2.5,
                }}
              >
                {formatMoney(entry.value)} ₫
              </Typography>
            </Box>
          ))}
        </Box>
      );
    }
    return null;
  };

  // Floating particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2,
  }));

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)",
        }}
      >
        <CircularProgress
          size={56}
          thickness={4}
          sx={{
            color: "#6366f1",
            "& .MuiCircularProgress-circle": {
              strokeLinecap: "round",
            },
          }}
        />
        <Typography
          sx={{
            mt: 3,
            fontSize: "1.125rem",
            fontWeight: 600,
            color: "#64748b",
            letterSpacing: "0.3px",
          }}
        >
          Đang tải dữ liệu doanh thu...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)",
        position: "relative",
        overflow: "hidden",
        pb: 6,
      }}
    >
      {/* Background Particles */}
      {particles.map((particle) => (
        <Box
          key={particle.id}
          component={motion.div}
          animate={{
            y: [0, -40, 0],
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
          sx={{
            position: "absolute",
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            borderRadius: "50%",
            background: "radial-gradient(circle, #6366f1 0%, transparent 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      ))}

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1, pt: 4 }}>
        {/* Header */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          sx={{ mb: 5 }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Box
              component={motion.div}
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              sx={{
                width: 64,
                height: 64,
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                boxShadow: "0 12px 32px rgba(99,102,241,0.4)",
              }}
            >
              <AttachMoneyIcon sx={{ fontSize: 36, color: "#ffffff" }} />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontSize: "2.5rem",
                  fontWeight: 900,
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  lineHeight: 1.2,
                }}
              >
                Báo cáo Doanh thu
              </Typography>
              <Typography
                sx={{
                  fontSize: "1rem",
                  color: "#64748b",
                  fontWeight: 500,
                  mt: 0.5,
                }}
              >
                Thống kê tổng hợp doanh thu Shop & Shipper
              </Typography>
            </Box>
          </Box>

          {/* Year Selector */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 2,
              px: 3,
              py: 1.5,
              borderRadius: 3,
              background: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(99,102,241,0.2)",
              boxShadow: "0 4px 16px rgba(99,102,241,0.1)",
            }}
          >
            <CalendarTodayIcon sx={{ fontSize: 20, color: "#6366f1" }} />
            <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#64748b" }}>
              Năm:
            </Typography>
            <Select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              size="small"
              sx={{
                minWidth: 120,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(99,102,241,0.3)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#6366f1",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#6366f1",
                },
              }}
            >
              {years.map((y) => (
                <MenuItem key={y} value={y}>
                  {y}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
          {/* Total Revenue */}
          <Box sx={{ flex: 1 }}>
            <Card
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(99,102,241,0.2)" }}
              sx={{
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                borderRadius: 4,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <Box
                component={motion.div}
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                sx={{
                  position: "absolute",
                  top: -50,
                  right: -50,
                  width: 200,
                  height: 200,
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)",
                }}
              />
              <CardContent sx={{ position: "relative", zIndex: 1, p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                  <AttachMoneyIcon sx={{ fontSize: 32, color: "rgba(255,255,255,0.9)" }} />
                  <Typography sx={{ fontSize: "0.875rem", fontWeight: 700, color: "rgba(255,255,255,0.8)", textTransform: "uppercase", letterSpacing: "1px" }}>
                    Tổng doanh thu
                  </Typography>
                </Box>
                <Typography
                  component={motion.div}
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  sx={{ fontSize: "2.5rem", fontWeight: 900, color: "#ffffff", lineHeight: 1, mb: 1 }}
                >
                  {formatMoney(totalRevenue)} ₫
                </Typography>
                <Typography sx={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.7)" }}>
                  Năm {year}
                </Typography>
              </CardContent>
            </Card>
          </Box>

          {/* Shop Revenue */}
          <Box sx={{ flex: 1 }}>
            <Card
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(14,165,233,0.2)" }}
              sx={{
                background: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
                borderRadius: 4,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <Box
                component={motion.div}
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "200%",
                  height: "100%",
                  background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
                }}
              />
              <CardContent sx={{ position: "relative", zIndex: 1, p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                  <StoreIcon sx={{ fontSize: 32, color: "rgba(255,255,255,0.9)" }} />
                  <Typography sx={{ fontSize: "0.875rem", fontWeight: 700, color: "rgba(255,255,255,0.8)", textTransform: "uppercase", letterSpacing: "1px" }}>
                    Doanh thu Shop
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: "2.5rem", fontWeight: 900, color: "#ffffff", lineHeight: 1, mb: 1 }}>
                  {formatMoney(totalShopRevenue)} ₫
                </Typography>
                <Typography sx={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.7)" }}>
                  {totalRevenue > 0 ? ((totalShopRevenue / totalRevenue) * 100).toFixed(1) : '0.0'}% tổng doanh thu
                </Typography>
              </CardContent>
            </Card>
          </Box>

          {/* Shipper Revenue */}
          <Box sx={{ flex: 1 }}>
            <Card
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(251,146,60,0.2)" }}
              sx={{
                background: "linear-gradient(135deg, #fb923c 0%, #f97316 100%)",
                borderRadius: 4,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <Box
                component={motion.div}
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
                sx={{
                  position: "absolute",
                  bottom: -50,
                  left: -50,
                  width: 200,
                  height: 200,
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)",
                }}
              />
              <CardContent sx={{ position: "relative", zIndex: 1, p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                  <LocalShippingIcon sx={{ fontSize: 32, color: "rgba(255,255,255,0.9)" }} />
                  <Typography sx={{ fontSize: "0.875rem", fontWeight: 700, color: "rgba(255,255,255,0.8)", textTransform: "uppercase", letterSpacing: "1px" }}>
                    Doanh thu Shipper
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: "2.5rem", fontWeight: 900, color: "#ffffff", lineHeight: 1, mb: 1 }}>
                  {formatMoney(totalShipperRevenue)} ₫
                </Typography>
                <Typography sx={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.7)" }}>
                  {totalRevenue > 0 ? ((totalShipperRevenue / totalRevenue) * 100).toFixed(1) : '0.0'}% tổng doanh thu
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Comparison Chart */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          sx={{
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(20px)",
            borderRadius: 4,
            p: 4,
            mb: 4,
            border: "1px solid rgba(99,102,241,0.1)",
            boxShadow: "0 8px 32px rgba(99,102,241,0.1)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            component={motion.div}
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            sx={{
              position: "absolute",
              top: -100,
              right: -100,
              width: 300,
              height: 300,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <TrendingUpIcon sx={{ fontSize: 28, color: "#6366f1" }} />
              <Typography
                sx={{
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  color: "#1e293b",
                }}
              >
                So sánh doanh thu theo tháng
              </Typography>
            </Box>

            {comparison.length === 0 ? (
              <Typography sx={{ textAlign: "center", py: 8, color: "#64748b" }}>
                Không có dữ liệu thống kê
              </Typography>
            ) : (
              <ResponsiveContainer width="100%" height={450}>
                <BarChart data={comparison} margin={{ top: 20, right: 30, left: 10, bottom: 10 }} barCategoryGap="20%">
                  <defs>
                    <linearGradient id="shopGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0ea5e9" stopOpacity={1} />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.85} />
                    </linearGradient>
                    <linearGradient id="shipperGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fb923c" stopOpacity={1} />
                      <stop offset="100%" stopColor="#f97316" stopOpacity={0.85} />
                    </linearGradient>
                    <filter id="barShadow">
                      <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.3" />
                    </filter>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickFormatter={(v) => v.split(" ")[0]}
                    tick={{ fontSize: 13, fill: "#64748b", fontWeight: 600 }}
                    tickLine={false}
                    axisLine={{ stroke: "rgba(148,163,184,0.2)", strokeWidth: 2 }}
                    tickMargin={12}
                  />
                  <YAxis
                    tickFormatter={(v) => formatMoney(v)}
                    tick={{ fontSize: 12, fill: "#64748b", fontWeight: 600 }}
                    tickLine={false}
                    axisLine={false}
                    width={70}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={false} />
                  <Legend
                    wrapperStyle={{ paddingTop: "20px" }}
                    iconType="circle"
                  />
                  <Bar
                    dataKey="shop_revenue"
                    name="Doanh thu Shop"
                    fill="url(#shopGradient)"
                    radius={[12, 12, 0, 0]}
                    maxBarSize={50}
                    filter="url(#barShadow)"
                    isAnimationActive
                    animationDuration={1200}
                    animationEasing="ease-out"
                  />
                  <Bar
                    dataKey="shipper_revenue"
                    name="Doanh thu Shipper"
                    fill="url(#shipperGradient)"
                    radius={[12, 12, 0, 0]}
                    maxBarSize={50}
                    filter="url(#barShadow)"
                    isAnimationActive
                    animationDuration={1200}
                    animationEasing="ease-out"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Box>
        </Box>

        {/* Top Rankings */}
        <Grid container spacing={4}>
// Phần Top Rankings - tiếp tục từ dòng 582
          {/* Top Shops */}
          <Grid item xs={12} lg={6}>
            <Box
              component={motion.div}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              sx={{
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(20px)",
                borderRadius: 4,
                p: 4,
                border: "1px solid rgba(14,165,233,0.15)",
                boxShadow: "0 8px 32px rgba(14,165,233,0.1)",
                height: "100%",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                component={motion.div}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.1, 0.2, 0.1],
                }}
                transition={{ duration: 4, repeat: Infinity }}
                sx={{
                  position: "absolute",
                  top: -50,
                  left: -50,
                  width: 200,
                  height: 200,
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(14,165,233,0.2) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />

              <Box sx={{ position: "relative", zIndex: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                  <Box
                    component={motion.div}
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
                      boxShadow: "0 8px 24px rgba(14,165,233,0.35)",
                    }}
                  >
                    <StoreIcon sx={{ fontSize: 28, color: "#ffffff" }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: "1.25rem", fontWeight: 800, color: "#1e293b" }}>
                      Top 10 Cửa hàng
                    </Typography>
                    <Typography sx={{ fontSize: "0.8125rem", color: "#64748b", fontWeight: 500 }}>
                      Xếp hạng theo doanh thu
                    </Typography>
                  </Box>
                </Box>

                {topShops.length === 0 ? (
                  <Typography sx={{ textAlign: "center", py: 6, color: "#64748b" }}>
                    Không có dữ liệu
                  </Typography>
                ) : (
                  <Box sx={{ maxHeight: 600, overflowY: "auto", pr: 1 }}>
                    <AnimatePresence>
                      {topShops.slice(0, 10).map((shop, index) => (
                        <Box
                          key={index}
                          component={motion.div}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.02, boxShadow: "0 8px 24px rgba(14,165,233,0.15)" }}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            p: 2,
                            mb: 1.5,
                            borderRadius: 3,
                            background: index < 3
                              ? "linear-gradient(135deg, rgba(14,165,233,0.08) 0%, rgba(6,182,212,0.05) 100%)"
                              : "rgba(248,250,252,0.8)",
                            border: `1px solid ${index < 3 ? "rgba(14,165,233,0.2)" : "rgba(226,232,240,0.8)"}`,
                            transition: "all 0.3s ease",
                            cursor: "pointer",
                          }}
                        >
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: 2,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: index < 3
                                ? "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)"
                                : "linear-gradient(135deg, #94a3b8 0%, #64748b 100%)",
                              boxShadow: index < 3 ? "0 4px 12px rgba(14,165,233,0.3)" : "none",
                              position: "relative",
                            }}
                          >
                            {index < 3 && (
                              <EmojiEventsIcon
                                sx={{
                                  position: "absolute",
                                  top: -8,
                                  right: -8,
                                  fontSize: 16,
                                  color: index === 0 ? "#fbbf24" : index === 1 ? "#94a3b8" : "#fb923c",
                                }}
                              />
                            )}
                            <Typography sx={{ fontSize: "1.125rem", fontWeight: 900, color: "#ffffff" }}>
                              {index + 1}
                            </Typography>
                          </Box>

                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              sx={{
                                fontSize: "0.9375rem",
                                fontWeight: 700,
                                color: "#1e293b",
                                mb: 0.5,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {shop.shop_name}
                            </Typography>
                            <Chip
                              label="Shop"
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: "0.6875rem",
                                fontWeight: 700,
                                background: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
                                color: "#ffffff",
                                border: "none",
                              }}
                            />
                          </Box>

                          <Box sx={{ textAlign: "right" }}>
                            <Typography
                              sx={{
                                fontSize: "1.125rem",
                                fontWeight: 800,
                                color: "#0ea5e9",
                                lineHeight: 1,
                                mb: 0.5,
                              }}
                            >
                              {formatMoney(shop.revenue)}
                            </Typography>
                            <Typography sx={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600 }}>
                              ₫
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </AnimatePresence>
                  </Box>
                )}
              </Box>
            </Box>
          </Grid>

          {/* Top Shippers - tương tự Top Shops nhưng màu orange */}
          <Grid item xs={12} lg={6}>
            <Box
              component={motion.div}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              sx={{
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(20px)",
                borderRadius: 4,
                p: 4,
                border: "1px solid rgba(251,146,60,0.15)",
                boxShadow: "0 8px 32px rgba(251,146,60,0.1)",
                height: "100%",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                component={motion.div}
                animate={{
                  y: [0, 20, 0],
                  opacity: [0.1, 0.2, 0.1],
                }}
                transition={{ duration: 4, repeat: Infinity }}
                sx={{
                  position: "absolute",
                  bottom: -50,
                  right: -50,
                  width: 200,
                  height: 200,
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(251,146,60,0.2) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />

              <Box sx={{ position: "relative", zIndex: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                  <Box
                    component={motion.div}
                    animate={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "linear-gradient(135deg, #fb923c 0%, #f97316 100%)",
                      boxShadow: "0 8px 24px rgba(251,146,60,0.35)",
                    }}
                  >
                    <LocalShippingIcon sx={{ fontSize: 28, color: "#ffffff" }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: "1.25rem", fontWeight: 800, color: "#1e293b" }}>
                      Top 10 Shipper
                    </Typography>
                    <Typography sx={{ fontSize: "0.8125rem", color: "#64748b", fontWeight: 500 }}>
                      Xếp hạng theo doanh thu
                    </Typography>
                  </Box>
                </Box>

                {topShippers.length === 0 ? (
                  <Typography sx={{ textAlign: "center", py: 6, color: "#64748b" }}>
                    Không có dữ liệu
                  </Typography>
                ) : (
                  <Box sx={{ maxHeight: 600, overflowY: "auto", pr: 1 }}>
                    <AnimatePresence>
                      {topShippers.slice(0, 10).map((shipper, index) => (
                        <Box
                          key={index}
                          component={motion.div}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.02, boxShadow: "0 8px 24px rgba(251,146,60,0.15)" }}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            p: 2,
                            mb: 1.5,
                            borderRadius: 3,
                            background: index < 3
                              ? "linear-gradient(135deg, rgba(251,146,60,0.08) 0%, rgba(249,115,22,0.05) 100%)"
                              : "rgba(248,250,252,0.8)",
                            border: `1px solid ${index < 3 ? "rgba(251,146,60,0.2)" : "rgba(226,232,240,0.8)"}`,
                            transition: "all 0.3s ease",
                            cursor: "pointer",
                          }}
                        >
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: 2,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: index < 3
                                ? "linear-gradient(135deg, #fb923c 0%, #f97316 100%)"
                                : "linear-gradient(135deg, #94a3b8 0%, #64748b 100%)",
                              boxShadow: index < 3 ? "0 4px 12px rgba(251,146,60,0.3)" : "none",
                              position: "relative",
                            }}
                          >
                            {index < 3 && (
                              <EmojiEventsIcon
                                sx={{
                                  position: "absolute",
                                  top: -8,
                                  right: -8,
                                  fontSize: 16,
                                  color: index === 0 ? "#fbbf24" : index === 1 ? "#94a3b8" : "#fb923c",
                                }}
                              />
                            )}
                            <Typography sx={{ fontSize: "1.125rem", fontWeight: 900, color: "#ffffff" }}>
                              {index + 1}
                            </Typography>
                          </Box>

                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              sx={{
                                fontSize: "0.9375rem",
                                fontWeight: 700,
                                color: "#1e293b",
                                mb: 0.5,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {shipper.username}
                            </Typography>
                            <Chip
                              label="Shipper"
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: "0.6875rem",
                                fontWeight: 700,
                                background: "linear-gradient(135deg, #fb923c 0%, #f97316 100%)",
                                color: "#ffffff",
                                border: "none",
                              }}
                            />
                          </Box>

                          <Box sx={{ textAlign: "right" }}>
                            <Typography
                              sx={{
                                fontSize: "1.125rem",
                                fontWeight: 800,
                                color: "#fb923c",
                                lineHeight: 1,
                                mb: 0.5,
                              }}
                            >
                              {formatMoney(shipper.total_fee)}
                            </Typography>
                            <Typography sx={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600 }}>
                              ₫
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </AnimatePresence>
                  </Box>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid >
      </Container >
    </Box >
  );
}
