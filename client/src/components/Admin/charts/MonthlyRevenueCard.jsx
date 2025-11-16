import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { motion, AnimatePresence } from "motion/react";
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
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

const MonthlyRevenueCard = ({ months = 6, year }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(null);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [trend, setTrend] = useState(0);

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
                        fullMonth: i.month,
                    };
                });
                setData(formatted);

                // Calculate total and trend
                const total = formatted.reduce((sum, item) => sum + item.revenue, 0);
                setTotalRevenue(total);

                if (formatted.length >= 2) {
                    const lastMonth = formatted[formatted.length - 1].revenue;
                    const prevMonth = formatted[formatted.length - 2].revenue;
                    const trendPercent = prevMonth > 0
                        ? ((lastMonth - prevMonth) / prevMonth) * 100
                        : 0;
                    setTrend(trendPercent);
                }
            })
            .catch((err) => console.error("❌ Lỗi lấy dữ liệu doanh thu:", err))
            .finally(() => setLoading(false));
    }, [months, year]);

    const formatCurrency = (v) => {
        if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)}B`;
        if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
        if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`;
        return v.toString();
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <Box
                    component={motion.div}
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    sx={{
                        background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
                        borderRadius: "16px",
                        padding: "16px 20px",
                        border: "1px solid rgba(251,146,60,0.3)",
                        boxShadow: "0 25px 50px rgba(15,23,42,0.6), 0 0 0 1px rgba(251,146,60,0.2)",
                        backdropFilter: "blur(12px)",
                        minWidth: "180px",
                    }}
                >
                    <Typography
                        sx={{
                            color: "#fb923c",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            mb: 1,
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                        }}
                    >
                        {payload[0].payload.fullMonth}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
                        <Typography
                            sx={{
                                color: "#ffffff",
                                fontSize: "1.5rem",
                                fontWeight: 800,
                                lineHeight: 1,
                            }}
                        >
                            {formatCurrency(payload[0].value)}
                        </Typography>
                        <Typography
                            sx={{
                                color: "#94a3b8",
                                fontSize: "0.875rem",
                                fontWeight: 600,
                            }}
                        >
                            ₫
                        </Typography>
                    </Box>
                </Box>
            );
        }
        return null;
    };

    // Floating particles animation
    const particles = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 2,
    }));

    if (loading) {
        return (
            <Box
                component={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                sx={{
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: 4,
                    background: "linear-gradient(135deg, #fff5f0 0%, #ffffff 100%)",
                    border: "1px solid rgba(251,146,60,0.15)",
                    p: 4,
                    height: 480,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 3,
                }}
            >
                <CircularProgress
                    size={48}
                    thickness={3.5}
                    sx={{
                        color: "#f97316",
                        "& .MuiCircularProgress-circle": {
                            strokeLinecap: "round",
                        }
                    }}
                />
                <Typography
                    sx={{
                        color: "#64748b",
                        fontSize: "0.9375rem",
                        fontWeight: 600,
                        letterSpacing: "0.3px",
                    }}
                >
                    Đang tải dữ liệu doanh thu...
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            sx={{
                position: "relative",
                overflow: "hidden",
                borderRadius: 4,
                background: "linear-gradient(135deg, #fff5f0 0%, #ffffff 100%)",
                border: "1px solid rgba(251,146,60,0.15)",
                boxShadow: "0 4px 20px rgba(251,146,60,0.08)",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                    boxShadow: "0 20px 40px rgba(251,146,60,0.15)",
                    transform: "translateY(-4px)",
                },
            }}
        >
            {/* Animated Background Particles */}
            {particles.map((particle) => (
                <Box
                    key={particle.id}
                    component={motion.div}
                    animate={{
                        y: [0, -30, 0],
                        opacity: [0.3, 0.6, 0.3],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: particle.duration,
                        repeat: Infinity,
                        delay: particle.delay,
                        ease: "easeInOut",
                    }}
                    sx={{
                        position: "absolute",
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: particle.size,
                        height: particle.size,
                        borderRadius: "50%",
                        background: "radial-gradient(circle, #fb923c 0%, transparent 70%)",
                        pointerEvents: "none",
                        zIndex: 0,
                    }}
                />
            ))}

            {/* Gradient Orb */}
            <Box
                component={motion.div}
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                }}
                sx={{
                    position: "absolute",
                    top: -100,
                    right: -100,
                    width: 300,
                    height: 300,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(251,146,60,0.15) 0%, transparent 70%)",
                    filter: "blur(40px)",
                    pointerEvents: "none",
                    zIndex: 0,
                }}
            />

            {/* Content */}
            <Box sx={{ position: "relative", zIndex: 1, p: 4 }}>
                {/* Header */}
                <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 3 }}>
                    <Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                            <Box
                                component={motion.div}
                                animate={{ rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 2.5,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    background: "linear-gradient(135deg, #fb923c 0%, #f97316 100%)",
                                    boxShadow: "0 8px 24px rgba(251,146,60,0.35)",
                                    color: "#ffffff",
                                    fontSize: "1.5rem",
                                }}
                            >
                                <AttachMoneyIcon sx={{ fontSize: 28 }} />
                            </Box>
                            <Box>
                                <Typography
                                    sx={{
                                        fontSize: "0.8125rem",
                                        fontWeight: 700,
                                        color: "#f97316",
                                        textTransform: "uppercase",
                                        letterSpacing: "1.2px",
                                        mb: 0.5,
                                    }}
                                >
                                    Doanh thu
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: "0.75rem",
                                        color: "#64748b",
                                        fontWeight: 500,
                                    }}
                                >
                                    {months} tháng gần đây
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* Trend Badge */}
                    <AnimatePresence>
                        {trend !== 0 && (
                            <Box
                                component={motion.div}
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                    px: 2,
                                    py: 1,
                                    borderRadius: 2,
                                    background: trend > 0
                                        ? "linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(5,150,105,0.1) 100%)"
                                        : "linear-gradient(135deg, rgba(239,68,68,0.15) 0%, rgba(220,38,38,0.1) 100%)",
                                    border: `1px solid ${trend > 0 ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
                                }}
                            >
                                <TrendingUpIcon
                                    sx={{
                                        fontSize: 18,
                                        color: trend > 0 ? "#10b981" : "#ef4444",
                                        transform: trend < 0 ? "rotate(180deg)" : "none",
                                    }}
                                />
                                <Typography
                                    sx={{
                                        fontSize: "0.875rem",
                                        fontWeight: 700,
                                        color: trend > 0 ? "#10b981" : "#ef4444",
                                    }}
                                >
                                    {Math.abs(trend).toFixed(1)}%
                                </Typography>
                            </Box>
                        )}
                    </AnimatePresence>
                </Box>

                {/* Total Revenue */}
                <Box
                    component={motion.div}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    sx={{ mb: 4 }}
                >
                    <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                        <Typography
                            component={motion.div}
                            animate={{
                                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                            }}
                            transition={{ duration: 3, repeat: Infinity }}
                            sx={{
                                fontSize: "3rem",
                                fontWeight: 900,
                                lineHeight: 1,
                                background: "linear-gradient(90deg, #fb923c 0%, #f97316 50%, #ea580c 100%)",
                                backgroundSize: "200% 100%",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                            }}
                        >
                            {formatCurrency(totalRevenue)}
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: "1.5rem",
                                fontWeight: 700,
                                color: "#f97316",
                                mb: 0.5,
                            }}
                        >
                            ₫
                        </Typography>
                    </Box>
                    <Typography
                        sx={{
                            fontSize: "0.875rem",
                            color: "#64748b",
                            fontWeight: 500,
                            mt: 1,
                        }}
                    >
                        Tổng doanh thu {months} tháng
                    </Typography>
                </Box>

                {/* Chart */}
                <Box sx={{ width: "100%", height: 260 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                            barCategoryGap="25%"
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
                                <linearGradient id="barGradientOrange" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#fb923c" stopOpacity={1} />
                                    <stop offset="100%" stopColor="#f97316" stopOpacity={0.8} />
                                </linearGradient>
                                <linearGradient id="barGradientActive" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#fbbf24" stopOpacity={1} />
                                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.9} />
                                </linearGradient>
                                <filter id="barShadow">
                                    <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#f97316" floodOpacity="0.4" />
                                </filter>
                                <filter id="barGlow">
                                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                                    <feMerge>
                                        <feMergeNode in="coloredBlur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                                stroke="rgba(148,163,184,0.12)"
                                strokeWidth={1}
                            />
                            <XAxis
                                dataKey="name"
                                tick={{ fontSize: 13, fill: "#64748b", fontWeight: 600 }}
                                tickLine={false}
                                axisLine={{ stroke: "rgba(148,163,184,0.2)", strokeWidth: 2 }}
                                tickMargin={12}
                            />
                            <YAxis
                                tickFormatter={(v) => formatCurrency(v)}
                                tick={{ fontSize: 12, fill: "#64748b", fontWeight: 600 }}
                                tickLine={false}
                                axisLine={false}
                                width={50}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={false} />
                            <Bar
                                dataKey="revenue"
                                radius={[14, 14, 0, 0]}
                                maxBarSize={60}
                                isAnimationActive
                                animationDuration={1200}
                                animationBegin={0}
                                animationEasing="ease-out"
                            >
                                {data.map((_, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={
                                            activeIndex === index
                                                ? "url(#barGradientActive)"
                                                : "url(#barGradientOrange)"
                                        }
                                        filter={activeIndex === index ? "url(#barGlow)" : "url(#barShadow)"}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            </Box>
        </Box>
    );
};

export default MonthlyRevenueCard;
