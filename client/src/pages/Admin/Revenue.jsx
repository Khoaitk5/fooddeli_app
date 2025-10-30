// src/pages/admin/Revenue.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Stack,
  CircularProgress,
  Select,
  MenuItem,
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
import {
  getRevenueComparison,
  getTopRevenueShops,
  getTopRevenueShippers,
} from "../../api/adminApi";

export default function Revenue() {
  const [comparison, setComparison] = useState([]);
  const [topShops, setTopShops] = useState([]);
  const [topShippers, setTopShippers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Thêm lọc năm
  const [year, setYear] = useState(new Date().getFullYear());
  const years = React.useMemo(() => {
    const cur = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => cur - i); // 5 năm gần nhất
  }, []);

  // 🧭 Lấy dữ liệu từ API khi load trang hoặc đổi năm
  useEffect(() => {
    const fetchData = async () => {
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

  // ⏳ Loading
  if (loading)
    return (
      <Box textAlign="center" py={5}>
        <CircularProgress size={24} />
        <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
          Đang tải dữ liệu...
        </Typography>
      </Box>
    );

  // ✅ Hàm format tiền tệ kiểu “M” (triệu)
  const formatMoney = (v) => `${(v / 1_000_000).toFixed(2)}M ₫`;

  return (
    <Box sx={{ width: "100%", px: 2, pb: 5 }}>
      {/* 🧾 Tiêu đề */}
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Báo cáo doanh thu
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Thống kê tổng hợp doanh thu giữa Shop và Shipper trong hệ thống
      </Typography>

      {/* 💹 Biểu đồ cột: So sánh Shop vs Shipper */}
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
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            So sánh doanh thu Shop và Shipper theo tháng
          </Typography>

          {/* 🔹 Bộ lọc năm */}
          <Select
            size="small"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            sx={{ height: 32 }}
          >
            {years.map((y) => (
              <MenuItem key={y} value={y}>
                Năm {y}
              </MenuItem>
            ))}
          </Select>
        </Stack>

        {comparison.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Không có dữ liệu thống kê.
          </Typography>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={comparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => v.split(" ")[0]} // ✅ chỉ hiển thị tháng, bỏ năm
              />
              <YAxis
                tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(v) => formatMoney(v)}
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
                labelStyle={{ fontWeight: "bold" }}
              />
              <Legend />
              <Bar dataKey="shop_revenue" name="Shop" fill="#36A2EB" barSize={35} radius={[6, 6, 0, 0]} />
              <Bar dataKey="shipper_revenue" name="Shipper" fill="#FFB347" barSize={35} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Paper>

      {/* 🏆 Top cửa hàng & shipper */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          width: "100%",
        }}
      >
        {/* 🏪 Top cửa hàng */}
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
          <Typography variant="subtitle1" fontWeight={600} gutterBottom align="center">
            🏪 Top 10 cửa hàng theo doanh thu
          </Typography>

          {topShops.length === 0 ? (
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Không có dữ liệu.
            </Typography>
          ) : (
            <Box sx={{ flex: 1, overflowY: "auto", pr: 1 }}>
              {topShops.slice(0, 10).map((shop, i) => (
                <Stack
                  key={i}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ py: 1.2, borderBottom: "1px solid #eee" }}
                >
                  <Typography variant="body2">
                    {i + 1}. {shop.shop_name}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    {formatMoney(shop.revenue)}
                  </Typography>
                </Stack>
              ))}
            </Box>
          )}
        </Paper>

        {/* 🚚 Top Shipper */}
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
          <Typography variant="subtitle1" fontWeight={600} gutterBottom align="center">
            🚚 Top 10 shipper theo doanh thu
          </Typography>

          {topShippers.length === 0 ? (
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Không có dữ liệu.
            </Typography>
          ) : (
            <Box sx={{ flex: 1, overflowY: "auto", pr: 1 }}>
              {topShippers.slice(0, 10).map((s, i) => (
                <Stack
                  key={i}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ py: 1.2, borderBottom: "1px solid #eee" }}
                >
                  <Typography variant="body2">
                    {i + 1}. {s.username}
                  </Typography>
                  <Typography variant="body2" color="info.main">
                    {formatMoney(s.total_fee)}
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
