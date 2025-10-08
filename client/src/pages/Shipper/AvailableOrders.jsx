import React from 'react';
import { Box, Stack, Typography, Chip, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import PlaceIcon from '@mui/icons-material/Place';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ScaleIcon from '@mui/icons-material/Scale';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

// Thẻ đơn hàng có thao tác vuốt
const SwipeOrderCard = ({ order, onAccepted, onRejected }) => {
  const navigate = useNavigate();
  const [dragX, setDragX] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const startXRef = React.useRef(0);

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
    const rejectThreshold = -100;
    if (dragX > acceptThreshold) {
      setIsDragging(false);
      setDragX(520);
      setTimeout(() => {
        resetDrag();
        if (onAccepted) onAccepted(order);
        navigate(`/shipper/order/${order.id}`);
      }, 220);
      return;
    }
    if (dragX < rejectThreshold) {
      setIsDragging(false);
      setDragX(-520);
      setTimeout(() => {
        resetDrag();
        if (onRejected) onRejected(order);
      }, 220);
      return;
    }
    resetDrag();
  };

  return (
    <>
      <Paper
        elevation={8}
        sx={{
          maxWidth: 390,
          mx: 'auto',
          mt: 2,
          borderRadius: 2,
          overflow: 'hidden',
          position: 'relative',
          '&:before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: dragX > 0 ? 'linear-gradient(90deg, rgba(16,185,129,0.08), transparent 40%)' : dragX < 0 ? 'linear-gradient(270deg, rgba(239,68,68,0.08), transparent 40%)' : 'transparent',
            pointerEvents: 'none',
          },
        }}
      >
        <Box
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
          sx={{
            position: 'relative',
            transform: `translateX(${dragX}px) rotate(${Math.max(-8, Math.min(8, dragX / 12))}deg)`,
            transition: isDragging ? 'none' : 'transform 200ms ease',
            willChange: 'transform',
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none',
            touchAction: 'pan-y',
          }}
        >
          {/* Overlay tint */}
          <Box sx={{ position: 'absolute', inset: 0, borderRadius: 2, background: dragX > 10 ? 'rgba(16,185,129,0.12)' : dragX < -10 ? 'rgba(239,68,68,0.12)' : 'transparent', transition: 'background 150ms ease', pointerEvents: 'none' }} />
          {/* Header */}
          <Box sx={{ background: 'linear-gradient(90deg, #fff7ed, #ffffff)', borderBottom: '1px solid rgba(0,0,0,0.06)', p: 2 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction="row" alignItems="center" spacing={1.25}>
                <Box sx={{ width: 28, height: 28, borderRadius: '50%', background: '#fff1e9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <LocalMallIcon sx={{ color: '#ff6b35', fontSize: 16 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 12, color: '#6a7282' }}>Mã đơn</Typography>
                  <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#ff6b35' }}>#DH{String(order.id).padStart(3, '0')}</Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Chip size="small" label="Gấp" sx={{ background: '#ffe2e2', color: '#c10007', fontWeight: 600 }} />
                <Chip size="small" label={`+${order.bonus.toLocaleString()}đ`} sx={{ background: '#e7f7ee', color: '#008236', fontWeight: 700 }} />
              </Stack>
            </Stack>

            {(Math.abs(dragX) > 60) && (
              <Box sx={{ position: 'absolute', left: '50%', top: '50%', transform: `translate(-50%, -50%) rotate(${Math.max(-6, Math.min(6, dragX / 18))}deg)`, background: dragX > 0 ? '#22c55e' : '#fb2c36', color: '#fff', borderRadius: 2, px: 2, py: 1.25, boxShadow: '0 10px 30px rgba(0,0,0,0.25)' }}>
                {dragX > 0 ? <CheckRoundedIcon sx={{ fontSize: 36 }} /> : <CloseRoundedIcon sx={{ fontSize: 36 }} />}
              </Box>
            )}
          </Box>

          {/* Body */}
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', mb: 1.75 }}>
              <Box sx={{ width: 12, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: '#2b7fff', boxShadow: '0 0 0 4px #dbeafe' }} />
                <Box sx={{ width: 2, flex: 1, mt: 1, background: 'linear-gradient(#bedbff, #e5e7eb 50%, #ffd6a7)' }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 12, color: '#6a7282' }}>Lấy hàng tại</Typography>
                <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>{order.pickupName}</Typography>
                <Typography sx={{ fontSize: 14, color: '#4a5565' }}>{order.pickupAddr}</Typography>
              </Box>
            </Box>

            <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ mb: 2 }}>
              <PlaceIcon sx={{ color: '#ed6c66' }} fontSize="small" />
              <Box>
                <Typography sx={{ fontSize: 12, color: '#6a7282' }}>Giao đến</Typography>
                <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>{order.dropName}</Typography>
                <Typography sx={{ fontSize: 14, color: '#4a5565' }}>{order.dropAddr}</Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1} sx={{ borderTop: '1px solid rgba(0,0,0,0.06)', pt: 1.5, mb: 2 }}>
              <Box sx={{ flex: 1, background: '#ffffff', border: '1px solid #eef2f7', borderRadius: 2, px: 1, py: 1.25, textAlign: 'center' }}>
                <Box sx={{ color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 0.5 }}>
                  <PlaceIcon sx={{ fontSize: 18 }} />
                  <Typography sx={{ fontSize: 12 }}>Khoảng cách</Typography>
                </Box>
                <Typography sx={{ fontSize: 14, color: '#111827', fontWeight: 700 }}>{order.distance} km</Typography>
              </Box>
              <Box sx={{ flex: 1, background: '#ffffff', border: '1px solid #eef2f7', borderRadius: 2, px: 1, py: 1.25, textAlign: 'center' }}>
                <Box sx={{ color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 0.5 }}>
                  <AccessTimeIcon sx={{ fontSize: 18 }} />
                  <Typography sx={{ fontSize: 12 }}>Thời gian</Typography>
                </Box>
                <Typography sx={{ fontSize: 14, color: '#111827', fontWeight: 700 }}>{order.eta}</Typography>
              </Box>
              <Box sx={{ flex: 1, background: '#ffffff', border: '1px solid #eef2f7', borderRadius: 2, px: 1, py: 1.25, textAlign: 'center' }}>
                <Box sx={{ color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 0.5 }}>
                  <ScaleIcon sx={{ fontSize: 18 }} />
                  <Typography sx={{ fontSize: 12 }}>Khối lượng</Typography>
                </Box>
                <Typography sx={{ fontSize: 14, color: '#111827', fontWeight: 700 }}>{order.weight}</Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between" sx={{ background: '#fff1e9', borderRadius: 2, px: 1.75, py: 1.75 }}>
              <Typography sx={{ color: '#ff6b35', fontWeight: 800, fontSize: 18 }}>$ {order.cod.toLocaleString()}đ</Typography>
              <Typography sx={{ color: '#00a63e', fontWeight: 700 }}>+{order.bonus.toLocaleString()}đ</Typography>
            </Stack>
          </Box>
        </Box>
      </Paper>

      <Box sx={{ maxWidth: 390, mx: 'auto', mt: 1.25, textAlign: 'center' }}>
        <Typography sx={{ color: '#99a1af', fontWeight: 600 }}>Vuốt để chọn đơn hàng</Typography>
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={3} sx={{ mt: 1 }}>
          <Typography sx={{ color: '#fb2c36', fontWeight: 600 }}>✗ Bỏ qua</Typography>
          <Box sx={{ width: 72, height: 6, borderRadius: 9999, background: '#e5e7eb' }} />
          <Typography sx={{ color: '#00c950', fontWeight: 700 }}>Nhận đơn ✓</Typography>
        </Stack>
      </Box>
    </>
  );
};

