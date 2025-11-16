import React, { useEffect, useState } from "react";
import { Box, Typography, Avatar, Chip } from "@mui/material";
import { motion, AnimatePresence } from "motion/react";

const ActivityTimeline = ({ endpoint = "/api/admin/stats/dashboard/activities" }) => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock data
        const mockActivities = [
            {
                id: 1,
                type: "shop",
                icon: "🏪",
                title: "Cửa hàng mới",
                description: 'Phở Hà Nội đã đăng ký',
                time: "5 phút trước",
                color: "#10b981",
                bgColor: "#d1fae5",
            },
            {
                id: 2,
                type: "shipper",
                icon: "🚚",
                title: "Shipper xuất sắc",
                description: "Nguyễn Văn A - 10 đơn hoàn thành",
                time: "15 phút trước",
                color: "#0ea5e9",
                bgColor: "#dbeafe",
            },
            {
                id: 3,
                type: "warning",
                icon: "⚠️",
                title: "Cần xử lý",
                description: "3 đăng ký shipper chờ duyệt",
                time: "30 phút trước",
                color: "#f59e0b",
                bgColor: "#fef3c7",
            },
            {
                id: 4,
                type: "revenue",
                icon: "💰",
                title: "Doanh thu tăng",
                description: "45 triệu VND hôm nay (+25%)",
                time: "1 giờ trước",
                color: "#8b5cf6",
                bgColor: "#ede9fe",
            },
            {
                id: 5,
                type: "order",
                icon: "📦",
                title: "Đơn hàng mới",
                description: "12 đơn trong 1 giờ qua",
                time: "2 giờ trước",
                color: "#ec4899",
                bgColor: "#fce7f3",
            },
        ];

        setTimeout(() => {
            setActivities(mockActivities);
            setLoading(false);
        }, 500);
    }, [endpoint]);

    if (loading) {
        return (
            <Box sx={{ p: 2 }}>
                {[1, 2, 3].map((i) => (
                    <Box
                        key={i}
                        component={motion.div}
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        sx={{
                            height: 70,
                            bgcolor: "rgba(148,163,184,0.1)",
                            borderRadius: 2,
                            mb: 2,
                        }}
                    />
                ))}
            </Box>
        );
    }

    return (
        <Box
            sx={{
                position: "relative",
                pl: 4,
                "&::before": {
                    content: '""',
                    position: "absolute",
                    left: "19px",
                    top: "10px",
                    bottom: "10px",
                    width: "2px",
                    background: "linear-gradient(180deg, #e2e8f0 0%, #cbd5e1 50%, #e2e8f0 100%)",
                },
            }}
        >
            <AnimatePresence>
                {activities.map((activity, index) => (
                    <Box
                        key={activity.id}
                        component={motion.div}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 30 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        sx={{
                            position: "relative",
                            mb: 3,
                            "&:last-child": { mb: 0 },
                        }}
                    >
                        {/* Timeline Dot */}
                        <Box
                            component={motion.div}
                            whileHover={{ scale: 1.3 }}
                            sx={{
                                position: "absolute",
                                left: "-31px",
                                top: "8px",
                                width: "24px",
                                height: "24px",
                                borderRadius: "50%",
                                bgcolor: activity.bgColor,
                                border: `3px solid ${activity.color}`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "0.75rem",
                                boxShadow: `0 0 0 4px #ffffff, 0 4px 12px ${activity.color}30`,
                                zIndex: 1,
                            }}
                        >
                            {activity.icon}
                        </Box>

                        {/* Content Card */}
                        <Box
                            component={motion.div}
                            whileHover={{
                                scale: 1.02,
                                boxShadow: `0 8px 24px ${activity.color}20`,
                            }}
                            sx={{
                                p: 2,
                                borderRadius: 2.5,
                                bgcolor: "#ffffff",
                                border: `1px solid ${activity.color}20`,
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    borderColor: activity.color,
                                    bgcolor: `${activity.color}05`,
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    justifyContent: "space-between",
                                    gap: 1,
                                    mb: 0.5,
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: "0.9375rem",
                                        fontWeight: 700,
                                        color: activity.color,
                                        letterSpacing: "-0.01em",
                                    }}
                                >
                                    {activity.title}
                                </Typography>
                                <Chip
                                    label={activity.time}
                                    size="small"
                                    sx={{
                                        height: 20,
                                        fontSize: "0.6875rem",
                                        fontWeight: 600,
                                        bgcolor: `${activity.color}15`,
                                        color: activity.color,
                                        "& .MuiChip-label": {
                                            px: 1,
                                        },
                                    }}
                                />
                            </Box>

                            <Typography
                                sx={{
                                    fontSize: "0.8125rem",
                                    color: "#64748b",
                                    lineHeight: 1.5,
                                }}
                            >
                                {activity.description}
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </AnimatePresence>

            {/* View More Button */}
            <Box
                component={motion.div}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                sx={{
                    mt: 3,
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: "rgba(99,102,241,0.08)",
                    border: "2px dashed rgba(99,102,241,0.3)",
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all 0.3s ease",
                    "&:hover": {
                        bgcolor: "rgba(99,102,241,0.12)",
                        borderColor: "rgba(99,102,241,0.5)",
                    },
                }}
            >
                <Typography
                    sx={{
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: "#6366f1",
                    }}
                >
                    Xem thêm hoạt động →
                </Typography>
            </Box>
        </Box>
    );
};

export default ActivityTimeline;
