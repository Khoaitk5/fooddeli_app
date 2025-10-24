import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";
import { CircularProgress, Box, Typography } from "@mui/material";

const BarChartMini = ({ endpoint = "/api/admin/stats/dashboard/monthly" }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:5000${endpoint}`)
      .then(res => {
        // API trả về { items: [ { month: 'Jan', revenue: 12345 }, ... ] }
        const formatted = res.data.items.map(i => ({
          name: i.month,
          revenue: Number(i.revenue) || 0
        }));
        setData(formatted);
      })
      .catch(err => console.error("❌ Lỗi lấy dữ liệu BarChart:", err))
      .finally(() => setLoading(false));
  }, [endpoint]);

  if (loading)
    return (
      <Box textAlign="center" py={4}>
        <CircularProgress size={20} />
        <Typography variant="caption" display="block" sx={{ mt: 1 }}>Đang tải...</Typography>
      </Box>
    );

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(v) => v.toLocaleString("vi-VN") + " ₫"} />
        <Bar dataKey="revenue" fill="#4caf50" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartMini;
