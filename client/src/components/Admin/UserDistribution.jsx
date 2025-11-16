import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Avatar, Chip } from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from "recharts";
import { motion, AnimatePresence } from "motion/react";
import axios from "axios";

const COLORS = [
    { main: "#6366f1", light: "#818cf8", dark: "#4f46e5", bg: "#eef2ff" },
    { main: "#f59e0b", light: "#fbbf24", dark: "#d97706", bg: "#fef3c7" },
    { main: "#10b981", light: "#34d399", dark: "#059669", bg: "#d1fae5" },
];

const ROLE_CONFIG = {
    user: {
        label: "Khách hàng",
        icon: "👤",
        description: "Người dùng đặt món",
    },
    shop: {
        label: "Cửa hàng",
        icon: "🏪",
        description: "Nhà hàng đối tác",
    },
    shipper: {
        label: "Shipper",
        icon: "🚚",
        description: "Người giao hàng",
    },
};

const UserDistribution = ({ endpoint = "/api/admin/stats/dashboard/users" }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);

    useEffect(() => {
        axios
            .get(`http://localhost:5000${endpoint}`)
            .then((res) => {
                const summary = res.data.summary || {};
                const allowedRoles = ["user", "shop", "shipper"];
                const filtered = allowedRoles
                    .filter((role) => summary[role])
                    .map((role, index) => ({
                        name: ROLE_CONFIG[role].label,
                        value: summary[role],
                        role,
                        icon: ROLE_CONFIG[role].icon,
                        description: ROLE_CONFIG[role].description,
                        colorIndex: index,
                    }));

                const total = filtered.reduce((sum, item) => sum + item.value, 0);
                setTotalUsers(total);
                setData(filtered);
            })
            .catch((err) => console.error("❌ Lỗi lấy dữ liệu phân bố người dùng:", err))
            .finally(() => setLoading(false));
    }, [endpoint]);

    const onPieEnter = (_, index) => {
        setActiveIndex(index);
    };

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    py: 8,
                    gap: 2,
                }}
            >
                <CircularProgress size={40} thickness={4} sx={{ color: "#6366f1" }} />
                <Typography
                    sx={{
                        color: "#64748b",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                    }}
                >
                    Đang tải dữ liệu phân bố...
                </Typography>
            </Box>
        );
    }

    if (!data.length) {
        return (
            <Box textAlign="center" py={6}>
                <Typography variant="body2" color="text.secondary">
                    Không có dữ liệu để hiển thị
                </Typography>
            </Box>
        );
    }

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
                    y={cy - 15}
                    dy={8}
                    textAnchor="middle"
                    style={{ fontSize: "2rem" }}
                >
                    {payload.icon}
                </text>
                <text
                    x={cx}
                    y={cy + 10}
                    dy={8}
                    textAnchor="middle"
                    fill="#1e293b"
                    style={{ fontSize: "1.75rem", fontWeight: "800" }}
                >
                    {value}
                </text>
                <text
                    x={cx}
                    y={cy + 35}
                    dy={8}
                    textAnchor="middle"
                    fill="#64748b"
                    style={{ fontSize: "0.875rem", fontWeight: 600 }}
                >
                    {payload.name}
                </text>
                <text
                    x={cx}
                    y={cy + 52}
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

    const dataWithPercent = data.map((item) => {
        return {
            ...item,
            percent: (item.value / totalUsers) * 100,
        };
    });

    return (
        <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            sx={{
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Header với gradient background */}
            <Box
                sx={{
                    position: "relative",
                    p: 3,
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    borderRadius: "16px 16px 0 0",
                    overflow: "hidden",
                    "&::before": {
                        content: '""',
                        position: "absolute",
                        top: -100,
                        right: -100,
                        width: 300,
                        height: 300,
                        borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)",
                    },
                }}
            >
                <Box sx={{ position: "relative", zIndex: 1 }}>
                    <Typography
                        sx={{
                            fontSize: "1.25rem",
                            fontWeight: 700,
                            color: "#ffffff",
                            mb: 0.5,
                            letterSpacing: "-0.02em",
                        }}
                    >
                        Phân bố người dùng
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: "0.875rem",
                            color: "rgba(255,255,255,0.9)",
                            fontWeight: 500,
                        }}
                    >
                        Tổng quan về các loại tài khoản trong hệ thống
                    </Typography>
                </Box>

                {/* Total Users Badge */}
                <Box
                    component={motion.div}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    sx={{
                        position: "absolute",
                        top: 20,
                        right: 20,
                        bgcolor: "rgba(255,255,255,0.25)",
                        backdropFilter: "blur(10px)",
                        borderRadius: 3,
                        px: 2.5,
                        py: 1,
                        border: "1px solid rgba(255,255,255,0.3)",
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: "0.75rem",
                            color: "rgba(255,255,255,0.9)",
                            fontWeight: 600,
                            mb: 0.25,
                        }}
                    >
                        TỔNG SỐ
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: "1.5rem",
                            fontWeight: 800,
                            color: "#ffffff",
                            lineHeight: 1,
                        }}
                    >
                        {totalUsers}
                    </Typography>
                </Box>
            </Box>

            {/* Chart Section */}
            <Box sx={{ bgcolor: "#ffffff", p: 3 }}>
                <Box sx={{ width: "100%", height: 320, position: "relative" }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <defs>
                                {COLORS.map((color, index) => (
                                    <linearGradient
                                        key={`gradient-${index}`}
                                        id={`userGradient${index}`}
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop offset="0%" stopColor={color.light} stopOpacity={1} />
                                        <stop offset="100%" stopColor={color.dark} stopOpacity={0.9} />
                                    </linearGradient>
                                ))}
                                <filter id="userGlow">
                                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
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
                                cy="50%"
                                innerRadius={70}
                                outerRadius={100}
                                dataKey="value"
                                onMouseEnter={onPieEnter}
                                isAnimationActive
                                animationBegin={0}
                                animationDuration={1200}
                                animationEasing="ease-out"
                            >
                                {dataWithPercent.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={`url(#userGradient${entry.colorIndex})`}
                                        stroke={activeIndex === index ? "#ffffff" : "none"}
                                        strokeWidth={activeIndex === index ? 4 : 0}
                                        filter={activeIndex === index ? "url(#userGlow)" : "none"}
                                        style={{
                                            transition: "all 0.3s ease",
                                            cursor: "pointer",
                                        }}
                                    />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </Box>

                {/* Stats Cards */}
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: 2,
                        mt: 3,
                    }}
                >
                    <AnimatePresence>
                        {dataWithPercent.map((item, index) => (
                            <Box
                                key={item.role}
                                component={motion.div}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 + 0.3 }}
                                whileHover={{
                                    scale: 1.05,
                                    boxShadow: `0 12px 24px ${COLORS[item.colorIndex].main}30`,
                                }}
                                onMouseEnter={() => setActiveIndex(index)}
                                sx={{
                                    p: 2.5,
                                    borderRadius: 3,
                                    bgcolor: COLORS[item.colorIndex].bg,
                                    border: `2px solid ${activeIndex === index
                                            ? COLORS[item.colorIndex].main
                                            : "transparent"
                                        }`,
                                    cursor: "pointer",
                                    transition: "all 0.3s ease",
                                    position: "relative",
                                    overflow: "hidden",
                                    "&::before": {
                                        content: '""',
                                        position: "absolute",
                                        top: -50,
                                        right: -50,
                                        width: 100,
                                        height: 100,
                                        borderRadius: "50%",
                                        background: `radial-gradient(circle, ${COLORS[item.colorIndex].light}30 0%, transparent 70%)`,
                                    },
                                }}
                            >
                                <Box sx={{ position: "relative", zIndex: 1 }}>
                                    {/* Icon & Label */}
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1.5,
                                            mb: 2,
                                        }}
                                    >
                                        <Avatar
                                            sx={{
                                                width: 48,
                                                height: 48,
                                                bgcolor: COLORS[item.colorIndex].main,
                                                fontSize: "1.5rem",
                                                boxShadow: `0 4px 12px ${COLORS[item.colorIndex].main}40`,
                                            }}
                                        >
                                            {item.icon}
                                        </Avatar>
                                        <Box>
                                            <Typography
                                                sx={{
                                                    fontSize: "0.875rem",
                                                    fontWeight: 700,
                                                    color: COLORS[item.colorIndex].dark,
                                                    letterSpacing: "-0.01em",
                                                }}
                                            >
                                                {item.name}
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    fontSize: "0.75rem",
                                                    color: "#64748b",
                                                }}
                                            >
                                                {item.description}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Stats */}
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "flex-end",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Box>
                                            <Typography
                                                component={motion.div}
                                                animate={{ scale: activeIndex === index ? [1, 1.1, 1] : 1 }}
                                                transition={{ duration: 0.3 }}
                                                sx={{
                                                    fontSize: "2rem",
                                                    fontWeight: 800,
                                                    color: COLORS[item.colorIndex].main,
                                                    lineHeight: 1,
                                                    mb: 0.5,
                                                }}
                                            >
                                                {item.value}
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    fontSize: "0.75rem",
                                                    color: "#64748b",
                                                    fontWeight: 500,
                                                }}
                                            >
                                                người dùng
                                            </Typography>
                                        </Box>

                                        <Chip
                                            label={`${item.percent.toFixed(1)}%`}
                                            sx={{
                                                height: 28,
                                                fontSize: "0.8125rem",
                                                fontWeight: 700,
                                                bgcolor: COLORS[item.colorIndex].main,
                                                color: "#ffffff",
                                                boxShadow: `0 4px 12px ${COLORS[item.colorIndex].main}40`,
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        ))}
                    </AnimatePresence>
                </Box>
            </Box>
        </Box>
    );
};

export default UserDistribution;
