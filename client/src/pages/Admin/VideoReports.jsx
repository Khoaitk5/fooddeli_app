import { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Stack,
  Chip,
  IconButton,
  Avatar,
  InputAdornment,
  Container,
  Card,
  CardContent,
  TableContainer,
} from "@mui/material";
import { motion, AnimatePresence } from "motion/react";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ReportIcon from "@mui/icons-material/Report";
import PendingIcon from "@mui/icons-material/Pending";
import RateReviewIcon from "@mui/icons-material/RateReview";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

const VideoReports = () => {
  const [search, setSearch] = useState("");

  const reports = [
    {
      id: 1,
      video: {
        title: "Review món ăn tại Phở Hà Nội",
        thumbnail: "https://via.placeholder.com/60",
        duration: "3:45",
        date: "25/9/2024",
      },
      reporter: { name: "Nguyễn Văn A", email: "nguyenvana@email.com" },
      store: "Phở Hà Nội",
      reason: "Nội dung không phù hợp",
      date: "28/9/2024",
      views: "1.250",
      status: "Chờ xử lý",
    },
    {
      id: 2,
      video: {
        title: "Đánh giá shipper giao hàng chậm",
        thumbnail: "https://via.placeholder.com/60",
        duration: "2:18",
        date: "27/9/2024",
      },
      reporter: { name: "Lê Thị C", email: "lethic@email.com" },
      store: "Pizza Italia",
      reason: "Xúc phạm danh dự",
      date: "29/9/2024",
      views: "890",
      status: "Đang xem xét",
    },
    {
      id: 3,
      video: {
        title: "Unboxing đồ ăn từ Bánh Mì Sài Gòn",
        thumbnail: "https://via.placeholder.com/60",
        duration: "5:22",
        date: "22/9/2024",
      },
      reporter: { name: "Phạm Văn D", email: "phamvand@email.com" },
      store: "Bánh Mì Sài Gòn",
      reason: "Spam",
      date: "30/9/2024",
      views: "2.100",
      status: "Đã xử lý",
    },
  ];

  const filtered = reports.filter(
    (r) =>
      r.video.title?.toLowerCase().includes(search.toLowerCase()) ||
      r.reporter.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.store?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Chờ xử lý":
        return "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)";
      case "Đang xem xét":
        return "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)";
      case "Đã xử lý":
        return "linear-gradient(135deg, #10b981 0%, #059669 100%)";
      default:
        return "linear-gradient(135deg, #94a3b8 0%, #64748b 100%)";
    }
  };

  const getReasonColor = (reason) => {
    if (reason.includes("phù hợp")) return "#ef4444";
    if (reason.includes("danh dự")) return "#f59e0b";
    return "#8b5cf6";
  };

  // Stats
  const totalReports = reports.length;
  const pendingReports = reports.filter((r) => r.status === "Chờ xử lý").length;
  const reviewingReports = reports.filter((r) => r.status === "Đang xem xét").length;
  const resolvedReports = reports.filter((r) => r.status === "Đã xử lý").length;

  const StatCard = ({ title, value, sub, icon, gradient, delay }) => (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(239,68,68,0.2)" }}
      sx={{
        background: gradient,
        borderRadius: 4,
        overflow: "hidden",
        position: "relative",
        height: "100%",
      }}
    >
      <Box
        component={motion.div}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        sx={{
          position: "absolute",
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)",
        }}
      />
      <CardContent sx={{ position: "relative", zIndex: 1, p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          {icon}
          <Typography
            sx={{
              fontSize: "0.875rem",
              fontWeight: 700,
              color: "rgba(255,255,255,0.8)",
              textTransform: "uppercase",
              letterSpacing: "1px",
              lineHeight: 1.4,
            }}
          >
            {title}
          </Typography>
        </Box>
        <Typography
          component={motion.div}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          sx={{
            fontSize: "2.5rem",
            fontWeight: 900,
            color: "#ffffff",
            lineHeight: 1.2,
            mb: 2,
          }}
        >
          {value}
        </Typography>
        <Typography
          sx={{
            fontSize: "0.8125rem",
            color: "rgba(255,255,255,0.7)",
            lineHeight: 1.5,
          }}
        >
          {sub}
        </Typography>
      </CardContent>
    </Card>
  );

  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2,
  }));

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc 0%, #fee2e2 100%)",
        position: "relative",
        overflow: "hidden",
        pb: 6,
      }}
    >
      {/* Background Particles */}
      {particles.map((particle) => (
        <Box
          key={particle.id}
          component={motion.div}
          animate={{
            y: [0, -40, 0],
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.3, 1],
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
            background: "radial-gradient(circle, #ef4444 0%, transparent 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      ))}

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1, pt: 4 }}>
        {/* Header */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          sx={{ mb: 5 }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Box
              component={motion.div}
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              sx={{
                width: 64,
                height: 64,
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                boxShadow: "0 12px 32px rgba(239,68,68,0.4)",
              }}
            >
              <ReportIcon sx={{ fontSize: 36, color: "#ffffff" }} />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontSize: "2.5rem",
                  fontWeight: 900,
                  background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  lineHeight: 1.2,
                }}
              >
                Quản lý Report Videos
              </Typography>
              <Typography
                sx={{
                  fontSize: "1rem",
                  color: "#64748b",
                  fontWeight: 500,
                  mt: 0.5,
                }}
              >
                Xem xét và xử lý các video bị báo cáo vi phạm nội dung trong hệ thống
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
          <Box sx={{ flex: 1 }}>
            <StatCard
              title="Tổng báo cáo"
              value={totalReports}
              sub="Video được báo cáo"
              icon={<ReportIcon sx={{ fontSize: 32, color: "rgba(255,255,255,0.9)" }} />}
              gradient="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
              delay={0.1}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <StatCard
              title="Chờ xử lý"
              value={pendingReports}
              sub="Cần xem xét ngay"
              icon={<PendingIcon sx={{ fontSize: 32, color: "rgba(255,255,255,0.9)" }} />}
              gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
              delay={0.2}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <StatCard
              title="Đang xem xét"
              value={reviewingReports}
              sub="Đang xử lý"
              icon={<RateReviewIcon sx={{ fontSize: 32, color: "rgba(255,255,255,0.9)" }} />}
              gradient="linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
              delay={0.3}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <StatCard
              title="Đã xử lý"
              value={resolvedReports}
              sub="Hoàn thành"
              icon={<CheckCircleIcon sx={{ fontSize: 32, color: "rgba(255,255,255,0.9)" }} />}
              gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)"
              delay={0.4}
            />
          </Box>
        </Box>

        {/* Reports List */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          sx={{
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(20px)",
            borderRadius: 4,
            p: 4,
            border: "1px solid rgba(239,68,68,0.1)",
            boxShadow: "0 8px 32px rgba(239,68,68,0.1)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            component={motion.div}
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            sx={{
              position: "absolute",
              top: -100,
              right: -100,
              width: 300,
              height: 300,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(239,68,68,0.05) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
              <Box>
                <Typography sx={{ fontSize: "1.5rem", fontWeight: 800, color: "#1e293b", mb: 0.5 }}>
                  Danh sách video bị báo cáo
                </Typography>
                <Typography sx={{ fontSize: "0.875rem", color: "#64748b" }}>
                  Xem xét và xử lý các báo cáo vi phạm từ người dùng
                </Typography>
              </Box>
              <TextField
                size="small"
                placeholder="Tìm kiếm video..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{
                  width: 320,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    background: "rgba(248,250,252,0.8)",
                    "& fieldset": {
                      borderColor: "rgba(239,68,68,0.2)",
                    },
                    "&:hover fieldset": {
                      borderColor: "#ef4444",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#ef4444",
                    },
                  },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: "#ef4444" }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>

            <TableContainer sx={{ borderRadius: 3, overflow: "hidden" }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ background: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)" }}>
                    <TableCell sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.875rem" }}>Video</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.875rem" }}>Người báo cáo</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.875rem" }}>Cửa hàng</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.875rem" }}>Lý do</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.875rem" }}>Ngày báo cáo</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.875rem" }}>Lượt xem</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.875rem" }}>Trạng thái</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.875rem" }}>Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <AnimatePresence>
                    {filtered.length > 0 ? (
                      filtered.map((r, index) => (
                        <TableRow
                          key={r.id}
                          component={motion.tr}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.03 }}
                          sx={{
                            "&:hover": {
                              background: "rgba(239,68,68,0.05)",
                            },
                            transition: "all 0.2s ease",
                          }}
                        >
                          <TableCell>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                              <Box sx={{ position: "relative" }}>
                                <Avatar
                                  src={r.video.thumbnail}
                                  variant="rounded"
                                  sx={{ width: 56, height: 40 }}
                                />
                                <PlayCircleIcon
                                  sx={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    fontSize: 20,
                                    color: "#ffffff",
                                    opacity: 0.9,
                                  }}
                                />
                              </Box>
                              <Box>
                                <Typography sx={{ fontWeight: 600, color: "#1e293b", fontSize: "0.9375rem" }}>
                                  {r.video.title}
                                </Typography>
                                <Typography sx={{ fontSize: "0.75rem", color: "#64748b" }}>
                                  {r.video.duration} • {r.video.date}
                                </Typography>
                              </Box>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Typography sx={{ fontSize: "0.875rem", color: "#1e293b", fontWeight: 500 }}>
                              {r.reporter.name}
                            </Typography>
                            <Typography sx={{ fontSize: "0.75rem", color: "#64748b" }}>
                              {r.reporter.email}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography sx={{ fontSize: "0.875rem", color: "#1e293b", fontWeight: 500 }}>
                              {r.store}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              label={r.reason}
                              sx={{
                                fontWeight: 600,
                                fontSize: "0.75rem",
                                background: `${getReasonColor(r.reason)}20`,
                                color: getReasonColor(r.reason),
                                border: `1px solid ${getReasonColor(r.reason)}40`,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography sx={{ fontSize: "0.875rem", color: "#64748b" }}>
                              {r.date}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                              <RemoveRedEyeIcon sx={{ fontSize: 16, color: "#64748b" }} />
                              <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#1e293b" }}>
                                {r.views}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              label={r.status}
                              sx={{
                                fontWeight: 700,
                                fontSize: "0.75rem",
                                background: getStatusColor(r.status),
                                color: "#ffffff",
                                border: "none",
                              }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              <IconButton
                                size="small"
                                sx={{
                                  background: "rgba(239,68,68,0.1)",
                                  color: "#ef4444",
                                  "&:hover": {
                                    background: "rgba(239,68,68,0.2)",
                                  },
                                }}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                sx={{
                                  background: "rgba(245,158,11,0.1)",
                                  color: "#f59e0b",
                                  "&:hover": {
                                    background: "rgba(245,158,11,0.2)",
                                  },
                                }}
                              >
                                <WarningAmberIcon fontSize="small" />
                              </IconButton>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                          <Typography sx={{ fontSize: "0.9375rem", color: "#64748b" }}>
                            Không tìm thấy báo cáo phù hợp.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default VideoReports;
