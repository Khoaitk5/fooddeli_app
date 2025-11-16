import React, { useEffect, useState } from "react";
import {
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import axios from "axios";
import { CircularProgress, Box, Typography } from "@mui/material";
import { motion } from "motion/react";

const RadarChartMini = ({ endpoint = "/api/admin/stats/dashboard/performance" }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock data nếu API chưa có
        const mockData = [
            { category: "Dịch vụ", value: 85, fullMark: 100 },
            { category: "Tốc độ", value: 92, fullMark: 100 },
            { category: "Chất lượng", value: 78, fullMark: 100 },
            { category: "Giá cả", value: 88, fullMark: 100 },
            { category: "Đa dạng", value: 75, fullMark: 100 },
            { category: "Hỗ trợ", value: 90, fullMark: 100 },
        ];

        // Giả lập API call
        setTimeout(() => {
            setData(mockData);
            setLoading(false);
        }, 500);

        // Uncomment khi có API thật
        // axios
        //   .get(`http://localhost:5000${endpoint}`)
        //   .then((res) => {
        //     setData(res.data.items);
        //   })
        //   .catch((err) => console.error("❌ Lỗi lấy dữ liệu RadarChart:", err))
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
                <CircularProgress size={32} thickness={4} sx={{ color: "#ec4899" }} />
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

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <Box
                    component={motion.div}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    sx={{
                        background: "linear-gradient(135deg, #be185d 0%, #db2777 100%)",
                        borderRadius: "12px",
                        padding: "12px 16px",
                        border: "1px solid rgba(236,72,153,0.4)",
                        boxShadow:
                            "0 20px 40px rgba(236,72,153,0.3), 0 0 0 1px rgba(244,114,182,0.2)",
                        backdropFilter: "blur(10px)",
                    }}
                >
                    <Typography
                        sx={{
                            color: "#fbcfe8",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            mb: 0.5,
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                        }}
                    >
                        {payload[0].payload.category}
                    </Typography>
                    <Typography
                        sx={{
                            color: "#ffffff",
                            fontSize: "1.125rem",
                            fontWeight: 700,
                        }}
                    >
                        {payload[0].value}/100
                    </Typography>
                </Box>
            );
        }
        return null;
    };

    return (
        <Box sx={{ width: "100%", height: 320, position: "relative" }}>
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                    <defs>
                        <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f472b6" stopOpacity={0.8} />
                            <stop offset="100%" stopColor="#ec4899" stopOpacity={0.3} />
                        </linearGradient>
                        <filter id="radarGlow">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                    <PolarGrid
                        stroke="rgba(148,163,184,0.2)"
                        strokeWidth={1.5}
                        strokeDasharray="3 3"
                    />
                    <PolarAngleAxis
                        dataKey="category"
                        tick={{
                            fill: "#64748b",
                            fontSize: 13,
                            fontWeight: 500,
                        }}
                    />
                    <PolarRadiusAxis
                        angle={90}
                        domain={[0, 100]}
                        tick={{
                            fill: "#94a3b8",
                            fontSize: 11,
                        }}
                    />
                    <Radar
                        name="Hiệu suất"
                        dataKey="value"
                        stroke="#ec4899"
                        fill="url(#radarGradient)"
                        strokeWidth={3}
                        fillOpacity={0.6}
                        filter="url(#radarGlow)"
                        isAnimationActive
                        animationDuration={1200}
                        animationEasing="ease-out"
                        dot={{
                            r: 5,
                            fill: "#ffffff",
                            stroke: "#ec4899",
                            strokeWidth: 2,
                        }}
                        activeDot={{
                            r: 7,
                            stroke: "#ec4899",
                            strokeWidth: 3,
                            fill: "#ffffff",
                        }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                </RadarChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default RadarChartMini;
