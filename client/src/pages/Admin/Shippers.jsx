import { useEffect, useState } from "react";
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
  InputAdornment,
  CircularProgress,
  Container,
  Card,
  CardContent,
  Avatar,
  TableContainer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
} from "@mui/material";
import { motion, AnimatePresence } from "motion/react";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BlockIcon from "@mui/icons-material/Block";
import StarIcon from "@mui/icons-material/Star";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import { getShippers } from "../../api/adminApi";

const Shippers = () => {
  const [shippers, setShippers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedShipper, setSelectedShipper] = useState(null);

  // 🧭 Lấy danh sách shipper từ DB
  useEffect(() => {
    const fetchShippers = async () => {
      try {
        const data = await getShippers();
        setShippers(data);
      } catch (error) {
        console.error("❌ Lỗi khi tải danh sách shipper:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchShippers();
  }, []);

  // 🔍 Lọc theo ô tìm kiếm
  const filtered = shippers.filter((s) => {
    const keyword = search.toLowerCase();
    return (
      s.username?.toLowerCase().includes(keyword) ||
      s.email?.toLowerCase().includes(keyword) ||
      s.phone?.toLowerCase().includes(keyword)
    );
  });

  const handleViewDetail = (shipper) => {
    setSelectedShipper(shipper);
    setDetailOpen(true);
  };

  // 📊 Tính toán thống kê
  const totalShippers = shippers.length;
  const activeShippers = shippers.filter((s) => s.status === "approved").length;
  const pendingShippers = shippers.filter((s) => s.status === "pending").length;
  const avgRating = "4.7";

  // 🟩 Thẻ thống kê hiện đại với animation
  const StatCard = ({ title, value, sub, icon, gradient, delay }) => (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(59,130,246,0.2)" }}
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

  // Floating particles cho background
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2,
  }));

  // 🕓 Hiển thị Loading
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f8fafc 0%, #dbeafe 100%)",
        }}
      >
        <CircularProgress
          size={56}
          thickness={4}
          sx={{
            color: "#3b82f6",
            "& .MuiCircularProgress-circle": {
              strokeLinecap: "round",
            },
          }}
        />
        <Typography
          sx={{
            mt: 3,
            fontSize: "1.125rem",
            fontWeight: 600,
            color: "#64748b",
            letterSpacing: "0.3px",
          }}
        >
          Đang tải danh sách shipper...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc 0%, #dbeafe 100%)",
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
            background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)",
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
                background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                boxShadow: "0 12px 32px rgba(59,130,246,0.4)",
              }}
            >
              <DeliveryDiningIcon sx={{ fontSize: 36, color: "#ffffff" }} />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontSize: "2.5rem",
                  fontWeight: 900,
                  background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  lineHeight: 1.2,
                }}
              >
                Quản lý Shipper
              </Typography>
              <Typography
                sx={{
                  fontSize: "1rem",
                  color: "#64748b",
                  fontWeight: 500,
                  mt: 0.5,
                }}
              >
                Quản lý thông tin và hoạt động của đội ngũ shipper trong hệ thống
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
          <Box sx={{ flex: 1 }}>
            <StatCard
              title="Tổng Shipper"
              value={totalShippers}
              sub="+12 shipper mới tháng này"
              icon={<DeliveryDiningIcon sx={{ fontSize: 32, color: "rgba(255,255,255,0.9)" }} />}
              gradient="linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
              delay={0.1}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <StatCard
              title="Đang hoạt động"
              value={activeShippers}
              sub="Shipper đã duyệt"
              icon={<CheckCircleIcon sx={{ fontSize: 32, color: "rgba(255,255,255,0.9)" }} />}
              gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)"
              delay={0.2}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <StatCard
              title="Chờ duyệt"
              value={pendingShippers}
              sub="Cần xem xét"
              icon={<HourglassEmptyIcon sx={{ fontSize: 32, color: "rgba(255,255,255,0.9)" }} />}
              gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
              delay={0.3}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <StatCard
              title="Đánh giá TB"
              value={avgRating}
              sub="+0.1 điểm tháng này"
              icon={<TrendingUpIcon sx={{ fontSize: 32, color: "rgba(255,255,255,0.9)" }} />}
              gradient="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
              delay={0.4}
            />
          </Box>
        </Box>

        {/* Shipper List */}
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
            border: "1px solid rgba(59,130,246,0.1)",
            boxShadow: "0 8px 32px rgba(59,130,246,0.1)",
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
              background: "radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
              <Box>
                <Typography sx={{ fontSize: "1.5rem", fontWeight: 800, color: "#1e293b", mb: 0.5 }}>
                  Danh sách Shipper
                </Typography>
                <Typography sx={{ fontSize: "0.875rem", color: "#64748b" }}>
                  Quản lý và theo dõi hoạt động của các shipper
                </Typography>
              </Box>
              <TextField
                size="small"
                placeholder="Tìm kiếm shipper..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{
                  width: 320,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    background: "rgba(248,250,252,0.8)",
                    "& fieldset": {
                      borderColor: "rgba(59,130,246,0.2)",
                    },
                    "&:hover fieldset": {
                      borderColor: "#3b82f6",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#3b82f6",
                    },
                  },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: "#3b82f6" }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>

            <TableContainer sx={{ borderRadius: 3, overflow: "hidden" }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)" }}>
                    <TableCell sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.875rem" }}>Shipper</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.875rem" }}>Thông tin liên hệ</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.875rem" }}>Trạng thái</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.875rem" }}>Online</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.875rem" }}>Đánh giá</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.875rem" }}>Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <AnimatePresence>
                    {filtered.length > 0 ? (
                      filtered.map((s, index) => (
                        <TableRow
                          key={s.id}
                          component={motion.tr}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.03 }}
                          sx={{
                            "&:hover": {
                              background: "rgba(59,130,246,0.05)",
                            },
                            transition: "all 0.2s ease",
                          }}
                        >
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                              <Avatar
                                sx={{
                                  width: 40,
                                  height: 40,
                                  background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                                  fontWeight: 700,
                                  fontSize: "0.875rem",
                                }}
                              >
                                {s.username?.charAt(0).toUpperCase()}
                              </Avatar>
                              <Box>
                                <Typography sx={{ fontWeight: 600, color: "#1e293b", fontSize: "0.9375rem" }}>
                                  {s.username}
                                </Typography>
                                <Typography sx={{ fontSize: "0.75rem", color: "#64748b" }}>
                                  ID: {s.id}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <PhoneIcon sx={{ fontSize: 14, color: "#64748b" }} />
                                <Typography sx={{ fontSize: "0.875rem", color: "#1e293b" }}>
                                  {s.phone || "—"}
                                </Typography>
                              </Box>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <EmailIcon sx={{ fontSize: 14, color: "#64748b" }} />
                                <Typography sx={{ fontSize: "0.75rem", color: "#64748b" }}>
                                  {s.email || "—"}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              label={
                                s.status === "approved"
                                  ? "Đã duyệt"
                                  : s.status === "rejected"
                                    ? "Từ chối"
                                    : "Chờ duyệt"
                              }
                              sx={{
                                fontWeight: 700,
                                fontSize: "0.75rem",
                                background:
                                  s.status === "approved"
                                    ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                                    : s.status === "rejected"
                                      ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
                                      : "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                                color: "#ffffff",
                                border: "none",
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                              <FiberManualRecordIcon
                                sx={{
                                  fontSize: 12,
                                  color: s.online_status === "online" ? "#10b981" : "#94a3b8",
                                }}
                              />
                              <Typography
                                sx={{
                                  fontSize: "0.875rem",
                                  fontWeight: 600,
                                  color: s.online_status === "online" ? "#10b981" : "#64748b",
                                }}
                              >
                                {s.online_status === "online" ? "Online" : "Offline"}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                              <StarIcon sx={{ fontSize: 16, color: "#fbbf24" }} />
                              <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#1e293b" }}>
                                {s.rating ?? avgRating}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              <IconButton
                                size="small"
                                onClick={() => handleViewDetail(s)}
                                sx={{
                                  background: "rgba(59,130,246,0.1)",
                                  color: "#3b82f6",
                                  "&:hover": {
                                    background: "rgba(59,130,246,0.2)",
                                  },
                                }}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
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
                                <BlockIcon fontSize="small" />
                              </IconButton>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                          <Typography sx={{ fontSize: "0.9375rem", color: "#64748b" }}>
                            Không tìm thấy shipper phù hợp.
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

      {/* Dialog chi tiết shipper */}
      <Dialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: "linear-gradient(135deg, #ffffff 0%, #dbeafe 100%)",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
            color: "#ffffff",
            fontWeight: 800,
            fontSize: "1.25rem",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <DeliveryDiningIcon />
            Thông tin Shipper
          </Box>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          {selectedShipper ? (
            <Box>
              <Box sx={{ mb: 3 }}>
                <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: "#1e293b", mb: 2 }}>
                  Thông tin cơ bản
                </Typography>
                <Stack spacing={1.5}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography sx={{ fontSize: "0.875rem", color: "#64748b" }}>Tên đăng nhập:</Typography>
                    <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#1e293b" }}>
                      {selectedShipper.username}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography sx={{ fontSize: "0.875rem", color: "#64748b" }}>Số điện thoại:</Typography>
                    <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#1e293b" }}>
                      {selectedShipper.phone || "—"}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography sx={{ fontSize: "0.875rem", color: "#64748b" }}>Email:</Typography>
                    <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#1e293b" }}>
                      {selectedShipper.email || "—"}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography sx={{ fontSize: "0.875rem", color: "#64748b" }}>Trạng thái:</Typography>
                    <Chip
                      size="small"
                      label={
                        selectedShipper.status === "approved"
                          ? "Đã duyệt"
                          : selectedShipper.status === "rejected"
                            ? "Từ chối"
                            : "Chờ duyệt"
                      }
                      sx={{
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        background:
                          selectedShipper.status === "approved"
                            ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                            : selectedShipper.status === "rejected"
                              ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
                              : "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                        color: "#ffffff",
                        border: "none",
                      }}
                    />
                  </Box>
                  <Divider />
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography sx={{ fontSize: "0.875rem", color: "#64748b" }}>Online:</Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <FiberManualRecordIcon
                        sx={{
                          fontSize: 12,
                          color: selectedShipper.online_status === "online" ? "#10b981" : "#94a3b8",
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          color: selectedShipper.online_status === "online" ? "#10b981" : "#64748b",
                        }}
                      >
                        {selectedShipper.online_status === "online" ? "Online" : "Offline"}
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </Box>
            </Box>
          ) : (
            <Typography sx={{ fontSize: "0.875rem", color: "#64748b", textAlign: "center", py: 4 }}>
              Không có dữ liệu shipper.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setDetailOpen(false)}
            sx={{
              background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
              color: "#ffffff",
              fontWeight: 700,
              px: 3,
              borderRadius: 2,
              "&:hover": {
                background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
              },
            }}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Shippers;
