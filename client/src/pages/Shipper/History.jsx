import React, { useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Card,
  Button,
  Fade,
  Slide,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Collapse,
  Avatar,
  Divider,
  Tab,
  Tabs,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import {
  Search,
  FilterList,
  CheckCircle,
  Cancel,
  AccessTime,
  LocalShipping,
  MonetizationOn,
  Star,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Phone,
  LocationOn,
  CalendarToday,
  Close,
  ArrowBack,
  TrendingUp,
  Receipt,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const History = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState("all");

  // Orders will be loaded from API
  const [orders, setOrders] = React.useState([]);
  const [loadingOrders, setLoadingOrders] = React.useState(true);
  const [ordersError, setOrdersError] = React.useState(null);

  // Helper: format number -> VND string
  const formatVND = (v) => {
    const n = Number(v) || 0;
    return n.toLocaleString("vi-VN") + "đ";
  };

  React.useEffect(() => {
    let mounted = true;
    const fetchOrders = async () => {
      setLoadingOrders(true);
      setOrdersError(null);
      try {
        // get current user to obtain shipper_id (use same pattern as other shipper pages)
        const meRes = await fetch("http://localhost:5000/api/users/me", { credentials: "include" });
        const meJson = await meRes.json();
        const shipperId = meJson?.user?.shipper_profile?.id;
        if (!shipperId) throw new Error("Không tìm thấy shipper_id");

        const res = await fetch("http://localhost:5000/api/shipper/orders/by-shipper", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ shipper_id: shipperId, limit: 200 }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const payload = await res.json();
        if (!payload || !payload.success) {
          throw new Error(payload?.message || "Không thể lấy dữ liệu");
        }

        const items = Array.isArray(payload.data) ? payload.data : [];

        // Map server enriched items to UI shape
        const mapped = items.map((it) => {
          const row = it.order || {};
          // id (prefix with #DH as requested, e.g., #DH958)
          const rawId = String(row.order_id ?? row.id ?? Math.random());
          const id = `#DH${rawId}`;

          // date/time
          let dateStr = "";
          let timeStr = "";
          try {
            if (row.created_at) {
              const d = new Date(row.created_at);
              dateStr = d.toLocaleDateString("vi-VN");
              timeStr = d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
            }
          } catch (e) { console.error(e); }

          const customerName = it.customer_name || row.user_full_name || "Khách hàng";
          const customerPhone = it.customer_phone || row.user_phone || "";

          const pickupAddress = it.shop_info?.address?.address_line?.address || it.shop_info?.address?.address || (it.shop_info?.shop_name || "");
          const deliveryAddress = (Array.isArray(it.user_addresses) && it.user_addresses[0]) ?
            (it.user_addresses[0].address_line?.address || it.user_addresses[0].address) : "";

          const distance = (it.distance_km != null) ? `${Number(it.distance_km).toFixed(2)} km` : (it.pickup_to_drop_distance_km != null ? `${Number(it.pickup_to_drop_distance_km).toFixed(2)} km` : "");

          const incomeVal = row.shipper_earn != null ? Number(row.shipper_earn) : (row.delivery_fee != null ? Number(row.delivery_fee) : 0);
          const tipVal = row.tip != null ? Number(row.tip) : (row.shipper_tip != null ? Number(row.shipper_tip) : 0);

          const itemsList = Array.isArray(it.details) ? it.details.map((d) => ({
            name: d.product_name || d.name || d.product_name,
            quantity: d.quantity || d.qty || d.count || 1,
            price: formatVND(d.unit_price || d.price || d.product_price || 0),
          })) : [];

          const totalPriceVal = row.total_price != null ? Number(row.total_price) : null;

          // prefer pickup_to_drop_duration_sec
          let deliveryTimeText = null;
          if (it.pickup_to_drop_duration_sec != null) {
            const m = Math.round(Number(it.pickup_to_drop_duration_sec) / 60);
            deliveryTimeText = `${m} phút`;
          } else if (it.duration_sec != null) {
            const m = Math.round(Number(it.duration_sec) / 60);
            deliveryTimeText = `${m} phút`;
          }

          return {
            id,
            date: dateStr,
            time: timeStr,
            customerName,
            customerPhone,
            pickupAddress,
            deliveryAddress,
            distance,
            income: formatVND(incomeVal),
            tip: formatVND(tipVal),
            status: row.status || "",
            rating: row.shipper_rating || row.rating || null,
            comment: row.shipper_comment || row.comment || null,
            items: itemsList,
            totalPrice: totalPriceVal != null ? formatVND(totalPriceVal) : "",
            deliveryTime: deliveryTimeText,
            // keep raw for debugging
            _raw: it,
          };
        });

        if (mounted) setOrders(mapped);
      } catch (err) {
        console.error("[History] fetch orders error:", err);
        if (mounted) setOrdersError(err.message || String(err));
      } finally {
        if (mounted) setLoadingOrders(false);
      }
    };

    fetchOrders();
    return () => { mounted = false; };
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.pickupAddress.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = 
      selectedTab === 0 ? true :
      selectedTab === 1 ? order.status === "completed" :
      selectedTab === 2 ? order.status === "cancelled" : true;
    
    const matchesDate = 
      dateFilter === "all" ? true :
      dateFilter === "today" ? order.date === "10/10/2024" :
      dateFilter === "yesterday" ? order.date === "09/10/2024" :
      dateFilter === "week" ? true : true;
    
    return matchesSearch && matchesTab && matchesDate;
  });

  const stats = {
    total: orders.length,
    completed: orders.filter(o => o.status === "completed").length,
    cancelled: orders.filter(o => o.status === "cancelled").length,
    totalIncome: orders
      .filter(o => o.status === "completed")
      .reduce((sum, o) => sum + parseInt(o.income.replace(/[đ,]/g, "")), 0),
    totalTips: orders
      .filter(o => o.status === "completed")
      .reduce((sum, o) => sum + parseInt(o.tip.replace(/[đ,]/g, "")), 0),
    avgRating: (orders
      .filter(o => o.rating)
      .reduce((sum, o) => sum + o.rating, 0) / orders.filter(o => o.rating).length).toFixed(1),
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "completed":
        return {
          label: "Hoàn thành",
          color: "#16a34a",
          bg: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
          icon: <CheckCircle />,
        };
      case "cancelled":
        return {
          label: "Đã hủy",
          color: "#dc2626",
          bg: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
          icon: <Cancel />,
        };
      default:
        return {
          label: "Đang xử lý",
          color: "#ca8a04",
          bg: "linear-gradient(135deg, #fef3c7 0%, #fde047 100%)",
          icon: <AccessTime />,
        };
    }
  };

  const handleOrderClick = (order) => {
    // toggle dialog / expanded selection
    if (selectedOrder && selectedOrder.id === order.id) setSelectedOrder(null);
    else setSelectedOrder(order);
  };

  const handleCloseDialog = () => {
    setSelectedOrder(null);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fff5f2 0%, #f0f9ff 100%)",
        pb: 12,
      }}
    >
