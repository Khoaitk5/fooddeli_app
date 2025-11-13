import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import axios from "axios";
import { CircularProgress, Box, Typography } from "@mui/material";

const COLORS = ["#3641f5", "#7592ff", "#dde9ff"]; // Match mẫu: Desktop, Mobile, Tablet

const PieChartMini = ({ endpoint = "/api/admin/stats/dashboard/users" }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(-1);

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
            name: role === "user" ? "Khách hàng" : role === "shop" ? "Cửa hàng" : "Shipper",
            value: count,
          }));

        setData(filtered);
      })
      .catch((err) => console.error("❌ Lỗi lấy dữ liệu PieChart:", err))
      .finally(() => setLoading(false));
  }, [endpoint]);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(-1);
  };

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
    <ResponsiveContainer width="100%" height={286}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          innerRadius={50}
          dataKey="value"
          onMouseEnter={onPieEnter}
          onMouseLeave={onPieLeave}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
              fillOpacity={activeIndex === index ? 1 : 0.8}
              stroke={activeIndex === index ? COLORS[index % COLORS.length] : "none"}
              strokeWidth={activeIndex === index ? 2 : 0}
            />
          ))}
        </Pie>
        <Tooltip formatter={(v, n) => [`${v} người`, n]} />
        <Legend
          verticalAlign="bottom"
          height={36}
          iconType="circle"
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChartMini;
