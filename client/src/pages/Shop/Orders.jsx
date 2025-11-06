import React, { useContext, useEffect, useState, useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Stack,
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  SoupKitchen as CookingIcon,
  ArrowForward as ArrowForwardIcon,
  Cancel as CancelIcon,
  LocalShipping as ShippingIcon,
} from "@mui/icons-material";
import axios from "axios";
import { ShopContext } from "../../contexts/ShopContext";

const STATUS = {
  pending: "Chờ xác nhận",
  cooking: "Đang chế biến",
  shipping: "Đang giao",
  completed: "Hoàn tất",
  cancelled: "Đã huỷ",
};

const API_BASE = "http://localhost:5000/api/orders";

const StatCard = ({ label, value, color, icon }) => (
  <Paper
    elevation={0}
    sx={{
      borderRadius: "14px",
      border: "0.8px solid rgba(0,0,0,0.08)",
      p: 2.2,
      height: 96,
      background: "linear-gradient(180deg, #ffffff 0%, #fdfdfd 100%)",
      transition: "box-shadow 200ms ease, transform 200ms ease",
      "&:hover": {
        boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
        transform: "translateY(-2px)",
      },
    }}
  >
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Box>
        <Typography sx={{ color: "#717182", fontSize: 13 }}>{label}</Typography>
        <Typography sx={{ fontWeight: 800, fontSize: 26, color }}>{value}</Typography>
      </Box>
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: `${color}1a`,
        }}
      >
        {icon}
      </Box>
    </Stack>
  </Paper>
);

const OrderCard = ({ order, onAdvance, onCancel }) => {
  const getProgress = (status) => {
    if (status === "pending") return { pct: 25, color: "#e46600dc" };
    if (status === "cooking") return { pct: 50, color: "#00b3faff" };
    if (status === "shipping") return { pct: 100, color: "#077a31ff" };
    if (status === "completed") return { pct: 100, color: "#077a31ff" };
    if (status === "cancelled") return { pct: 100, color: "#ff2929ff" };
    return { pct: 0, color: "#999" };
  };
  const { pct, color } = getProgress(order.status);

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "14px",
        border: "0.8px solid rgba(0,0,0,0.1)",
        overflow: "hidden",
      }}
    >
      <Box sx={{ px: 3, pt: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Typography sx={{ fontSize: 18, fontWeight: 700 }}>Đơn #{order.id}</Typography>
            <Typography sx={{ fontSize: 14, color }}>
              {STATUS[order.status] || "Không xác định"}
            </Typography>
          </Stack>
          <Typography sx={{ fontSize: 14, color: "#717182" }}>
            {new Date(order.createdAt).toLocaleString("vi-VN")}
          </Typography>
        </Stack>

        <Box
          sx={{
            height: 8,
            backgroundColor: "rgba(3,2,19,0.12)",
            borderRadius: 99,
            mt: 2,
          }}
        >
          <Box
            sx={{
              height: 8,
              borderRadius: 99,
              backgroundColor: color,
              width: `${pct}%`,
              transition: "width 300ms ease",
            }}
          />
        </Box>
      </Box>

      <Box sx={{ px: 3, py: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Stack spacing={1}>
              <Typography sx={{ fontSize: 14 }}>
                <strong>Khách hàng:</strong> {order.customer.name}
              </Typography>
              <Typography sx={{ fontSize: 14 }}>
                <strong>SĐT:</strong> {order.customer.phone}
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography sx={{ fontSize: 16, fontWeight: 600, mb: 1 }}>
              Món đã đặt:
            </Typography>
            {order.items.map((it, idx) => (
              <Stack
                key={idx}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  mb: 0.5,
                  px: 0.5,
                  gap: 2,
                }}
              >
                <Typography sx={{ fontSize: 14, flex: 1 }}>
                  {it.name} × {it.qty}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 600,
                    minWidth: "100px",
                    textAlign: "right",
                  }}
                >
                  {it.price.toLocaleString("vi-VN")} ₫
                </Typography>
              </Stack>
            ))}
            <Divider sx={{ my: 1.5 }} />
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography sx={{ fontSize: 16 }}>Tổng cộng:</Typography>
              <Typography sx={{ fontSize: 16, color: "#00a63e", fontWeight: 700 }}>
                {order.total.toLocaleString("vi-VN")} ₫
              </Typography>
            </Stack>
            <Typography sx={{ mt: 1, fontSize: 14, color: "#717182" }}>
              Thanh toán: {order.payment}
            </Typography>
          </Grid>
        </Grid>

        {order.note && (
          <Box
            sx={{
              mt: 2,
              backgroundColor: "#fff7db",
              borderRadius: "10px",
              px: 1.5,
              py: 1.5,
            }}
          >
            <Typography sx={{ fontWeight: 700, fontSize: 14, display: "inline" }}>
              Ghi chú:
            </Typography>
            <Typography sx={{ fontSize: 14, display: "inline" }}>
              {order.note}
            </Typography>
          </Box>
        )}

        <Box sx={{ mt: 2.5 }}>
          <Divider sx={{ mb: 1.5 }} />
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5 }}>
            {order.status === "pending" && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<CancelIcon />}
                sx={{
                  borderRadius: "10px",
                  height: 38,
                  px: 2.2,
                  textTransform: "none",
                  fontWeight: 600,
                  borderWidth: "2px",
                }}
                onClick={() => onCancel(order.id)}
              >
                Huỷ đơn
              </Button>
            )}
            {order.status === "pending" && (
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  backgroundColor: "#F9704B",
                  "&:hover": { backgroundColor: "#e55a3a" },
                  borderRadius: "10px",
                  height: 38,
                  px: 2.2,
                  minWidth: 160,
                  textTransform: "none",
                  fontWeight: 600,
                }}
                onClick={() => onAdvance(order.id, order.status)}
              >
                Xác nhận đơn
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

