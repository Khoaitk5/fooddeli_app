import React, { useState } from "react";
import {
    Box,
    Typography,
    Badge,
    IconButton,
    Popover,
    Divider,
    Avatar,
    Chip,
} from "@mui/material";
import { motion, AnimatePresence } from "motion/react";

const NotificationBell = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: "order",
            title: "Đơn hàng mới",
            message: "Bạn có 5 đơn hàng mới cần xử lý",
            time: "2 phút trước",
            read: false,
            color: "#ec4899",
            icon: "📦",
        },
        {
            id: 2,
            type: "shop",
            title: "Cửa hàng đăng ký",
            message: 'Cửa hàng "Bún Chả Hà Nội" chờ duyệt',
            time: "10 phút trước",
            read: false,
            color: "#10b981",
            icon: "🏪",
        },
        {
            id: 3,
            type: "revenue",
            title: "Doanh thu tăng",
            message: "Doanh thu hôm nay tăng 35% so với hôm qua",
            time: "1 giờ trước",
            read: true,
            color: "#8b5cf6",
            icon: "💰",
        },
        {
            id: 4,
            type: "shipper",
            title: "Shipper mới",
            message: "3 shipper đăng ký chờ phê duyệt",
            time: "2 giờ trước",
            read: true,
            color: "#0ea5e9",
            icon: "🚚",
        },
    ]);

    const unreadCount = notifications.filter((n) => !n.read).length;

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const markAsRead = (id) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    };

    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    const open = Boolean(anchorEl);

    return (
        <>
            {/* Bell Icon Button */}
            <IconButton
                component={motion.button}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClick}
                sx={{
                    position: "relative",
                    width: 48,
                    height: 48,
                    bgcolor: "rgba(99,102,241,0.1)",
                    "&:hover": {
                        bgcolor: "rgba(99,102,241,0.2)",
                    },
                }}
            >
                <Badge
                    badgeContent={unreadCount}
                    color="error"
                    sx={{
                        "& .MuiBadge-badge": {
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            minWidth: 20,
                            height: 20,
                            animation: unreadCount > 0 ? "pulse 2s infinite" : "none",
                            "@keyframes pulse": {
                                "0%, 100%": { transform: "scale(1)" },
                                "50%": { transform: "scale(1.1)" },
                            },
                        },
                    }}
                >
                    <Box
                        component={motion.div}
                        animate={
                            unreadCount > 0
                                ? {
                                    rotate: [0, -15, 15, -15, 15, 0],
                                }
                                : {}
                        }
                        transition={{
                            duration: 0.5,
                            repeat: unreadCount > 0 ? Infinity : 0,
                            repeatDelay: 3,
                        }}
                        sx={{ fontSize: "1.5rem" }}
                    >
                        🔔
                    </Box>
                </Badge>
            </IconButton>

            {/* Notifications Popover */}
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                PaperProps={{
                    component: motion.div,
                    initial: { opacity: 0, y: -20, scale: 0.95 },
                    animate: { opacity: 1, y: 0, scale: 1 },
                    exit: { opacity: 0, y: -20, scale: 0.95 },
                    sx: {
                        width: 380,
                        maxHeight: 600,
                        mt: 1,
                        borderRadius: 3,
                        boxShadow: "0 20px 60px rgba(15,23,42,0.15)",
                        border: "1px solid rgba(148,163,184,0.2)",
                    },
                }}
            >
                {/* Header */}
                <Box
                    sx={{
                        p: 2.5,
                        borderBottom: "1px solid rgba(148,163,184,0.15)",
                        background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            mb: 1,
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: "1.125rem",
                                fontWeight: 700,
                                color: "#ffffff",
                            }}
                        >
                            Thông báo
                        </Typography>
                        {unreadCount > 0 && (
                            <Chip
                                label={`${unreadCount} mới`}
                                size="small"
                                sx={{
                                    bgcolor: "rgba(255,255,255,0.2)",
                                    color: "#ffffff",
                                    fontWeight: 600,
                                    fontSize: "0.75rem",
                                    backdropFilter: "blur(10px)",
                                }}
                            />
                        )}
                    </Box>
                    {unreadCount > 0 && (
                        <Box
                            component={motion.div}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={markAllAsRead}
                            sx={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 0.5,
                                px: 1.5,
                                py: 0.5,
                                borderRadius: 1.5,
                                bgcolor: "rgba(255,255,255,0.15)",
                                cursor: "pointer",
                                "&:hover": {
                                    bgcolor: "rgba(255,255,255,0.25)",
                                },
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: "0.75rem",
                                    fontWeight: 600,
                                    color: "#ffffff",
                                }}
                            >
                                Đánh dấu tất cả đã đọc
                            </Typography>
                        </Box>
                    )}
                </Box>

                {/* Notifications List */}
                <Box
                    sx={{
                        maxHeight: 450,
                        overflowY: "auto",
                        "&::-webkit-scrollbar": {
                            width: "6px",
                        },
                        "&::-webkit-scrollbar-track": {
                            background: "rgba(148,163,184,0.1)",
                        },
                        "&::-webkit-scrollbar-thumb": {
                            background: "rgba(148,163,184,0.3)",
                            borderRadius: "10px",
                        },
                    }}
                >
                    <AnimatePresence>
                        {notifications.map((notification, index) => (
                            <Box
                                key={notification.id}
                                component={motion.div}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ bgcolor: `${notification.color}05` }}
                                onClick={() => markAsRead(notification.id)}
                                sx={{
                                    p: 2,
                                    cursor: "pointer",
                                    borderBottom: "1px solid rgba(148,163,184,0.1)",
                                    position: "relative",
                                    bgcolor: notification.read
                                        ? "transparent"
                                        : "rgba(99,102,241,0.03)",
                                    "&:last-child": {
                                        borderBottom: "none",
                                    },
                                }}
                            >
                                {/* Unread Indicator */}
                                {!notification.read && (
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            left: 8,
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            width: 8,
                                            height: 8,
                                            borderRadius: "50%",
                                            bgcolor: notification.color,
                                            boxShadow: `0 0 8px ${notification.color}`,
                                        }}
                                    />
                                )}

                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 2,
                                        ml: notification.read ? 0 : 2,
                                    }}
                                >
                                    {/* Icon */}
                                    <Avatar
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            bgcolor: `${notification.color}20`,
                                            fontSize: "1.25rem",
                                        }}
                                    >
                                        {notification.icon}
                                    </Avatar>

                                    {/* Content */}
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Typography
                                            sx={{
                                                fontSize: "0.875rem",
                                                fontWeight: 600,
                                                color: "#1e293b",
                                                mb: 0.5,
                                            }}
                                        >
                                            {notification.title}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontSize: "0.8125rem",
                                                color: "#64748b",
                                                lineHeight: 1.4,
                                                mb: 0.5,
                                            }}
                                        >
                                            {notification.message}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontSize: "0.75rem",
                                                color: "#94a3b8",
                                                fontWeight: 500,
                                            }}
                                        >
                                            {notification.time}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        ))}
                    </AnimatePresence>
                </Box>

                {/* Footer */}
                <Box
                    component={motion.div}
                    whileHover={{ bgcolor: "rgba(99,102,241,0.05)" }}
                    sx={{
                        p: 2,
                        textAlign: "center",
                        borderTop: "1px solid rgba(148,163,184,0.15)",
                        cursor: "pointer",
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            color: "#6366f1",
                        }}
                    >
                        Xem tất cả thông báo →
                    </Typography>
                </Box>
            </Popover>
        </>
    );
};

export default NotificationBell;
