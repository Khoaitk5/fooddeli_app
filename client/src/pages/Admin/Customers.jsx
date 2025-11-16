import React, { useEffect, useState } from "react";
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
  Grid,
  Chip,
  IconButton,
  InputAdornment,
  CircularProgress,
  Container,
  Card,
  CardContent,
  Avatar,
  TableContainer,
} from "@mui/material";
import { motion, AnimatePresence } from "motion/react";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BlockIcon from "@mui/icons-material/Block";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import StarIcon from "@mui/icons-material/Star";
import { getCustomers, banCustomer, unbanCustomer } from "../../api/adminApi";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // 🧭 Lấy danh sách khách hàng từ DB
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getCustomers();
        setCustomers(data);
      } catch (error) {
        console.error("❌ Lỗi khi tải danh sách khách hàng:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  // 🔍 Lọc theo ô tìm kiếm
  const filtered = customers.filter((c) => {
    const keyword = search.toLowerCase();
    return (
      c.username?.toLowerCase().includes(keyword) ||
      c.email?.toLowerCase().includes(keyword) ||
      c.phone?.includes(search)
    );
  });

  // 🚫 / 🔓 Khóa hoặc mở khóa khách hàng
  const handleToggleBan = async (customer) => {
    const action = customer.status === "banned" ? "mở khóa" : "khóa tài khoản";
    if (!window.confirm(`Bạn có chắc muốn ${action} khách hàng "${customer.username}" không?`)) return;

    try {
      if (customer.status === "banned") {
        await unbanCustomer(customer.id);
        setCustomers((prev) => prev.map((c) => (c.id === customer.id ? { ...c, status: "active" } : c)));
      } else {
        await banCustomer(customer.id);
        setCustomers((prev) => prev.map((c) => (c.id === customer.id ? { ...c, status: "banned" } : c)));
      }
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật trạng thái khách hàng:", error);
    }
  };

  // 📊 Tính toán thống kê
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.status === "active").length;
  const bannedCustomers = customers.filter((c) => c.status === "banned").length;

  // 🟩 Thẻ thống kê hiện đại
  const StatCard = ({ title, value, sub, icon, gradient, delay }) => (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(99,102,241,0.2)" }}
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

  // Floating particles
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
          background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)",
        }}
      >
        <CircularProgress
          size={56}
          thickness={4}
          sx={{
            color: "#6366f1",
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
          Đang tải danh sách khách hàng...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)",
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
            background: "radial-gradient(circle, #6366f1 0%, transparent 70%)",
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
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                boxShadow: "0 12px 32px rgba(99,102,241,0.4)",
              }}
            >
              <PeopleIcon sx={{ fontSize: 36, color: "#ffffff" }} />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontSize: "2.5rem",
                  fontWeight: 900,
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  lineHeight: 1.2,
                }}
              >
                Quản lý Khách hàng
              </Typography>
              <Typography
                sx={{
                  fontSize: "1rem",
                  color: "#64748b",
                  fontWeight: 500,
                  mt: 0.5,
                }}
              >
                Quản lý thông tin và hoạt động của khách hàng trong hệ thống
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
          <Box sx={{ flex: 1 }}>
            <StatCard
              title="Tổng khách hàng"
              value={totalCustomers}
              sub="+8.2% tháng này"
              icon={<PeopleIcon sx={{ fontSize: 32, color: "rgba(255,255,255,0.9)" }} />}
              gradient="linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
              delay={0.1}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <StatCard
              title="Đang hoạt động"
              value={activeCustomers}
              sub="Khách hàng khả dụng"
              icon={<CheckCircleIcon sx={{ fontSize: 32, color: "rgba(255,255,255,0.9)" }} />}
              gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)"
              delay={0.2}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <StatCard
              title="Bị khóa"
              value={bannedCustomers}
              sub="Cần xem xét"
              icon={<CancelIcon sx={{ fontSize: 32, color: "rgba(255,255,255,0.9)" }} />}
              gradient="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
              delay={0.3}
            />
          </Box>
        </Box>

        {/* Customer List */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          sx={{
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(20px)",
            borderRadius: 4,
            p: 4,
            border: "1px solid rgba(99,102,241,0.1)",
            boxShadow: "0 8px 32px rgba(99,102,241,0.1)",
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
              background: "radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
              <Box>
                <Typography sx={{ fontSize: "1.5rem", fontWeight: 800, color: "#1e293b", mb: 0.5 }}>
                  Danh sách khách hàng
                </Typography>
                <Typography sx={{ fontSize: "0.875rem", color: "#64748b" }}>
                  Quản lý và theo dõi thông tin khách hàng
                </Typography>
              </Box>
              <TextField
                size="small"
                placeholder="Tìm kiếm khách hàng..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{
                  width: 320,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    background: "rgba(248,250,252,0.8)",
                    "& fieldset": {
                      borderColor: "rgba(99,102,241,0.2)",
                    },
                    "&:hover fieldset": {
                      borderColor: "#6366f1",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#6366f1",
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#6366f1" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <TableContainer sx={{ borderRadius: 3, overflow: "hidden" }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)" }}>
                    <TableCell sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.875rem" }}>Khách hàng</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.875rem" }}>Liên hệ</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.875rem" }}>Trạng thái</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.875rem" }}>Đánh giá</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.875rem" }}>Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <AnimatePresence>
                    {filtered.length > 0 ? (
                      filtered.map((c, index) => (
                        <TableRow
                          key={c.id}
                          component={motion.tr}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.03 }}
                          sx={{
                            "&:hover": {
                              background: "rgba(99,102,241,0.05)",
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
                                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                                  fontWeight: 700,
                                  fontSize: "0.875rem",
                                }}
                              >
                                {c.username?.charAt(0).toUpperCase()}
                              </Avatar>
                              <Box>
                                <Typography sx={{ fontWeight: 600, color: "#1e293b", fontSize: "0.9375rem" }}>
                                  {c.username}
                                </Typography>
                                <Typography sx={{ fontSize: "0.75rem", color: "#64748b" }}>
                                  ID: {c.id}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography sx={{ fontSize: "0.875rem", color: "#1e293b", mb: 0.5 }}>
                              {c.email}
                            </Typography>
                            <Typography sx={{ fontSize: "0.75rem", color: "#64748b" }}>
                              {c.phone || "—"}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              label={c.status === "active" ? "Hoạt động" : c.status === "banned" ? "Bị khóa" : "Khác"}
                              sx={{
                                fontWeight: 700,
                                fontSize: "0.75rem",
                                background: c.status === "active"
                                  ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                                  : c.status === "banned"
                                    ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
                                    : "linear-gradient(135deg, #94a3b8 0%, #64748b 100%)",
                                color: "#ffffff",
                                border: "none",
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                              <StarIcon sx={{ fontSize: 16, color: "#fbbf24" }} />
                              <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#1e293b" }}>
                                {c.rating ?? "—"}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              <IconButton
                                size="small"
                                sx={{
                                  background: "rgba(99,102,241,0.1)",
                                  color: "#6366f1",
                                  "&:hover": {
                                    background: "rgba(99,102,241,0.2)",
                                  },
                                }}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleToggleBan(c)}
                                sx={{
                                  background: c.status === "banned" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                                  color: c.status === "banned" ? "#10b981" : "#ef4444",
                                  "&:hover": {
                                    background: c.status === "banned" ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)",
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
                        <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                          <Typography sx={{ fontSize: "0.9375rem", color: "#64748b" }}>
                            Không tìm thấy khách hàng phù hợp.
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

export default Customers;
