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
  InputAdornment,
  Container,
  Card,
  CardContent,
  TableContainer,
  Button,
  Avatar,
} from "@mui/material";
import { motion, AnimatePresence } from "motion/react";
import SearchIcon from "@mui/icons-material/Search";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import VisibilityIcon from "@mui/icons-material/Visibility";
import GetAppIcon from "@mui/icons-material/GetApp";

const AdminWalletPage = () => {
  const [search, setSearch] = useState("");

  const transactions = [
    { id: 1, detail: "Hoa hồng từ đơn hàng #1245", amount: 450000, date: "09/10/2025", type: "income", category: "Hoa hồng" },
    { id: 2, detail: "Thanh toán phí hệ thống", amount: -120000, date: "07/10/2025", type: "expense", category: "Phí hệ thống" },
    { id: 3, detail: "Nhận phí duy trì từ cửa hàng", amount: 300000, date: "05/10/2025", type: "income", category: "Phí duy trì" },
    { id: 4, detail: "Hoa hồng từ đơn hàng #1230", amount: 280000, date: "04/10/2025", type: "income", category: "Hoa hồng" },
    { id: 5, detail: "Chi phí vận hành server", amount: -500000, date: "03/10/2025", type: "expense", category: "Vận hành" },
    { id: 6, detail: "Phí giao dịch từ shipper", amount: 150000, date: "02/10/2025", type: "income", category: "Phí giao dịch" },
  ];

  const filtered = transactions.filter(
    (t) =>
      t.detail?.toLowerCase().includes(search.toLowerCase()) ||
      t.category?.toLowerCase().includes(search.toLowerCase())
  );

  const currentBalance = 2870000;
  const totalIncome = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = Math.abs(transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0));
  const transactionCount = transactions.length;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const StatCard = ({ title, value, sub, icon, gradient, delay, trend }) => (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(139,92,246,0.2)" }}
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
            fontSize: "2rem",
            fontWeight: 900,
            color: "#ffffff",
            lineHeight: 1.2,
            mb: 2,
          }}
        >
          {value}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {trend && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                px: 1,
                py: 0.5,
                borderRadius: 2,
                background: "rgba(255,255,255,0.2)",
              }}
            >
              {trend > 0 ? (
                <TrendingUpIcon sx={{ fontSize: 16, color: "#ffffff" }} />
              ) : (
                <TrendingDownIcon sx={{ fontSize: 16, color: "#ffffff" }} />
              )}
              <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#ffffff" }}>
                {Math.abs(trend)}%
              </Typography>
            </Box>
          )}
          <Typography
            sx={{
              fontSize: "0.8125rem",
              color: "rgba(255,255,255,0.7)",
              lineHeight: 1.5,
            }}
          >
            {sub}
          </Typography>
        </Box>
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
        background: "linear-gradient(135deg, #f8fafc 0%, #e9d5ff 100%)",
        position: "relative",
        overflow: "hidden",
        pb: 6,
      }}
    >
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
            background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      ))}

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1, pt: 4 }}>
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
                background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                boxShadow: "0 12px 32px rgba(139,92,246,0.4)",
              }}
            >
              <AccountBalanceWalletIcon sx={{ fontSize: 36, color: "#ffffff" }} />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontSize: "2.5rem",
                  fontWeight: 900,
                  background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  lineHeight: 1.2,
                }}
              >
                Ví hệ thống
              </Typography>
              <Typography
                sx={{
                  fontSize: "1rem",
                  color: "#64748b",
                  fontWeight: 500,
                  mt: 0.5,
                }}
              >
                Quản lý tài chính và giao dịch của hệ thống
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          component={motion.div}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          sx={{ mb: 4 }}
        >
          <Card
            sx={{
              background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
              borderRadius: 4,
              overflow: "hidden",
              position: "relative",
              boxShadow: "0 20px 60px rgba(139,92,246,0.3)",
            }}
          >
            <Box
              component={motion.div}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 4, repeat: Infinity }}
              sx={{
                position: "absolute",
                top: -100,
                right: -100,
                width: 300,
                height: 300,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)",
              }}
            />
            <CardContent sx={{ position: "relative", zIndex: 1, p: 4 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 4 }}>
                <Box>
                  <Typography
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.7)",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      mb: 1,
                    }}
                  >
                    Số dư hiện tại
                  </Typography>
                  <Typography
                    component={motion.div}
                    animate={{ scale: [1, 1.01, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    sx={{
                      fontSize: "3rem",
                      fontWeight: 900,
                      color: "#ffffff",
                      lineHeight: 1.2,
                    }}
                  >
                    {formatCurrency(currentBalance)}
                  </Typography>
                </Box>
                <AccountBalanceIcon sx={{ fontSize: 48, color: "rgba(255,255,255,0.3)" }} />
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<GetAppIcon />}
                  sx={{
                    background: "#ffffff",
                    color: "#8b5cf6",
                    fontWeight: 700,
                    px: 3,
                    py: 1.5,
                    borderRadius: 3,
                    "&:hover": {
                      background: "#f3f4f6",
                    },
                  }}
                >
                  Rút tiền
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<VisibilityIcon />}
                  sx={{
                    borderColor: "rgba(255,255,255,0.5)",
                    color: "#ffffff",
                    fontWeight: 700,
                    px: 3,
                    py: 1.5,
                    borderRadius: 3,
                    borderWidth: 2,
                    "&:hover": {
                      borderColor: "#ffffff",
                      borderWidth: 2,
                      background: "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  Xem báo cáo
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
          <Box sx={{ flex: 1 }}>
            <StatCard
              title="Tổng thu"
              value={formatCurrency(totalIncome)}
              sub="Tháng này"
              icon={<ArrowUpwardIcon sx={{ fontSize: 32, color: "rgba(255,255,255,0.9)" }} />}
              gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)"
              delay={0.3}
              trend={12.5}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <StatCard
              title="Tổng chi"
              value={formatCurrency(totalExpense)}
              sub="Tháng này"
              icon={<ArrowDownwardIcon sx={{ fontSize: 32, color: "rgba(255,255,255,0.9)" }} />}
              gradient="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
              delay={0.4}
              trend={-8.3}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <StatCard
              title="Giao dịch"
              value={transactionCount}
              sub="Tổng giao dịch"
              icon={<ReceiptIcon sx={{ fontSize: 32, color: "rgba(255,255,255,0.9)" }} />}
              gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
              delay={0.5}
            />
          </Box>
        </Box>

        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          sx={{
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(20px)",
            borderRadius: 4,
            p: 4,
            border: "1px solid rgba(139,92,246,0.1)",
            boxShadow: "0 8px 32px rgba(139,92,246,0.1)",
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
              background: "radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
              <Box>
                <Typography sx={{ fontSize: "1.5rem", fontWeight: 800, color: "#1e293b", mb: 0.5 }}>
                  Lịch sử giao dịch
                </Typography>
                <Typography sx={{ fontSize: "0.875rem", color: "#64748b" }}>
                  Theo dõi tất cả các giao dịch thu chi của hệ thống
                </Typography>
              </Box>
              <TextField
                size="small"
                placeholder="Tìm kiếm giao dịch..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{
                  width: 320,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    background: "rgba(248,250,252,0.8)",
                    "& fieldset": {
                      borderColor: "rgba(139,92,246,0.2)",
                    },
                    "&:hover fieldset": {
                      borderColor: "#8b5cf6",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#8b5cf6",
                    },
                  },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: "#8b5cf6" }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>

            <TableContainer sx={{ borderRadius: 3, overflow: "hidden" }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ background: "linear-gradient(135deg, #e9d5ff 0%, #ddd6fe 100%)" }}>
                    <TableCell sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.875rem" }}>Ngày</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.875rem" }}>Chi tiết</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.875rem" }}>Danh mục</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.875rem" }}>Loại</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.875rem" }}>
                      Số tiền
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.875rem" }}>
                      Thao tác
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <AnimatePresence>
                    {filtered.length > 0 ? (
                      filtered.map((t, index) => (
                        <TableRow
                          key={t.id}
                          component={motion.tr}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.03 }}
                          sx={{
                            "&:hover": {
                              background: "rgba(139,92,246,0.05)",
                            },
                            transition: "all 0.2s ease",
                          }}
                        >
                          <TableCell>
                            <Typography sx={{ fontSize: "0.875rem", color: "#64748b", fontWeight: 500 }}>
                              {t.date}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                              <Avatar
                                sx={{
                                  width: 40,
                                  height: 40,
                                  background:
                                    t.type === "income"
                                      ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                                      : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                                }}
                              >
                                {t.type === "income" ? (
                                  <ArrowUpwardIcon sx={{ fontSize: 20 }} />
                                ) : (
                                  <ArrowDownwardIcon sx={{ fontSize: 20 }} />
                                )}
                              </Avatar>
                              <Box>
                                <Typography sx={{ fontWeight: 600, color: "#1e293b", fontSize: "0.9375rem" }}>
                                  {t.detail}
                                </Typography>
                                <Typography sx={{ fontSize: "0.75rem", color: "#64748b" }}>
                                  ID: #{t.id}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              label={t.category}
                              sx={{
                                fontWeight: 600,
                                fontSize: "0.75rem",
                                background: "rgba(139,92,246,0.1)",
                                color: "#8b5cf6",
                                border: "1px solid rgba(139,92,246,0.3)",
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              label={t.type === "income" ? "Thu" : "Chi"}
                              icon={
                                t.type === "income" ? (
                                  <TrendingUpIcon sx={{ fontSize: 14 }} />
                                ) : (
                                  <TrendingDownIcon sx={{ fontSize: 14 }} />
                                )
                              }
                              sx={{
                                fontWeight: 700,
                                fontSize: "0.75rem",
                                background:
                                  t.type === "income"
                                    ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                                    : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                                color: "#ffffff",
                                border: "none",
                                "& .MuiChip-icon": {
                                  color: "#ffffff",
                                },
                              }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Typography
                              sx={{
                                fontSize: "1rem",
                                fontWeight: 800,
                                color: t.type === "income" ? "#10b981" : "#ef4444",
                              }}
                            >
                              {t.amount > 0 ? "+" : ""}
                              {formatCurrency(t.amount)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              sx={{
                                background: "rgba(139,92,246,0.1)",
                                color: "#8b5cf6",
                                "&:hover": {
                                  background: "rgba(139,92,246,0.2)",
                                },
                              }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                          <Typography sx={{ fontSize: "0.9375rem", color: "#64748b" }}>
                            Không tìm thấy giao dịch phù hợp.
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

export default AdminWalletPage;
