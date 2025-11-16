import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Sector } from "recharts";
import axios from "axios";
import { CircularProgress, Box, Typography } from "@mui/material";
import { motion } from "motion/react";

const COLORS = [
  { main: "#6366f1", light: "#818cf8", dark: "#4f46e5" },
  { main: "#f59e0b", light: "#fbbf24", dark: "#d97706" },
  { main: "#10b981", light: "#34d399", dark: "#059669" },
];

const PieChartMini = ({ endpoint = "/api/admin/stats/dashboard/users" }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    axios
      .get(`http://localhost:5000${endpoint}`)
      .then((res) => {
        const summary = res.data.summary || {};
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

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 6,
          gap: 2,
        }}
      >
        <CircularProgress size={32} thickness={4} sx={{ color: "#6366f1" }} />
        <Typography
          variant="body2"
          sx={{
            color: "rgba(100,116,139,0.8)",
            fontSize: "0.875rem",
            fontWeight: 500,
          }}
        >
          Đang tải dữ liệu...
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

  const renderActiveShape = (props) => {
    const {
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props;

    return (
      <g>
        <text
          x={cx}
          y={cy - 10}
          dy={8}
          textAnchor="middle"
          fill="#1e293b"
          style={{ fontSize: "1.5rem", fontWeight: "bold" }}
        >
          {value}
        </text>
        <text
          x={cx}
          y={cy + 15}
          dy={8}
          textAnchor="middle"
          fill="#64748b"
          style={{ fontSize: "0.875rem", fontWeight: 500 }}
        >
          {payload.name}
        </text>
        <text
          x={cx}
          y={cy + 35}
          dy={8}
          textAnchor="middle"
          fill="#94a3b8"
          style={{ fontSize: "0.75rem" }}
        >
          {`${(percent * 100).toFixed(1)}%`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
          opacity={0.8}
        />
      </g>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          component={motion.div}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          sx={{
            background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
            borderRadius: "12px",
            padding: "12px 16px",
            border: `1px solid ${COLORS[payload[0].payload.index % COLORS.length].light}40`,
            boxShadow: "0 20px 40px rgba(15,23,42,0.5)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Typography
            sx={{
              color: COLORS[payload[0].payload.index % COLORS.length].light,
              fontSize: "0.75rem",
              fontWeight: 600,
              mb: 0.5,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {payload[0].name}
          </Typography>
          <Typography
            sx={{
              color: "#ffffff",
              fontSize: "1.125rem",
              fontWeight: 700,
            }}
          >
            {payload[0].value} người
          </Typography>
          <Typography
            sx={{
              color: "#94a3b8",
              fontSize: "0.75rem",
              mt: 0.5,
            }}
          >
            {`${payload[0].payload.percent.toFixed(1)}% tổng số`}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  const dataWithPercent = data.map((item, index) => {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    return {
      ...item,
      percent: (item.value / total) * 100,
      index,
    };
  });

  return (
    <Box sx={{ width: "100%", height: 300, position: "relative" }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <defs>
            {COLORS.map((color, index) => (
              <linearGradient
                key={`gradient-${index}`}
                id={`pieGradient${index}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={color.light} stopOpacity={1} />
                <stop offset="100%" stopColor={color.dark} stopOpacity={0.9} />
              </linearGradient>
            ))}
            <filter id="pieGlow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={dataWithPercent}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={85}
            dataKey="value"
            onMouseEnter={onPieEnter}
            isAnimationActive
            animationBegin={0}
            animationDuration={1000}
            animationEasing="ease-out"
          >
            {dataWithPercent.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={`url(#pieGradient${index % COLORS.length})`}
                stroke={activeIndex === index ? "#ffffff" : "none"}
                strokeWidth={activeIndex === index ? 3 : 0}
                filter={activeIndex === index ? "url(#pieGlow)" : "none"}
                style={{
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={40}
            iconType="circle"
            iconSize={10}
            formatter={(value, entry) => (
              <span
                style={{
                  color: "#64748b",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  marginLeft: "6px",
                }}
              >
                {value}
              </span>
            )}
            wrapperStyle={{
              paddingTop: "16px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default PieChartMini;
