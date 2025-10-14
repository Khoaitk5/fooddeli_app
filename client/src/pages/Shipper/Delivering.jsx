import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Stack, Typography, Paper, Chip, Button, Fade, Slide, Zoom } from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import RoomIcon from '@mui/icons-material/Room';
import NavigationIcon from '@mui/icons-material/Navigation';
import InfoIcon from '@mui/icons-material/Info';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useShipper } from '@/hooks/useShipper';

// Trang Đang giao (Delivering) - Thiết kế mới từ Figma
const Delivering = () => {
  const navigate = useNavigate();
  const { currentOrder, setCurrentOrder } = useShipper();

  // State để quản lý trạng thái đơn hàng
  const [orderStatus, setOrderStatus] = React.useState('picking'); // picking | delivering | completed

  // Mock dữ liệu đơn đang giao
  const order = React.useMemo(() => {
    const baseOrder = currentOrder || {
      code: '001',
      pickupName: 'Nhà hàng Phở 24',
      pickupAddr: '123 Nguyễn Huệ, Q.1, TP.HCM',
      pickupContact: 'Nguyễn Văn A',
      pickupPhone: '0901234567',
      dropName: 'Nguyễn Thị B',
      dropAddr: '456 Lê Lợi, Q.3, TP.HCM',
      dropContact: 'Trần Thị B',
      dropPhone: '0907654321',
      distance: '3.5',
      weight: '2kg',
      cod: 45000,
      note: 'Gọi trước 10 phút khi đến. Không giao sau 9 giờ tối.',
    };
    
    return {
      ...baseOrder,
      status: orderStatus
    };
  }, [currentOrder, orderStatus]);

  const displayCode = `#DH${String(order.code).padStart(3, '0')}`;

  const handleCallPickup = () => {
    window.location.href = `tel:${order.pickupPhone}`;
  };

  const handleCallDrop = () => {
    window.location.href = `tel:${order.dropPhone}`;
  };

  const handleNavigatePickup = () => {
    const destination = encodeURIComponent(order.pickupAddr);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`, '_blank');
  };

  const handleNavigateDrop = () => {
    const destination = encodeURIComponent(order.dropAddr);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`, '_blank');
  };

  const handlePickedUp = () => {
    // Chuyển sang trạng thái đang giao
    setOrderStatus('delivering');
    // Cập nhật trong context nếu cần
    if (currentOrder) {
      setCurrentOrder({ ...currentOrder, status: 'delivering' });
    }
  };

  const handleCompleted = () => {
    // Hoàn thành đơn hàng
    setOrderStatus('completed');
    // Sau 1 giây chuyển về trang available
    setTimeout(() => {
      setCurrentOrder(null);
      navigate('/shipper/available');
    }, 1000);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fff5f2 0%, #f0f9ff 100%)',
      pb: 12
    }}>
      {/* Header với progress - Cải thiện responsive */}
      <Slide direction="down" in timeout={600}>
        <Box sx={{ 
          background: 'linear-gradient(135deg, #ff6b35 0%, #ff5722 100%)',
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
          pt: 3,
          pb: 3.5,
          px: 3,
          boxShadow: '0 16px 48px rgba(255,107,53,0.25)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: 250,
            height: 250,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            transform: 'translate(30%, -30%)'
          }
        }}>
          <Stack spacing={3} sx={{ position: 'relative', zIndex: 1 }}>
            {/* Mã đơn hàng - Cải thiện responsive */}
            <Fade in timeout={800}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ 
                  fontSize: 13, 
                  color: 'rgba(255,255,255,0.85)',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  fontWeight: 600,
                  mb: 1
                }}>
                  ĐƠN HÀNG ĐANG GIAO
                </Typography>
                <Typography sx={{ 
                  fontSize: 32, 
                  fontWeight: 900,
                  color: '#fff',
                  mb: 1.5,
                  letterSpacing: '1px',
                  textShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}>
                  {displayCode}
                </Typography>
                <Chip 
                  label={order.status === 'picking' ? '📦 Đang đến lấy hàng' : '🚚 Đang giao hàng'}
                  sx={{ 
                    background: 'rgba(255,255,255,0.25)',
                    backdropFilter: 'blur(10px)',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 13,
                    height: 36,
                    borderRadius: 3,
                    px: 2,
                    border: '1px solid rgba(255,255,255,0.3)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
              </Box>
            </Fade>

            {/* Progress bar - Cải thiện animations */}
            <Stack direction="row" spacing={0} alignItems="center" justifyContent="center">
            {/* Bước 1: Lấy hàng */}
            <Stack alignItems="center" spacing={1.5} sx={{ width: 64 }}>
              <Box sx={{
                width: 64,
                height: 64,
                borderRadius: 4,
                background: order.status === 'picking' ? '#fff' : 'rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: order.status === 'picking' ? '0px 25px 50px -12px rgba(0,0,0,0.25)' : 'none'
              }}>
                <RoomIcon sx={{ 
                  fontSize: 28, 
                  color: order.status === 'picking' ? '#ff6b35' : 'rgba(255,255,255,0.5)' 
                }} />
              </Box>
              <Typography sx={{ 
                fontSize: 12, 
                color: order.status === 'picking' ? '#fff' : 'rgba(255,255,255,0.5)'
              }}>
                Lấy hàng
              </Typography>
            </Stack>

            {/* Đường kẻ giữa */}
            <Box sx={{ 
              width: 48, 
              height: 6, 
              background: 'rgba(255,255,255,0.2)',
              borderRadius: 3,
              mx: 1,
              position: 'relative',
              overflow: 'hidden'
            }}>
              <Box sx={{
                position: 'absolute',
                left: 0,
                top: 0,
                height: '100%',
                width: order.status === 'delivering' || order.status === 'completed' ? '100%' : '0%',
                background: '#fff',
                transition: 'width 0.3s ease'
              }} />
            </Box>

            {/* Bước 2: Đang giao */}
            <Stack alignItems="center" spacing={1.5} sx={{ width: 64 }}>
              <Box sx={{
                width: 60.8,
                height: 60.8,
                borderRadius: 4,
                background: order.status === 'delivering' ? '#fff' : 'rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <LocalShippingIcon sx={{ 
                  fontSize: 26.6, 
                  color: order.status === 'delivering' ? '#ff6b35' : 'rgba(255,255,255,0.5)' 
                }} />
              </Box>
              <Typography sx={{ 
                fontSize: 12, 
                color: order.status === 'delivering' ? '#fff' : 'rgba(255,255,255,0.5)'
              }}>
                Đang giao
              </Typography>
            </Stack>

            {/* Đường kẻ giữa */}
            <Box sx={{ 
              width: 48, 
              height: 6, 
              background: 'rgba(255,255,255,0.2)',
              borderRadius: 3,
              mx: 1,
              position: 'relative',
              overflow: 'hidden'
            }}>
              <Box sx={{
                position: 'absolute',
                left: 0,
                top: 0,
                height: '100%',
                width: order.status === 'completed' ? '100%' : '0%',
                background: '#fff',
                transition: 'width 0.3s ease'
              }} />
            </Box>

            {/* Bước 3: Hoàn thành */}
            <Stack alignItems="center" spacing={1.5} sx={{ width: 64 }}>
              <Box sx={{
                width: 60.8,
                height: 60.8,
                borderRadius: 4,
                background: order.status === 'completed' ? '#fff' : 'rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CheckCircleIcon sx={{ 
                  fontSize: 26.6, 
                  color: order.status === 'completed' ? '#ff6b35' : 'rgba(255,255,255,0.5)' 
                }} />
              </Box>
              <Typography sx={{ 
                fontSize: 12, 
                color: order.status === 'completed' ? '#fff' : 'rgba(255,255,255,0.5)'
              }}>
                Hoàn thành
              </Typography>
            </Stack>
          </Stack>
          </Stack>
        </Box>
      </Slide>

      {/* Bản đồ placeholder */}
      <Box sx={{ px: 2, mt: 2, position: 'relative', zIndex: 1 }}>
        <Box sx={{
          height: 188,
          borderRadius: 3.5,
          background: 'linear-gradient(135deg, #e0f2fe 0%, #fef3c7 100%)',
          border: '4px solid #fff',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Grid pattern */}
          <Box sx={{
            position: 'absolute',
            inset: 0,
            opacity: 0.1,
            backgroundImage: 'repeating-linear-gradient(0deg, #99a1af 0px, #99a1af 1px, transparent 1px, transparent 24px), repeating-linear-gradient(90deg, #99a1af 0px, #99a1af 1px, transparent 1px, transparent 33px)',
          }} />
          
          {/* Marker điểm lấy hàng */}
          <Box sx={{ 
            position: 'absolute',
            left: 97,
            top: 122,
            width: 34.5,
            height: 34.5
          }}>
            <Box sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: '#51a2ff',
              opacity: 0.5,
              filter: 'blur(8px)'
            }} />
            <Box sx={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: '#2b7fff',
              border: '2.857px solid #fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <RoomIcon sx={{ fontSize: 17.3, color: '#fff' }} />
            </Box>
            {/* Tooltip */}
            <Box sx={{
              position: 'absolute',
              top: -39,
              left: -19,
              background: '#155dfc',
              borderRadius: 2.5,
              px: 1.35,
              py: 0.4,
              boxShadow: '0px 20px 25px -5px rgba(0,0,0,0.1), 0px 8px 10px -6px rgba(0,0,0,0.1)',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -4,
                left: '50%',
                transform: 'translateX(-50%)',
                borderLeft: '4px solid transparent',
                borderRight: '4px solid transparent',
                borderTop: '4px solid #155dfc'
              }
            }}>
              <Typography sx={{ fontSize: 12, color: '#fff', whiteSpace: 'nowrap' }}>
                Lấy hàng
              </Typography>
            </Box>
          </Box>

          {/* Marker điểm giao hàng */}
          <Box sx={{ 
            position: 'absolute',
            left: 262,
            top: 44,
            width: 34.3,
            height: 34.3
          }}>
            <Box sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: '#05df72',
              opacity: 0.5,
              filter: 'blur(8px)'
            }} />
            <Box sx={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: '#00c853',
              border: '2.857px solid #fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <RoomIcon sx={{ fontSize: 17.1, color: '#fff' }} />
            </Box>
            {/* Tooltip */}
            <Box sx={{
              position: 'absolute',
              top: -39,
              left: -23,
              background: '#ff6b35',
              borderRadius: 2.5,
              px: 1.35,
              py: 0.4,
              boxShadow: '0px 20px 25px -5px rgba(0,0,0,0.1), 0px 8px 10px -6px rgba(0,0,0,0.1)',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -4,
                left: '50%',
                transform: 'translateX(-50%)',
                borderLeft: '4px solid transparent',
                borderRight: '4px solid transparent',
                borderTop: '4px solid #ff6b35'
              }
            }}>
              <Typography sx={{ fontSize: 12, color: '#fff', whiteSpace: 'nowrap' }}>
                Giao hàng
              </Typography>
            </Box>
          </Box>

          {/* Distance info card */}
          <Paper sx={{
            position: 'absolute',
            left: 16,
            top: 12,
            background: 'rgba(255,255,255,0.95)',
            border: '0.571px solid rgba(255,255,255,0.4)',
            borderRadius: 3.5,
            px: 1.6,
            py: 1,
            backdropFilter: 'blur(10px)'
          }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box sx={{
                width: 28,
                height: 28,
                borderRadius: 2.5,
                background: 'rgba(255,107,53,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <NavigationIcon sx={{ fontSize: 16, color: '#ff6b35' }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 10, color: '#6a7282' }}>
                  Khoảng cách
                </Typography>
                <Typography sx={{ fontSize: 14, color: '#ff6b35', fontWeight: 700 }}>
                  {order.distance} km
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Box>
      </Box>

      {/* Nội dung chính */}
      <Stack spacing={1.5} sx={{ px: 2, mt: 2 }}>
        {/* Card điểm lấy hàng */}
        <Paper elevation={0} sx={{ 
          borderRadius: 3.5,
          border: '1.714px solid #bedbff',
          overflow: 'hidden'
        }}>
          {/* Header xanh */}
          <Box sx={{
            background: 'linear-gradient(90deg, #eff6ff 0%, #dbeafe 100%)',
            px: 2,
            py: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <RoomIcon sx={{ fontSize: 20, color: '#1c398e' }} />
            <Typography sx={{ fontSize: 16, color: '#1c398e', fontWeight: 600 }}>
              Điểm đến tiếp theo
            </Typography>
          </Box>

          {/* Nội dung */}
          <Box sx={{ p: 2 }}>
            <Typography sx={{ fontSize: 12, color: '#6a7282', mb: 1 }}>
              Điểm lấy hàng
            </Typography>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#000', mb: 0.5 }}>
              {order.pickupName}
            </Typography>
            <Typography sx={{ fontSize: 14, color: '#4a5565', mb: 2 }}>
              {order.pickupAddr}
            </Typography>

            {/* Contact info */}
            <Box sx={{ 
              background: '#f9fafb',
              borderRadius: 3.5,
              p: 1.5,
              mb: 2
            }}>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <PersonIcon sx={{ fontSize: 16, color: '#6b7280' }} />
                  <Typography sx={{ fontSize: 14, color: '#000' }}>
                    {order.pickupContact}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <PhoneIcon sx={{ fontSize: 16, color: '#6b7280' }} />
                  <Typography 
                    component="a"
                    href={`tel:${order.pickupPhone}`}
                    sx={{ 
                      fontSize: 14, 
                      color: '#ff6b35',
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    {order.pickupPhone}
                  </Typography>
                </Stack>
              </Stack>
            </Box>

            {/* Buttons */}
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                onClick={handleCallPickup}
                startIcon={<PhoneIcon />}
                sx={{
                  flex: 1,
                  borderColor: '#ff6b35',
                  color: '#ff6b35',
                  borderRadius: 2,
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#ff6b35',
                    background: 'rgba(255,107,53,0.05)'
                  }
                }}
              >
                Gọi
              </Button>
              <Button
                variant="contained"
                onClick={handleNavigatePickup}
                startIcon={<NavigationIcon />}
                sx={{
                  flex: 1,
                  background: 'linear-gradient(90deg, #ff6b35 0%, #ff6900 100%)',
                  borderRadius: 2,
                  textTransform: 'none',
                  boxShadow: 'none',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #ff6900 0%, #f54900 100%)',
                    boxShadow: 'none'
                  }
                }}
              >
                Chỉ đường
              </Button>
            </Stack>
          </Box>
        </Paper>

        {/* Card điểm giao hàng */}
        <Paper elevation={0} sx={{ 
          borderRadius: 3.5,
          border: '0.571px solid rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          {/* Header cam */}
          <Box sx={{
            background: 'linear-gradient(90deg, #fff7ed 0%, #ffedd4 100%)',
            px: 2,
            py: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <RoomIcon sx={{ fontSize: 20, color: '#7e2a0c' }} />
            <Typography sx={{ fontSize: 16, color: '#7e2a0c', fontWeight: 600 }}>
              Điểm giao hàng
            </Typography>
          </Box>

          {/* Nội dung */}
          <Box sx={{ p: 2 }}>
            <Typography sx={{ fontSize: 12, color: '#6a7282', mb: 1 }}>
              Người nhận
            </Typography>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#000', mb: 0.5 }}>
              {order.dropName}
            </Typography>
            <Typography sx={{ fontSize: 14, color: '#4a5565', mb: 2 }}>
              {order.dropAddr}
            </Typography>

            {/* Contact info */}
            <Box sx={{ 
              background: '#f9fafb',
              borderRadius: 3.5,
              p: 1.5,
              mb: order.status === 'delivering' ? 2 : 0
            }}>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <PersonIcon sx={{ fontSize: 16, color: '#6b7280' }} />
                  <Typography sx={{ fontSize: 14, color: '#000' }}>
                    {order.dropContact}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <PhoneIcon sx={{ fontSize: 16, color: '#6b7280' }} />
                  <Typography 
                    component="a"
                    href={`tel:${order.dropPhone}`}
                    sx={{ 
                      fontSize: 14, 
                      color: '#ff6b35',
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    {order.dropPhone}
                  </Typography>
                </Stack>
              </Stack>
            </Box>

            {/* Buttons - hiển thị khi đang giao */}
            {order.status === 'delivering' && (
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  onClick={handleCallDrop}
                  startIcon={<PhoneIcon />}
                  sx={{
                    flex: 1,
                    borderColor: '#ff6b35',
                    color: '#ff6b35',
                    borderRadius: 2,
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: '#ff6b35',
                      background: 'rgba(255,107,53,0.05)'
                    }
                  }}
                >
                  Gọi
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNavigateDrop}
                  startIcon={<NavigationIcon />}
                  sx={{
                    flex: 1,
                    background: 'linear-gradient(90deg, #ff6b35 0%, #ff6900 100%)',
                    borderRadius: 2,
                    textTransform: 'none',
                    boxShadow: 'none',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #ff6900 0%, #f54900 100%)',
                      boxShadow: 'none'
                    }
                  }}
                >
                  Chỉ đường
                </Button>
              </Stack>
            )}
          </Box>
        </Paper>

        {/* Card chi tiết đơn hàng */}
        <Paper elevation={0} sx={{ 
          borderRadius: 3.5,
          border: '0.571px solid rgba(0,0,0,0.1)',
          p: 2
        }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
            <InfoIcon sx={{ fontSize: 20, color: '#000' }} />
            <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#000' }}>
              Chi tiết đơn hàng
            </Typography>
          </Stack>

          <Stack spacing={1.5}>
            {/* Khối lượng */}
            <Box sx={{
              background: '#f9fafb',
              borderRadius: 3.5,
              px: 1.5,
              py: 1.5,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Typography sx={{ fontSize: 16, color: '#4a5565' }}>
                Khối lượng
              </Typography>
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#000' }}>
                {order.weight}
              </Typography>
            </Box>

            {/* Thu hộ */}
            <Box sx={{
              background: 'linear-gradient(90deg, #fff7ed 0%, #ffedd4 100%)',
              borderRadius: 3.5,
              px: 1.5,
              py: 1.5,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <AttachMoneyIcon sx={{ fontSize: 20, color: '#4a5565' }} />
                <Typography sx={{ fontSize: 16, color: '#4a5565' }}>
                  Thu hộ
                </Typography>
              </Stack>
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#ff6b35' }}>
                {order.cod.toLocaleString()}đ
              </Typography>
            </Box>

            {/* Ghi chú */}
            {order.note && (
              <Box sx={{
                background: '#eff6ff',
                border: '0.571px solid #bedbff',
                borderRadius: 3.5,
                p: 1.6
              }}>
                <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 1 }}>
                  <InfoIcon sx={{ fontSize: 12, color: '#155dfc' }} />
                  <Typography sx={{ fontSize: 12, color: '#155dfc' }}>
                    Ghi chú quan trọng
                  </Typography>
                </Stack>
                <Typography sx={{ fontSize: 14, color: '#364153', lineHeight: 1.43 }}>
                  {order.note}
                </Typography>
              </Box>
            )}
          </Stack>
        </Paper>

        {/* Button hành động - thay đổi theo trạng thái */}
        {order.status === 'picking' && (
          <Button
            variant="contained"
            onClick={handlePickedUp}
            startIcon={<CheckCircleIcon />}
            fullWidth
            sx={{
              height: 48,
              borderRadius: 3.5,
              background: 'linear-gradient(90deg, #ff6b35 0%, #ff6900 100%)',
              fontSize: 14,
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1)',
              '&:hover': {
                background: 'linear-gradient(90deg, #ff6900 0%, #f54900 100%)'
              }
            }}
          >
            Đã lấy hàng
          </Button>
        )}

        {order.status === 'delivering' && (
          <Button
            variant="contained"
            onClick={handleCompleted}
            startIcon={<CheckCircleIcon />}
            fullWidth
            sx={{
              height: 48,
              borderRadius: 3.5,
              background: 'linear-gradient(90deg, #00c853 0%, #00a63e 100%)',
              fontSize: 14,
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1)',
              '&:hover': {
                background: 'linear-gradient(90deg, #00a63e 0%, #019c3a 100%)'
              }
            }}
          >
            Hoàn thành giao hàng
          </Button>
        )}

        {order.status === 'completed' && (
          <Box
            sx={{
              height: 48,
              borderRadius: 3.5,
              background: 'linear-gradient(90deg, #00c853 0%, #00a63e 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              color: '#fff'
            }}
          >
            <CheckCircleIcon />
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
              Đã hoàn thành
            </Typography>
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default Delivering;


