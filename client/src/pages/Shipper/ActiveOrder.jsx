import React from "react";
import { Box, Stack, Typography, Chip, Paper, Fade } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useShipper } from "@/hooks/useShipper";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import PlaceIcon from "@mui/icons-material/Place";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ScaleIcon from "@mui/icons-material/Scale";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

// ---------------------- helpers ----------------------
const money = (v) => Number(v || 0).toLocaleString();

// format hiển thị
const formatDistance = (km) => {
  if (km == null) return "-";
  const v = Number(km);
  return v < 1 ? `${Math.round(v * 1000)}m` : `${v.toFixed(3)}km`;
};
const formatDuration = (sec) => {
  if (sec == null) return "-";
  const s = Math.max(0, Math.round(Number(sec)));
  const m = Math.floor(s / 60);
  const r = s % 60;
  if (m === 0) return `${r} giây`;
  return `${m} phút${r ? ` ${r} giây` : ""}`;
};

const mapEnrichedToCard = (item) => {
  const o = item.order || {};
  const shopInfo = item.shop_info || {};
  const shopAddr =
    shopInfo.address?.address_line?.address || shopInfo.address?.address || "-";
  const userAddr = (item.user_addresses && item.user_addresses[0]) || null;
  const dropAddr = userAddr?.address_line?.address || "-";

  const earnRaw =
    item.shipper_earn ??
    o.shipper_earn ??
    Number(o.delivery_fee || 0) * Number(o.shipper_commission_rate || 0.15);
  const shipperEarn = Math.round(Number(earnRaw || 0));


   const pickupLat = shopInfo?.address?.lat_lon?.lat ?? null;
  const pickupLon = shopInfo?.address?.lat_lon?.lon ?? null;
  const dropLat   = userAddr?.lat_lon?.lat ?? null;
  const dropLon   = userAddr?.lat_lon?.lon ?? null;
  return {
    id: o.order_id,

    pickupLat, pickupLon,
    dropLat,   dropLon,

    pickupName: shopInfo.shop_name || `Shop #${o.shop_id}`,
    pickupAddr: shopAddr,
    pickupContactName: item.shop_contact_name || null,
    pickupPhone: item.shop_phone || null,

    dropName: item.customer_name || "Khách hàng",
    dropAddr,
    dropPhone: item.customer_phone || null,

    distance: formatDistance(item.distance_km),
    eta: formatDuration(item.duration_sec),
       deliveryDistance: formatDistance(item.pickup_to_drop_distance_km), // shop -> khách
   deliveryEta: formatDuration(item.pickup_to_drop_duration_sec),
    cod: o.payment_method === "COD" ? Number(o.total_price || 0) : 0,
    bonus: Math.round(
      Number(o.delivery_fee || 0) * Number(o.shipper_commission_rate || 0.15)
    ),
    shipperEarn,
    
  };
};

