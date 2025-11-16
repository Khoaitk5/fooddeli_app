import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Grid,
  Paper,
  Stack,
  Avatar,
  Chip,
  CircularProgress,
  Select,
  MenuItem,
} from "@mui/material";
import { motion } from "motion/react";
import {
  getOverviewStats,
  getWeeklyOrders,
  getUserDistribution,
} from "../../api/adminApi";
import BarChartMini from "../../components/admin/charts/BarChartMini";
import LineChartMini from "../../components/admin/charts/LineChartMini";
import PieChartMini from "../../components/admin/charts/PieChartMini";
import RecentActivity from "../../components/Admin/RecentActivity";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeMonths, setActiveMonths] = useState(6); // chọn số tháng
  const [year, setYear] = useState(new Date().getFullYear()); // lọc năm đặt ở Dashboard

  // Danh sách năm: chỉ tới năm hiện tại (ví dụ 5 năm gần nhất)
  const years = React.useMemo(() => {
    const cur = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => cur - i); // [cur, cur-1, ...]
  }, []);

  // Lấy dữ liệu tổng quan khi load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const overview = await getOverviewStats();
        setStats(overview);
      } catch (error) {
        console.error("❌ Lỗi khi tải dữ liệu dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // Thẻ thống kê nhỏ
  const StatCard = ({ title, value, sub, icon }) => (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: "0 18px 45px rgba(15,23,42,0.12)" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "rgba(148, 163, 184, 0.35)",
        bgcolor: "#ffffff",
        backgroundImage:
          "radial-gradient(circle at 0% 0%, rgba(56,189,248,0.08), transparent 55%), radial-gradient(circle at 100% 0%, rgba(251,146,60,0.1), transparent 55%)",
        p: 2.75,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: "rgba(100,116,139,1)",
          fontSize: "0.875rem",
        }}
      >
        {title}
      </Typography>

      <Box
        sx={{
          mt: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.5,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: "rgba(15,23,42,1)",
              fontSize: "1.6rem",
            }}
          >
            {value ?? "—"}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              display: "block",
              mt: 0.5,
              color: "rgba(100,116,139,1)",
              fontSize: "0.75rem",
            }}
          >
            {sub}
          </Typography>
        </Box>

        {icon && (
          <Box
            sx={{
              flexShrink: 0,
              ml: 1,
            }}
          >
            {icon}
          </Box>
        )}
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {/* 4 Thẻ thống kê */}
      <Grid
        container
        spacing={2}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "nowrap",
          mb: 3,
        }}
      >
        <Grid item xs={12} sm={6} md={3} sx={{ flex: 1 }}>
          <StatCard
            title="Tổng doanh thu"
            value={
              stats?.total_revenue
                ? `₫ ${Number(stats.total_revenue).toLocaleString("vi-VN")}`
                : "₫ 0"
            }
            sub="Tổng doanh thu từ đơn hoàn tất"
            icon={
              <Avatar sx={{ bgcolor: "#FFF1EC", color: "primary.main" }}>
                💰
              </Avatar>
            }
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3} sx={{ flex: 1 }}>
          <StatCard
            title="Tổng đơn hàng"
            value={stats?.total_orders ?? 0}
            sub="Đơn hàng hoàn thành"
            icon={
              <Avatar sx={{ bgcolor: "#FFF1EC", color: "primary.main" }}>
                📦
              </Avatar>
            }
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3} sx={{ flex: 1 }}>
          <StatCard
            title="Khách hàng"
            value={stats?.total_customers ?? 0}
            sub="Người dùng đã đăng ký"
            icon={
              <Avatar sx={{ bgcolor: "#FFF1EC", color: "primary.main" }}>
                👤
              </Avatar>
            }
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3} sx={{ flex: 1 }}>
          <StatCard
            title="Cửa hàng / Shipper"
            value={`${stats?.total_shops ?? 0} / ${stats?.total_shippers ?? 0}`}
            sub="Tổng số cửa hàng & shipper"
            icon={
              <Avatar sx={{ bgcolor: "#FFF1EC", color: "primary.main" }}>
                🚚
              </Avatar>
            }
          />
        </Grid>
      </Grid>

      {/* Biểu đồ doanh thu & đơn hàng */}
      <Grid container spacing={2} sx={{ flexWrap: "nowrap" }}>
        {/* 💰 Biểu đồ doanh thu */}
        <Grid item xs={12} sm={6} md={6} sx={{ flex: 1, minWidth: 0 }}>
          <Paper
            component={motion.div}
            elevation={0}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            sx={{
              p: 2,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "rgba(148,163,184,0.35)",
              backgroundColor: "#ffffff",
              boxShadow: "0 22px 45px rgba(15,23,42,0.08)",
              height: "100%",
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: 1 }}
            >
              <Typography variant="subtitle1" fontWeight={600}>
                Doanh thu theo tháng
              </Typography>

              {/* Cùng hàng: 6 tháng / 12 tháng / Năm */}
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  size="small"
                  label="6 tháng"
                  color={activeMonths === 6 ? "primary" : "default"}
                  variant={activeMonths === 6 ? "filled" : "outlined"}
                  onClick={() => setActiveMonths(6)}
                />
                <Chip
                  size="small"
                  label="12 tháng"
                  color={activeMonths === 12 ? "primary" : "default"}
                  variant={activeMonths === 12 ? "filled" : "outlined"}
                  onClick={() => setActiveMonths(12)}
                />
                <Select
                  size="small"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  sx={{ height: 28, ml: 1 }}
                >
                  {years.map((y) => (
                    <MenuItem key={y} value={y}>
                      Năm {y}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
            </Stack>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Thống kê doanh thu gần đây
            </Typography>

            <BarChartMini months={activeMonths} year={year} />
          </Paper>
        </Grid>

        {/* 📦 Biểu đồ đơn hàng */}
        <Grid item xs={12} sm={6} md={6} sx={{ flex: 1, minWidth: 0 }}>
          <Paper
            component={motion.div}
            elevation={0}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.06, ease: "easeOut" }}
            sx={{
              p: 2,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "rgba(148,163,184,0.35)",
              backgroundColor: "#ffffff",
              boxShadow: "0 22px 45px rgba(15,23,42,0.08)",
              height: "100%",
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: 1 }}
            >
              <Typography variant="subtitle1" fontWeight={600}>
                Đơn hàng trong tuần
              </Typography>
              <Stack direction="row" spacing={1}>
                <Chip
                  size="small"
                  label="Tuần này"
                  color="primary"
                  variant="outlined"
                />
                <Chip size="small" label="Tuần trước" variant="outlined" />
              </Stack>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Số lượng đơn hàng theo ngày
            </Typography>
            <LineChartMini fetchData={getWeeklyOrders} />
          </Paper>
        </Grid>
      </Grid>

      {/* Phân bố người dùng & hoạt động */}
      <Box sx={{ mt: 3 }}>
        <Grid container spacing={2} sx={{ flexWrap: "nowrap" }}>
          <Grid item xs={12} md={6} lg={6} sx={{ flex: 1, minWidth: 0 }}>
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              sx={{
                borderRadius: 3,
                border: "1px solid",
                borderColor: "rgba(148,163,184,0.35)",
                bgcolor: "#ffffff",
                p: { xs: 2.5, sm: 3 },
                boxShadow: "0 22px 45px rgba(15,23,42,0.06)",
                height: "100%",
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 4.5 }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: "grey.800",
                    fontSize: "1.125rem",
                  }}
                >
                  Phân bố người dùng
                </Typography>
                <Box>{/* Placeholder for dropdown if needed */}</Box>
              </Stack>
              <Typography
                variant="body2"
                sx={{
                  color: "grey.500",
                  mb: 1,
                  fontSize: "0.875rem",
                }}
              >
                Tỷ lệ khách hàng, cửa hàng và shipper
              </Typography>
              <PieChartMini fetchData={getUserDistribution} />
            </Box>
          </Grid>

          <Grid item xs={12} md={6} lg={6} sx={{ flex: 1, minWidth: 0 }}>
            <Paper
              component={motion.div}
              elevation={0}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08, ease: "easeOut" }}
              sx={{
                p: 2.5,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "rgba(148,163,184,0.35)",
                backgroundColor: "#ffffff",
                boxShadow: "0 22px 45px rgba(15,23,42,0.06)",
                height: "100%",
              }}
            >
              <RecentActivity />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
