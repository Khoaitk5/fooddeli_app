import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Stack,
  CircularProgress,
} from "@mui/material";
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

export default function Revenue() {
  const [comparison, setComparison] = useState([]);
  const [topShops, setTopShops] = useState([]);
  const [topShippers, setTopShippers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cmp, shops, shippers] = await Promise.all([
          axios.get("http://localhost:5000/api/admin/stats/revenue/comparison"),
          axios.get("http://localhost:5000/api/admin/stats/revenue/topshops"),
          axios.get("http://localhost:5000/api/admin/stats/revenue/topshippers"),
        ]);
        setComparison(cmp.data.items || []);
        setTopShops(shops.data.items || []);
        setTopShippers(shippers.data.items || []);
      } catch (err) {
        console.error("❌ Lỗi khi lấy dữ liệu Revenue:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <Box textAlign="center" py={5}>
        <CircularProgress size={24} />
        <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
          Đang tải dữ liệu...
        </Typography>
      </Box>
    );

  return (
    <Box sx={{ width: "100%", px: 2, pb: 5 }}>
      {/* 🧾 Tiêu đề */}
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Báo cáo doanh thu
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Thống kê tổng hợp doanh thu giữa Shop và Shipper
      </Typography>

      {/* 💹 Biểu đồ so sánh Shop vs Shipper */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          mb: 4,
        }}
      >
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          So sánh doanh thu Shop và Shipper theo tháng
        </Typography>
        {comparison.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Không có dữ liệu thống kê.
          </Typography>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={comparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(v) => `${Number(v).toLocaleString("vi-VN")} ₫`}
              />
              <Legend />
              <Bar dataKey="shop_revenue" name="Shop" fill="#36A2EB" />
              <Bar dataKey="shipper_revenue" name="Shipper" fill="#FFB347" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Paper>

      {/* 🏆 Top cửa hàng & shipper */}
      {/* 🏆 Top cửa hàng & shipper */}
<Box
  sx={{
    display: "flex",
    flexDirection: { xs: "column", md: "row" },
    gap: 2,
    width: "100%",
  }}
>
  {/* Top cửa hàng */}
  <Paper
    elevation={0}
    sx={{
      flex: 1,
      p: 3,
      borderRadius: 2,
      border: "1px solid",
      borderColor: "divider",
      height: "100%",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <Typography
      variant="subtitle1"
      fontWeight={600}
      gutterBottom
      align="center"
    >
      🏪 Top cửa hàng theo doanh thu
    </Typography>

    {topShops.length === 0 ? (
      <Typography
        variant="body2"
        color="text.secondary"
        textAlign="center"
      >
        Không có dữ liệu.
      </Typography>
    ) : (
      <Box sx={{ flex: 1, overflowY: "auto", pr: 1 }}>
        {topShops.map((shop, i) => (
          <Stack
            key={i}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              py: 1.2,
              borderBottom: "1px solid #eee",
            }}
          >
            <Typography variant="body2">
              {i + 1}. {shop.shop_name}
            </Typography>
            <Typography variant="body2" color="success.main">
              {Number(shop.revenue).toLocaleString("vi-VN")} ₫
            </Typography>
          </Stack>
        ))}
      </Box>
    )}
  </Paper>

  {/* Top Shipper */}
  <Paper
    elevation={0}
    sx={{
      flex: 1,
      p: 3,
      borderRadius: 2,
      border: "1px solid",
      borderColor: "divider",
      height: "100%",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <Typography
      variant="subtitle1"
      fontWeight={600}
      gutterBottom
      align="center"
    >
      🚚 Top shipper theo doanh thu
    </Typography>

    {topShippers.length === 0 ? (
      <Typography
        variant="body2"
        color="text.secondary"
        textAlign="center"
      >
        Không có dữ liệu.
      </Typography>
    ) : (
      <Box sx={{ flex: 1, overflowY: "auto", pr: 1 }}>
        {topShippers.map((s, i) => (
          <Stack
            key={i}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              py: 1.2,
              borderBottom: "1px solid #eee",
            }}
          >
            <Typography variant="body2">
              {i + 1}. {s.username}
            </Typography>
            <Typography variant="body2" color="info.main">
              {Number(s.total_fee).toLocaleString("vi-VN")} ₫
            </Typography>
          </Stack>
        ))}
      </Box>
    )}
  </Paper>
</Box>
    </Box>
  );
} 