// ---------------------- SwipeOrderCard giữ nguyên UI, chỉ sửa chỗ order.id ----------------------
const SwipeOrderCard = ({ order, onAccepted }) => {
  const [dragX, setDragX] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const startXRef = React.useRef(0);

  const showLeft = isDragging && dragX > 10;
  const showRight = isDragging && dragX < -10;

  const handlePointerDown = (e) => {
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    startXRef.current = x;
    setIsDragging(true);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    setDragX(x - startXRef.current);
  };

  const resetDrag = () => {
    setIsDragging(false);
    setDragX(0);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    const acceptThreshold = 100;

    // Vuốt quá 100px TRÁI hay PHẢI đều nhận
    if (Math.abs(dragX) > acceptThreshold) {
      setIsDragging(false);
      setDragX(dragX > 0 ? 520 : -520);
      setTimeout(() => {
        resetDrag();
        onAccepted?.(order);
      }, 220);
      return;
    }
    resetDrag();
  };

  // đặt ở đầu file (trước return) – helper nhỏ
const StatCard = ({ icon, label, value, color = "#2563eb", bg = "rgba(37,99,235,0.12)" }) => (
  <Box
    sx={{
      flex: "1 1 0",
      borderRadius: 4,
      p: 1.75,
      background: "linear-gradient(180deg,#ffffff 0%,#f8fafc 100%)",
      border: "1px solid rgba(15,23,42,0.06)",
      boxShadow: "0 6px 18px rgba(2,8,23,0.06)",
      display: "flex",
      alignItems: "center",
      gap: 1.25,
      minWidth: 0,
    }}
  >
    <Box
      sx={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {React.cloneElement(icon, { sx: { fontSize: 18, color } })}
    </Box>
    <Box sx={{ minWidth: 0 }}>
      <Typography sx={{ fontSize: 12, color: "#64748b", fontWeight: 600, lineHeight: 1 }}>
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: 16,
          fontWeight: 900,
          color: "#0f172a",
          lineHeight: 1.25,
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          overflow: "hidden",
        }}
      >
        {value || "—"}
      </Typography>
    </Box>
  </Box>
);


  return (
    <Fade in timeout={500}>
      <Box sx={{ position: "relative", maxWidth: 440, mx: "auto", px: 2 }}>
        {/* Nền chỉ báo khi swipe (nằm dưới card, không nhận click) */}
        <Box
          sx={{
            position: "absolute",
            inset: "0 16px",
            zIndex: 0,
            pointerEvents: "none",
            borderRadius: 5,
            overflow: "hidden",
          }}
        >
          {/* Tick TRÁI (hiện khi dragX > 30) */}
          <Box
            sx={{
              position: "absolute",
              left: 24,
              top: "50%",
              transform: `translateY(-50%) scale(${
                dragX > 30 ? Math.min(1.2, dragX / 100 + 0.5) : 0.5
              })`,
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: showLeft ? Math.min(1, dragX / 100) : 0,
              transition: isDragging
                ? "none"
                : "all 0.3s cubic-bezier(0.4,0,0.2,1)",
              boxShadow: "0 8px 24px rgba(34,197,94,0.4)",
            }}
          >
            <CheckRoundedIcon sx={{ fontSize: 40, color: "#fff" }} />
          </Box>

          {/* Tick PHẢI (hiện khi dragX < -30) */}
          <Box
            sx={{
              position: "absolute",
              right: 24,
              top: "50%",
              transform: `translateY(-50%) scale(${
                dragX < -30 ? Math.min(1.2, Math.abs(dragX) / 100 + 0.5) : 0.5
              })`,
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: showRight ? Math.min(1, Math.abs(dragX) / 100) : 0,
              transition: isDragging
                ? "none"
                : "all 0.3s cubic-bezier(0.4,0,0.2,1)",
              boxShadow: "0 8px 24px rgba(34,197,94,0.4)",
            }}
          >
            <CheckRoundedIcon sx={{ fontSize: 40, color: "#fff" }} />
          </Box>
        </Box>

        {/* === Card chính: di chuyển CẢ Paper (không chỉ phần nội dung) === */}
        <Paper
          elevation={12}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
          sx={{
            borderRadius: 5,
            overflow: "hidden",
            position: "relative",
            zIndex: 2,
            background: "#fff",
            boxShadow:
              "0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)",
            // 💡 Di chuyển cả khối, bỏ rotate để không bị “mỏng như giấy”
            transform: `translate3d(${dragX}px, 0, 0)`,
            transition: isDragging
              ? "none"
              : "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
            willChange: "transform",
            cursor: isDragging ? "grabbing" : "grab",
            userSelect: "none",
            touchAction: "pan-y",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: "linear-gradient(135deg, #fff7ed 0%, #ffffff 100%)",
              borderBottom: "1.5px solid rgba(255,107,53,0.1)",
              p: 2.5,
              position: "relative",
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 3,
                    background:
                      "linear-gradient(135deg, #fff1e9 0%, #ffe4d6 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 12px rgba(255,107,53,0.15)",
                  }}
                >
                  <LocalShippingIcon sx={{ color: "#ff6b35", fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography
                    sx={{ fontSize: 13, color: "#9ca3af", fontWeight: 500 }}
                  >
                    Mã đơn hàng
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 20,
                      fontWeight: 800,
                      color: "#ff6b35",
                      letterSpacing: "0.5px",
                    }}
                  >
                    #DH{String(order.id).padStart(3, "0")}
                  </Typography>
                </Box>
              </Stack>
              <Chip
                label={`+${Number(order.shipperEarn || 0).toLocaleString()}đ`}
                sx={{
                  background:
                    "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
                  color: "#166534",
                  fontWeight: 800,
                  height: 32,
                  borderRadius: 2,
                  boxShadow: "0 2px 8px rgba(34,197,94,0.2)",
                  minWidth: 96,
                  "& .MuiChip-label": {
                    px: 1.5,
                    fontSize: 14,
                    lineHeight: "32px",
                  },
                }}
              />
            </Stack>
          </Box>

          {/* Body - Chi tiết đơn hàng */}
          <Box sx={{ p: 3 }}>
            {/* Điểm lấy hàng */}
            {/* GÓI CHUNG: pickup + connector + drop */}
            {/* Block pickup + connector + drop (2 cột) */}
            <Box sx={{ display: "flex", gap: 2, alignItems: "stretch", mb: 3 }}>
              {/* Cột trái: icon + line + icon (tự căn giữa) */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: 44, // đúng bằng icon
                  flexShrink: 0,
                }}
              >
                {/* Icon pickup */}
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 12px rgba(59,130,246,0.2)",
                  }}
                >
                  <LocalMallIcon sx={{ color: "#1d4ed8", fontSize: 20 }} />
                </Box>

                {/* Line nối (auto giãn) */}
                <Box
                  sx={{
                    width: 3,
                    flex: 1,
                    my: 1,
                    borderRadius: 2,
                    background:
                      "linear-gradient(180deg, #3b82f6 0%, #ff6b35 100%)",
                  }}
                />

                {/* Icon drop */}
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 12px rgba(255,107,53,0.2)",
                  }}
                >
                  <PlaceIcon sx={{ color: "#c2410c", fontSize: 22 }} />
                </Box>
              </Box>

              {/* Cột phải: nội dung pickup + drop */}
              <Box sx={{ flex: 1 }}>
                {/* Pickup text */}
                <Box sx={{ mb: 2 }}>
                  <Typography
                    sx={{
                      fontSize: 13,
                      color: "#6b7280",
                      fontWeight: 500,
                      mb: 0.5,
                    }}
                  >
                    Lấy hàng tại
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 17,
                      fontWeight: 700,
                      color: "#111827",
                      mb: 0.5,
                    }}
                  >
                    {order.pickupName}
                  </Typography>
                  <Typography
                    sx={{ fontSize: 14, color: "#6b7280", lineHeight: 1.5 }}
                  >
                    {order.pickupAddr}
                  </Typography>
                </Box>

                {/* Drop text */}
                <Box>
                  <Typography
                    sx={{
                      fontSize: 13,
                      color: "#6b7280",
                      fontWeight: 500,
                      mb: 0.5,
                    }}
                  >
                    Giao đến
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 17,
                      fontWeight: 700,
                      color: "#111827",
                      mb: 0.5,
                    }}
                  >
                    {order.dropName}
                  </Typography>
                  <Typography
                    sx={{ fontSize: 14, color: "#6b7280", lineHeight: 1.5 }}
                  >
                    {order.dropAddr}
                  </Typography>
                </Box>
              </Box>
            </Box>
            {/* Stats */}
{/* Stats – thay nguyên khối cũ */}
<Stack spacing={1.25} sx={{ mb: 3 }}>
  <Stack direction="row" spacing={1.25}>
    <StatCard
      icon={<PlaceIcon />}
      label="Bạn → Quán"
      value={order.distance}
      color="#2563eb"
      bg="rgba(37,99,235,0.12)"
    />
    <StatCard
      icon={<AccessTimeIcon />}
      label="Tới quán"
      value={order.eta}
      color="#7c3aed"
      bg="rgba(124,58,237,0.12)"
    />
  </Stack>

  <Stack direction="row" spacing={1.25}>
    <StatCard
      icon={<PlaceIcon />}
      label="Quán → Khách"
      value={order.deliveryDistance || "Đang tính…"}
      color="#f97316"
      bg="rgba(249,115,22,0.12)"
    />
    <StatCard
      icon={<AccessTimeIcon />}
      label="Thời gian giao"
      value={order.deliveryEta || "Đang tính…"}
      color="#ef4444"
      bg="rgba(239,68,68,0.12)"
    />
  </Stack>
