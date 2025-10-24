import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import axios from "axios";
import { CircularProgress, Box, Typography } from "@mui/material";

const COLORS = ["#2196f3", "#ff9800", "#9c27b0"]; // user, shipper, shop

const PieChartMini = ({ endpoint = "/api/admin/stats/dashboard/users" }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:5000${endpoint}`)
      .then((res) => {
        // API trả về { summary: { user: 10, shop: 3, shipper: 5, admin: 1 } }
        const summary = res.data.summary || {};

        // ✅ Chỉ giữ các role mong muốn
        const allowedRoles = ["user", "shop", "shipper"];
        const filtered = Object.entries(summary)
          .filter(([role]) => allowedRoles.includes(role))
          .map(([role, count]) => ({
            name: role,
            value: count,
          }));

        setData(filtered);
      })
      .catch((err) => console.error("❌ Lỗi lấy dữ liệu PieChart:", err))
      .finally(() => setLoading(false));
  }, [endpoint]);

  if (loading)
    return (
      <Box textAlign="center" py={4}>
        <CircularProgress size={20} />
        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
          Đang tải...
        </Typography>
      </Box>
    );

  if (!data.length)
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="body2" color="text.secondary">
          Không có dữ liệu để hiển thị
        </Typography>
      </Box>
    );

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(v, n) => [`${v} người`, n]} />
        <Legend /> {/* ✅ Giữ lại Legend nhưng chỉ hiển thị theo data đã lọc */}
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChartMini;
