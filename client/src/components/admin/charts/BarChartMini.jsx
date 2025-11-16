import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import axios from "axios";
import { CircularProgress, Box, Typography } from "@mui/material";
import { motion } from "motion/react";

const BarChartMini = ({ months = 6, year }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    setLoading(true);
    const base = `http://localhost:5000/api/admin/stats/dashboard/monthly?months=${months}`;
    const url = typeof year === "number" ? `${base}&year=${year}` : base;

    axios
      .get(url)
      .then((res) => {
        const formatted = res.data.items.map((i) => {
          const [monthName] = i.month.split(" ");
          return {
            name: monthName,
            revenue: Number(i.revenue) || 0,
          };
        });
        setData(formatted);
      })
      .catch((err) => console.error("❌ Lỗi lấy dữ liệu BarChart:", err))
      .finally(() => setLoading(false));
  }, [months, year]);

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
        <CircularProgress size={32} thickness={4} sx={{ color: "#f97316" }} />
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

  const formatCurrency = (v) => {
    if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)}B ₫`;
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M ₫`;
    return `${(v / 1_000).toFixed(0)}K ₫`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
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
            border: "1px solid rgba(251,146,60,0.3)",
            boxShadow: "0 20px 40px rgba(15,23,42,0.5), 0 0 0 1px rgba(251,146,60,0.1)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Typography
            sx={{
              color: "#fb923c",
              fontSize: "0.75rem",
              fontWeight: 600,
              mb: 0.5,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {label}
          </Typography>
          <Typography
            sx={{
              color: "#ffffff",
              fontSize: "1.125rem",
              fontWeight: 700,
            }}
          >
            {formatCurrency(payload[0].value)}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box sx={{ width: "100%", height: 280, position: "relative" }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
          barCategoryGap="20%"
          onMouseMove={(state) => {
            if (state.isTooltipActive) {
              setActiveIndex(state.activeTooltipIndex);
            } else {
              setActiveIndex(null);
            }
          }}
          onMouseLeave={() => setActiveIndex(null)}
        >
          <defs>
            <linearGradient id="barGradient1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fb923c" stopOpacity={1} />
              <stop offset="100%" stopColor="#f97316" stopOpacity={0.85} />
            </linearGradient>
            <linearGradient id="barGradient2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity={1} />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.85} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="shadow">
              <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.3" />
            </filter>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="rgba(148,163,184,0.15)"
            strokeWidth={1}
          />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 13, fill: "#64748b", fontWeight: 500 }}
            tickLine={false}
            axisLine={{ stroke: "rgba(148,163,184,0.2)", strokeWidth: 1.5 }}
            tickMargin={10}
          />
          <YAxis
            tickFormatter={(v) => formatCurrency(v).replace(" ₫", "")}
            tick={{ fontSize: 12, fill: "#64748b", fontWeight: 500 }}
            tickLine={false}
            axisLine={false}
            width={60}
          />
          <Tooltip content={<CustomTooltip />} cursor={false} />
          <Bar
            dataKey="revenue"
            radius={[12, 12, 0, 0]}
            maxBarSize={50}
            isAnimationActive
            animationDuration={1000}
            animationBegin={0}
            animationEasing="ease-out"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  activeIndex === index
                    ? "url(#barGradient2)"
                    : "url(#barGradient1)"
                }
                filter={activeIndex === index ? "url(#shadow)" : "none"}
                style={{
                  transition: "all 0.3s ease",
                  transform:
                    activeIndex === index ? "scaleY(1.05)" : "scaleY(1)",
                  transformOrigin: "bottom",
                }}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default BarChartMini;
