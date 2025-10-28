// src/pages/admin/Dashboard.jsx
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
} from "@mui/material";
import {
  getOverviewStats,
  getMonthlyRevenue,
  getWeeklyOrders,
  getUserDistribution,
} from "../../api/adminApi";
import BarChartMini from "../../components/admin/charts/BarChartMini";
import LineChartMini from "../../components/admin/charts/LineChartMini";
import PieChartMini from "../../components/admin/charts/PieChartMini";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🧭 Lấy dữ liệu tổng quan khi trang load
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

  // 🟡 Hiển thị loading
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
      </Box>
    );
  }

  // 📊 Thẻ thống kê nhỏ
  const StatCard = ({ title, value, sub, icon }) => (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h5" sx={{ mt: 0.5 }}>
            {value ?? "—"}
          </Typography>
          <Typography variant="caption" color="success.main">
            {sub}
          </Typography>
        </Box>
        {icon}
      </Stack>
    </Paper>
  );

  return (
    <Box>
      {/* 🔹 Tiêu đề */}
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
        Dashboard Tổng quan
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Tổng quan về hoạt động và hiệu quả kinh doanh hệ thống giao đồ ăn
      </Typography>

      {/* 🔹 4 Thẻ thống kê */}
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
            icon={<Avatar sx={{ bgcolor: "#FFF1EC", color: "primary.main" }}>💰</Avatar>}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3} sx={{ flex: 1 }}>
          <StatCard
            title="Tổng đơn hàng"
            value={stats?.total_orders ?? 0}
            sub="Đơn hàng hoàn thành"
            icon={<Avatar sx={{ bgcolor: "#FFF1EC", color: "primary.main" }}>📦</Avatar>}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3} sx={{ flex: 1 }}>
          <StatCard
            title="Khách hàng"
            value={stats?.total_customers ?? 0}
            sub="Người dùng đã đăng ký"
            icon={<Avatar sx={{ bgcolor: "#FFF1EC", color: "primary.main" }}>👤</Avatar>}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3} sx={{ flex: 1 }}>
          <StatCard
            title="Cửa hàng / Shipper"
            value={`${stats?.total_shops ?? 0} / ${stats?.total_shippers ?? 0}`}
            sub="Tổng số cửa hàng & shipper"
            icon={<Avatar sx={{ bgcolor: "#FFF1EC", color: "primary.main" }}>🚚</Avatar>}
          />
        </Grid>
      </Grid>

      {/* 🔹 Biểu đồ doanh thu & đơn hàng */}
      <Grid
        container
        spacing={2}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "nowrap",
        }}
      >
        <Grid item xs={12} sm={6} md={6} sx={{ flex: 1, minWidth: 0 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
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
              <Stack direction="row" spacing={1}>
                <Chip size="small" label="6 tháng" color="primary" variant="outlined" />
                <Chip size="small" label="12 tháng" variant="outlined" />
              </Stack>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Thống kê doanh thu gần đây
            </Typography>
            <BarChartMini fetchData={getMonthlyRevenue} />
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={6} sx={{ flex: 1, minWidth: 0 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
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
                <Chip size="small" label="Tuần này" color="primary" variant="outlined" />
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

      {/* 🔹 Biểu đồ phân bố người dùng & hoạt động */}
      <Box sx={{ mt: 3 }}>
        <Grid
          container
          spacing={2}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "nowrap",
          }}
        >
          <Grid item xs={12} md={6} lg={6} sx={{ flex: 1, minWidth: 0 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                height: "100%",
              }}
            >
              <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                Phân bố người dùng
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Tỷ lệ khách hàng, cửa hàng và shipper
              </Typography>
              <PieChartMini fetchData={getUserDistribution} />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6} lg={6} sx={{ flex: 1, minWidth: 0 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                height: "100%",
              }}
            >
              <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                Hoạt động gần đây
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Các sự kiện mới nhất trong hệ thống
              </Typography>
              <Stack spacing={1}>
                {[
                  'Cửa hàng "Phở Hà Nội" đã đăng ký thành công',
                  "Shipper Nguyễn Văn A đã hoàn thành 10 đơn hàng",
                  "Có 3 đăng ký shipper chờ duyệt",
                  "Doanh thu hôm nay đã đạt 45 triệu VND",
                ].map((txt, idx) => (
                  <Stack key={idx} direction="row" spacing={1} alignItems="center">
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        bgcolor: ["success.main", "info.main", "warning.main", "secondary.main"][idx],
                        borderRadius: "50%",
                      }}
                    />
                    <Typography variant="body2">{txt}</Typography>
                    <Chip
                      size="small"
                      label={["5 phút trước", "15 phút trước", "30 phút trước", "1 giờ trước"][idx]}
                      variant="outlined"
                    />
                  </Stack>
                ))}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