// Trang Đơn hàng khả dụng (theo thiết kế từ Figma)
const AvailableOrders = () => {
  const orders = React.useMemo(() => ([
    { id: 1, pickupName: 'Nhà hàng Phở 24', pickupAddr: '123 Nguyễn Huệ, Q.1', dropName: 'Nguyễn Văn A', dropAddr: '456 Lê Lợi, Q.3', distance: 3.5, eta: '15–20 phút', weight: '2kg', cod: 45000, bonus: 5000 },
    { id: 2, pickupName: 'Bún Chả Hà Nội', pickupAddr: '45 Trần Hưng Đạo, Q.1', dropName: 'Trần B', dropAddr: '12 Hai Bà Trưng, Q.1', distance: 2.2, eta: '10–15 phút', weight: '1.5kg', cod: 38000, bonus: 4000 },
    { id: 3, pickupName: 'Cơm Tấm 68', pickupAddr: '68 Lê Lai, Q.1', dropName: 'Lê C', dropAddr: '200 Nguyễn Thị Minh Khai, Q.3', distance: 4.1, eta: '18–25 phút', weight: '3kg', cod: 52000, bonus: 6000 },
    { id: 4, pickupName: 'Trà sữa Gấu', pickupAddr: '99 Pasteur, Q.3', dropName: 'Phạm D', dropAddr: '15 Nguyễn Trãi, Q.5', distance: 3.0, eta: '12–18 phút', weight: '1kg', cod: 30000, bonus: 3000 },
    { id: 5, pickupName: 'Pizza 4U', pickupAddr: '12 Đinh Tiên Hoàng, Q.1', dropName: 'Đỗ E', dropAddr: '88 Võ Văn Tần, Q.3', distance: 5.0, eta: '20–28 phút', weight: '2.3kg', cod: 65000, bonus: 7000 },
  ]), []);

  const [queue, setQueue] = React.useState(orders);

  const handleRejected = () => {
    setQueue((q) => q.slice(1));
  };

  const handleAccepted = () => {
    // Khi nhận đơn, ta không pop ở đây vì đã điều hướng sang chi tiết
  };

  return (
    <Box sx={{ pb: 3 }}>
      {/* Header gradient */}
      <Box sx={{ background: 'linear-gradient(90deg, #ff6b35, #f54900)' }}>
        <Box
          sx={{
            maxWidth: 390,
            mx: 'auto',
            borderBottomLeftRadius: 28,
            borderBottomRightRadius: 28,
            color: '#fff',
            px: 2.5,
            pt: 2,
            pb: 1.75,
            boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.10), 0px 4px 6px -4px rgba(0,0,0,0.10)'
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between">
    <Box>
              <Typography sx={{ fontSize: 14, opacity: 0.85 }}>Xin chào 👋</Typography>
              <Typography sx={{ fontSize: 16, fontWeight: 700 }}>Đơn hàng khả dụng</Typography>
            </Box>
            <Box sx={{ background: 'rgba(255,255,255,0.20)', borderRadius: 2, px: 2, py: 1 }}>
              <Typography sx={{ fontSize: 12, opacity: 0.85 }}>Còn lại</Typography>
              <Typography sx={{ fontSize: 16, fontWeight: 700 }}>5 đơn</Typography>
            </Box>
      </Stack>
        </Box>
      </Box>

      {/* Chỉ hiển thị 1 thẻ đầu hàng đợi. Sau khi vuốt hủy, hiển thị thẻ kế tiếp */}
      {queue.length > 0 && (
        <SwipeOrderCard order={queue[0]} onRejected={handleRejected} onAccepted={handleAccepted} />
      )}
    </Box>
  );
};

export default AvailableOrders;

