import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Stack,
  Typography,
  IconButton,
  Button,
  Fade,
  Slide,
} from "@mui/material";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useShipper } from "@/hooks/useShipper";
import Map4DView from "@/components/Shipper/Map4DView.jsx";

// helper nhỏ
const money = (v) => Number(v || 0).toLocaleString() + "đ";

const formatDistance = (km) => {
  if (km == null || isNaN(km)) return "-";
  const v = Number(km);
  return v < 1 ? `${Math.round(v * 1000)}m` : `${v.toFixed(2)}km`;
};

const formatDuration = (sec) => {
  if (sec == null || isNaN(sec)) return "-";
  const s = Math.max(0, Math.round(Number(sec)));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return m === 0 ? `${r}s` : `${m}p${r ? ` ${r}s` : ""}`;
};

const Home = () => {
  const navigate = useNavigate();
  const { isOnline, setIsOnline, resetAvailableOrders } = useShipper();
  const online = isOnline;

  // Popup đơn giản
  const [showIncomingOrder, setShowIncomingOrder] = React.useState(false);
  const [countdown, setCountdown] = React.useState(28);
  const [incomingOrder, setIncomingOrder] = React.useState(null); // {id, distance, duration, cod}

  const timersRef = React.useRef({
    countdown: null,
  });

  // Bật online -> mở popup & reset countdown
  React.useEffect(() => {
    if (online) {
      setShowIncomingOrder(true);
    } else {
      setShowIncomingOrder(false);
    }
  }, [online]);

  // Lấy 1 đơn mới nhất từ DB để hiển thị trong popup
  const fetchIncomingOrder = React.useCallback(async () => {
    try {
      // 1) shipper_id
      const meRes = await fetch("http://localhost:5000/api/users/me", {
        credentials: "include",
      });
      const meJson = await meRes.json();
      const shipperId = meJson?.user?.shipper_profile?.id;
      if (!shipperId) throw new Error("Không tìm thấy shipper_id");

      // 2) vị trí hiện tại
      const coords = await new Promise((resolve, reject) => {
        if (!navigator.geolocation)
          return reject(new Error("Trình duyệt không hỗ trợ định vị"));
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve(pos.coords),
          (err) => reject(err),
          { enableHighAccuracy: true, timeout: 8000, maximumAge: 10000 }
        );
      });

      // 3) gọi API nearby (lọc cooking trong bán kính 3km)
      const res = await fetch(
        "http://localhost:5000/api/shipper/orders/nearby",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            shipper_id: shipperId,
            lat: coords.latitude,
            lon: coords.longitude,
            radius_km: 3,
            status: "cooking",
            limit: 1,
            offset: 0,
          }),
        }
      );
      const json = await res.json();
      if (!res.ok || json.success === false)
        throw new Error(json.message || "Không lấy được đơn");

      const first = (json.data || json.items || [])[0];
      if (!first) {
        setIncomingOrder(null);
        return;
      }

      const o = first.order || {};
      const cod = o.payment_method === "COD" ? Number(o.total_price || 0) : 0;

      setIncomingOrder({
        id: o.order_id,
        distanceText: formatDistance(first.distance_km),
        durationText: formatDuration(first.duration_sec),
        cod,
      });
    } catch (e) {
      console.log("[fetchIncomingOrder] error:", e.message);
      setIncomingOrder(null);
    }
  }, []);

  // Khi popup mở -> fetch data thật
  React.useEffect(() => {
    if (online && showIncomingOrder) {
      fetchIncomingOrder();
    }
  }, [online, showIncomingOrder, fetchIncomingOrder]);

  // Đếm ngược tự đóng popup
  React.useEffect(() => {
    if (!showIncomingOrder) {
      if (timersRef.current.countdown) {
        clearInterval(timersRef.current.countdown);
        timersRef.current.countdown = null;
      }
      return;
    }
    setCountdown(28);
    timersRef.current.countdown = setInterval(() => {
      setCountdown((s) => {
        if (s <= 1) {
          if (timersRef.current.countdown) {
            clearInterval(timersRef.current.countdown);
            timersRef.current.countdown = null;
          }
          setShowIncomingOrder(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (timersRef.current.countdown) {
        clearInterval(timersRef.current.countdown);
        timersRef.current.countdown = null;
      }
    };
  }, [showIncomingOrder]);

  return (
    <Box sx={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      {/* Bản đồ full-screen */}
      <Box sx={{ position: "fixed", inset: 0, zIndex: 0 }}>
        <Map4DView height="100vh" hideControls followUser />
      </Box>

      {/* UI nổi trên map */}
      <Box sx={{ position: "relative", zIndex: 1, px: 2.5, pt: 3, pb: 12 }}>
        <Fade in timeout={600}>
          <Paper
            elevation={online ? 8 : 2}
            sx={{
              position: "fixed", // 👈 ghim cố định
              top: "calc(env(safe-area-inset-top) + 12px)", // tránh tai thỏ iOS
              left: "50%",
              transform: "translateX(-50%)",
              width: "min(400px, calc(100% - 32px))", // maxWidth + chừa 2 bên
              zIndex: 10, // nổi trên bản đồ
              borderRadius: 4,
              p: 2.5,
              background: "rgba(255,255,255,0.9)",
              border: online
                ? "2px solid rgba(34,197,94,0.2)"
                : "1px solid rgba(0,0,0,0.08)",
              backdropFilter: "blur(10px)",
              transition: "all 0.3s ease",
              transformOrigin: "top center",
              ...(online
                ? { boxShadow: "0 4px 12px rgba(34,197,94,0.2)" }
                : {}),
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 3,
                    background: online
                      ? "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)"
                      : "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    boxShadow: online
                      ? "0 4px 12px rgba(34,197,94,0.2)"
                      : "none",
                  }}
                >
                  <PowerSettingsNewIcon
                    sx={{ color: online ? "#16a34a" : "#6B7280", fontSize: 28 }}
                  />
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontSize: 13,
                      lineHeight: "18px",
                      color: "#6b7280",
                      fontWeight: 500,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Trạng thái
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 18,
                      lineHeight: "28px",
                      fontWeight: 700,
                      color: online ? "#00a63e" : "#4a5565",
                    }}
                  >
                    {online ? "Đang hoạt động" : "Offline"}
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Box
                  sx={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    backgroundColor: online ? "#22c55e" : "#99a1af",
                    boxShadow: online ? "0 0 12px rgba(34,197,94,0.5)" : "none",
                    transition: "all 0.3s ease",
                  }}
                />
                <IconButton size="small" sx={{ color: "#6B7280" }}>
                  <MoreHorizIcon />
                </IconButton>
              </Stack>
            </Stack>
          </Paper>
        </Fade>

        {/* Nút bật kết nối */}
        <Box
          sx={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 100,
            display: "flex",
            justifyContent: "center",
            px: 3,
            zIndex: 100,
          }}
        >
          <Slide direction="up" in timeout={800}>
            <Button
              onClick={() => setIsOnline(!online)}
              startIcon={<PowerSettingsNewIcon sx={{ fontSize: 24 }} />}
              sx={{
                minWidth: 280,
                height: 60,
                borderRadius: 4,
                color: "#ffffff",
                textTransform: "none",
                fontSize: 17,
                fontWeight: 700,
                letterSpacing: "0.5px",
                background: online
                  ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
                  : "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                boxShadow: online
                  ? "0 12px 40px rgba(239,68,68,0.4), 0 4px 12px rgba(0,0,0,0.1)"
                  : "0 12px 40px rgba(34,197,94,0.4), 0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              {online ? "Ngắt kết nối" : "Bật kết nối"}
            </Button>
          </Slide>
        </Box>
      </Box>

      {/* Popup đơn hàng mới (tối giản) */}
      {online && showIncomingOrder && incomingOrder && (
        <Fade in={showIncomingOrder}>
          <Box
            sx={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1300,
              px: 2,
            }}
            onClick={() => setShowIncomingOrder(false)}
          >
            <Slide direction="up" in={showIncomingOrder} timeout={250}>
              <Paper
                onClick={(e) => e.stopPropagation()}
                elevation={12}
                sx={{ width: "100%", maxWidth: 360, borderRadius: 3, p: 2 }}
              >
                {/* Header ngắn gọn */}
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ mb: 1 }}
                >
                  <Typography sx={{ fontWeight: 800, fontSize: 16 }}>
                    Có đơn hàng mới
                  </Typography>
                  <Typography
                    sx={{ fontSize: 13, color: "#6b7280", fontWeight: 600 }}
                  >
                    Đóng sau <b>{countdown}</b> giây
                  </Typography>
                </Stack>

                {/* 3 dòng thông tin chính */}
                <Stack spacing={1.25} sx={{ mb: 1.5 }}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: 13, color: "#6b7280" }}>
                      Khoảng cách
                    </Typography>
                    <Typography sx={{ fontWeight: 800 }}>
                      {incomingOrder?.distanceText ?? "-"}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: 13, color: "#6b7280" }}>
                      Thời gian
                    </Typography>
                    <Typography sx={{ fontWeight: 800 }}>
                      {incomingOrder?.durationText ?? "-"}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: 13, color: "#6b7280" }}>
                      Thu hộ
                    </Typography>
                    <Typography sx={{ fontWeight: 900, color: "#16a34a" }}>
                      {money(incomingOrder?.cod)}đ
                    </Typography>
                  </Stack>
                </Stack>

                {/* Action */}
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    onClick={() => setShowIncomingOrder(false)}
                    sx={{ flex: 1, textTransform: "none" }}
                  >
                    Để sau
                  </Button>
                  <Button
                    onClick={() => {
                      setShowIncomingOrder(false);
                      // Làm mới danh sách & đi tới trang Available để xem chi tiết
                      resetAvailableOrders();
                      navigate("/shipper/available");
                    }}
                    sx={{
                      flex: 1,
                      textTransform: "none",
                      background: "linear-gradient(135deg,#ff6b35,#ff5722)",
                      color: "#fff",
                      "&:hover": {
                        background: "linear-gradient(135deg,#ff5722,#f4511e)",
                      },
                    }}
                  >
                    Xem chi tiết
                  </Button>
                </Stack>
              </Paper>
            </Slide>
          </Box>
        </Fade>
      )}
    </Box>
  );
};

export default Home;