</Stack>



            {/* Thu hộ */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%)",
                borderRadius: 4,
                px: 3,
                py: 2.5,
                border: "2px solid rgba(255,107,53,0.2)",
                boxShadow: "0 4px 16px rgba(255,107,53,0.15)",
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #ff6b35 0%, #ff5722 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 12px rgba(255,107,53,0.3)",
                  }}
                >
                  <AttachMoneyIcon sx={{ color: "#fff", fontSize: 22 }} />
                </Box>
                <Typography
                  sx={{ fontSize: 15, color: "#c2410c", fontWeight: 600 }}
                >
                  Thu hộ
                </Typography>
              </Stack>
              <Box sx={{ textAlign: "right" }}>
                <Typography
                  sx={{
                    fontSize: 24,
                    color: "#c2410c",
                    fontWeight: 900,
                    lineHeight: 1,
                  }}
                >
                  {money(order.cod)}đ
                </Typography>
                <Typography
                  sx={{
                    fontSize: 13,
                    color: "#16a34a",
                    fontWeight: 700,
                    mt: 0.5,
                  }}
                ></Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Fade>
  );
};

// ---------------------- Trang Đơn hàng ----------------------
const ActiveOrder = () => {
  const { availableOrders, setAvailableOrders, setCurrentOrder } = useShipper();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [refreshTick, setRefreshTick] = React.useState(0);

  // fetch dữ liệu thật (lặp lại khi ấn "Quét lại")
  React.useEffect(() => {
    let abort = false;

    const load = async () => {
      try {
        setLoading(true);
        setError("");

        // 1) lấy shipper_id từ /api/users/me
        const meRes = await fetch("http://localhost:5000/api/users/me", {
          credentials: "include",
        });
        const meJson = await meRes.json();
        const shipperId = meJson?.user?.shipper_profile?.id;
        if (!shipperId) throw new Error("Không tìm thấy shipper_id");

        // 2) lấy vị trí hiện tại của shipper
        const getPosition = () =>
          new Promise((resolve, reject) => {
            if (!navigator.geolocation)
              return reject(new Error("Trình duyệt không hỗ trợ định vị"));
            navigator.geolocation.getCurrentPosition(
              (pos) => resolve(pos.coords),
              (err) => reject(err),
              { enableHighAccuracy: true, timeout: 8000, maximumAge: 10000 }
            );
          });

        let coords;
        try {
          coords = await getPosition();
          // eslint-disable-next-line no-unused-vars
        } catch (err) {
          throw new Error("Không lấy được vị trí hiện tại");
        }

        // 3) gọi API BE mới: /api/shipper/orders/nearby (lọc 3km + cooking)
        const ordersRes = await fetch(
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
              limit: 50,
              offset: 0,
            }),
          }
        );

        const ordersJson = await ordersRes.json();
        if (!ordersRes.ok || ordersJson.success === false) {
          throw new Error(ordersJson.message || "Không lấy được danh sách đơn");
        }

        const enrichedItems = ordersJson.data || ordersJson.items || [];
        const cards = enrichedItems.map(mapEnrichedToCard);
        if (!abort) setAvailableOrders(cards);
      } catch (e) {
        if (!abort) setError(e.message || "Lỗi tải dữ liệu");
      } finally {
        if (!abort) setLoading(false);
      }
    };
    load();

    return () => {
      abort = true;
    };
  }, [setAvailableOrders, refreshTick]);

  const queue = availableOrders;

  const handleRejected = () => {
    setAvailableOrders((q) => q.slice(1));
  };

  const handleAccepted = async (order) => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/shipper/orders/accept",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ order_id: order.id }), // shipper lấy từ session
        }
      );
      const json = await res.json();
      if (!res.ok || json.success === false) {
        throw new Error(json.message || "Nhận đơn thất bại");
      }

      // cập nhật state local
      setCurrentOrder(order);
      setAvailableOrders((q) => q.filter((o) => o.id !== order.id));

      // điều hướng
      navigate("/shipper/delivering");
    } catch (err) {
      alert(err.message || "Không thể nhận đơn");
    }
  };

  // UI loading / error
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography>Đang tải đơn hàng…</Typography>
      </Box>
    );
  }
  if (error) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
          textAlign: "center",
        }}
      >
        <Typography color="error">Lỗi: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #fff5f2 0%, #f0f9ff 50%, #fef3c7 100%)",
        pb: 12,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #ff6b35 0%, #ff5722 100%)",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            right: 0,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
            transform: "translate(30%, -30%)",
          },
        }}
      >
        <Fade in timeout={600}>
          <Box
            sx={{
              maxWidth: 480,
              mx: "auto",
              borderBottomLeftRadius: 32,
              borderBottomRightRadius: 32,
              color: "#fff",
              px: 3,
              pt: 3,
              pb: 3,
              boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
              position: "relative",
              zIndex: 1,
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: 15,
                    opacity: 0.9,
                    fontWeight: 500,
                    mb: 0.5,
                    letterSpacing: "0.5px",
                  }}
                >
                  Xin chào
                </Typography>
                <Typography
                  sx={{ fontSize: 24, fontWeight: 800, letterSpacing: "0.5px" }}
                >
                  Đơn hàng khả dụng
                </Typography>
              </Box>
              <Box
                sx={{
                  background: "rgba(255,255,255,0.2)",
                  backdropFilter: "blur(10px)",
                  borderRadius: 3,
                  px: 2.5,
                  py: 1.5,
                  border: "1px solid rgba(255,255,255,0.3)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
                <Typography
                  sx={{ fontSize: 12, opacity: 0.9, fontWeight: 500, mb: 0.25 }}
                >
                  Còn lại
                </Typography>
                <Typography
                  sx={{ fontSize: 22, fontWeight: 800, letterSpacing: "1px" }}
                >
                  {queue.length} đơn
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Fade>
      </Box>

      {/* Content */}
      <Box sx={{ mt: -4, position: "relative", zIndex: 2 }}>
        {queue.length > 0 ? (
          <Box sx={{ mt: 6, display: "flex", flexDirection: "column", gap: 4 }}>
            {queue.map((order, idx) => (
              <SwipeOrderCard
                key={order.id || idx}
                order={order}
                onRejected={handleRejected}
                onAccepted={handleAccepted}
              />
            ))}
          </Box>
        ) : (
          <Fade in timeout={600}>
            <Box
              sx={{
                maxWidth: 400,
                mx: "auto",
                mt: 12,
                px: 3,
                textAlign: "center",
              }}
            >
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 3,
                  fontSize: 48,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                }}
              >
                📦
              </Box>
              <Typography
                sx={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#374151",
                  mb: 1.5,
                }}
              >
                Hiện chưa có đơn khả dụng
              </Typography>
              <Typography
                sx={{ fontSize: 15, color: "#6b7280", lineHeight: 1.6, mb: 2 }}
              >
                Kéo để làm mới hoặc bấm nút dưới để quét lại.
              </Typography>
              <Box
                onClick={() => setRefreshTick((n) => n + 1)}
                sx={{
                  display: "inline-block",
                  px: 3,
                  py: 1.2,
                  borderRadius: 2,
                  cursor: "pointer",
                  userSelect: "none",
                  background:
                    "linear-gradient(135deg, #ff6b35 0%, #ff5722 100%)",
                  color: "#fff",
                  fontWeight: 700,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                }}
              >
                Quét lại
              </Box>
            </Box>
          </Fade>
        )}
      </Box>
    </Box>
  );
};

export default ActiveOrder;