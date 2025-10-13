import React from 'react';
import { Box, Stack, Typography, Chip, Paper, Fade, Slide } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useShipper } from '@/hooks/useShipper';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import PlaceIcon from '@mui/icons-material/Place';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ScaleIcon from '@mui/icons-material/Scale';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

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
        navigate(`/shipper/delivering`);
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
    <Fade in timeout={500}>
      <Box sx={{ position: 'relative', maxWidth: 440, mx: 'auto', px: 2 }}>
        {/* Background indicators khi swipe */}
        <Box sx={{
          position: 'absolute',
          inset: '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 0,
          pointerEvents: 'none',
        }}>
          {/* Left indicator - Từ chối */}
          <Box sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: dragX < -30 ? Math.min(1, Math.abs(dragX) / 100) : 0,
            transform: `scale(${dragX < -30 ? Math.min(1.2, Math.abs(dragX) / 100 + 0.5) : 0.5})`,
            transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 8px 24px rgba(239,68,68,0.4)',
          }}>
            <CloseRoundedIcon sx={{ fontSize: 40, color: '#fff' }} />
          </Box>

          {/* Right indicator - Chấp nhận */}
          <Box sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: dragX > 30 ? Math.min(1, dragX / 100) : 0,
            transform: `scale(${dragX > 30 ? Math.min(1.2, dragX / 100 + 0.5) : 0.5})`,
            transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 8px 24px rgba(34,197,94,0.4)',
          }}>
            <CheckRoundedIcon sx={{ fontSize: 40, color: '#fff' }} />
          </Box>
        </Box>

        {/* Card chính */}
        <Paper
          elevation={12}
          sx={{
            borderRadius: 5,
            overflow: 'hidden',
            position: 'relative',
            zIndex: 1,
            background: '#fff',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
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
              transform: `translateX(${dragX}px) rotate(${Math.max(-6, Math.min(6, dragX / 15))}deg)`,
              transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              willChange: 'transform',
              cursor: isDragging ? 'grabbing' : 'grab',
              userSelect: 'none',
              touchAction: 'pan-y',
            }}
          >
            {/* Overlay tint động */}
            <Box sx={{ 
              position: 'absolute', 
              inset: 0, 
              background: dragX > 10 
                ? `linear-gradient(90deg, rgba(34,197,94,${Math.min(0.15, dragX / 600)}) 0%, transparent 100%)`
                : dragX < -10 
                  ? `linear-gradient(270deg, rgba(239,68,68,${Math.min(0.15, Math.abs(dragX) / 600)}) 0%, transparent 100%)`
                  : 'transparent',
              transition: 'background 0.2s ease',
              pointerEvents: 'none',
              borderRadius: 5,
            }} />

            {/* Header gradient đẹp */}
            <Box sx={{ 
              background: 'linear-gradient(135deg, #fff7ed 0%, #ffffff 100%)', 
              borderBottom: '1.5px solid rgba(255,107,53,0.1)', 
              p: 2.5,
              position: 'relative'
            }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Box sx={{ 
                    width: 48, 
                    height: 48, 
                    borderRadius: 3, 
                    background: 'linear-gradient(135deg, #fff1e9 0%, #ffe4d6 100%)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(255,107,53,0.15)'
                  }}>
                    <LocalShippingIcon sx={{ color: '#ff6b35', fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 13, color: '#9ca3af', fontWeight: 500 }}>
                      Mã đơn hàng
                    </Typography>
                    <Typography sx={{ fontSize: 20, fontWeight: 800, color: '#ff6b35', letterSpacing: '0.5px' }}>
                      #DH{String(order.id).padStart(3, '0')}
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Chip 
                    label="Gấp 🔥" 
                    sx={{ 
                      background: 'linear-gradient(135deg, #fef3c7 0%, #fde047 100%)',
                      color: '#92400e',
                      fontWeight: 700,
                      fontSize: 12,
                      height: 32,
                      borderRadius: 2,
                      boxShadow: '0 2px 8px rgba(253,224,71,0.3)'
                    }} 
                  />
                  <Chip 
                    label={`+${order.bonus.toLocaleString()}đ`} 
                    sx={{ 
                      background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                      color: '#166534',
                      fontWeight: 800,
                      fontSize: 12,
                      height: 32,
                      borderRadius: 2,
                      boxShadow: '0 2px 8px rgba(34,197,94,0.2)'
                    }} 
                  />
                </Stack>
              </Stack>

              {/* Swipe action overlay khi kéo mạnh */}
              {(Math.abs(dragX) > 80) && (
                <Box sx={{ 
                  position: 'absolute', 
                  left: '50%', 
                  top: '50%', 
                  transform: `translate(-50%, -50%) rotate(${Math.max(-12, Math.min(12, dragX / 10))}deg) scale(${Math.min(1.2, Math.abs(dragX) / 100)})`, 
                  background: dragX > 0 
                    ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' 
                    : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', 
                  color: '#fff', 
                  borderRadius: 4, 
                  px: 3, 
                  py: 2, 
                  boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  fontWeight: 700,
                  fontSize: 16,
                  animation: 'pulse 0.5s ease-in-out infinite'
                }}>
                  {dragX > 0 ? (
                    <>
                      <CheckRoundedIcon sx={{ fontSize: 32 }} />
                      <Typography sx={{ fontWeight: 700, fontSize: 16 }}>NHẬN ĐƠN</Typography>
                    </>
                  ) : (
                    <>
                      <CloseRoundedIcon sx={{ fontSize: 32 }} />
                      <Typography sx={{ fontWeight: 700, fontSize: 16 }}>BỎ QUA</Typography>
                    </>
                  )}
                </Box>
              )}
            </Box>

            {/* Body - Chi tiết đơn hàng */}
            <Box sx={{ p: 3 }}>
              {/* Điểm lấy hàng */}
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mb: 2.5, position: 'relative' }}>
                <Box sx={{ 
                  width: 44, 
                  height: 44, 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(59,130,246,0.2)'
                }}>
                  <LocalMallIcon sx={{ color: '#1d4ed8', fontSize: 20 }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: 13, color: '#6b7280', fontWeight: 500, mb: 0.5 }}>
                    Lấy hàng tại
                  </Typography>
                  <Typography sx={{ fontSize: 17, fontWeight: 700, color: '#111827', mb: 0.5 }}>
                    {order.pickupName}
                  </Typography>
                  <Typography sx={{ fontSize: 14, color: '#6b7280', lineHeight: 1.5 }}>
                    {order.pickupAddr}
                  </Typography>
                </Box>
              </Box>

              {/* Đường kết nối */}
              <Box sx={{ 
                width: 3, 
                height: 24, 
                background: 'linear-gradient(180deg, #3b82f6 0%, #ff6b35 100%)',
                ml: 2.6,
                mb: 1.5,
                borderRadius: 2
              }} />

              {/* Điểm giao hàng */}
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mb: 3 }}>
                <Box sx={{ 
                  width: 44, 
                  height: 44, 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(255,107,53,0.2)'
                }}>
                  <PlaceIcon sx={{ color: '#c2410c', fontSize: 22 }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: 13, color: '#6b7280', fontWeight: 500, mb: 0.5 }}>
                    Giao đến
                  </Typography>
                  <Typography sx={{ fontSize: 17, fontWeight: 700, color: '#111827', mb: 0.5 }}>
                    {order.dropName}
                  </Typography>
                  <Typography sx={{ fontSize: 14, color: '#6b7280', lineHeight: 1.5 }}>
                    {order.dropAddr}
                  </Typography>
                </Box>
              </Box>

              {/* Stats cards đẹp hơn */}
              <Stack direction="row" spacing={1.5} sx={{ mb: 3 }}>
                {[
                  { icon: <PlaceIcon />, label: 'Khoảng cách', value: `${order.distance} km`, color: '#3b82f6' },
                  { icon: <AccessTimeIcon />, label: 'Thời gian', value: order.eta, color: '#8b5cf6' },
                  { icon: <ScaleIcon />, label: 'Khối lượng', value: order.weight, color: '#06b6d4' },
                ].map((item, idx) => (
                  <Box 
                    key={idx}
                    sx={{ 
                      flex: 1, 
                      background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
                      border: '1px solid rgba(0,0,0,0.06)',
                      borderRadius: 3,
                      px: 1.5,
                      py: 2,
                      textAlign: 'center',
                      transition: 'all 0.2s ease',
                      '&:hover': { 
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                      }
                    }}
                  >
                    <Box sx={{ 
                      color: item.color, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      mb: 0.75 
                    }}>
                      {React.cloneElement(item.icon, { sx: { fontSize: 20 } })}
                    </Box>
                    <Typography sx={{ fontSize: 11, color: '#6b7280', fontWeight: 500, mb: 0.5 }}>
                      {item.label}
                    </Typography>
                    <Typography sx={{ fontSize: 15, color: '#111827', fontWeight: 800 }}>
                      {item.value}
                    </Typography>
                  </Box>
                ))}
              </Stack>

              {/* Thu hộ - highlight */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                background: 'linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%)',
                borderRadius: 4,
                px: 3,
                py: 2.5,
                border: '2px solid rgba(255,107,53,0.2)',
                boxShadow: '0 4px 16px rgba(255,107,53,0.15)'
              }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #ff6b35 0%, #ff5722 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(255,107,53,0.3)'
                  }}>
                    <AttachMoneyIcon sx={{ color: '#fff', fontSize: 22 }} />
                  </Box>
                  <Typography sx={{ fontSize: 15, color: '#c2410c', fontWeight: 600 }}>
                    Thu hộ
                  </Typography>
                </Stack>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography sx={{ fontSize: 24, color: '#c2410c', fontWeight: 900, lineHeight: 1 }}>
                    {order.cod.toLocaleString()}đ
                  </Typography>
                  <Typography sx={{ fontSize: 13, color: '#16a34a', fontWeight: 700, mt: 0.5 }}>
                    +{order.bonus.toLocaleString()}đ thưởng
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Hướng dẫn swipe */}
        <Box sx={{ textAlign: 'center', mt: 2, px: 2 }}>
          <Typography sx={{ 
            color: '#9ca3af', 
            fontWeight: 600,
            fontSize: 15,
            mb: 1.5,
            letterSpacing: '0.5px'
          }}>
            👆 Vuốt để chọn đơn hàng
          </Typography>
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <Box sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(239,68,68,0.3)'
              }}>
                <CloseRoundedIcon sx={{ color: '#fff', fontSize: 18 }} />
              </Box>
              <Typography sx={{ color: '#ef4444', fontWeight: 700, fontSize: 14 }}>
                Bỏ qua
              </Typography>
            </Stack>

            <Box sx={{ 
              width: 80, 
              height: 8, 
              borderRadius: 4,
              background: 'linear-gradient(90deg, #ef4444 0%, #e5e7eb 50%, #22c55e 100%)',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }
            }} />

            <Stack direction="row" spacing={0.75} alignItems="center">
              <Typography sx={{ color: '#22c55e', fontWeight: 700, fontSize: 14 }}>
                Nhận đơn
              </Typography>
              <Box sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(34,197,94,0.3)'
              }}>
                <CheckRoundedIcon sx={{ color: '#fff', fontSize: 18 }} />
              </Box>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Fade>
  );
};

