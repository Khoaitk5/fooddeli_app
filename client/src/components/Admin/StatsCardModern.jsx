import React from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "motion/react";

const StatsCardModern = ({
    title,
    value,
    subtitle,
    icon,
    color = "#6366f1",
    trend,
    trendValue,
}) => {
    const isPositiveTrend = trend === "up";

    return (
        <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{
                y: -8,
                boxShadow: `0 20px 40px ${color}20`,
            }}
            transition={{ duration: 0.3 }}
            sx={{
                position: "relative",
                overflow: "hidden",
                p: 3,
                borderRadius: 3,
                bgcolor: "#ffffff",
                border: `1px solid ${color}20`,
                cursor: "pointer",
                height: "100%",
                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background: `linear-gradient(90deg, ${color} 0%, ${color}80 100%)`,
                },
                "&::after": {
                    content: '""',
                    position: "absolute",
                    top: -100,
                    right: -100,
                    width: 200,
                    height: 200,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`,
                    transition: "all 0.5s ease",
                },
                "&:hover::after": {
                    top: -50,
                    right: -50,
                },
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    mb: 2,
                }}
            >
                <Typography
                    sx={{
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: "#64748b",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                    }}
                >
                    {title}
                </Typography>

                {/* Icon */}
                <Box
                    component={motion.div}
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
                        fontSize: "1.5rem",
                        boxShadow: `0 4px 12px ${color}20`,
                    }}
                >
                    {icon}
                </Box>
            </Box>

            {/* Value */}
            <Typography
                component={motion.div}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                sx={{
                    fontSize: "2rem",
                    fontWeight: 800,
                    color: "#1e293b",
                    lineHeight: 1.2,
                    mb: 1,
                    background: `linear-gradient(135deg, ${color} 0%, ${color}80 100%)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                }}
            >
                {value}
            </Typography>

            {/* Subtitle */}
            <Typography
                sx={{
                    fontSize: "0.8125rem",
                    color: "#64748b",
                    mb: 2,
                    lineHeight: 1.4,
                }}
            >
                {subtitle}
            </Typography>

            {/* Trend */}
            {trendValue && (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        pt: 2,
                        borderTop: `1px solid ${color}15`,
                    }}
                >
                    <Box
                        component={motion.div}
                        animate={{ y: isPositiveTrend ? [-2, 0, -2] : [2, 0, 2] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            bgcolor: isPositiveTrend
                                ? "rgba(16,185,129,0.15)"
                                : "rgba(239,68,68,0.15)",
                            color: isPositiveTrend ? "#10b981" : "#ef4444",
                            fontSize: "0.875rem",
                            fontWeight: "bold",
                        }}
                    >
                        {isPositiveTrend ? "↑" : "↓"}
                    </Box>
                    <Typography
                        sx={{
                            fontSize: "0.8125rem",
                            fontWeight: 600,
                            color: isPositiveTrend ? "#10b981" : "#ef4444",
                        }}
                    >
                        {trendValue}
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: "0.75rem",
                            color: "#94a3b8",
                        }}
                    >
                        so với tháng trước
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default StatsCardModern;