<Slide direction="down" in timeout={600}>
  <Box
    sx={{
      background: "linear-gradient(135deg, #ff6b35 0%, #ff5722 100%)",
      color: "#fff",
      p: 3,
      boxShadow: "0 8px 24px rgba(255,107,53,0.25)",
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      zIndex: 1000,
      overflow: "hidden",
      pointerEvents: "auto", // 👈 Cho phép bấm trong header
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        right: 0,
        width: 250,
        height: 250,
        borderRadius: "50%",
        background: "rgba(255,255,255,0.1)",
        transform: "translate(30%, -30%)",
      },
    }}
  >
    <Stack
      direction="row"
      alignItems="center"
      spacing={2}
      sx={{ position: "relative", zIndex: 1 }}
    >
      <IconButton
        onClick={() => navigate(-1)}
        sx={{ color: "#fff", mr: -1 }}
      >
        <ArrowBack />
      </IconButton>

      <Box sx={{ flex: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 900, mb: 0.5 }}>
          Lịch sử giao hàng
        </Typography>
        <Typography sx={{ fontSize: 14, opacity: 0.9 }}>
          Xem lại các chuyến đi của bạn
        </Typography>
      </Box>

      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: 3,
          background: "rgba(255,255,255,0.2)",
          backdropFilter: "blur(10px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid rgba(255,255,255,0.3)",
          fontSize: 28,
        }}
      >
        📦
      </Box>
    </Stack>
  </Box>
