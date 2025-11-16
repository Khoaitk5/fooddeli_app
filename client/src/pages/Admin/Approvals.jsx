import { useEffect, useState } from "react";
import axios from "axios";
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
  Tabs,
  Tab,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Paper,
  Avatar,
} from "@mui/material";
import { motion, AnimatePresence } from "motion/react";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DescriptionIcon from "@mui/icons-material/Description";
import AssignmentIcon from "@mui/icons-material/Assignment";
import StorefrontIcon from "@mui/icons-material/Storefront";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const Approvals = () => {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const [shopContracts, setShopContracts] = useState([]);
  const [shipperContracts, setShipperContracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailType, setDetailType] = useState(null);
  const [detailData, setDetailData] = useState(null);

  const handleTabChange = (_, v) => setTab(v);

  const getDocLabel = (type, key) => {
    if (type === "shipper") {
      const shipperLabels = {
        portrait_photo_url: "Ảnh chân dung",
        id_card_front_url: "CMND/CCCD mặt trước",
        id_card_back_url: "CMND/CCCD mặt sau",
        vehicle_registration_url: "Đăng ký xe",
        driving_license_front_url: "Bằng lái xe - mặt trước",
        driving_license_back_url: "Bằng lái xe - mặt sau",
        motorcycle_license_front_url: "Giấy phép lái xe máy - mặt trước",
        motorcycle_license_back_url: "Giấy phép lái xe máy - mặt sau",
        health_certificate_url: "Giấy khám sức khỏe",
        criminal_record_url: "Phiếu lý lịch tư pháp số 02",
        lltp_01_url: "LLTP số 01",
        lltp_appointment_url: "Giấy hẹn LLTP số 02",
        proof_image_url: "Ảnh minh chứng khác",
      };
      return shipperLabels[key] || key;
    }

    const shopLabels = {
      shop_logo_url: "Logo cửa hàng",
      shop_cover_url: "Ảnh bìa cửa hàng",
      id_card_front_url: "CMND/CCCD chủ hộ - mặt trước",
      id_card_back_url: "CMND/CCCD chủ hộ - mặt sau",
      household_business_cert_url: "Giấy đăng ký hộ kinh doanh",
      storefront_photo_url: "Ảnh mặt tiền/quầy bán",
      tax_code_doc_url: "Giấy tờ mã số thuế",
      company_business_cert_url: "Giấy đăng ký kinh doanh (công ty)",
      authorization_letter_url: "Giấy ủy quyền",
      food_safety_cert_url: "Giấy chứng nhận ATTP",
      representative_id_card_front_url: "CMND/CCCD người đại diện - mặt trước",
      representative_id_card_back_url: "CMND/CCCD người đại diện - mặt sau",
    };
    return shopLabels[key] || key;
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      const [shopRes, shipperRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/shop-contracts`, { withCredentials: true }),
        axios.get(`${API_BASE_URL}/shipper-contracts`, { withCredentials: true }),
      ]);

      const shops = shopRes.data?.data || shopRes.data || [];
      const shippers = shipperRes.data?.data || shipperRes.data || [];

      setShopContracts(shops.filter((c) => c.status === "pending"));
      setShipperContracts(shippers.filter((c) => c.status === "pending"));
    } catch (err) {
      console.error("❌ Fetch approvals error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenDetail = async (type, id) => {
    try {
      setDetailType(type);
      setDetailData(null);
      setDetailOpen(true);

      if (type === "shop") {
        const res = await axios.get(`${API_BASE_URL}/shop-contracts/${id}`, {
          withCredentials: true,
        });
        setDetailData(res.data?.data || res.data);
      } else {
        const res = await axios.get(`${API_BASE_URL}/shipper-contracts/${id}`, {
          withCredentials: true,
        });
        setDetailData(res.data?.data || res.data);
      }
    } catch (err) {
      console.error("❌ Fetch contract detail error", err);
      setDetailData({ error: err.response?.data?.message || "Không thể tải chi tiết." });
    }
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
    setDetailData(null);
    setDetailType(null);
  };

  const handleApproveDetail = async () => {
    if (!detailData || !detailType) return;

    try {
      const endpoint = detailType === "shop" ? "shop-contracts" : "shipper-contracts";

      await axios.patch(
        `${API_BASE_URL}/${endpoint}/${detailData.id}`,
        { status: "approved" },
        { withCredentials: true }
      );

      await fetchData();
      handleCloseDetail();
    } catch (err) {
      console.error("❌ Approve contract error", err);
      alert(err.response?.data?.message || "Không thể chấp nhận hợp đồng.");
    }
  };

  const handleRejectDetail = async () => {
    if (!detailData || !detailType) return;

    try {
      const endpoint = detailType === "shop" ? "shop-contracts" : "shipper-contracts";

      await axios.patch(
        `${API_BASE_URL}/${endpoint}/${detailData.id}`,
        { status: "rejected" },
        { withCredentials: true }
      );

      await fetchData();
      handleCloseDetail();
    } catch (err) {
      console.error("❌ Reject contract error", err);
      alert(err.response?.data?.message || "Không thể từ chối hợp đồng.");
    }
  };

  const filtered = (tab === 0 ? shopContracts : shipperContracts).filter((item) => {
    const keyword = search.toLowerCase();
    if (tab === 0) {
      return (
        item.shop_name?.toLowerCase().includes(keyword) ||
        item.owner_name?.toLowerCase().includes(keyword) ||
        item.phone?.includes(keyword)
      );
    } else {
      return (
        item.full_name?.toLowerCase().includes(keyword) ||
        item.phone?.includes(keyword) ||
        item.email?.toLowerCase().includes(keyword)
      );
    }
  });

  const StatCard = ({ title, value, sub, icon, gradient, delay }) => (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(16,185,129,0.2)" }}
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
        background: "linear-gradient(135deg, #f8fafc 0%, #d1fae5 100%)",
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
            background: "radial-gradient(circle, #10b981 0%, transparent 70%)",
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
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                boxShadow: "0 12px 32px rgba(16,185,129,0.4)",
              }}
            >
              <AssignmentIcon sx={{ fontSize: 36, color: "#ffffff" }} />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontSize: "2.5rem",
                  fontWeight: 900,
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  lineHeight: 1.2,
                }}
              >
                Duyệt đăng ký
              </Typography>
              <Typography
                sx={{
                  fontSize: "1rem",
                  color: "#64748b",
                  fontWeight: 500,
                  mt: 0.5,
                }}
              >
                Xem xét và phê duyệt đăng ký từ cửa hàng và shipper mới tham gia hệ thống
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
          <Box sx={{ flex: 1 }}>
            <StatCard
              title="Chờ duyệt cửa hàng"
              value={shopContracts.length}
              sub="Cần xử lý"
              icon={<StorefrontIcon sx={{ fontSize: 32, color: "rgba(255,255,255,0.9)" }} />}
              gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
              delay={0.1}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <StatCard
              title="Chờ duyệt shipper"
              value={shipperContracts.length}
              sub="Cần xử lý"
              icon={<DeliveryDiningIcon sx={{ fontSize: 32, color: "rgba(255,255,255,0.9)" }} />}
              gradient="linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
              delay={0.2}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <StatCard
              title="Đã duyệt tuần này"
              value="12"
              sub="+8 cửa hàng, +4 shipper"
              icon={<PendingActionsIcon sx={{ fontSize: 32, color: "rgba(255,255,255,0.9)" }} />}
              gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)"
              delay={0.3}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <StatCard
              title="Tỷ lệ chấp nhận"
              value="87%"
              sub="+5% so với tháng trước"
              icon={<TrendingUpIcon sx={{ fontSize: 32, color: "rgba(255,255,255,0.9)" }} />}
              gradient="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
              delay={0.4}
            />
          </Box>
        </Box>

        {/* Tabs */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          sx={{ mb: 3 }}
        >
          <Tabs
            value={tab}
            onChange={handleTabChange}
            sx={{
              "& .MuiTab-root": {
                fontWeight: 700,
                fontSize: "0.9375rem",
                textTransform: "none",
                color: "#64748b",
                "&.Mui-selected": {
                  color: "#10b981",
                },
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#10b981",
                height: 3,
                borderRadius: "3px 3px 0 0",
              },
            }}
          >
            <Tab label="Đăng ký cửa hàng" />
            <Tab label="Đăng ký shipper" />
          </Tabs>
        </Box>

        {/* List */}
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
            border: "1px solid rgba(16,185,129,0.1)",
            boxShadow: "0 8px 32px rgba(16,185,129,0.1)",
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
              background: "radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
              <Box>
                <Typography sx={{ fontSize: "1.5rem", fontWeight: 800, color: "#1e293b", mb: 0.5 }}>
                  {tab === 0 ? "Đăng ký cửa hàng" : "Đăng ký shipper"}
                </Typography>
                <Typography sx={{ fontSize: "0.875rem", color: "#64748b" }}>
                  {tab === 0
                    ? "Xem xét và phê duyệt đăng ký từ các cửa hàng mới"
                    : "Xem xét và phê duyệt đăng ký từ các shipper mới"}
                </Typography>
              </Box>
              <TextField
                size="small"
                placeholder={tab === 0 ? "Tìm kiếm cửa hàng..." : "Tìm kiếm shipper..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{
                  width: 320,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    background: "rgba(248,250,252,0.8)",
                    "& fieldset": {
                      borderColor: "rgba(16,185,129,0.2)",
                    },
                    "&:hover fieldset": {
                      borderColor: "#10b981",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#10b981",
                    },
                  },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: "#10b981" }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>

            <TableContainer sx={{ borderRadius: 3, overflow: "hidden" }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)" }}>
                    <TableCell sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.875rem" }}>
                      {tab === 0 ? "Cửa hàng" : "Shipper"}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.875rem" }}>
                      {tab === 0 ? "Chủ cửa hàng" : "Số điện thoại"}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.875rem" }}>
                      {tab === 0 ? "Danh mục" : "Email"}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.875rem" }}>Ngày tạo</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.875rem" }}>Giấy tờ</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.875rem" }}>Trạng thái</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.875rem" }}>
                      Thao tác
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <AnimatePresence>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                          <Typography sx={{ fontSize: "0.9375rem", color: "#64748b" }}>
                            Đang tải danh sách...
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : filtered.length > 0 ? (
                      filtered.map((item, index) => (
                        <TableRow
                          key={item.id}
                          component={motion.tr}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.03 }}
                          sx={{
                            "&:hover": {
                              background: "rgba(16,185,129,0.05)",
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
                                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                  fontWeight: 700,
                                  fontSize: "0.875rem",
                                }}
                              >
                                {tab === 0
                                  ? item.shop_name?.charAt(0).toUpperCase()
                                  : item.full_name?.charAt(0).toUpperCase()}
                              </Avatar>
                              <Box>
                                <Typography sx={{ fontWeight: 600, color: "#1e293b", fontSize: "0.9375rem" }}>
                                  {tab === 0 ? item.shop_name : item.full_name}
                                </Typography>
                                <Typography sx={{ fontSize: "0.75rem", color: "#64748b" }}>
                                  {tab === 0 ? item.shop_address : item.id_card_number}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            {tab === 0 ? (
                              <Box>
                                <Typography sx={{ fontSize: "0.875rem", color: "#1e293b", fontWeight: 500 }}>
                                  {item.owner_name || "—"}
                                </Typography>
                                <Typography sx={{ fontSize: "0.75rem", color: "#64748b" }}>
                                  {item.phone}
                                </Typography>
                              </Box>
                            ) : (
                              <Typography sx={{ fontSize: "0.875rem", color: "#1e293b", fontWeight: 500 }}>
                                {item.phone}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            {tab === 0 ? (
                              <Chip
                                size="small"
                                label={item.business_type || "Khác"}
                                sx={{
                                  fontWeight: 600,
                                  fontSize: "0.75rem",
                                  background: "rgba(16,185,129,0.1)",
                                  color: "#10b981",
                                  border: "1px solid rgba(16,185,129,0.3)",
                                }}
                              />
                            ) : (
                              <Typography sx={{ fontSize: "0.875rem", color: "#64748b" }}>
                                {item.email || "—"}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Typography sx={{ fontSize: "0.875rem", color: "#64748b" }}>
                              {item.created_at ? new Date(item.created_at).toLocaleDateString("vi-VN") : "—"}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                              <DescriptionIcon sx={{ fontSize: 16, color: "#10b981" }} />
                              <Typography sx={{ fontSize: "0.875rem", color: "#64748b" }}>
                                Tài liệu đính kèm
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              label="Chờ duyệt"
                              sx={{
                                fontWeight: 700,
                                fontSize: "0.75rem",
                                background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                                color: "#ffffff",
                                border: "none",
                              }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<VisibilityIcon />}
                              onClick={() => handleOpenDetail(tab === 0 ? "shop" : "shipper", item.id)}
                              sx={{
                                borderColor: "#10b981",
                                color: "#10b981",
                                fontWeight: 600,
                                borderRadius: 2,
                                "&:hover": {
                                  borderColor: "#059669",
                                  background: "rgba(16,185,129,0.05)",
                                },
                              }}
                            >
                              Xem chi tiết
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                          <Typography sx={{ fontSize: "0.9375rem", color: "#64748b" }}>
                            Không có hồ sơ nào cần duyệt.
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

      {/* Dialog chi tiết */}
      <Dialog
        open={detailOpen}
        onClose={handleCloseDetail}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: "linear-gradient(135deg, #ffffff 0%, #d1fae5 100%)",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            color: "#ffffff",
            fontWeight: 800,
            fontSize: "1.25rem",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {detailType === "shop" ? <StorefrontIcon /> : <DeliveryDiningIcon />}
            {detailType === "shop" ? "Chi tiết hợp đồng cửa hàng" : "Chi tiết hợp đồng shipper"}
          </Box>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          {!detailData && (
            <Typography variant="body2">Đang tải chi tiết...</Typography>
          )}
          {detailData?.error && (
            <Typography color="error" variant="body2">
              {detailData.error}
            </Typography>
          )}
          {detailData && !detailData.error && (
            <Box>
              <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: "#1e293b", mb: 2 }}>
                Thông tin chính
              </Typography>
              {detailType === "shop" ? (
                <Stack spacing={1.5}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography sx={{ fontSize: "0.875rem", color: "#64748b" }}>Tên cửa hàng:</Typography>
                    <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#1e293b" }}>
                      {detailData.shop_name}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography sx={{ fontSize: "0.875rem", color: "#64748b" }}>Mô tả:</Typography>
                    <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#1e293b" }}>
                      {detailData.shop_description}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography sx={{ fontSize: "0.875rem", color: "#64748b" }}>Địa chỉ:</Typography>
                    <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#1e293b" }}>
                      {detailData.shop_address}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography sx={{ fontSize: "0.875rem", color: "#64748b" }}>Điện thoại:</Typography>
                    <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#1e293b" }}>
                      {detailData.phone}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography sx={{ fontSize: "0.875rem", color: "#64748b" }}>Email:</Typography>
                    <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#1e293b" }}>
                      {detailData.email || "—"}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography sx={{ fontSize: "0.875rem", color: "#64748b" }}>Loại hình:</Typography>
                    <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#1e293b" }}>
                      {detailData.business_type}
                    </Typography>
                  </Box>
                </Stack>
              ) : (
                <Stack spacing={1.5}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography sx={{ fontSize: "0.875rem", color: "#64748b" }}>Họ tên:</Typography>
                    <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#1e293b" }}>
                      {detailData.full_name}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography sx={{ fontSize: "0.875rem", color: "#64748b" }}>Số điện thoại:</Typography>
                    <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#1e293b" }}>
                      {detailData.phone}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography sx={{ fontSize: "0.875rem", color: "#64748b" }}>Email:</Typography>
                    <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#1e293b" }}>
                      {detailData.email || "—"}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography sx={{ fontSize: "0.875rem", color: "#64748b" }}>Biển số xe:</Typography>
                    <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#1e293b" }}>
                      {detailData.vehicle_plate_number || "—"}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography sx={{ fontSize: "0.875rem", color: "#64748b" }}>CMND/CCCD:</Typography>
                    <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#1e293b" }}>
                      {detailData.id_card_number || "—"}
                    </Typography>
                  </Box>
                </Stack>
              )}

              <Divider sx={{ my: 3 }} />

              <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: "#1e293b", mb: 2 }}>
                Ảnh & tài liệu
              </Typography>
              <Stack direction="column" spacing={2}>
                {Object.entries(detailData)
                  .filter(
                    ([key, value]) =>
                      typeof value === "string" && value && key.endsWith("_url")
                  )
                  .map(([key, value]) => (
                    <Paper
                      key={key}
                      variant="outlined"
                      sx={{ p: 1.5, borderRadius: 2, borderColor: "rgba(16,185,129,0.2)" }}
                    >
                      <Typography
                        variant="caption"
                        display="block"
                        sx={{ mb: 0.75, fontWeight: 600, color: "#10b981" }}
                      >
                        {getDocLabel(detailType, key)}
                      </Typography>
                      <Box
                        component="img"
                        src={value}
                        alt={key}
                        sx={{
                          width: "100%",
                          borderRadius: 1,
                          border: "1px solid",
                          borderColor: "divider",
                          objectFit: "contain",
                          maxHeight: 360,
                          bgcolor: "#f9fafb",
                        }}
                      />
                    </Paper>
                  ))}
                {Object.entries(detailData).filter(
                  ([key, value]) =>
                    typeof value === "string" && value && key.endsWith("_url")
                ).length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      Không có ảnh/tài liệu nào.
                    </Typography>
                  )}
              </Stack>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={handleCloseDetail}
            sx={{
              color: "#64748b",
              fontWeight: 600,
              "&:hover": {
                background: "rgba(100,116,139,0.1)",
              },
            }}
          >
            Đóng
          </Button>
          <Button
            color="error"
            variant="outlined"
            startIcon={<CloseIcon />}
            onClick={handleRejectDetail}
            disabled={!detailData || detailData?.error}
            sx={{
              fontWeight: 700,
              borderRadius: 2,
              borderWidth: 2,
              "&:hover": {
                borderWidth: 2,
              },
            }}
          >
            Từ chối
          </Button>
          <Button
            variant="contained"
            startIcon={<CheckIcon />}
            onClick={handleApproveDetail}
            disabled={!detailData || detailData?.error}
            sx={{
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              fontWeight: 700,
              borderRadius: 2,
              px: 3,
              "&:hover": {
                background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
              },
            }}
          >
            Chấp nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Approvals;
