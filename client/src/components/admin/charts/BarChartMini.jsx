import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import axios from "axios";
import { CircularProgress, Box, Typography } from "@mui/material";

const BarChartMini = ({ months = 6, year }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const base = `http://localhost:5000/api/admin/stats/dashboard/monthly?months=${months}`;
    const url = typeof year === "number" ? `${base}&year=${year}` : base;

    axios
      .get(url)
      .then((res) => {
        const formatted = res.data.items.map((i) => {
          // ví dụ: "May 2024" → chỉ lấy "May"
          const [monthName] = i.month.split(" ");
          return {
            name: monthName, // giữ lại tháng tiếng Anh, bỏ năm
            revenue: Number(i.revenue) || 0,
          };
        });
        setData(formatted);
      })
      .catch((err) => console.error("❌ Lỗi lấy dữ liệu BarChart:", err))
      .finally(() => setLoading(false));
  }, [months, year]); // ✅ đóng ngoặc useEffect đầy đủ

  if (loading)
    return (
      <Box textAlign="center" py={4}>
        <CircularProgress size={20} />
        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
          Đang tải...
        </Typography>
      </Box>
    );

  const formatCurrency = (v) => `${(v / 1_000_000).toFixed(2)} triệu ₫`;

  return (
    <Box sx={{ width: "100%", height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`} tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(v) => formatCurrency(v)}
            contentStyle={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              border: "1px solid #ddd",
            }}
            labelStyle={{ fontWeight: "bold" }}
          />
          <Bar dataKey="revenue" fill="#4caf50" barSize={35} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default BarChartMini;