</Slide>


      {/* Container */}
      <Box sx={{ px: 2.5, mt: 17 }}>
        {/* Stats Cards */}
        <Fade in timeout={800}>
          <Stack direction="row" spacing={2} mb={2.5} sx={{ overflowX: "auto" }}>
            {[
              {
                label: "Tổng đơn",
                value: stats.total,
                icon: <LocalShipping />,
                gradient: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
                color: "#1d4ed8",
              },
              {
                label: "Hoàn thành",
                value: stats.completed,
                icon: <CheckCircle />,
                gradient: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
                color: "#16a34a",
              },
              {
                label: "Thu nhập",
                value: `${(stats.totalIncome / 1000).toFixed(0)}K`,
                icon: <MonetizationOn />,
                gradient: "linear-gradient(135deg, #fef3c7 0%, #fde047 100%)",
                color: "#ca8a04",
              },
              {
                label: "Đánh giá TB",
                value: stats.avgRating,
                icon: <Star />,
                gradient: "linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)",
                color: "#c2410c",
              },
            ].map((stat, idx) => (
              <Card
                key={idx}
                sx={{
                  minWidth: 120,
                  p: 2,
                  borderRadius: 3,
                  background: stat.gradient,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  border: "1px solid rgba(0,0,0,0.05)",
                }}
              >
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 2,
                    background: "rgba(255,255,255,0.7)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: stat.color,
                    mb: 1,
                  }}
                >
                  {React.cloneElement(stat.icon, { sx: { fontSize: 18 } })}
                </Box>
                <Typography
                  sx={{ fontSize: 22, fontWeight: 900, color: stat.color, mb: 0.5 }}
                >
                  {stat.value}
                </Typography>
                <Typography sx={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>
                  {stat.label}
                </Typography>
              </Card>
            ))}
          </Stack>
        </Fade>

        {/* Search & Filter */}
        <Fade in timeout={1000}>
          <Card
            sx={{
              p: 2,
              mb: 2.5,
              borderRadius: 3,
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              background: "#fff",
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <TextField
                fullWidth
                placeholder="Tìm kiếm đơn hàng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: "#9ca3af" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2.5,
                    background: "#f9fafb",
                    "& fieldset": { border: "none" },
                  },
                }}
              />
              <IconButton
                onClick={() => setFilterOpen(!filterOpen)}
                sx={{
                  background: filterOpen
                    ? "linear-gradient(135deg, #ff6b35 0%, #ff5722 100%)"
                    : "#f3f4f6",
                  color: filterOpen ? "#fff" : "#6b7280",
                  "&:hover": {
                    background: filterOpen
                      ? "linear-gradient(135deg, #ff5722 0%, #f4511e 100%)"
                      : "#e5e7eb",
                  },
                }}
              >
                <FilterList />
              </IconButton>
            </Stack>

            {/* Filter Options */}
            <Collapse in={filterOpen}>
              <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid #e5e7eb" }}>
                <Typography
                  sx={{ fontSize: 13, fontWeight: 700, color: "#6b7280", mb: 1.5 }}
                >
                  Lọc theo thời gian
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {[
                    { label: "Tất cả", value: "all" },
                    { label: "Hôm nay", value: "today" },
                    { label: "Hôm qua", value: "yesterday" },
                    { label: "Tuần này", value: "week" },
                  ].map((filter) => (
                    <Chip
                      key={filter.value}
                      label={filter.label}
                      onClick={() => setDateFilter(filter.value)}
                      sx={{
                        background:
                          dateFilter === filter.value
                            ? "linear-gradient(135deg, #ff6b35 0%, #ff5722 100%)"
                            : "#f3f4f6",
                        color: dateFilter === filter.value ? "#fff" : "#6b7280",
                        fontWeight: 700,
                        fontSize: 13,
                        "&:hover": {
                          background:
                            dateFilter === filter.value
                              ? "linear-gradient(135deg, #ff5722 0%, #f4511e 100%)"
                              : "#e5e7eb",
                        },
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            </Collapse>
          </Card>
        </Fade>

        {/* Tabs */}
        <Fade in timeout={1200}>
          <Card
            sx={{
              mb: 2.5,
              borderRadius: 3,
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              background: "#fff",
              overflow: "hidden",
            }}
          >
            <Tabs
              value={selectedTab}
              onChange={(e, newValue) => setSelectedTab(newValue)}
              variant="fullWidth"
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: 14,
                  py: 2,
                },
                "& .Mui-selected": {
                  color: "#ff6b35 !important",
                },
                "& .MuiTabs-indicator": {
                  background: "linear-gradient(90deg, #ff6b35 0%, #ff5722 100%)",
                  height: 3,
                  borderRadius: "3px 3px 0 0",
                },
              }}
            >
              <Tab label="Tất cả" />
              <Tab label="Hoàn thành" />
              <Tab label="Đã hủy" />
            </Tabs>
          </Card>
        </Fade>

        {/* Orders List */}
        <Stack spacing={2}>
          {loadingOrders ? (
            <Card sx={{ p: 6, borderRadius: 3, textAlign: "center", background: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
              <Stack alignItems="center" spacing={2}>
                <CircularProgress />
                <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#6b7280" }}>Đang tải đơn hàng...</Typography>
              </Stack>
            </Card>
          ) : ordersError ? (
            <Card sx={{ p: 6, borderRadius: 3, textAlign: "center", background: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
              <Typography sx={{ fontSize: 20, mb: 1 }}>⚠️ Lỗi</Typography>
              <Typography sx={{ fontSize: 14, color: "#9ca3af" }}>{ordersError}</Typography>
            </Card>
          ) : filteredOrders.length === 0 ? (
            <Card
              sx={{
                p: 6,
                borderRadius: 3,
                textAlign: "center",
                background: "#fff",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            >
              <Typography sx={{ fontSize: 48, mb: 2 }}>📭</Typography>
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#6b7280" }}>
                Không tìm thấy đơn hàng
              </Typography>
              <Typography sx={{ fontSize: 14, color: "#9ca3af", mt: 1 }}>
                Thử thay đổi bộ lọc hoặc tìm kiếm khác
              </Typography>
            </Card>
          ) : (
            filteredOrders.map((order, index) => (
              <Fade in timeout={1400 + index * 100} key={order.id}>
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    background: "#fff",
                    overflow: "hidden",
                    border: "1px solid rgba(0,0,0,0.05)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  <Box sx={{ p: 2.5 }}>
                    {/* Header */}
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      mb={2}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                          <Typography
                            sx={{ fontSize: 16, fontWeight: 900, color: "#111827" }}
                          >
                            {order.id}
                          </Typography>
                          <Chip
                            size="small"
                            label={getStatusConfig(order.status).label}
                            icon={getStatusConfig(order.status).icon}
                            sx={{
                              background: getStatusConfig(order.status).bg,
                              color: getStatusConfig(order.status).color,
                              fontWeight: 700,
                              fontSize: 11,
                              "& .MuiChip-icon": {
                                color: getStatusConfig(order.status).color,
                                fontSize: 16,
                              },
                            }}
                          />
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <CalendarToday sx={{ fontSize: 14, color: "#9ca3af" }} />
                          <Typography sx={{ fontSize: 13, color: "#6b7280" }}>
                            {order.date} • {order.time}
                          </Typography>
                        </Stack>
                      </Box>
                      <Box sx={{ textAlign: "right" }}>
                        <Typography
                          sx={{ fontSize: 18, fontWeight: 900, color: "#16a34a" }}
                        >
                          {order.income}
                        </Typography>
                        {order.tip !== "0đ" && (
                          <Typography
                            sx={{ fontSize: 12, color: "#ca8a04", fontWeight: 600 }}
                          >
                            +{order.tip} tip
                          </Typography>
                        )}
                      </Box>
                    </Stack>

                    {/* Customer Info */}
                    <Box
                      sx={{
                        background: "#f9fafb",
                        borderRadius: 2.5,
                        p: 2,
                        mb: 2,
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={1.5} mb={1.5}>
                        <Avatar
                          sx={{
                            width: 36,
                            height: 36,
                            background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
                            color: "#1d4ed8",
                            fontSize: 18,
                            fontWeight: 700,
                          }}
                        >
                          {order.customerName.charAt(0)}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>
                            {order.customerName}
                          </Typography>
                          <Typography sx={{ fontSize: 12, color: "#6b7280" }}>
                            {order.customerPhone}
                          </Typography>
                        </Box>
                        {order.rating && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                              background: "#fef3c7",
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 2,
                            }}
                          >
                            <Star sx={{ fontSize: 16, color: "#ca8a04" }} />
                            <Typography
                              sx={{ fontSize: 14, fontWeight: 700, color: "#ca8a04" }}
                            >
                              {order.rating}
                            </Typography>
                          </Box>
                        )}
                      </Stack>

                      {order.comment && (
                        <Box
                          sx={{
                            background: "#fff",
                            borderRadius: 2,
                            p: 1.5,
                            borderLeft: "3px solid #fde047",
                          }}
                        >
                          <Typography sx={{ fontSize: 13, color: "#6b7280", fontStyle: "italic" }}>
                            "{order.comment}"
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    {/* Route Info */}
                    <Stack spacing={1.5} mb={2}>
                      <Stack direction="row" spacing={1.5}>
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: 2,
                            background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <LocalShipping sx={{ fontSize: 16, color: "#16a34a" }} />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ fontSize: 12, color: "#9ca3af", mb: 0.5 }}>
                            Lấy hàng
                          </Typography>
                          <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>
                            {order.pickupAddress}
                          </Typography>
                        </Box>
                      </Stack>
                      <Stack direction="row" spacing={1.5}>
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: 2,
                            background: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <LocationOn sx={{ fontSize: 16, color: "#dc2626" }} />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ fontSize: 12, color: "#9ca3af", mb: 0.5 }}>
                            Giao hàng
                          </Typography>
                          <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>
                            {order.deliveryAddress}
                          </Typography>
                        </Box>
                      </Stack>
                    </Stack>

                    {/* Quick Stats */}
                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{
                        background: "#f9fafb",
                        borderRadius: 2,
                        p: 1.5,
                        mb: 2,
                      }}
                    >
                      <Box sx={{ flex: 1, textAlign: "center" }}>
                        <Typography sx={{ fontSize: 11, color: "#9ca3af", mb: 0.5 }}>
                          Khoảng cách
                        </Typography>
                        <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#1d4ed8" }}>
                          {order.distance}
                        </Typography>
                      </Box>
                      <Divider orientation="vertical" flexItem />
                      <Box sx={{ flex: 1, textAlign: "center" }}>
                        <Typography sx={{ fontSize: 11, color: "#9ca3af", mb: 0.5 }}>
                          Tổng tiền
                        </Typography>
                        <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#c2410c" }}>
                          {order.totalPrice}
                        </Typography>
                      </Box>
                      {order.deliveryTime && (
                        <>
                          <Divider orientation="vertical" flexItem />
                          <Box sx={{ flex: 1, textAlign: "center" }}>
                            <Typography sx={{ fontSize: 11, color: "#9ca3af", mb: 0.5 }}>
                              Thời gian
                            </Typography>
                            <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#16a34a" }}>
                              {order.deliveryTime}
                            </Typography>
                          </Box>
                        </>
                      )}
                    </Stack>

                    {/* Action Button */}
                    <Button
                      fullWidth
                      onClick={() => handleOrderClick(order)}
                      endIcon={
                        selectedOrder && selectedOrder.id === order.id ? (
                          <KeyboardArrowUp />
                        ) : (
                          <KeyboardArrowDown />
                        )
                      }
                      sx={{
                        textTransform: "none",
                        background: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
                        color: "#374151",
                        fontWeight: 700,
                        fontSize: 14,
                        py: 1.25,
                        borderRadius: 2,
                        "&:hover": {
                          background: "linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)",
                        },
                      }}
                    >
                      Xem chi tiết
                    </Button>
                  </Box>
                </Card>
              </Fade>
            ))
          )}
        </Stack>


      </Box>

      {/* Order Detail Dialog */}
      <Dialog
        open={Boolean(selectedOrder)}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            maxHeight: "90vh",
          },
        }}
      >
        {selectedOrder && (
          <>
            <DialogTitle
              sx={{
                background: "linear-gradient(135deg, #ff6b35 0%, #ff5722 100%)",
                color: "#fff",
                position: "relative",
                pb: 3,
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography sx={{ fontSize: 20, fontWeight: 900 }}>
                    Chi tiết đơn hàng
                  </Typography>
                  <Typography sx={{ fontSize: 14, opacity: 0.9, mt: 0.5 }}>
                    {selectedOrder.id}
                  </Typography>
                </Box>
                <IconButton onClick={handleCloseDialog} sx={{ color: "#fff" }}>
                  <Close />
                </IconButton>
              </Stack>
            </DialogTitle>
            <DialogContent sx={{ p: 3, mt: 2 }}>
              <Stack spacing={2.5}>
                {/* Status */}
                <Box
                  sx={{
                    background: getStatusConfig(selectedOrder.status).bg,
                    borderRadius: 3,
                    p: 2.5,
                    textAlign: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.7)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 1.5,
                      color: getStatusConfig(selectedOrder.status).color,
                    }}
                  >
                    {React.cloneElement(getStatusConfig(selectedOrder.status).icon, {
                      sx: { fontSize: 32 },
                    })}
                  </Box>
                  <Typography
                    sx={{
                      fontSize: 18,
                      fontWeight: 900,
                      color: getStatusConfig(selectedOrder.status).color,
                    }}
                  >
                    {getStatusConfig(selectedOrder.status).label}
                  </Typography>
                  <Typography sx={{ fontSize: 13, color: "#6b7280", mt: 0.5 }}>
                    {selectedOrder.date} • {selectedOrder.time}
                  </Typography>
                </Box>

                {/* Customer */}
                <Box>
                  <Typography
                    sx={{ fontSize: 14, fontWeight: 700, color: "#6b7280", mb: 1.5 }}
                  >
                    Khách hàng
                  </Typography>
                  <Box
                    sx={{
                      background: "#f9fafb",
                      borderRadius: 2.5,
                      p: 2,
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={2} mb={1.5}>
                      <Avatar
                        sx={{
                          width: 48,
                          height: 48,
                          background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
                          color: "#1d4ed8",
                          fontSize: 20,
                          fontWeight: 700,
                        }}
                      >
                        {selectedOrder.customerName.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>
                          {selectedOrder.customerName}
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={0.5} mt={0.5}>
                          <Phone sx={{ fontSize: 14, color: "#6b7280" }} />
                          <Typography sx={{ fontSize: 13, color: "#6b7280" }}>
                            {selectedOrder.customerPhone}
                          </Typography>
                        </Stack>
                      </Box>
                    </Stack>
                    {selectedOrder.rating && (
                      <Box
                        sx={{
                          background: "#fff",
                          borderRadius: 2,
                          p: 1.5,
                          borderLeft: "3px solid #fde047",
                        }}
                      >
                        <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                          <Star sx={{ fontSize: 18, color: "#ca8a04" }} />
                          <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#ca8a04" }}>
                            {selectedOrder.rating}/5
                          </Typography>
                        </Stack>
                        {selectedOrder.comment && (
                          <Typography
                            sx={{ fontSize: 13, color: "#6b7280", fontStyle: "italic" }}
                          >
                            "{selectedOrder.comment}"
                          </Typography>
                        )}
                      </Box>
                    )}
                  </Box>
                </Box>

                {/* Route */}
                <Box>
                  <Typography
                    sx={{ fontSize: 14, fontWeight: 700, color: "#6b7280", mb: 1.5 }}
                  >
                    Địa điểm
                  </Typography>
                  <Stack spacing={1.5}>
                    <Box
                      sx={{
                        background: "#dcfce7",
                        borderRadius: 2.5,
                        p: 2,
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={1.5} mb={0.5}>
                        <LocalShipping sx={{ fontSize: 20, color: "#16a34a" }} />
                        <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#16a34a" }}>
                          Lấy hàng
                        </Typography>
                      </Stack>
                      <Typography sx={{ fontSize: 14, color: "#111827", pl: 4.5 }}>
                        {selectedOrder.pickupAddress}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        background: "#fee2e2",
                        borderRadius: 2.5,
                        p: 2,
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={1.5} mb={0.5}>
                        <LocationOn sx={{ fontSize: 20, color: "#dc2626" }} />
                        <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#dc2626" }}>
                          Giao hàng
                        </Typography>
                      </Stack>
                      <Typography sx={{ fontSize: 14, color: "#111827", pl: 4.5 }}>
                        {selectedOrder.deliveryAddress}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                {/* Items */}
                <Box>
                  <Typography
                    sx={{ fontSize: 14, fontWeight: 700, color: "#6b7280", mb: 1.5 }}
                  >
                    Món ăn
                  </Typography>
                  <Box
                    sx={{
                      background: "#f9fafb",
                      borderRadius: 2.5,
                      p: 2,
                    }}
                  >
                    <Stack spacing={1.5}>
                      {selectedOrder.items.map((item, idx) => (
                        <Stack
                          key={idx}
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Box
                              sx={{
                                width: 28,
                                height: 28,
                                borderRadius: 1.5,
                                background: "#fff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 12,
                                fontWeight: 700,
                                color: "#ff6b35",
                              }}
                            >
                              {item.quantity}x
                            </Box>
                            <Typography sx={{ fontSize: 14, color: "#111827" }}>
                              {item.name}
                            </Typography>
                          </Stack>
                          <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#c2410c" }}>
                            {item.price}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </Box>
                </Box>

                {/* Payment Summary */}
                <Box>
                  <Typography
                    sx={{ fontSize: 14, fontWeight: 700, color: "#6b7280", mb: 1.5 }}
                  >
                    Thanh toán
                  </Typography>
                  <Box
                    sx={{
                      background: "linear-gradient(135deg, #fef3c7 0%, #fde047 100%)",
                      borderRadius: 2.5,
                      p: 2.5,
                    }}
                  >
                    <Stack spacing={1.5}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography sx={{ fontSize: 13, color: "#78350f" }}>
                          Tổng đơn hàng
                        </Typography>
                        <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#78350f" }}>
                          {selectedOrder.totalPrice}
                        </Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography sx={{ fontSize: 13, color: "#78350f" }}>
                          Phí giao hàng
                        </Typography>
                        <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#16a34a" }}>
                          {selectedOrder.income}
                        </Typography>
                      </Stack>
                      {selectedOrder.tip !== "0đ" && (
                        <Stack direction="row" justifyContent="space-between">
                          <Typography sx={{ fontSize: 13, color: "#78350f" }}>
                            Tiền tip
                          </Typography>
                          <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#ca8a04" }}>
                            +{selectedOrder.tip}
                          </Typography>
                        </Stack>
                      )}
                      <Divider />
                      <Stack direction="row" justifyContent="space-between">
                        <Typography sx={{ fontSize: 15, fontWeight: 800, color: "#78350f" }}>
                          Thu nhập của bạn
                        </Typography>
                        <Typography sx={{ fontSize: 18, fontWeight: 900, color: "#16a34a" }}>
                          {parseInt(selectedOrder.income.replace(/[đ,]/g, "")) +
                            parseInt(selectedOrder.tip.replace(/[đ,]/g, ""))}
                          đ
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>
                </Box>

                {/* Stats */}
                {selectedOrder.deliveryTime && (
                  <Stack direction="row" spacing={2}>
                    <Box
                      sx={{
                        flex: 1,
                        background: "#dbeafe",
                        borderRadius: 2.5,
                        p: 2,
                        textAlign: "center",
                      }}
                    >
                      <Typography sx={{ fontSize: 12, color: "#1d4ed8", mb: 0.5 }}>
                        Khoảng cách
                      </Typography>
                      <Typography sx={{ fontSize: 18, fontWeight: 900, color: "#1d4ed8" }}>
                        {selectedOrder.distance}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        flex: 1,
                        background: "#dcfce7",
                        borderRadius: 2.5,
                        p: 2,
                        textAlign: "center",
                      }}
                    >
                      <Typography sx={{ fontSize: 12, color: "#16a34a", mb: 0.5 }}>
                        Thời gian giao
                      </Typography>
                      <Typography sx={{ fontSize: 18, fontWeight: 900, color: "#16a34a" }}>
                        {selectedOrder.deliveryTime}
                      </Typography>
                    </Box>
                  </Stack>
                )}
              </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 0 }}>
              <Button
                fullWidth
                onClick={handleCloseDialog}
                sx={{
                  textTransform: "none",
                  background: "linear-gradient(135deg, #ff6b35 0%, #ff5722 100%)",
                  color: "#fff",
                  fontWeight: 700,
                  py: 1.5,
                  borderRadius: 2.5,
                  fontSize: 15,
                  "&:hover": {
                    background: "linear-gradient(135deg, #ff5722 0%, #f4511e 100%)",
                  },
                }}
              >
                Đóng
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default History;

