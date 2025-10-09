import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Stack, Typography, IconButton, Button } from '@mui/material';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import CloseIcon from '@mui/icons-material/Close';
import { useShipper } from '@/hooks/useShipper';

// Trang Home Shipper theo thiết kế Figma: nền lưới + thẻ trạng thái + nút bật kết nối
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
        minHeight: 'calc(100vh - 64px)', // chừa chỗ cho thanh tab dưới trong layout
        px: 2,
        pt: 2,
        // Nền lưới với gradient nhẹ giống bản thiết kế
        backgroundImage: `
          linear-gradient(120deg, rgba(0,201,80,0.08), rgba(255,107,53,0.08)),
          repeating-linear-gradient(0deg, rgba(107,114,128,0.15) 0, rgba(107,114,128,0.15) 1px, transparent 1px, transparent 52px),
          repeating-linear-gradient(90deg, rgba(107,114,128,0.15) 0, rgba(107,114,128,0.15) 1px, transparent 1px, transparent 32.75px)
        `,
        backgroundSize: 'cover, auto, auto',
        backgroundPosition: 'center',
      }}
    >
      {/* Thẻ trạng thái */}
      <Paper
        elevation={6}
        sx={{
          borderRadius: 3,
          px: 2,
          py: 1.5,
          width: '100%',
          maxWidth: 361,
          mx: 'auto',
          backdropFilter: 'blur(2px)',
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                backgroundColor: online ? '#dcfce7' : '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PowerSettingsNewIcon sx={{ color: online ? '#16a34a' : '#6B7280' }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 12, lineHeight: '16px', color: '#6a7282' }}>Trạng thái</Typography>
              <Typography sx={{ fontSize: 16, lineHeight: '24px', color: online ? '#00a63e' : '#4a5565' }}>
                {online ? 'Đang hoạt động' : 'Offline'}
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: 9999,
                backgroundColor: online ? '#22c55e' : '#99a1af',
              }}
            />
            <IconButton size="small">
              <MoreHorizIcon sx={{ color: '#6B7280' }} />
            </IconButton>
          </Stack>
        </Stack>
      </Paper>

      {/* Marker & hiệu ứng khi online */}
      {online && (
        <>
          {/* Vị trí hiện tại (vòng tròn xanh có viền trắng) */}
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              top: '48%',
              transform: 'translate(-50%, -50%)',
              // Định nghĩa keyframes ripple tại container để dùng cho các vòng
              '@keyframes pulseRing': {
                '0%': { transform: 'translate(-50%, -50%) scale(0.6)', opacity: 0.6 },
                '70%': { transform: 'translate(-50%, -50%) scale(2.2)', opacity: 0.05 },
                '100%': { transform: 'translate(-50%, -50%) scale(2.4)', opacity: 0 },
              },
            }}
          >
            {/* Ripple rings */}
            {rippleActive && [0, 1, 2].map((r) => (
              <Box
                key={r}
                sx={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: 120,
                  height: 120,
                  borderRadius: '9999px',
                  border: '3px solid rgba(59,130,246,0.35)',
                  animation: 'pulseRing 1.6s ease-out both',
                  animationDelay: `${r * 200}ms`,
                }}
              />
            ))}
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '9999px',
                border: '4px solid #ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 0 1.5px rgba(81,162,255,0.5)',
                background: 'rgba(81,162,255,0.4)',
                backdropFilter: 'blur(2px)',
              }}
            >
              <Box sx={{ width: 24, height: 24, borderRadius: '9999px', background: '#3b82f6' }} />
            </Box>
          </Box>

          {/* Marker đơn hàng (icon) hiển thị dần */}
          {orderPoints.map((p, i) => (
            <Box key={i} sx={{ position: 'absolute', left: p.x, top: p.y, transform: 'translate(-50%, -50%)' }}>
              {i < visibleIcons && (
                <>
                  <Box sx={{ width: 28, height: 28, borderRadius: '9999px', background: 'rgba(255,137,4,0.35)', filter: 'blur(6px)' }} />
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '9999px',
                      background: '#ff6b35',
                      border: '2px solid #fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mt: '-30px',
                      boxShadow: '0 6px 14px rgba(0,0,0,0.15)',
                      transform: 'scale(0.8)',
                      opacity: 0,
                      animation: 'fadeInIcon 300ms ease-out forwards',
                    }}
                  >
                    <LocalMallIcon sx={{ color: '#fff', fontSize: 18 }} />
                  </Box>
                </>
              )}
            </Box>
          ))}
          {/* Keyframes cho icon */}
          <Box sx={{ display: 'none', '@keyframes fadeInIcon': { from: { transform: 'scale(0.8)', opacity: 0 }, to: { transform: 'scale(1)', opacity: 1 } } }} />
        </>
      )}

      {/* Nút bật kết nối ở giữa màn hình */}
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 180, // đặt thấp hơn để không đè lên thanh điều hướng
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Button
          onClick={() => {
            setIsOnline(!online);
          }}
          startIcon={<PowerSettingsNewIcon />}
          sx={{
            px: 3,
            height: 48,
            borderRadius: 2,
            color: '#ffffff',
            textTransform: 'none',
            fontSize: 16,
            background: online
              ? 'linear-gradient(90deg, #fb2c36, #e7000b)'
              : 'linear-gradient(90deg, #00c950, #00a63e)',
            boxShadow: '0px 25px 50px -12px rgba(0,0,0,0.25)',
            '&:hover': {
              background: online
                ? 'linear-gradient(90deg, #ef2530, #d60009)'
                : 'linear-gradient(90deg, #01ba4b, #019c3a)',
            },
          }}
        >
          {online ? 'Ngắt kết nối' : 'Bật kết nối'}
        </Button>
      </Box>

      

      {/* Modal đơn hàng mới khi đã bật kết nối (theo Figma 2:988) */}
      {online && showIncomingOrder && (
        <Box
          sx={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1300,
          }}
          onClick={() => setShowIncomingOrder(false)}
        >
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{
              width: 340,
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: '0px 25px 50px -12px rgba(0,0,0,0.25)',
              background: '#fff',
            }}
          >
            {/* Header cam */}
            <Box
              sx={{
                height: 124,
                background: 'linear-gradient(90deg, #ff6b35, #f54900)',
                px: 2,
                pt: 2,
                color: '#fff',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography sx={{ fontSize: 12, opacity: 0.8 }}>Đơn hàng mới</Typography>
                  <Typography sx={{ fontSize: 20, fontWeight: 700 }}>#DH001</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ background: '#fdc700', color: '#733e0a', borderRadius: 1, px: 1, py: 0.25, fontSize: 12 }}>Gấp</Box>
                  <IconButton size="small" onClick={() => setShowIncomingOrder(false)} sx={{ color: '#fff' }}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
              <Box
                sx={{
                  mt: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  background: 'rgba(255,255,255,0.10)',
                  borderRadius: 1.25,
                  height: 36,
                  px: 1.5,
                }}
              >
                <Box sx={{ width: 16, height: 16, borderRadius: '50%', background: '#fff' }} />
                <Typography sx={{ fontSize: 14, color: '#fff' }}>Tự động đóng sau {countdown}s</Typography>
              </Box>
            </Box>

            {/* Nội dung */}
            <Box sx={{ p: 2 }}>
              {/* Lấy hàng */}
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', mb: 1 }}>
                <Box sx={{ width: 32, height: 32, borderRadius: 9999, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
                <Box>
                  <Typography sx={{ fontSize: 12, color: '#6a7282' }}>Lấy hàng</Typography>
                  <Typography sx={{ fontSize: 14, color: '#1e2939' }}>Nhà hàng Phở 24</Typography>
                  <Typography sx={{ fontSize: 12, color: '#4a5565' }}>123 Nguyễn Huệ, Q.1</Typography>
                </Box>
              </Box>
              {/* Giao hàng */}
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', mb: 1.5 }}>
                <Box sx={{ width: 32, height: 32, borderRadius: 9999, background: '#ffedd4', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
                <Box>
                  <Typography sx={{ fontSize: 12, color: '#6a7282' }}>Giao hàng</Typography>
                  <Typography sx={{ fontSize: 14, color: '#1e2939' }}>Nguyễn Văn A</Typography>
                  <Typography sx={{ fontSize: 12, color: '#4a5565' }}>456 Lê Lợi, Q.3</Typography>
                </Box>
              </Box>

              {/* Chỉ số nhanh */}
              <Box sx={{ display: 'flex', gap: 1, borderTop: '1px solid rgba(0,0,0,0.1)', pt: 1.5, mb: 1.5 }}>
                {[
                  { label: 'Khoảng cách', value: '3.5 km' },
                  { label: 'Thời gian', value: '15-20 phút' },
                  { label: 'Khối lượng', value: '2kg' },
                ].map((m) => (
                  <Box key={m.label} sx={{ background: '#f9fafb', borderRadius: 1.25, px: 1, py: 1, flex: 1, textAlign: 'center' }}>
                    <Typography sx={{ fontSize: 12, color: '#6a7282' }}>{m.label}</Typography>
                    <Typography sx={{ fontSize: 14, color: '#111827' }}>{m.value}</Typography>
                  </Box>
                ))}
              </Box>

              {/* Thu hộ */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f0fdf4', borderRadius: 1.25, px: 1.5, height: 52, mb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 20, height: 20, borderRadius: '50%', background: '#22c55e' }} />
                  <Typography sx={{ fontSize: 14, color: '#364153' }}>Thu hộ</Typography>
                </Box>
                <Typography sx={{ fontSize: 18, color: '#00a63e' }}>45.000đ</Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="outlined" color="inherit" onClick={() => setShowIncomingOrder(false)} sx={{ flex: 1, height: 48, borderRadius: 1.75 }}>
                  Không nhận
                </Button>
                <Button onClick={() => {
                  // Đóng popup trước, đảm bảo có đơn rồi điều hướng sang trang nhận đơn
                  setShowIncomingOrder(false);
                  // Nếu danh sách đơn rỗng (trường hợp vừa hết), reset lại để tránh lỗi
                  setTimeout(() => {
                    if (!online) setIsOnline(true);
                    resetAvailableOrders();
                    navigate('/shipper/available');
                  }, 50);
                }} sx={{ flex: 1, height: 48, background: '#ff6b35', color: '#fff', borderRadius: 1.75, '&:hover': { background: '#f0602e' } }}>
                  Xem chi tiết đơn hàng
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Home;