// Trang Đơn hàng đang hoạt động (đổi tên từ AvailableOrders)
const ActiveOrder = () => {
  const { availableOrders, setAvailableOrders, setCurrentOrder } = useShipper();
  const navigate = useNavigate();

  const queue = availableOrders;

  const handleRejected = () => {
    setAvailableOrders((q) => q.slice(1));
  };

  const handleAccepted = (order) => {
    // Đánh dấu đơn hiện tại và loại khỏi hàng đợi để không xuất hiện lại
    setCurrentOrder(order);
    setAvailableOrders((q) => q.filter((o) => o.id !== order.id));
  };

  // Khi hết đơn, tự chuyển về home sau 300ms (hiển thị thông báo ngắn)
  React.useEffect(() => {
    if (queue.length === 0) {
      const t = setTimeout(() => navigate('/shipper/home'), 300);
      return () => clearTimeout(t);
    }
  }, [queue.length, navigate]);

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fff5f2 0%, #f0f9ff 50%, #fef3c7 100%)',
      pb: 12
    }}>
      {/* Header đẹp hơn */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #ff6b35 0%, #ff5722 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          transform: 'translate(30%, -30%)'
        }
      }}>
        <Fade in timeout={600}>
          <Box
            sx={{
              maxWidth: 480,
              mx: 'auto',
              borderBottomLeftRadius: 32,
              borderBottomRightRadius: 32,
              color: '#fff',
              px: 3,
              pt: 3,
              pb: 3,
              boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
              position: 'relative',
              zIndex: 1
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography sx={{ 
                  fontSize: 15, 
                  opacity: 0.9,
                  fontWeight: 500,
                  mb: 0.5,
                  letterSpacing: '0.5px'
                }}>
                  Xin chào 👋
                </Typography>
                <Typography sx={{ 
                  fontSize: 24, 
                  fontWeight: 800,
                  letterSpacing: '0.5px'
                }}>
                  Đơn hàng khả dụng
                </Typography>
              </Box>
              <Box sx={{ 
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                borderRadius: 3,
                px: 2.5,
                py: 1.5,
                border: '1px solid rgba(255,255,255,0.3)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <Typography sx={{ fontSize: 12, opacity: 0.9, fontWeight: 500, mb: 0.25 }}>
                  Còn lại
                </Typography>
                <Typography sx={{ fontSize: 22, fontWeight: 800, letterSpacing: '1px' }}>
                  {queue.length} đơn
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Fade>
      </Box>

      {/* Content area */}
      <Box sx={{ mt: -4, position: 'relative', zIndex: 2 }}>
        {queue.length > 0 ? (
          <Box sx={{ mt: 6 }}>
            <SwipeOrderCard order={queue[0]} onRejected={handleRejected} onAccepted={handleAccepted} />
          </Box>
        ) : (
          <Fade in timeout={600}>
            <Box sx={{ 
              maxWidth: 400, 
              mx: 'auto', 
              mt: 12,
              px: 3, 
              textAlign: 'center'
            }}>
              <Box sx={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
                fontSize: 48,
                boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
              }}>
                📦
              </Box>
              <Typography sx={{ 
                fontSize: 20, 
                fontWeight: 700, 
                color: '#374151',
                mb: 1.5
              }}>
                Đã hết đơn hàng khả dụng
              </Typography>
              <Typography sx={{ 
                fontSize: 15, 
                color: '#6b7280',
                lineHeight: 1.6,
                mb: 2
              }}>
                Đang chuyển về Trang chủ để quét đơn mới...
              </Typography>
              <Box sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                border: '3px solid #e5e7eb',
                borderTopColor: '#ff6b35',
                animation: 'spin 1s linear infinite',
                mx: 'auto',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' }
                }
              }} />
            </Box>
          </Fade>
        )}
      </Box>
    </Box>
  );
};

export default ActiveOrder;


