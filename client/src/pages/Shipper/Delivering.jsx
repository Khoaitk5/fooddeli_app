import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Stack, Typography, Paper, Chip, Button, Divider } from '@mui/material';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import PlaceIcon from '@mui/icons-material/Place';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ScaleIcon from '@mui/icons-material/Scale';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import NavigationIcon from '@mui/icons-material/Navigation';
import { useShipper } from '@/hooks/useShipper';

// Trang Đang giao (Delivering) theo bố cục Figma
const Delivering = () => {
  const navigate = useNavigate();
  const { currentOrder, setCurrentOrder } = useShipper();

  // Mock dữ liệu đơn đang giao
  const order = React.useMemo(() => currentOrder || ({
    code: 'DH000',
    urgent: true,
    pickupName: 'Đang lấy...',
    pickupAddr: '---',
    dropName: '---',
    dropAddr: '---',
    distance: 0,
    eta: '---',
    weight: '---',
    cod: 0,
  }), [currentOrder]);

  const displayCode = React.useMemo(() => {
    if (order.code) return order.code;
    if (order.id != null) return `DH${String(order.id).padStart(3, '0')}`;
    return 'DH---';
  }, [order]);

  const handleCall = () => {
    console.log('call receiver');
  };
  const handleChat = () => {
    console.log('open chat');
  };
  const handleComplete = () => {
    // Sau khi hoàn thành chuyển tới trang nhận đơn để tiếp tục nhận
    setCurrentOrder(null);
    navigate('/shipper/available');
  };
  const handleOpenNavigation = () => {
    const origin = encodeURIComponent(order.pickupAddr);
    const destination = encodeURIComponent(order.dropAddr);
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
    window.open(url, '_blank');
  };

  return (
    <Box sx={{ pb: 3 }}>
      {/* Header trạng thái */}
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
            <Stack direction="row" alignItems="center" spacing={1.25}>
              <Box sx={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LocalMallIcon sx={{ color: '#fff', fontSize: 16 }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 12, opacity: 0.85 }}>Đang giao</Typography>
                <Typography sx={{ fontSize: 16, fontWeight: 800 }}>#{displayCode}</Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={1}>
              {order.urgent && (
                <Chip size="small" label="Gấp" sx={{ background: '#fdc700', color: '#733e0a', fontWeight: 700 }} />
              )}
              <Chip size="small" icon={<AccessTimeIcon sx={{ color: '#fff' }} fontSize="small" />} label={order.eta} sx={{ background: 'rgba(255,255,255,0.22)', color: '#fff' }} />
            </Stack>
          </Stack>
        </Box>
      </Box>

      {/* Bản đồ (placeholder) */}
      <Box sx={{ maxWidth: 390, mx: 'auto', px: 2.5 }}>
        <Box
          sx={{
            mt: 2,
            height: 180,
            borderRadius: 3,
            background: 'linear-gradient(180deg, #f3f4f6, #e5e7eb)',
            border: '1px dashed #cbd5e1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <NavigationIcon sx={{ color: '#9ca3af' }} />
          <Box sx={{ position: 'absolute', right: 12, bottom: 12 }}>
            <Chip size="small" label="Mở điều hướng" clickable onClick={handleOpenNavigation} sx={{ background: '#111827', color: '#fff' }} />
          </Box>
        </Box>

        {/* Điểm lấy và giao */}
        <Paper elevation={3} sx={{ mt: 2, borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ p: 1.75 }}>
            <Stack direction="row" spacing={1.5} alignItems="flex-start">
              <Box sx={{ width: 12, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: '#2b7fff', boxShadow: '0 0 0 4px #dbeafe' }} />
                <Box sx={{ width: 2, flex: 1, mt: 1, background: 'linear-gradient(#bedbff, #e5e7eb 50%, #ffd6a7)' }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 12, color: '#6a7282' }}>Lấy hàng</Typography>
                <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>{order.pickupName}</Typography>
                <Typography sx={{ fontSize: 14, color: '#4a5565' }}>{order.pickupAddr}</Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ mt: 1.5 }}>
              <PlaceIcon sx={{ color: '#ed6c66' }} fontSize="small" />
              <Box>
                <Typography sx={{ fontSize: 12, color: '#6a7282' }}>Giao đến</Typography>
                <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>{order.dropName}</Typography>
                <Typography sx={{ fontSize: 14, color: '#4a5565' }}>{order.dropAddr}</Typography>
              </Box>
            </Stack>
          </Box>
          <Divider />
          {/* Chỉ số nhanh */}
          <Box sx={{ p: 1.25 }}>
            <Stack direction="row" spacing={1}>
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
          </Box>
        </Paper>

        {/* Thu hộ COD */}
        <Box sx={{ mt: 2, background: '#f0fdf4', border: '1px solid #dcfce7', borderRadius: 2, px: 1.75, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ color: '#00a63e', fontWeight: 700 }}>Thu hộ</Typography>
          <Typography sx={{ color: '#00a63e', fontWeight: 800, fontSize: 18 }}>{order.cod.toLocaleString()}đ</Typography>
        </Box>
      </Box>

      {/* Thanh hành động dính dưới (chừa khoảng cho BottomActionBar của layout) */}
      <Box
        sx={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 80,
          zIndex: 1200,
        }}
      >
        <Box sx={{ maxWidth: 390, mx: 'auto', px: 2.5 }}>
          <Paper elevation={6} sx={{ borderRadius: 2, px: 1.25, py: 1 }}>
            <Stack direction="row" spacing={1.25} alignItems="center">
              <Button onClick={handleCall} startIcon={<PhoneInTalkIcon />} variant="outlined" color="inherit" sx={{ flex: 1, height: 44, borderRadius: 1.5 }}>
                Gọi
              </Button>
              <Button onClick={handleChat} startIcon={<ChatBubbleOutlineIcon />} variant="outlined" color="inherit" sx={{ flex: 1, height: 44, borderRadius: 1.5 }}>
                Chat
              </Button>
              <Button onClick={handleComplete} startIcon={<CheckCircleRoundedIcon />} sx={{ flex: 2, height: 44, borderRadius: 1.5, background: '#00a63e', color: '#fff', '&:hover': { background: '#019c3a' } }}>
                Hoàn thành giao
              </Button>
            </Stack>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Delivering;


