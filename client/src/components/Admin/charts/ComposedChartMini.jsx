import React, { useEffect, useState } from "react";
import {
    ComposedChart,
    Line,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    CartesianGrid,
    Area,
} from "recharts";
import axios from "axios";
import { CircularProgress, Box, Typography } from "@mui/material";
import { motion } from "motion/react";

const ComposedChartMini = ({ endpoint = "/api/admin/stats/dashboard/combined" }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock data - kết hợp doanh thu và đơn hàng
        const mockData = [
            { name: "T1", revenue: 15000000, orders: 120, growth: 5 },
            { name: "T2", revenue: 18000000, orders: 145, growth: 8 },
            { name: "T3", revenue: 22000000, orders: 178, growth: 12 },
            { name: "T4", revenue: 19000000, orders: 156, growth: 7 },
            { name: "T5", revenue: 25000000, orders: 198, growth: 15 },
            { name: "T6", revenue: 28000000, orders: 215, growth: 18 },
        ];

        setTimeout(() => {
            setData(mockData);
            setLoading(false);
        }, 500);

        // Uncomment khi có API
        // axios
        //   .get(`http://localhost:5000${endpoint}`)
        //   .then((res) => setData(res.data.items))
        //   .catch((err) => console.error("❌ Lỗi lấy dữ liệu ComposedChart:", err))
        //   .finally(() => setLoading(false));
    }, [endpoint]);

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
                <CircularProgress size={32} thickness={4} sx={{ color: "#14b8a6" }} />
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
        if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
        return `${(v / 1_000).toFixed(0)}K`;
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <Box
                    component={motion.div}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    sx={{
                        background: "linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)",
                        borderRadius: "12px",
                        padding: "14px 18px",
                        border: "1px solid rgba(20,184,166,0.4)",
                        boxShadow:
                            "0 20px 40px rgba(20,184,166,0.3), 0 0 0 1px rgba(45,212,191,0.2)",
                        backdropFilter: "blur(10px)",
                    }}
                >
                    <Typography
                        sx={{
                            color: "#5eead4",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            mb: 1,
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                        }}
                    >
                        {label}
                    </Typography>
                    {payload.map((entry, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 2,
                                mb: 0.5,
                            }}
                        >
                            <Typography
                                sx={{
                                    color: "#ccfbf1",
                                    fontSize: "0.875rem",
                                    fontWeight: 500,
                                }}
                            >
                                {entry.name === "revenue"
                                    ? "Doanh thu"
                                    : entry.name === "orders"
                                        ? "Đơn hàng"
                                        : "Tăng trưởng"}
                                :
                            </Typography>
                            <Typography
                                sx={{
                                    color: "#ffffff",
                                    fontSize: "0.875rem",
                                    fontWeight: 700,
                                }}
                            >
                                {entry.name === "revenue"
                                    ? `${formatCurrency(entry.value)} ₫`
                                    : entry.name === "growth"
                                        ? `${entry.value}%`
                                        : entry.value}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            );
        }
        return null;
    };

    const CustomLegend = (props) => {
        const { payload } = props;
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 3,
                    mt: 2,
                }}
            >
                {payload.map((entry, index) => (
                    <Box
                        key={`legend-${index}`}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                        }}
                    >
                        <Box
                            sx={{
                                width: 12,
                                height: 12,
                                borderRadius: entry.type === "line" ? "50%" : "2px",
                                backgroundColor: entry.color,
                            }}
                        />
                        <Typography
                            sx={{
                                color: "#64748b",
                                fontSize: "0.875rem",
                                fontWeight: 500,
                            }}
                        >
                            {entry.value}
                        </Typography>
                    </Box>
                ))}
            </Box>
        );
    };

    return (
        <Box sx={{ width: "100%", height: 300, position: "relative" }}>
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
                >
                    <defs>
                        <linearGradient id="revenueBar" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#2dd4bf" stopOpacity={0.9} />
                            <stop offset="100%" stopColor="#14b8a6" stopOpacity={0.7} />
                        </linearGradient>
                        <linearGradient id="growthArea" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05} />
                        </linearGradient>
                        <filter id="composedGlow">
                            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
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
                        yAxisId="left"
                        tickFormatter={formatCurrency}
                        tick={{ fontSize: 12, fill: "#64748b", fontWeight: 500 }}
                        tickLine={false}
                        axisLine={false}
                        width={50}
                    />
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        tick={{ fontSize: 12, fill: "#64748b", fontWeight: 500 }}
                        tickLine={false}
                        axisLine={false}
                        width={50}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={false} />
                    <Legend content={<CustomLegend />} />
                    <Area
                        yAxisId="right"
                        type="monotone"
                        dataKey="growth"
                        fill="url(#growthArea)"
                        stroke="none"
                        name="Tăng trưởng (%)"
                        isAnimationActive
                        animationDuration={1000}
                    />
                    <Bar
                        yAxisId="left"
                        dataKey="revenue"
                        fill="url(#revenueBar)"
                        radius={[8, 8, 0, 0]}
                        maxBarSize={40}
                        name="Doanh thu"
                        isAnimationActive
                        animationDuration={1000}
                        animationBegin={100}
                    />
                    <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="orders"
                        stroke="#6366f1"
                        strokeWidth={3}
                        dot={{
                            r: 4,
                            fill: "#ffffff",
                            stroke: "#6366f1",
                            strokeWidth: 2,
                        }}
                        activeDot={{
                            r: 7,
                            stroke: "#6366f1",
                            strokeWidth: 3,
                            fill: "#ffffff",
                            filter: "url(#composedGlow)",
                        }}
                        name="Đơn hàng"
                        isAnimationActive
                        animationDuration={1000}
                        animationBegin={200}
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default ComposedChartMini;
