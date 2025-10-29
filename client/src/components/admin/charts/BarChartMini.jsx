import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import axios from "axios";
import { CircularProgress, Box, Typography, Stack, Select, MenuItem } from "@mui/material";

const BarChartMini = ({ months = 6 }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]);

  // ✅ Hàm gọi API lấy dữ liệu theo tháng + năm
  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5000/api/admin/stats/dashboard/monthly?months=${months}&year=${year}`)
      .then((res) => {
        const formatted = res.data.items.map((i) => ({
          name: i.month,
          revenue: Number(i.revenue) || 0,
        }));
        setData(formatted);
      })
      .catch((err) => console.error("❌ Lỗi lấy dữ liệu BarChart:", err))
      .finally(() => setLoading(false));
  }, [months, year]);

  // ✅ Tạo danh sách năm (3 năm gần nhất)
  useEffect(() => {
    const current = new Date().getFullYear();
    setAvailableYears([current - 1, current, current + 1]);
  }, []);

  if (loading)
    return (
      <Box textAlign="center" py={4}>
        <CircularProgress size={20} />
        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
          Đang tải...
        </Typography>
      </Box>
    );

  // ✅ Định dạng giá trị tiền (triệu)
  const formatCurrency = (v) => `${(v / 1_000_000).toFixed(2)} triệu ₫`;

  return (
    <Box sx={{ width: "100%", height: 260 }}>
      {/* 🔹 Bộ lọc chọn năm */}
      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1 }}>
        <Select
          size="small"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          sx={{ fontSize: 13, height: 32 }}
        >
          {availableYears.map((y) => (
            <MenuItem key={y} value={y}>
              Năm {y}
            </MenuItem>
          ))}
        </Select>
      </Stack>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis
            tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(v) => formatCurrency(v)}
            contentStyle={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              border: "1px solid #ddd",
            }}
            labelStyle={{ fontWeight: "bold" }}
          />
          <Bar
            dataKey="revenue"
            fill="#4caf50"
            barSize={35}
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default BarChartMini;
