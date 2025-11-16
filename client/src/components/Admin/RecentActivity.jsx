import React, { useEffect, useState } from "react";
import { Box, Typography, Avatar, Chip, Stack, IconButton } from "@mui/material";
import { motion, AnimatePresence } from "motion/react";
import axios from "axios";

// Icons (có thể thay bằng MUI icons hoặc custom icons)
const ActivityIcon = ({ type, color }) => {
    const icons = {
        shop: "🏪",
        shipper: "🚚",
        order: "📦",
        revenue: "💰",
        user: "👤",
        warning: "⚠️",
        success: "✅",
        info: "ℹ️",
    };

    return (
        <Avatar
            sx={{
                width: 48,
                height: 48,
                background: `linear-gradient(135deg, ${color}20 0%, ${color}40 100%)`,
                border: `2px solid ${color}30`,
                fontSize: "1.5rem",
                boxShadow: `0 4px 12px ${color}20`,
            }}
        >
            {icons[type] || "📌"}
        </Avatar>
    );
};

const RecentActivity = ({ endpoint = "/api/admin/stats/dashboard/activities" }) => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock data - thay bằng API call thật
        const mockActivities = [
            {
                id: 1,
                type: "shop",
                title: 'Cửa hàng "Phở Hà Nội" đã đăng ký thành công',
                description: "Đang chờ xét duyệt từ admin",
                time: "5 phút trước",
                color: "#10b981",
                status: "pending",
            },
            {
                id: 2,
                type: "shipper",
                title: "Shipper Nguyễn Văn A đã hoàn thành 10 đơn hàng",
                description: "Đạt mốc 100 đơn hàng trong tháng",
                time: "15 phút trước",
                color: "#0ea5e9",
                status: "success",
            },
            {
                id: 3,
                type: "warning",
                title: "Có 3 đăng ký shipper chờ duyệt",
                description: "Cần xem xét và phê duyệt",
                time: "30 phút trước",
                color: "#f59e0b",
                status: "warning",
            },
            {
                id: 4,
                type: "revenue",
                title: "Doanh thu hôm nay đã đạt 45 triệu VND",
                description: "Tăng 25% so với hôm qua",
                time: "1 giờ trước",
                color: "#8b5cf6",
                status: "info",
            },
            {
                id: 5,
                type: "order",
                title: "Có 12 đơn hàng mới trong 1 giờ qua",
                description: "Tất cả đã được giao cho shipper",
                time: "2 giờ trước",
                color: "#ec4899",
                status: "success",
            },
        ];

        setTimeout(() => {
            setActivities(mockActivities);
            setLoading(false);
        }, 500);

        // Uncomment khi có API
        // axios
        //   .get(`http://localhost:5000${endpoint}`)
        //   .then((res) => setActivities(res.data.items))
        //   .catch((err) => console.error("❌ Lỗi lấy hoạt động:", err))
        //   .finally(() => setLoading(false));
    }, [endpoint]);

    const getStatusColor = (status) => {
        const colors = {
            success: "#10b981",
            warning: "#f59e0b",
            info: "#0ea5e9",
            pending: "#8b5cf6",
            error: "#ef4444",
        };
        return colors[status] || "#64748b";
    };

    const getStatusLabel = (status) => {
        const labels = {
            success: "Hoàn thành",
            warning: "Cần xử lý",
            info: "Thông tin",
            pending: "Chờ duyệt",
            error: "Lỗi",
        };
        return labels[status] || "Khác";
    };

    if (loading) {
        return (
            <Box sx={{ p: 3 }}>
                {[1, 2, 3].map((i) => (
                    <Box
                        key={i}
                        component={motion.div}
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        sx={{
                            height: 80,
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
                height: "100%",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                }}
            >
                <Box>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 600,
                            color: "#1e293b",
                            fontSize: "1.125rem",
                            mb: 0.5,
                        }}
                    >
                        Hoạt động gần đây
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            color: "#64748b",
                            fontSize: "0.875rem",
                        }}
                    >
                        Các sự kiện mới nhất trong hệ thống
                    </Typography>
                </Box>
                <Chip
                    label={`${activities.length} hoạt động`}
                    size="small"
                    sx={{
                        bgcolor: "rgba(99,102,241,0.1)",
                        color: "#6366f1",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                    }}
                />
            </Box>

            {/* Activities List */}
            <Box
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    pr: 1,
                    "&::-webkit-scrollbar": {
                        width: "6px",
                    },
                    "&::-webkit-scrollbar-track": {
                        background: "rgba(148,163,184,0.1)",
                        borderRadius: "10px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                        background: "rgba(148,163,184,0.3)",
                        borderRadius: "10px",
                        "&:hover": {
                            background: "rgba(148,163,184,0.5)",
                        },
                    },
                }}
            >
                <AnimatePresence>
                    {activities.map((activity, index) => (
                        <Box
                            key={activity.id}
                            component={motion.div}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            whileHover={{
                                scale: 1.02,
                                boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
                            }}
                            sx={{
                                position: "relative",
                                display: "flex",
                                gap: 2,
                                p: 2,
                                mb: 2,
                                borderRadius: 3,
                                bgcolor: "#ffffff",
                                border: "1px solid rgba(148,163,184,0.15)",
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    borderColor: activity.color,
                                    bgcolor: `${activity.color}05`,
                                },
                                "&::before": {
                                    content: '""',
                                    position: "absolute",
                                    left: 0,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    width: "4px",
                                    height: "60%",
                                    bgcolor: activity.color,
                                    borderRadius: "0 4px 4px 0",
                                    opacity: 0,
                                    transition: "opacity 0.3s ease",
                                },
                                "&:hover::before": {
                                    opacity: 1,
                                },
                            }}
                        >
                            {/* Icon */}
                            <Box sx={{ flexShrink: 0 }}>
                                <ActivityIcon type={activity.type} color={activity.color} />
                            </Box>

                            {/* Content */}
                            <Box sx={{ flex: 1, minWidth: 0 }}>
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
                                            fontWeight: 600,
                                            color: "#1e293b",
                                            lineHeight: 1.4,
                                        }}
                                    >
                                        {activity.title}
                                    </Typography>
                                    <Chip
                                        label={getStatusLabel(activity.status)}
                                        size="small"
                                        sx={{
                                            height: 22,
                                            fontSize: "0.6875rem",
                                            fontWeight: 600,
                                            bgcolor: `${getStatusColor(activity.status)}15`,
                                            color: getStatusColor(activity.status),
                                            border: `1px solid ${getStatusColor(activity.status)}30`,
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
                                        mb: 1,
                                        lineHeight: 1.5,
                                    }}
                                >
                                    {activity.description}
                                </Typography>

                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 6,
                                            height: 6,
                                            borderRadius: "50%",
                                            bgcolor: activity.color,
                                            boxShadow: `0 0 8px ${activity.color}60`,
                                        }}
                                    />
                                    <Typography
                                        sx={{
                                            fontSize: "0.75rem",
                                            color: "#94a3b8",
                                            fontWeight: 500,
                                        }}
                                    >
                                        {activity.time}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    ))}
                </AnimatePresence>
            </Box>

            {/* Footer - View All */}
            <Box
                component={motion.div}
                whileHover={{ scale: 1.02 }}
                sx={{
                    mt: 2,
                    pt: 2,
                    borderTop: "1px solid rgba(148,163,184,0.15)",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                        py: 1.5,
                        px: 2,
                        borderRadius: 2,
                        bgcolor: "rgba(99,102,241,0.05)",
                        border: "1px solid rgba(99,102,241,0.15)",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        "&:hover": {
                            bgcolor: "rgba(99,102,241,0.1)",
                            borderColor: "rgba(99,102,241,0.3)",
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
                        Xem tất cả hoạt động
                    </Typography>
                    <Box
                        component="span"
                        sx={{
                            fontSize: "1rem",
                            color: "#6366f1",
                        }}
                    >
                        →
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default RecentActivity;
