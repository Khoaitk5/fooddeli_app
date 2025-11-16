import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { motion, AnimatePresence } from "motion/react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Line,
    ComposedChart,
} from "recharts";
import axios from "axios";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

const WeeklyOrdersCard = ({ endpoint = "/api/admin/stats/dashboard/weekly" }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalOrders, setTotalOrders] = useState(0);
    const [avgOrders, setAvgOrders] = useState(0);

    useEffect(() => {
        axios
            .get(`http://localhost:5000${endpoint}`)
            .then((res) => {
                const formatted = res.data.items.map((i) => ({
                    name: i.day,
                    orders: Number(i.orders) || 0,
                }));
                setData(formatted);

                const total = formatted.reduce((sum, item) => sum + item.orders, 0);
                setTotalOrders(total);
                setAvgOrders(Math.round(total / formatted.length));
            })
            .catch((err) => console.error("❌ Lỗi lấy dữ liệu đơn hàng:", err))
            .finally(() => setLoading(false));
    }, [endpoint]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <Box
                    component={motion.div}
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    sx={{
                        background: "linear-gradient(135deg, #0c4a6e 0%, #075985 100%)",
                        borderRadius: "16px",
                        padding: "16px 20px",
                        border: "1px solid rgba(56,189,248,0.4)",
                        boxShadow: "0 25px 50px rgba(14,165,233,0.4), 0 0 0 1px rgba(56,189,248,0.2)",
                        backdropFilter: "blur(12px)",
                        minWidth: "160px",
                    }}
                >
                    <Typography
                        sx={{
                            color: "#7dd3fc",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            mb: 1,
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                        }}
                    >
                        {label}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                        <Typography
                            sx={{
                                color: "#ffffff",
                                fontSize: "1.5rem",
                                fontWeight: 800,
                                lineHeight: 1,
                            }}
                        >
                            {payload[0].value}
                        </Typography>
                        <Typography
                            sx={{
                                color: "#94a3b8",
                                fontSize: "0.875rem",
                                fontWeight: 600,
                            }}
                        >
                            đơn hàng
                        </Typography>
                    </Box>
                </Box>
            );
        }
        return null;
    };

    const CustomDot = (props) => {
        const { cx, cy, index } = props;
        const isLast = index === data.length - 1;

        return (
            <g>
                <motion.circle
                    cx={cx}
                    cy={cy}
                    r={isLast ? 8 : 5}
                    fill="#ffffff"
                    stroke="#0ea5e9"
                    strokeWidth={isLast ? 3 : 2}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                />
                {isLast && (
                    <motion.circle
                        cx={cx}
                        cy={cy}
                        r={12}
                        fill="none"
                        stroke="#0ea5e9"
                        strokeWidth={2}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.8, 0, 0.8],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                )}
            </g>
        );
    };

    // Wave animation particles
    const waves = Array.from({ length: 3 }, (_, i) => ({
        id: i,
        delay: i * 0.5,
        duration: 3 + i * 0.5,
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
                    background: "linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%)",
                    border: "1px solid rgba(14,165,233,0.15)",
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
                        color: "#0ea5e9",
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
                    Đang tải dữ liệu đơn hàng...
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            sx={{
                position: "relative",
                overflow: "hidden",
                borderRadius: 4,
                background: "linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%)",
                border: "1px solid rgba(14,165,233,0.15)",
                boxShadow: "0 4px 20px rgba(14,165,233,0.08)",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                    boxShadow: "0 20px 40px rgba(14,165,233,0.15)",
                    transform: "translateY(-4px)",
                },
            }}
        >
            {/* Animated Wave Background */}
            {waves.map((wave) => (
                <Box
                    key={wave.id}
                    component={motion.div}
                    animate={{
                        x: ["-100%", "100%"],
                        opacity: [0.1, 0.3, 0.1],
                    }}
                    transition={{
                        duration: wave.duration,
                        repeat: Infinity,
                        delay: wave.delay,
                        ease: "linear",
                    }}
                    sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        width: "200%",
                        height: "40%",
                        background: "linear-gradient(90deg, transparent 0%, rgba(14,165,233,0.1) 50%, transparent 100%)",
                        pointerEvents: "none",
                        zIndex: 0,
                    }}
                />
            ))}

            {/* Gradient Orb */}
            <Box
                component={motion.div}
                animate={{
                    scale: [1, 1.3, 1],
                    rotate: [0, -180, -360],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear",
                }}
                sx={{
                    position: "absolute",
                    top: -120,
                    left: -120,
                    width: 350,
                    height: 350,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(14,165,233,0.2) 0%, transparent 70%)",
                    filter: "blur(50px)",
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
                                animate={{
                                    rotate: [0, 10, -10, 0],
                                    scale: [1, 1.05, 1],
                                }}
                                transition={{ duration: 3, repeat: Infinity }}
                                sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 2.5,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    background: "linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)",
                                    boxShadow: "0 8px 24px rgba(14,165,233,0.4)",
                                    color: "#ffffff",
                                    fontSize: "1.5rem",
                                }}
                            >
                                <ShoppingCartIcon sx={{ fontSize: 28 }} />
                            </Box>
                            <Box>
                                <Typography
                                    sx={{
                                        fontSize: "0.8125rem",
                                        fontWeight: 700,
                                        color: "#0ea5e9",
                                        textTransform: "uppercase",
                                        letterSpacing: "1.2px",
                                        mb: 0.5,
                                    }}
                                >
                                    Đơn hàng
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: "0.75rem",
                                        color: "#64748b",
                                        fontWeight: 500,
                                    }}
                                >
                                    7 ngày qua
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* Stats Badge */}
                    <Box
                        component={motion.div}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            px: 2.5,
                            py: 1.5,
                            borderRadius: 2.5,
                            background: "linear-gradient(135deg, rgba(14,165,233,0.15) 0%, rgba(6,182,212,0.1) 100%)",
                            border: "1px solid rgba(14,165,233,0.3)",
                        }}
                    >
                        <LocalShippingIcon sx={{ fontSize: 20, color: "#0ea5e9" }} />
                        <Box>
                            <Typography
                                sx={{
                                    fontSize: "0.6875rem",
                                    color: "#64748b",
                                    fontWeight: 600,
                                    lineHeight: 1,
                                    mb: 0.5,
                                }}
                            >
                                Trung bình
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: "1rem",
                                    fontWeight: 800,
                                    color: "#0ea5e9",
                                    lineHeight: 1,
                                }}
                            >
                                {avgOrders}/ngày
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Total Orders */}
                <Box
                    component={motion.div}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    sx={{ mb: 4 }}
                >
                    <Box sx={{ display: "flex", alignItems: "baseline", gap: 1.5 }}>
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
                                background: "linear-gradient(90deg, #38bdf8 0%, #0ea5e9 50%, #0284c7 100%)",
                                backgroundSize: "200% 100%",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                            }}
                        >
                            {totalOrders}
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: "1.25rem",
                                fontWeight: 700,
                                color: "#0ea5e9",
                                mb: 0.5,
                            }}
                        >
                            đơn
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
                        Tổng đơn hàng trong tuần
                    </Typography>
                </Box>

                {/* Chart */}
                <Box sx={{ width: "100%", height: 260 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart
                            data={data}
                            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="areaGradientBlue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.5} />
                                    <stop offset="50%" stopColor="#0ea5e9" stopOpacity={0.25} />
                                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0.05} />
                                </linearGradient>
                                <linearGradient id="lineGradientBlue" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#38bdf8" />
                                    <stop offset="50%" stopColor="#0ea5e9" />
                                    <stop offset="100%" stopColor="#0284c7" />
                                </linearGradient>
                                <filter id="lineGlow">
                                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
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
                                tick={{ fontSize: 12, fill: "#64748b", fontWeight: 600 }}
                                tickLine={false}
                                axisLine={false}
                                width={40}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={false} />
                            <Area
                                type="monotone"
                                dataKey="orders"
                                stroke="none"
                                fill="url(#areaGradientBlue)"
                                isAnimationActive
                                animationDuration={1500}
                                animationEasing="ease-in-out"
                            />
                            <Line
                                type="monotone"
                                dataKey="orders"
                                stroke="url(#lineGradientBlue)"
                                strokeWidth={4}
                                dot={<CustomDot />}
                                activeDot={{
                                    r: 9,
                                    stroke: "#0ea5e9",
                                    strokeWidth: 4,
                                    fill: "#ffffff",
                                    filter: "url(#lineGlow)",
                                }}
                                filter="url(#lineGlow)"
                                isAnimationActive
                                animationDuration={1500}
                                animationEasing="ease-in-out"
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </Box>
            </Box>
        </Box>
    );
};

export default WeeklyOrdersCard;
