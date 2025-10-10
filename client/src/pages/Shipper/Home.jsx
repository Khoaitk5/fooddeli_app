import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Stack, Typography, IconButton, Button, Fade, Slide, Zoom } from '@mui/material';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import CloseIcon from '@mui/icons-material/Close';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import { useShipper } from '@/hooks/useShipper';

// Trang Home Shipper - Thiết kế responsive đẹp cho mobile
const Home = () => {
  const navigate = useNavigate();
  const { isOnline, setIsOnline, resetAvailableOrders } = useShipper();
  const online = isOnline;
  const [showIncomingOrder, setShowIncomingOrder] = React.useState(false);
  const [rippleActive, setRippleActive] = React.useState(false);
  const [visibleIcons, setVisibleIcons] = React.useState(0);
  const [orderPoints, setOrderPoints] = React.useState([]);
  const [countdown, setCountdown] = React.useState(28);
  const [iconsDone, setIconsDone] = React.useState(false);

  const timersRef = React.useRef({ ripple: null, iconInterval: null, afterIcons: null, countdown: null, respawn: null });

  // Khi bật online: ripple -> icon xuất hiện tuần tự -> popup đơn hàng mới
  React.useEffect(() => {
    const clearTimers = () => {
      const { ripple, iconInterval, afterIcons, countdown, respawn } = timersRef.current;
      if (ripple) clearTimeout(ripple);
      if (iconInterval) clearInterval(iconInterval);
      if (afterIcons) clearTimeout(afterIcons);
      if (countdown) clearInterval(countdown);
      if (respawn) clearTimeout(respawn);
      timersRef.current = { ripple: null, iconInterval: null, afterIcons: null, countdown: null, respawn: null };
    };

    if (!online) {
      clearTimers();
      setRippleActive(false);
      setVisibleIcons(0);
      setShowIncomingOrder(false);
      return;
    }

    // Bắt đầu ripple
    setShowIncomingOrder(false);
    setVisibleIcons(0);
    setRippleActive(true);
    setIconsDone(false);

    // Kết thúc ripple sau 1.6s rồi bắt đầu hiện icon
    timersRef.current.ripple = setTimeout(() => {
      setRippleActive(false);
      // Tạo vị trí ngẫu nhiên cho các icon (tránh vùng nút bật kết nối)
      const generated = generateRandomPoints(3);
      setOrderPoints(generated);
      // Stagger icon mỗi 400ms
      let index = 0;
      setVisibleIcons(0);
      timersRef.current.iconInterval = setInterval(() => {
        index += 1;
        setVisibleIcons((v) => {
          const next = Math.min(generated.length, Math.max(v, index));
          if (next >= generated.length) {
            if (timersRef.current.iconInterval) clearInterval(timersRef.current.iconInterval);
            // Sau khi hiện xong icon, chờ 600ms rồi hiện popup
            setIconsDone(true);
            timersRef.current.afterIcons = setTimeout(() => setShowIncomingOrder(true), 600);
          }
          return next;
        });
      }, 400);
    }, 1600);

    return () => {
      clearTimers();
    };
  }, [online]);

  // Đếm ngược tự động đóng popup đơn hàng mới
  React.useEffect(() => {
    // dọn timer cũ
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
          // về 0: đóng popup và clear interval
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

  // Sau khi đóng/không nhận đơn: bật lại popup mới sau 5-10s nếu vẫn online và đã hoàn tất sequence icon
  React.useEffect(() => {
    if (!online) {
      if (timersRef.current.respawn) {
        clearTimeout(timersRef.current.respawn);
        timersRef.current.respawn = null;
      }
      return;
    }
    if (!showIncomingOrder && iconsDone) {
      if (timersRef.current.respawn) clearTimeout(timersRef.current.respawn);
      const delay = 5000 + Math.floor(Math.random() * 5000); // 5s .. 10s
      timersRef.current.respawn = setTimeout(() => {
          setShowIncomingOrder(true);
          // tự reset danh sách đơn sau 10s nếu vẫn online (giả lập quét)
          timersRef.current.respawn = setTimeout(() => {
            if (online) resetAvailableOrders();
          }, 10000);
      }, delay);
    } else {
      if (timersRef.current.respawn) {
        clearTimeout(timersRef.current.respawn);
        timersRef.current.respawn = null;
      }
    }
    return () => {
      if (timersRef.current.respawn) {
        clearTimeout(timersRef.current.respawn);
        timersRef.current.respawn = null;
      }
    };
  }, [online, showIncomingOrder, iconsDone, resetAvailableOrders]);

  // Sinh ngẫu nhiên các điểm icon trên "bản đồ" theo phần trăm, tránh trùng nút kết nối ở đáy giữa
  const generateRandomPoints = (count) => {
    const points = [];
    const minGapPct = 10; // khoảng cách tối thiểu giữa các icon theo %

    // Vùng cấm: khu vực nút bật kết nối (bottom ~180px). Chuyển đổi tương đối bằng % theo giả định chiều cao hiển thị
    // Ta sẽ tránh vùng từ 70%-100% theo trục Y và 35%-65% theo trục X để không đè lên nút ở giữa dưới
    const isInForbidden = (xPct, yPct) => xPct >= 35 && xPct <= 65 && yPct >= 70;

    const isFarEnough = (xPct, yPct) => points.every((p) => {
      const dx = xPct - p.x;
      const dy = yPct - p.y;
      return Math.hypot(dx, dy) >= minGapPct;
    });

    let safety = 0;
    while (points.length < count && safety < 500) {
      safety += 1;
      const x = Math.round(10 + Math.random() * 80); // 10% .. 90%
      const y = Math.round(10 + Math.random() * 60); // 10% .. 70% (tránh phần dưới nhiều)
      if (isInForbidden(x, y)) continue;
      if (!isFarEnough(x, y)) continue;
      points.push({ x, y });
    }
    // fallback nếu chưa đủ, nới lỏng
    while (points.length < count) {
      const x = Math.round(5 + Math.random() * 90);
      const y = Math.round(5 + Math.random() * 80);
      if (isInForbidden(x, y)) continue;
      points.push({ x, y });
    }

    // chuyển sang dạng chuỗi % để dùng trực tiếp
    return points.map((p) => ({ x: `${p.x}%`, y: `${p.y}%` }));
  };

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
        // Nền gradient động với animation
        background: online 
          ? 'linear-gradient(135deg, #fff5f2 0%, #f0f9ff 50%, #fef3c7 100%)'
          : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        transition: 'background 0.5s ease',
        // Grid pattern overlay
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            repeating-linear-gradient(0deg, rgba(148,163,184,0.08) 0px, rgba(148,163,184,0.08) 1px, transparent 1px, transparent 40px),
            repeating-linear-gradient(90deg, rgba(148,163,184,0.08) 0px, rgba(148,163,184,0.08) 1px, transparent 1px, transparent 40px)
          `,
          pointerEvents: 'none',
          opacity: online ? 1 : 0.5,
          transition: 'opacity 0.3s ease'
        }
      }}
    >
      {/* Container chính */}
      <Box sx={{ position: 'relative', zIndex: 1, px: 2.5, pt: 3, pb: 12 }}>
        {/* Thẻ trạng thái - Responsive design */}
        <Fade in timeout={600}>
          <Paper
            elevation={online ? 8 : 2}
            sx={{
              borderRadius: 4,
              p: 2.5,
              mx: 'auto',
              maxWidth: 400,
              background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
              border: online ? '2px solid rgba(34,197,94,0.2)' : '1px solid rgba(0,0,0,0.08)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              transform: online ? 'scale(1.02)' : 'scale(1)',
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
                      ? 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)' 
                      : 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    boxShadow: online ? '0 4px 12px rgba(34,197,94,0.2)' : 'none',
                    transition: 'all 0.3s ease',
                    // Pulse animation khi online
                    ...(online && {
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: -4,
                        borderRadius: 3,
                        background: 'rgba(34,197,94,0.2)',
                        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                      }
                    })
                  }}
                >
                  <PowerSettingsNewIcon sx={{ 
                    color: online ? '#16a34a' : '#6B7280',
                    fontSize: 28
                  }} />
                </Box>
                <Box>
                  <Typography sx={{ 
                    fontSize: 13, 
                    lineHeight: '18px', 
                    color: '#6b7280',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Trạng thái
                  </Typography>
                  <Typography sx={{ 
                    fontSize: 18, 
                    lineHeight: '28px', 
                    fontWeight: 700,
                    color: online ? '#00a63e' : '#4a5565',
                    transition: 'color 0.3s ease'
                  }}>
                    {online ? 'Đang hoạt động' : 'Offline'}
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Box
                  sx={{
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    backgroundColor: online ? '#22c55e' : '#99a1af',
                    boxShadow: online ? '0 0 12px rgba(34,197,94,0.5)' : 'none',
                    transition: 'all 0.3s ease',
                  }}
                />
                <IconButton size="small" sx={{ color: '#6B7280' }}>
                  <MoreHorizIcon />
                </IconButton>
              </Stack>
            </Stack>
          </Paper>
        </Fade>

        {/* Map view area với markers */}
        <Box sx={{ 
          position: 'relative', 
          minHeight: '50vh',
          mt: 3,
          mb: 20
        }}>
          {online && (
            <>
              {/* Vị trí hiện tại của shipper - animated */}
              <Zoom in={online} timeout={600}>
                <Box
                  sx={{
                    position: 'absolute',
                    left: '50%',
                    top: '40%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10,
                    '@keyframes pulseRing': {
                      '0%': { transform: 'translate(-50%, -50%) scale(0.6)', opacity: 0.6 },
                      '70%': { transform: 'translate(-50%, -50%) scale(2.5)', opacity: 0.05 },
                      '100%': { transform: 'translate(-50%, -50%) scale(2.8)', opacity: 0 },
                    },
                  }}
                >
                  {/* Ripple rings - mượt hơn */}
                  {rippleActive && [0, 1, 2].map((r) => (
                    <Box
                      key={r}
                      sx={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        width: 140,
                        height: 140,
                        borderRadius: '50%',
                        border: '4px solid rgba(59,130,246,0.4)',
                        animation: 'pulseRing 1.8s cubic-bezier(0.4, 0, 0.2, 1) both',
                        animationDelay: `${r * 250}ms`,
                      }}
                    />
                  ))}
                  {/* Icon shipper */}
                  <Box
                    sx={{
                      width: 72,
                      height: 72,
                      borderRadius: '50%',
                      border: '4px solid #ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 8px 24px rgba(59,130,246,0.3), 0 0 0 2px rgba(59,130,246,0.2)',
                      background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                      backdropFilter: 'blur(4px)',
                      position: 'relative',
                    }}
                  >
                    <TwoWheelerIcon sx={{ 
                      fontSize: 32, 
                      color: '#fff',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                    }} />
                  </Box>
                </Box>
              </Zoom>

              {/* Marker đơn hàng - Animated icons */}
              {orderPoints.map((p, i) => (
                <Zoom 
                  key={i} 
                  in={i < visibleIcons} 
                  timeout={400}
                  style={{ transitionDelay: `${i * 150}ms` }}
                >
                  <Box sx={{ 
                    position: 'absolute', 
                    left: p.x, 
                    top: p.y, 
                    transform: 'translate(-50%, -50%)',
                    zIndex: 5
                  }}>
                    {/* Glow effect */}
                    <Box sx={{ 
                      position: 'absolute',
                      width: 48, 
                      height: 48, 
                      borderRadius: '50%', 
                      background: 'radial-gradient(circle, rgba(255,107,53,0.4) 0%, transparent 70%)',
                      filter: 'blur(8px)',
                      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                      animationDelay: `${i * 300}ms`,
                      transform: 'translate(-50%, -50%)',
                      left: '50%',
                      top: '50%'
                    }} />
                    {/* Icon marker */}
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #ff6b35 0%, #ff5722 100%)',
                        border: '3px solid #fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 6px 20px rgba(255,107,53,0.4)',
                        position: 'relative',
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease',
                        '&:hover': {
                          transform: 'scale(1.15)'
                        }
                      }}
                    >
                      <LocalMallIcon sx={{ color: '#fff', fontSize: 22 }} />
                      {/* Badge số đơn */}
                      <Box sx={{
                        position: 'absolute',
                        top: -4,
                        right: -4,
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        background: '#00c950',
                        border: '2px solid #fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 10,
                        fontWeight: 700,
                        color: '#fff'
                      }}>
                        {i + 1}
                      </Box>
                    </Box>
                  </Box>
                </Zoom>
              ))}
            </>
          )}
        </Box>

        {/* Nút bật kết nối - Fixed bottom, responsive */}
        <Box
          sx={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 100,
            display: 'flex',
            justifyContent: 'center',
            px: 3,
            zIndex: 100,
          }}
        >
          <Slide direction="up" in timeout={800}>
            <Button
              onClick={() => {
                setIsOnline(!online);
              }}
              startIcon={<PowerSettingsNewIcon sx={{ fontSize: 24 }} />}
              sx={{
                minWidth: 280,
                height: 60,
                borderRadius: 4,
                color: '#ffffff',
                textTransform: 'none',
                fontSize: 17,
                fontWeight: 700,
                letterSpacing: '0.5px',
                background: online
                  ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                  : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                boxShadow: online 
                  ? '0 12px 40px rgba(239,68,68,0.4), 0 4px 12px rgba(0,0,0,0.1)'
                  : '0 12px 40px rgba(34,197,94,0.4), 0 4px 12px rgba(0,0,0,0.1)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: 'scale(1)',
                '&:hover': {
                  transform: 'scale(1.05)',
                  background: online
                    ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
                    : 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                  boxShadow: online
                    ? '0 16px 48px rgba(239,68,68,0.5)'
                    : '0 16px 48px rgba(34,197,94,0.5)',
                },
                '&:active': {
                  transform: 'scale(0.98)',
                },
              }}
            >
              {online ? 'Ngắt kết nối' : 'Bật kết nối'}
            </Button>
          </Slide>
        </Box>
      </Box>

      {/* Global keyframes */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>


      {/* Modal đơn hàng mới - Responsive design */}
      {online && showIncomingOrder && (
        <Fade in={showIncomingOrder}>
          <Box
            sx={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1300,
              px: 2,
            }}
            onClick={() => setShowIncomingOrder(false)}
          >
            <Slide direction="up" in={showIncomingOrder} timeout={400}>
              <Box
                onClick={(e) => e.stopPropagation()}
                sx={{
                  width: '100%',
                  maxWidth: 420,
                  borderRadius: 5,
                  overflow: 'hidden',
                  boxShadow: '0 24px 48px rgba(0,0,0,0.3)',
                  background: '#fff',
                }}
              >
                {/* Header gradient đẹp */}
                <Box
                  sx={{
                    background: 'linear-gradient(135deg, #ff6b35 0%, #ff5722 100%)',
                    px: 3,
                    pt: 3,
                    pb: 2.5,
                    color: '#fff',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: 200,
                      height: 200,
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.1)',
                      transform: 'translate(50%, -50%)',
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5, position: 'relative', zIndex: 1 }}>
                    <Box>
                      <Typography sx={{ fontSize: 13, opacity: 0.9, letterSpacing: '0.5px', mb: 0.5 }}>
                        ĐƠN HÀNG MỚI
                      </Typography>
                      <Typography sx={{ fontSize: 24, fontWeight: 800 }}>
                        #DH001
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box sx={{ 
                        background: 'linear-gradient(135deg, #fde047 0%, #facc15 100%)', 
                        color: '#78350f', 
                        borderRadius: 2, 
                        px: 1.5, 
                        py: 0.5, 
                        fontSize: 13,
                        fontWeight: 700,
                        boxShadow: '0 2px 8px rgba(253,224,71,0.3)'
                      }}>
                        Gấp 🔥
                      </Box>
                      <IconButton 
                        size="small" 
                        onClick={() => setShowIncomingOrder(false)} 
                        sx={{ 
                          color: '#fff',
                          background: 'rgba(255,255,255,0.15)',
                          '&:hover': { background: 'rgba(255,255,255,0.25)' }
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Box>
                  
                  {/* Countdown timer đẹp hơn */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      background: 'rgba(255,255,255,0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: 3,
                      height: 48,
                      px: 2,
                      position: 'relative',
                      zIndex: 1,
                      border: '1px solid rgba(255,255,255,0.2)',
                    }}
                  >
                    <Box sx={{ 
                      width: 28, 
                      height: 28, 
                      borderRadius: '50%', 
                      background: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 14,
                      fontWeight: 700,
                      color: '#ff6b35'
                    }}>
                      {countdown}
                    </Box>
                    <Typography sx={{ fontSize: 15, color: '#fff', fontWeight: 600 }}>
                      Tự động đóng sau {countdown} giây
                    </Typography>
                  </Box>
                </Box>

                {/* Nội dung chi tiết */}
                <Box sx={{ p: 3 }}>
                  {/* Lấy hàng - với icon đẹp */}
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mb: 2.5 }}>
                    <Box sx={{ 
                      width: 44, 
                      height: 44, 
                      borderRadius: '50%', 
                      background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(34,197,94,0.2)',
                      flexShrink: 0
                    }}>
                      <LocalMallIcon sx={{ color: '#16a34a', fontSize: 20 }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontSize: 13, color: '#6b7280', fontWeight: 500, mb: 0.5 }}>
                        Lấy hàng tại
                      </Typography>
                      <Typography sx={{ fontSize: 16, color: '#111827', fontWeight: 700, mb: 0.5 }}>
                        Nhà hàng Phở 24
                      </Typography>
                      <Typography sx={{ fontSize: 14, color: '#6b7280', lineHeight: 1.5 }}>
                        123 Nguyễn Huệ, Quận 1, TP.HCM
                      </Typography>
                    </Box>
                  </Box>

                  {/* Connecting line */}
                  <Box sx={{ 
                    width: 2, 
                    height: 20, 
                    background: 'linear-gradient(180deg, #16a34a 0%, #ff6b35 100%)',
                    ml: 2.8,
                    mb: 1
                  }} />

                  {/* Giao hàng - với icon đẹp */}
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mb: 2.5 }}>
                    <Box sx={{ 
                      width: 44, 
                      height: 44, 
                      borderRadius: '50%', 
                      background: 'linear-gradient(135deg, #ffedd4 0%, #fed7aa 100%)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(255,107,53,0.2)',
                      flexShrink: 0
                    }}>
                      <LocalMallIcon sx={{ color: '#c2410c', fontSize: 20 }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontSize: 13, color: '#6b7280', fontWeight: 500, mb: 0.5 }}>
                        Giao đến
                      </Typography>
                      <Typography sx={{ fontSize: 16, color: '#111827', fontWeight: 700, mb: 0.5 }}>
                        Nguyễn Văn A
                      </Typography>
                      <Typography sx={{ fontSize: 14, color: '#6b7280', lineHeight: 1.5 }}>
                        456 Lê Lợi, Quận 3, TP.HCM
                      </Typography>
                    </Box>
                  </Box>

                  {/* Stats cards - Đẹp hơn */}
                  <Stack direction="row" spacing={1.5} sx={{ mb: 2.5 }}>
                    {[
                      { label: 'Khoảng cách', value: '3.5 km', icon: '📍' },
                      { label: 'Thời gian', value: '15-20p', icon: '⏱️' },
                      { label: 'Khối lượng', value: '2kg', icon: '📦' },
                    ].map((m) => (
                      <Box 
                        key={m.label} 
                        sx={{ 
                          background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
                          borderRadius: 3,
                          border: '1px solid rgba(0,0,0,0.06)',
                          px: 1.5,
                          py: 2,
                          flex: 1,
                          textAlign: 'center',
                          transition: 'transform 0.2s ease',
                          '&:hover': { transform: 'translateY(-2px)' }
                        }}
                      >
                        <Typography sx={{ fontSize: 18, mb: 0.5 }}>{m.icon}</Typography>
                        <Typography sx={{ fontSize: 11, color: '#6b7280', fontWeight: 500, mb: 0.25 }}>
                          {m.label}
                        </Typography>
                        <Typography sx={{ fontSize: 15, color: '#111827', fontWeight: 700 }}>
                          {m.value}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>

                  {/* Thu hộ - Highlight */}
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                    borderRadius: 3,
                    px: 2.5,
                    py: 2,
                    mb: 3,
                    border: '1.5px solid rgba(34,197,94,0.2)',
                    boxShadow: '0 4px 12px rgba(34,197,94,0.1)'
                  }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box sx={{ 
                        width: 36, 
                        height: 36, 
                        borderRadius: '50%', 
                        background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 18
                      }}>
                        💰
                      </Box>
                      <Typography sx={{ fontSize: 15, color: '#15803d', fontWeight: 600 }}>
                        Thu hộ
                      </Typography>
                    </Stack>
                    <Typography sx={{ fontSize: 22, color: '#16a34a', fontWeight: 800 }}>
                      45.000đ
                    </Typography>
                  </Box>

                  {/* Action buttons - Đẹp hơn */}
                  <Stack direction="row" spacing={1.5}>
                    <Button 
                      variant="outlined" 
                      onClick={() => setShowIncomingOrder(false)} 
                      sx={{ 
                        flex: 1, 
                        height: 54,
                        borderRadius: 3,
                        borderColor: '#e5e7eb',
                        color: '#6b7280',
                        fontWeight: 600,
                        fontSize: 15,
                        textTransform: 'none',
                        '&:hover': { 
                          borderColor: '#d1d5db',
                          background: '#f9fafb'
                        }
                      }}
                    >
                      Không nhận
                    </Button>
                    <Button 
                      onClick={() => {
                        setShowIncomingOrder(false);
                        setTimeout(() => {
                          if (!online) setIsOnline(true);
                          resetAvailableOrders();
                          navigate('/shipper/available');
                        }, 50);
                      }} 
                      sx={{ 
                        flex: 2, 
                        height: 54,
                        background: 'linear-gradient(135deg, #ff6b35 0%, #ff5722 100%)',
                        color: '#fff',
                        borderRadius: 3,
                        fontWeight: 700,
                        fontSize: 15,
                        textTransform: 'none',
                        boxShadow: '0 8px 20px rgba(255,107,53,0.3)',
                        '&:hover': { 
                          background: 'linear-gradient(135deg, #ff5722 0%, #f4511e 100%)',
                          boxShadow: '0 12px 28px rgba(255,107,53,0.4)',
                        }
                      }}
                    >
                      Xem chi tiết đơn hàng
                    </Button>
                  </Stack>
                </Box>
              </Box>
            </Slide>
          </Box>
        </Fade>
      )}
    </Box>
  );
};

export default Home;


