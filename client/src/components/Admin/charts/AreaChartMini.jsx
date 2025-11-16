import React, { useEffect, useState } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import axios from "axios";
import { CircularProgress, Box, Typography } from "@mui/material";
import { motion } from "motion/react";

const AreaChartMini = ({ endpoint = "/api/admin/stats/dashboard/weekly" }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get(`http://localhost:5000${endpoint}`)
            .then((res) => {
                const formatted = res.data.items.map((i) => ({
                    name: i.day,
                    value: Number(i.orders) || 0,
                }));
                setData(formatted);
            })
            .catch((err) => console.error("❌ Lỗi lấy dữ liệu AreaChart:", err))
            .finally(() => setLoading(false));
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
                <CircularProgress size={32} thickness={4} sx={{ color: "#8b5cf6" }} />
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

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <Box
                    component={motion.div}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    sx={{
                        background: "linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)",
                        borderRadius: "12px",
                        padding: "12px 16px",
                        border: "1px solid rgba(139,92,246,0.4)",
                        boxShadow:
                            "0 20px 40px rgba(139,92,246,0.3), 0 0 0 1px rgba(167,139,250,0.2)",
                        backdropFilter: "blur(10px)",
                    }}
                >
                    <Typography
                        sx={{
                            color: "#c4b5fd",
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
                        {payload[0].value} đơn
                    </Typography>
                </Box>
            );
        }
        return null;
    };

    return (
        <Box sx={{ width: "100%", height: 240, position: "relative" }}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
                >
                    <defs>
                        <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.5} />
                            <stop offset="50%" stopColor="#8b5cf6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.05} />
                        </linearGradient>
                        <linearGradient id="purpleStroke" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#a78bfa" />
                            <stop offset="50%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#7c3aed" />
                        </linearGradient>
                        <filter id="areaGlow">
                            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
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
                        tick={{ fontSize: 12, fill: "#64748b", fontWeight: 500 }}
                        tickLine={false}
                        axisLine={false}
                        width={40}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={false} />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke="url(#purpleStroke)"
                        strokeWidth={3}
                        fill="url(#purpleGradient)"
                        filter="url(#areaGlow)"
                        isAnimationActive
                        animationDuration={1200}
                        animationEasing="ease-in-out"
                        dot={{
                            r: 4,
                            fill: "#ffffff",
                            stroke: "#8b5cf6",
                            strokeWidth: 2,
                        }}
                        activeDot={{
                            r: 7,
                            stroke: "#8b5cf6",
                            strokeWidth: 3,
                            fill: "#ffffff",
                            filter: "url(#areaGlow)",
                        }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default AreaChartMini;
