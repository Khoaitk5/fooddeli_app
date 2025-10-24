import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";
import { CircularProgress, Box, Typography } from "@mui/material";

const LineChartMini = ({ endpoint = "/api/admin/stats/dashboard/weekly" }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:5000${endpoint}`)
      .then(res => {
        // API trả về { items: [ { day: '12/10', orders: 15 }, ... ] }
        const formatted = res.data.items.map(i => ({
          name: i.day,
          orders: Number(i.orders) || 0
        }));
        setData(formatted);
      })
      .catch(err => console.error("❌ Lỗi lấy dữ liệu LineChart:", err))
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
      <LineChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(v) => `${v} đơn`} />
        <Line
          type="monotone"
          dataKey="orders"
          stroke="#2196f3"
          strokeWidth={2}
          dot={{ r: 3 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartMini;
