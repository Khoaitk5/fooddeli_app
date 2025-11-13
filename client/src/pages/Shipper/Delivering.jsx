// src/pages/shipper/Delivering.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Stack, Typography, Paper, Chip, Button, Fade, Slide
} from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import RoomIcon from '@mui/icons-material/Room';
import NavigationIcon from '@mui/icons-material/Navigation';
import InfoIcon from '@mui/icons-material/Info';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useShipper } from '@/hooks/useShipper';

const Delivering = () => {
  const navigate = useNavigate();
  const { currentOrder, setCurrentOrder } = useShipper();

  // Luôn gọi hook ở top-level
// Chuẩn hoá status cũ -> mới
const migrate = (s) => (s === 'picking' ? 'picking' : s === 'delivering' ? 'delivering' : s);
const valid = (s) => ['picking', 'delivering', 'completed', 'cancelled'].includes(s);

// Status ban đầu lấy từ currentOrder đã persist
const initialStatus = React.useMemo(() => {
  const s = migrate(currentOrder?.status);
  return valid(s) ? s : 'picking';
}, [currentOrder?.status]);

const [orderStatus, setOrderStatus] = React.useState(initialStatus);

// Nếu currentOrder.status đổi (reload/tab khác), đồng bộ lại UI
React.useEffect(() => {
  setOrderStatus(initialStatus);
}, [initialStatus]);

  // Gom dữ liệu hiển thị từ currentOrder (đã có từ ActiveOrder)
  const order = React.useMemo(() => {
    const src = currentOrder ?? {};
    return {
      id: src.id,
      // pickup (shop)
      pickupName: src.pickupName ?? '',
      pickupAddr: src.pickupAddr ?? '',
      pickupContactName: src.pickupContactName ?? '',
      pickupPhone: src.pickupPhone ?? '',
      // drop (customer)
      dropName: src.dropName ?? '',
      dropAddr: src.dropAddr ?? '',
      dropPhone: src.dropPhone ?? '',
      // metrics
      distance: src.distance ?? '-',  // ví dụ "1.090km" (đã format ở trang trước)
      eta: src.eta ?? '-',
           deliveryDistance: src.deliveryDistance ?? '-',  // Quán → Khách (đã format)
     deliveryEta: src.deliveryEta ?? '-',
      cod: Number(src.cod ?? 0),
      bonus: Number(src.bonus ?? 0),
      shipperEarn: Number(src.shipperEarn ?? src.bonus ?? 0),
      status: orderStatus,
    };
  }, [currentOrder, orderStatus]);

  const displayCode = `#DH${String(order.id ?? '').padStart(3, '0')}`;

  const handleCall = (phone) => { if (phone) window.location.href = `tel:${phone}`; };

    // Điều hướng trong app: đẩy yêu cầu về Home để Map4DView xử lý
  const handleInAppNavigate = (target) => {
    // target: 'shop' | 'customer'
    if (!currentOrder) return;
    let dest = null;

    if (target === 'shop') {
      const lat = currentOrder?.pickupLat;
      const lon = currentOrder?.pickupLon;
      if (lat == null || lon == null) {
        alert('Thiếu tọa độ của shop (pickupLat/pickupLon).');
        return;
      }
      dest = { lat, lon };
    } else {
      const lat = currentOrder?.dropLat;
      const lon = currentOrder?.dropLon;
      if (lat == null || lon == null) {
        alert('Thiếu tọa độ của khách (dropLat/dropLon).');
        return;
      }
      dest = { lat, lon };
    }

    navigate('/shipper/home', {
      state: {
        startNavigation: true,
        target,                         // 'shop' hoặc 'customer'
        dest,                           // { lat, lon }
        orderId: currentOrder?.id || null
      },
      replace: true                     // tránh thêm lịch sử thừa
    });
  };

  const handlePickedUp = async () => {
  try {
    // gọi BE để chuyển trạng thái -> shipping
    const res = await fetch('http://localhost:5000/api/shipper/orders/pickup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ order_id: currentOrder?.id }),
    });
    const json = await res.json();
    if (!res.ok || json.success === false) {
      throw new Error(json.message || 'Không thể chuyển trạng thái sang shipping');
    }

    // cập nhật UI
    setOrderStatus('delivering');
    setCurrentOrder((o) => (o ? { ...o, status: 'delivering' } : o));
  } catch (e) {
    alert(e.message || 'Lỗi khi cập nhật trạng thái');
  }
};

  const handleCompleted = async () => {
  try {
    // gọi BE để đổi status = completed
    const res = await fetch("http://localhost:5000/api/shipper/orders/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ order_id: currentOrder?.id }),
    });
    const json = await res.json();
    if (!res.ok || json.success === false) {
      throw new Error(json.message || "Không thể hoàn thành đơn");
    }

    // OK: dọn context + localStorage và quay về danh sách
    setCurrentOrder(null);
    navigate("/shipper/available");
  } catch (e) {
    alert(e.message || "Có lỗi khi hoàn thành đơn");
  }
};


  // Nếu distance chưa có "km" thì thêm
   // Chọn dữ liệu theo trạng thái:
 // picking  -> dùng Bạn → Quán
 // delivering -> dùng Quán → Khách
 const distanceRaw = order.status === 'picking' ? order.distance : order.deliveryDistance;
 const etaRaw      = order.status === 'picking' ? order.eta      : order.deliveryEta;
 // đảm bảo có "km" khi cần
 const distanceDisplay =
   typeof distanceRaw === 'string' && distanceRaw.toLowerCase().includes('km')
     ? distanceRaw
     : `${distanceRaw} km`;

  // Sau khi mọi hook đã được gọi, mới render nhánh fallback
  if (!currentOrder) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2 }}>
        <Paper sx={{ maxWidth: 420, width: '100%', p: 3, textAlign: 'center', borderRadius: 3 }}>
          <Typography sx={{ fontSize: 20, fontWeight: 800, mb: 1 }}>Chưa có đơn giao</Typography>
          <Typography sx={{ color: 'text.secondary', mb: 2 }}>
            Hiện không tìm thấy đơn hàng đang giao.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/shipper/available')}
            sx={{
              borderRadius: 2,
              background: 'linear-gradient(90deg, #ff6b35 0%, #ff6900 100%)',
              textTransform: 'none'
            }}
          >
            ⟵ Quay lại danh sách đơn
          </Button>
        </Paper>
      </Box>
    );
  }

  // ====== UI chính giữ nguyên phía dưới ======
  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fff5f2 0%, #f0f9ff 100%)', pb: 12 }}>
      {/* Header */}
      <Slide direction="down" in timeout={600}>
        <Box sx={{
          background: 'linear-gradient(135deg, #ff6b35 0%, #ff5722 100%)',
          borderBottomLeftRadius: 32, borderBottomRightRadius: 32,
          pt: 3, pb: 3.5, px: 3, boxShadow: '0 16px 48px rgba(255,107,53,0.25)',
          position: 'relative', overflow: 'hidden',
          '&::before': {
            content: '""', position: 'absolute', top: 0, right: 0, width: 250, height: 250,
            borderRadius: '50%', background: 'rgba(255,255,255,0.1)', transform: 'translate(30%, -30%)'
          }
        }}>
          <Stack spacing={3} sx={{ position: 'relative', zIndex: 1 }}>
            <Fade in timeout={800}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{
                  fontSize: 13, color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase',
                  letterSpacing: '1.5px', fontWeight: 600, mb: 1
                }}>
                  ĐƠN HÀNG ĐANG GIAO
                </Typography>
                <Typography sx={{
                  fontSize: 32, fontWeight: 900, color: '#fff', mb: 1.5,
                  letterSpacing: '1px', textShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}>
                  {displayCode}
                </Typography>
                <Chip
                  label={order.status === 'picking' ? '📦 Đang đến lấy hàng' : '🚚 Đang giao hàng'}
                  sx={{
                    background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(10px)', color: '#fff',
                    fontWeight: 700, fontSize: 13, height: 36, borderRadius: 3, px: 2,
                    border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
              </Box>
            </Fade>

            {/* Progress */}
            <Stack direction="row" spacing={0} alignItems="center" justifyContent="center">
              {/* Step 1 */}
              <Stack alignItems="center" spacing={1.5} sx={{ width: 64 }}>
                <Box sx={{
                  width: 64, height: 64, borderRadius: 4,
                  background: order.status === 'picking' ? '#fff' : 'rgba(255,255,255,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: order.status === 'picking' ? '0px 25px 50px -12px rgba(0,0,0,0.25)' : 'none'
                }}>
                  <RoomIcon sx={{ fontSize: 28, color: order.status === 'picking' ? '#ff6b35' : 'rgba(255,255,255,0.5)' }} />
                </Box>
                <Typography sx={{ fontSize: 12, color: order.status === 'picking' ? '#fff' : 'rgba(255,255,255,0.5)' }}>
                  Lấy hàng
                </Typography>
              </Stack>

              {/* Divider */}
              <Box sx={{ width: 48, height: 6, background: 'rgba(255,255,255,0.2)', borderRadius: 3, mx: 1, position: 'relative', overflow: 'hidden' }}>
                <Box sx={{
                  position: 'absolute', left: 0, top: 0, height: '100%',
                  width: order.status !== 'picking' ? '100%' : '0%', background: '#fff',
                  transition: 'width 0.3s ease'
                }} />
              </Box>

              {/* Step 2 */}
              <Stack alignItems="center" spacing={1.5} sx={{ width: 64 }}>
                <Box sx={{
                  width: 60.8, height: 60.8, borderRadius: 4,
                  background: order.status === 'delivering' ? '#fff' : 'rgba(255,255,255,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <LocalShippingIcon sx={{ fontSize: 26.6, color: order.status === 'delivering' ? '#ff6b35' : 'rgba(255,255,255,0.5)' }} />
                </Box>
                <Typography sx={{ fontSize: 12, color: order.status === 'delivering' ? '#fff' : 'rgba(255,255,255,0.5)' }}>
                  Đang giao
                </Typography>
              </Stack>

              {/* Divider */}
              <Box sx={{ width: 48, height: 6, background: 'rgba(255,255,255,0.2)', borderRadius: 3, mx: 1, position: 'relative', overflow: 'hidden' }}>
                <Box sx={{
                  position: 'absolute', left: 0, top: 0, height: '100%',
                  width: order.status === 'completed' ? '100%' : '0%', background: '#fff',
                  transition: 'width 0.3s ease'
                }} />
              </Box>

              {/* Step 3 */}
              <Stack alignItems="center" spacing={1.5} sx={{ width: 64 }}>
                <Box sx={{
                  width: 60.8, height: 60.8, borderRadius: 4,
                  background: order.status === 'completed' ? '#fff' : 'rgba(255,255,255,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <CheckCircleIcon sx={{ fontSize: 26.6, color: order.status === 'completed' ? '#ff6b35' : 'rgba(255,255,255,0.5)' }} />
                </Box>
                <Typography sx={{ fontSize: 12, color: order.status === 'completed' ? '#fff' : 'rgba(255,255,255,0.5)' }}>
                  Hoàn thành
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </Slide>

      {/* Bản đồ placeholder + khoảng cách */}
      <Box sx={{ px: 2, mt: 2, position: 'relative', zIndex: 1 }}>
        <Box sx={{
          height: 188, borderRadius: 3.5, background: 'linear-gradient(135deg, #e0f2fe 0%, #fef3c7 100%)',
          border: '4px solid #fff', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          {/* grid nhạt */}
          <Box sx={{
            position: 'absolute', inset: 0, opacity: 0.1,
            backgroundImage:
              'repeating-linear-gradient(0deg, #99a1af 0px, #99a1af 1px, transparent 1px, transparent 24px),' +
              'repeating-linear-gradient(90deg, #99a1af 0px, #99a1af 1px, transparent 1px, transparent 33px)'
          }} />

          {/* marker lấy hàng */}
          <Box sx={{ position: 'absolute', left: 97, top: 122, width: 34.5, height: 34.5 }}>
            <Box sx={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', background: '#51a2ff', opacity: 0.5, filter: 'blur(8px)' }} />
            <Box sx={{
              width: '100%', height: '100%', borderRadius: '50%', background: '#2b7fff', border: '2.857px solid #fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <RoomIcon sx={{ fontSize: 17.3, color: '#fff' }} />
            </Box>
            <Box sx={{
              position: 'absolute', top: -39, left: -19, background: '#155dfc', borderRadius: 2.5, px: 1.35, py: 0.4,
              boxShadow: '0px 20px 25px -5px rgba(0,0,0,0.1), 0px 8px 10px -6px rgba(0,0,0,0.1)',
              '&::after': { content: '""', position: 'absolute', bottom: -4, left: '50%', transform: 'translateX(-50%)',
                borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: '4px solid #155dfc' }
            }}>
              <Typography sx={{ fontSize: 12, color: '#fff', whiteSpace: 'nowrap' }}>Lấy hàng</Typography>
            </Box>
          </Box>

          {/* marker giao hàng */}
          <Box sx={{ position: 'absolute', left: 262, top: 44, width: 34.3, height: 34.3 }}>
            <Box sx={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', background: '#05df72', opacity: 0.5, filter: 'blur(8px)' }} />
            <Box sx={{
              width: '100%', height: '100%', borderRadius: '50%', background: '#00c853', border: '2.857px solid #fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <RoomIcon sx={{ fontSize: 17.1, color: '#fff' }} />
            </Box>
            <Box sx={{
              position: 'absolute', top: -39, left: -23, background: '#ff6b35', borderRadius: 2.5, px: 1.35, py: 0.4,
              boxShadow: '0px 20px 25px -5px rgba(0,0,0,0.1), 0px 8px 10px -6px rgba(0,0,0,0.1)',
              '&::after': { content: '""', position: 'absolute', bottom: -4, left: '50%', transform: 'translateX(-50%)',
                borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: '4px solid #ff6b35' }
            }}>
              <Typography sx={{ fontSize: 12, color: '#fff', whiteSpace: 'nowrap' }}>Giao hàng</Typography>
            </Box>
          </Box>

          {/* khoảng cách */}
          <Paper sx={{
            position: 'absolute', left: 16, top: 12, background: 'rgba(255,255,255,0.95)',
            border: '0.571px solid rgba(255,255,255,0.4)', borderRadius: 3.5, px: 1.6, py: 1, backdropFilter: 'blur(10px)'
          }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box sx={{ width: 28, height: 28, borderRadius: 2.5, background: 'rgba(255,107,53,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <NavigationIcon sx={{ fontSize: 16, color: '#ff6b35' }} />
              </Box>
              <Box>
                 <Typography sx={{ fontSize: 10, color: '#6a7282' }}>
   {order.status === 'picking' ? 'Bạn → Quán' : 'Quán → Khách'}
 </Typography>
                <Typography sx={{ fontSize: 14, color: '#ff6b35', fontWeight: 700 }}>
                  {distanceDisplay}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Box>
      </Box>

      {/* Nội dung chính */}
      <Stack spacing={1.5} sx={{ px: 2, mt: 2 }}>
        {/* Điểm lấy hàng */}
        <Paper elevation={0} sx={{ borderRadius: 3.5, border: '1.714px solid #bedbff', overflow: 'hidden' }}>
          <Box sx={{ background: 'linear-gradient(90deg, #eff6ff 0%, #dbeafe 100%)', px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
            <RoomIcon sx={{ fontSize: 20, color: '#1c398e' }} />
            <Typography sx={{ fontSize: 16, color: '#1c398e', fontWeight: 600 }}>Điểm đến tiếp theo</Typography>
          </Box>

          <Box sx={{ p: 2 }}>
            <Typography sx={{ fontSize: 12, color: '#6a7282', mb: 1 }}>Điểm lấy hàng</Typography>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#000', mb: 0.5 }}>{order.pickupName}</Typography>
            <Typography sx={{ fontSize: 14, color: '#4a5565', mb: 2 }}>{order.pickupAddr}</Typography>

            <Box sx={{ background: '#f9fafb', borderRadius: 3.5, p: 1.5, mb: 2 }}>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <PersonIcon sx={{ fontSize: 16, color: '#6b7280' }} />
                  <Typography sx={{ fontSize: 14, color: '#000' }}>
                    {order.pickupContactName || order.pickupName}
                  </Typography>
                </Stack>
                {!!order.pickupPhone && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PhoneIcon sx={{ fontSize: 16, color: '#6b7280' }} />
                    <Typography
                      component="a"
                      href={`tel:${order.pickupPhone}`}
                      sx={{ fontSize: 14, color: '#ff6b35', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                    >
                      {order.pickupPhone}
                    </Typography>
                  </Stack>
                )}
              </Stack>
            </Box>

            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                onClick={() => handleCall(order.pickupPhone)}
                startIcon={<PhoneIcon />}
                sx={{
                  flex: 1, borderColor: '#ff6b35', color: '#ff6b35', borderRadius: 2, textTransform: 'none',
                  '&:hover': { borderColor: '#ff6b35', background: 'rgba(255,107,53,0.05)' }
                }}
              >
                Gọi
              </Button>
              <Button
                variant="contained"
                onClick={() => handleInAppNavigate('shop')}
                startIcon={<NavigationIcon />}
                sx={{
                  flex: 1, background: 'linear-gradient(90deg, #ff6b35 0%, #ff6900 100%)',
                  borderRadius: 2, textTransform: 'none', boxShadow: 'none',
                  '&:hover': { background: 'linear-gradient(90deg, #ff6900 0%, #f54900 100%)', boxShadow: 'none' }
                }}
              >
                Chỉ đường
              </Button>
            </Stack>
          </Box>
        </Paper>

        {/* Điểm giao hàng */}
        <Paper elevation={0} sx={{ borderRadius: 3.5, border: '0.571px solid rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <Box sx={{ background: 'linear-gradient(90deg, #fff7ed 0%, #ffedd4 100%)', px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
            <RoomIcon sx={{ fontSize: 20, color: '#7e2a0c' }} />
            <Typography sx={{ fontSize: 16, color: '#7e2a0c', fontWeight: 600 }}>Điểm giao hàng</Typography>
          </Box>

          <Box sx={{ p: 2 }}>
            <Typography sx={{ fontSize: 12, color: '#6a7282', mb: 1 }}>Người nhận</Typography>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#000', mb: 0.5 }}>{order.dropName}</Typography>
            <Typography sx={{ fontSize: 14, color: '#4a5565', mb: 2 }}>{order.dropAddr}</Typography>

            <Box sx={{ background: '#f9fafb', borderRadius: 3.5, p: 1.5, mb: order.status === 'delivering' ? 2 : 0 }}>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <PersonIcon sx={{ fontSize: 16, color: '#6b7280' }} />
                  <Typography sx={{ fontSize: 14, color: '#000' }}>{order.dropName}</Typography>
                </Stack>
                {!!order.dropPhone && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PhoneIcon sx={{ fontSize: 16, color: '#6b7280' }} />
                    <Typography
                      component="a"
                      href={`tel:${order.dropPhone}`}
                      sx={{ fontSize: 14, color: '#ff6b35', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                    >
                      {order.dropPhone}
                    </Typography>
                  </Stack>
                )}
              </Stack>
            </Box>

            {order.status === 'delivering' && (
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  onClick={() => handleCall(order.dropPhone)}
                  startIcon={<PhoneIcon />}
                  sx={{
                    flex: 1, borderColor: '#ff6b35', color: '#ff6b35', borderRadius: 2, textTransform: 'none',
                    '&:hover': { borderColor: '#ff6b35', background: 'rgba(255,107,53,0.05)' }
                  }}
                >
                  Gọi
                </Button>
                <Button
                  variant="contained"
                  onClick={() => handleInAppNavigate('customer')}
                  startIcon={<NavigationIcon />}
                  sx={{
                    flex: 1, background: 'linear-gradient(90deg, #ff6b35 0%, #ff6900 100%)',
                    borderRadius: 2, textTransform: 'none', boxShadow: 'none',
                    '&:hover': { background: 'linear-gradient(90deg, #ff6900 0%, #f54900 100%)', boxShadow: 'none' }
                  }}
                >
                  Chỉ đường
                </Button>
              </Stack>
            )}
          </Box>
        </Paper>

        {/* Chi tiết đơn */}
        <Paper elevation={0} sx={{ borderRadius: 3.5, border: '0.571px solid rgba(0,0,0,0.1)', p: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
            <InfoIcon sx={{ fontSize: 20, color: '#000' }} />
            <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#000' }}>Chi tiết đơn hàng</Typography>
          </Stack>

          <Stack spacing={1.5}>
            <Box sx={{
              background: '#f9fafb', borderRadius: 3.5, px: 1.5, py: 1.5,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
               <Typography sx={{ fontSize: 16, color: '#4a5565' }}>
   {order.status === 'picking' ? 'Tới quán (ước tính)' : 'Thời gian giao (ước tính)'}
 </Typography>
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#000' }}>{etaRaw}</Typography>
            </Box>

            <Box sx={{
              background: 'linear-gradient(90deg, #fff7ed 0%, #ffedd4 100%)', borderRadius: 3.5, px: 1.5, py: 1.5,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <AttachMoneyIcon sx={{ fontSize: 20, color: '#4a5565' }} />
                <Typography sx={{ fontSize: 16, color: '#4a5565' }}>Thu hộ</Typography>
              </Stack>
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#ff6b35' }}>
                {order.cod.toLocaleString()}đ
              </Typography>
            </Box>

              {/* Tiền shipper nhận */}
   {order.shipperEarn > 0 && (
     <Box
       sx={{
         background: 'linear-gradient(90deg, #dcfce7 0%, #bbf7d0 100%)',
         borderRadius: 3.5, px: 1.5, py: 1.5,
         display: 'flex', justifyContent: 'space-between', alignItems: 'center',
         border: '1px solid rgba(34,197,94,0.25)'
       }}
     >
       <Stack direction="row" spacing={1} alignItems="center">
         <AttachMoneyIcon sx={{ fontSize: 20, color: '#166534' }} />
         <Typography sx={{ fontSize: 16, color: '#166534', fontWeight: 600 }}>
           Tiền shipper nhận
         </Typography>
       </Stack>
       <Typography sx={{ fontSize: 16, fontWeight: 900, color: '#166534' }}>
         +{order.shipperEarn.toLocaleString()}đ
       </Typography>
     </Box>
   )}
          </Stack>
        </Paper>

        {/* Hành động */}
        {order.status === 'picking' && (
          <Button
            variant="contained"
            onClick={handlePickedUp}
            startIcon={<CheckCircleIcon />}
            fullWidth
            sx={{
              height: 48, borderRadius: 3.5, background: 'linear-gradient(90deg, #ff6b35 0%, #ff6900 100%)',
              fontSize: 14, fontWeight: 600, textTransform: 'none',
              boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1)',
              '&:hover': { background: 'linear-gradient(90deg, #ff6900 0%, #f54900 100%)' }
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
              height: 48, borderRadius: 3.5,
              background: 'linear-gradient(90deg, #00c853 0%, #00a63e 100%)',
              fontSize: 14, fontWeight: 600, textTransform: 'none',
              boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1)',
              '&:hover': { background: 'linear-gradient(90deg, #00a63e 0%, #019c3a 100%)' }
            }}
          >
            Hoàn thành giao hàng
          </Button>
        )}

        {order.status === 'completed' && (
          <Box sx={{
            height: 48, borderRadius: 3.5,
            background: 'linear-gradient(90deg, #00c853 0%, #00a63e 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, color: '#fff'
          }}>
            <CheckCircleIcon />
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Đã hoàn thành</Typography>
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default Delivering;