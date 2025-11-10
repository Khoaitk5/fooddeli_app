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

// --- keys cho bộ nhớ cục bộ ---
const ACK_KEY = "shipperAckOrderIds"; // các ID đã xác nhận (đã xem)

// helper nhỏ
const money = (v) => Number(v || 0).toLocaleString("vi-VN");

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

// 🔔 âm thanh "ding" ngắn bằng WebAudio (không cần file ngoài)
const playPing = () => {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  } catch {}
};

// 📳 rung máy (nếu hỗ trợ)
const vibrate = (pattern) => {
  if (navigator.vibrate) {
    try {
      navigator.vibrate(pattern);
    } catch {}
  }
};

const Home = () => {
  const navigate = useNavigate();
  const { isOnline, setIsOnline, resetAvailableOrders } = useShipper();
  const online = isOnline;

  // Hàng đợi các đơn mới (để đếm & điều hướng)
  const [incomingQueue, setIncomingQueue] = React.useState([]);

  // Set này chỉ để tránh thêm trùng lặp trong cùng phiên render (không persist)
  const seenRef = React.useRef(new Set());

  // Set các ID đã xem (persist qua sessionStorage)
  const ackRef = React.useRef(new Set());
  React.useEffect(() => {
    try {
      const raw = sessionStorage.getItem(ACK_KEY);
      if (raw) ackRef.current = new Set(JSON.parse(raw));
    } catch {}
  }, []);

  // Mount map trễ 1 frame để tránh layout shift
  const [mountMap, setMountMap] = React.useState(false);
  React.useEffect(() => {
    const id = requestAnimationFrame(() => setMountMap(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // --- ĐO VỊ TRÍ banner để đặt thông báo ngay bên dưới ---
  const bannerRef = React.useRef(null);
  const [bannerBottom, setBannerBottom] = React.useState(0);

  const updateBannerBottom = React.useCallback(() => {
    if (!bannerRef.current) return;
    const rect = bannerRef.current.getBoundingClientRect();
    // thêm khoảng cách 12px dưới banner
    setBannerBottom(rect.bottom + 12);
  }, []);

  React.useEffect(() => {
    updateBannerBottom();
    window.addEventListener("resize", updateBannerBottom);
    return () => window.removeEventListener("resize", updateBannerBottom);
  }, [updateBannerBottom]);

  // Lấy đơn gần shipper
  const fetchIncomingOrders = React.useCallback(async () => {
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
      const res = await fetch("http://localhost:5000/api/shipper/orders/nearby", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          shipper_id: shipperId,
          lat: coords.latitude,
          lon: coords.longitude,
          radius_km: 3,
          status: "cooking",
          limit: 5,
          offset: 0,
        }),
      });

      const json = await res.json();
      if (!res.ok || json.success === false)
        throw new Error(json.message || "Không lấy được đơn");

      const list = (json.data || json.items || []).map((it) => {
        const o = it.order || {};
        const cod = o.payment_method === "COD" ? Number(o.total_price || 0) : 0;
        return {
          id: o.order_id,
          distanceText: formatDistance(it.distance_km),
          durationText: formatDuration(it.duration_sec),
          cod,
        };
      });

      // Thêm vào queue nếu là đơn MỚI (không nằm trong ackRef & chưa có trong seenRef)
      let added = 0;
      setIncomingQueue((q) => {
        const next = [...q];
        for (const item of list) {
          if (!item.id) continue;
          if (ackRef.current.has(item.id)) continue; // đã xem -> bỏ
          if (seenRef.current.has(item.id)) continue; // đã add trong phiên -> bỏ
          seenRef.current.add(item.id);
          next.push(item);
          added++;
        }
        return next;
      });

      // Có đơn mới → phát âm thanh + rung
      if (added > 0) {
        playPing();
        vibrate([70, 40, 70]);
      }
    } catch (e) {
      console.log("[fetchIncomingOrder] error:", e?.message || e);
    }
  }, []);

  // Chu kỳ fetch khi Online
  React.useEffect(() => {
    if (!online) return;
    fetchIncomingOrders(); // gọi ngay lần đầu
    const id = setInterval(fetchIncomingOrders, 10000);
    return () => clearInterval(id);
  }, [online, fetchIncomingOrders]);

  // Reset queue khi bật/tắt Online
  const prevOnlineRef = React.useRef(online);
  React.useEffect(() => {
    const wasOnline = prevOnlineRef.current;

    // OFF -> ON: bắt đầu phiên mới, xoá danh sách ack cũ (tuỳ yêu cầu)
    if (!wasOnline && online) {
      seenRef.current = new Set();
      ackRef.current = new Set();
      try {
        sessionStorage.removeItem(ACK_KEY);
      } catch {}
      setIncomingQueue([]);
      fetchIncomingOrders();
    }

    // ON -> OFF
    if (wasOnline && !online) {
      setIncomingQueue([]);
      // không nhất thiết xoá ack; để giữ trạng thái đã xem khi bật lại
    }

    prevOnlineRef.current = online;
  }, [online, fetchIncomingOrders]);

  // Khi online thay đổi/render xong banner → đo lại vị trí
  React.useEffect(() => {
    const id = requestAnimationFrame(updateBannerBottom);
    return () => cancelAnimationFrame(id);
  }, [online, updateBannerBottom]);

  // Khi click thông báo: đánh dấu đã xem & điều hướng
  const handleOpenAvailable = React.useCallback(() => {
    try {
      const ids = incomingQueue.map((i) => i.id).filter(Boolean);
      if (ids.length) {
        for (const id of ids) ackRef.current.add(id);
        sessionStorage.setItem(ACK_KEY, JSON.stringify(Array.from(ackRef.current)));
      }
    } catch {}
    // xoá queue để ẩn thông báo ngay lập tức
    setIncomingQueue([]);
    resetAvailableOrders();
    navigate("/shipper/available");
  }, [incomingQueue, navigate, resetAvailableOrders]);

  return (
    <Box sx={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      {/* Bản đồ full-screen */}
      <Box sx={{ position: "fixed", inset: 0, zIndex: 0 }}>
        {mountMap && <Map4DView height="100vh" hideControls followUser />}
      </Box>

      {/* UI nổi trên map */}
      <Box sx={{ position: "relative", zIndex: 1, px: 2.5, pt: 3, pb: 12 }}>
        <Fade in timeout={600}>
          <Paper
            ref={bannerRef}
            elevation={online ? 8 : 2}
            sx={{
              position: "fixed",
              top: "calc(env(safe-area-inset-top) + 12px)",
              left: "50%",
              transform: "translateX(-50%)",
              width: "min(400px, calc(100% - 32px))",
              zIndex: 10,
              borderRadius: 4,
              p: 2.5,
              background: "rgba(255,255,255,0.9)",
              border: online
                ? "2px solid rgba(34,197,94,0.2)"
                : "1px solid rgba(0,0,0,0.08)",
              backdropFilter: "blur(10px)",
              transition: "all 0.3s ease",
              transformOrigin: "top center",
              ...(online ? { boxShadow: "0 4px 12px rgba(34,197,94,0.2)" } : {}),
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between">
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
                    boxShadow: online ? "0 4px 12px rgba(34,197,94,0.2)" : "none",
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

      {/* 🔔 Thông báo nổi nằm NGAY BÊN DƯỚI banner trạng thái */}
      {online && incomingQueue.length > 0 && (
        <Fade in>
          <Box
            role="button"
            aria-label={`Có ${incomingQueue.length} đơn hàng mới gần bạn`}
            onClick={handleOpenAvailable}
            sx={{
              position: "fixed",
              left: "50%",
              transform: "translateX(-50%)",
              top: bannerBottom || 120, // fallback nếu chưa đo được
              background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
              color: "#fff",
              borderRadius: 999,
              px: 2.5,
              py: 1.5,
              boxShadow: "0 10px 24px rgba(0,0,0,0.18)",
              cursor: "pointer",
              zIndex: 9,
              display: "flex",
              alignItems: "center",
              gap: 1,
              transition: "all 0.25s ease",
              "&:hover": {
                transform: "translateX(-50%) scale(1.04)",
                boxShadow: "0 12px 28px rgba(0,0,0,0.22)",
              },
              "@keyframes pulse": {
                "0%": { transform: "translateX(-50%) scale(1)" },
                "50%": { transform: "translateX(-50%) scale(1.03)" },
                "100%": { transform: "translateX(-50%) scale(1)" },
              },
              animation: "pulse 2.2s ease-in-out infinite",
            }}
          >
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: "#fff",
                mr: 1,
              }}
            />
            <Typography sx={{ fontWeight: 700 }}>
              Có <b>{incomingQueue.length}</b> đơn hàng mới gần bạn — bấm để xem
            </Typography>
          </Box>
        </Fade>
      )}
    </Box>
  );
};

export default Home;