const ShopOrders = () => {
  const shopId = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");

  const fetchOrders = useCallback(async (showLoading = false) => {
    if (!shopId) return;
    if (showLoading) setLoading(true);
    try {
      const res = await axios.post(
        `${API_BASE}/list-mine`,
        { shop_id: shopId, full: true },
        { withCredentials: true }
      );

      const data = res.data.items || [];
      const mapped = data.map((item) => {
        const o = item.order || item;
        const details = item.details || [];
        const customer = {
          name:
            o.user_full_name ||
            o.full_name ||
            o.username ||
            o.recipient_name ||
            "Khách hàng",
          phone:
            o.user_phone ||
            o.phone ||
            o.recipient_phone ||
            o.receiver_phone ||
            "—",
        };

        const items = details.map((d) => ({
          name: d.product_name,
          price: d.product_price,
          qty: d.quantity,
        }));

        const total =
          o.total_price ??
          details.reduce((sum, d) => sum + d.product_price * d.quantity, 0);

        return {
          id: o.order_id,
          status: o.status || "pending",
          customer,
          total,
          items,
          payment: o.payment_method || "COD",
          note: o.note || "",
          createdAt: o.created_at,
        };
      });

      setOrders(mapped);
    } catch (err) {
      console.error("❌ Lỗi khi lấy orders:", err);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [shopId]);

  useEffect(() => {
    // Gọi lần đầu có loading
    fetchOrders(true);

    // Gọi lại mỗi 5 giây KHÔNG bật loading
    const interval = setInterval(() => {
      console.log("🔁 [DEBUG] Làm mới danh sách đơn hàng...");
      fetchOrders(false);
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchOrders]);

  const handleAdvanceStatus = async (orderId, currentStatus) => {
    let nextStatus = null;
    if (currentStatus === "pending") nextStatus = "cooking";
    else if (currentStatus === "cooking") nextStatus = "shipping";
    else if (currentStatus === "shipping") nextStatus = "completed";
    else return;
    try {
      await axios.post(`${API_BASE}/update-status`, { order_id: orderId, status: nextStatus });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
      );
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật trạng thái:", err);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await axios.post(`${API_BASE}/update-status`, { order_id: orderId, status: "cancelled" });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: "cancelled" } : o))
      );
    } catch (err) {
      console.error("❌ Lỗi khi huỷ đơn:", err);
    }
  };

  const counts = useMemo(() => {
    const pending = orders.filter((o) => o.status === "pending").length;
    const cooking = orders.filter((o) => o.status === "cooking").length;
    const done = orders.filter((o) =>
      ["shipping", "completed", "cancelled"].includes(o.status)
    ).length;
    return { all: orders.length, pending, cooking, done };
  }, [orders]);

  const filtered = useMemo(() => {
    if (tab === "all") return orders;
    if (tab === "completed")
      return orders.filter((o) =>
        ["shipping", "completed", "cancelled"].includes(o.status)
      );
    return orders.filter((o) => o.status === tab);
  }, [tab, orders]);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        <Typography variant="h4" sx={{ fontWeight: 700, fontSize: 24, mb: 0.5 }}>
          Quản lý đơn hàng
        </Typography>
        <Typography sx={{ color: "#717182", fontSize: 16, mb: 2 }}>
          Theo dõi và xử lý đơn hàng của khách
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: { xs: 2, sm: 3 },
            mb: 2.5,
          }}
        >
          <StatCard label="Chờ xác nhận" value={counts.pending} color="#d08700" icon={<ScheduleIcon sx={{ color: "#d08700" }} />} />
          <StatCard label="Đang chế biến" value={counts.cooking} color="#155dfc" icon={<CookingIcon sx={{ color: "#155dfc" }} />} />
          <StatCard label="Đang giao / Hoàn tất / Huỷ" value={counts.done} color="#00a63e" icon={<ShippingIcon sx={{ color: "#00a63e" }} />} />
        </Box>

        <Box
          sx={{
            backgroundColor: "#ececf0",
            borderRadius: "14px",
            height: 36,
            px: 0.5,
            mb: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          {[
            { key: "all", label: `Tất cả (${counts.all})` },
            { key: "pending", label: `Chờ (${counts.pending})` },
            { key: "cooking", label: `Chế biến (${counts.cooking})` },
            { key: "completed", label: `Hoàn tất (${counts.done})` },
          ].map((tabItem) => (
            <Button
              key={tabItem.key}
              onClick={() => setTab(tabItem.key)}
              sx={{
                px: 2,
                textTransform: "none",
                borderRadius: "10px",
                backgroundColor: tab === tabItem.key ? "#fff" : "transparent",
                fontWeight: 600,
                boxShadow:
                  tab === tabItem.key ? "0 2px 6px rgba(0,0,0,0.08)" : "none",
              }}
            >
              {tabItem.label}
            </Button>
          ))}
        </Box>

        <Stack spacing={2.5}>
          {filtered.map((o) => (
            <OrderCard key={o.id} order={o} onAdvance={handleAdvanceStatus} onCancel={handleCancelOrder} />
          ))}
        </Stack>
      </Box>
    </Box>
  );
};

export default ShopOrders;