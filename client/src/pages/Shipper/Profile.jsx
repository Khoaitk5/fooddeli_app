import React from 'react';
import { Box, Typography, Stack, Paper, Divider, Button, Chip, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import PhoneIphoneOutlinedIcon from '@mui/icons-material/PhoneIphoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import TwoWheelerOutlinedIcon from '@mui/icons-material/TwoWheelerOutlined';
import { useShipper } from '@/hooks/useShipper';
import { useNavigate } from 'react-router-dom';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded';
import MonetizationOnRoundedIcon from '@mui/icons-material/MonetizationOnRounded';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';

const Profile = () => {
  const { shipper: shipperRaw } = useShipper();
  const navigate = useNavigate();
  const shipper = shipperRaw ?? {};

  const items = [
    { icon: <EditOutlinedIcon sx={{ color: '#6B7280' }} />, title: 'Chỉnh sửa hồ sơ', subtitle: 'Tên, ảnh đại diện, biển số' },
    { icon: <VerifiedUserOutlinedIcon sx={{ color: '#6B7280' }} />, title: 'Xác minh tài khoản', subtitle: 'Giấy tờ & trạng thái' },
    { icon: <CreditCardOutlinedIcon sx={{ color: '#6B7280' }} />, title: 'Phương thức thanh toán', subtitle: 'Ví/Ngân hàng' },
    { icon: <HistoryOutlinedIcon sx={{ color: '#6B7280' }} />, title: 'Lịch sử hoạt động', subtitle: 'Đơn đã giao' },
  ];

  // Số liệu tổng quan (fallback nếu thiếu)
  const completedOrders = shipper.completedOrders ?? 126;
  const rating = shipper.rating ?? 4.9;
  const earnings = shipper.earnings ?? 1250000; // VND
  const cancelRate = shipper.cancelRate ?? 0.8; // %

  return (
    <Box sx={{ pb: 3 }}>
      {/* Header gradient theo style chung shipper */}
      <Box sx={{ background: 'linear-gradient(135deg, #ff7a18 0%, #ff3d00 100%)' }}>
        <Box
          sx={{
            maxWidth: 390,
            mx: 'auto',
            borderBottomLeftRadius: 28,
            borderBottomRightRadius: 28,
            color: '#fff',
            px: 2.5,
            pt: 2,
            pb: 2,
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.10), 0px 4px 6px -4px rgba(0,0,0,0.10)'
          }}
        >
          {/* decorative blobs */}
          <Box sx={{ position: 'absolute', width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', right: -60, top: -40 }} />
          <Box sx={{ position: 'absolute', width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', right: 20, bottom: -30 }} />
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ width: 74, height: 74, borderRadius: '50%', background: 'linear-gradient(180deg, rgba(255,255,255,0.35), rgba(255,255,255,0.05))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 20px rgba(0,0,0,0.15)' }}>
              <Box sx={{ width: 66, height: 66, borderRadius: '50%', overflow: 'hidden', background: '#ffffff20', border: '2px solid rgba(255,255,255,0.65)' }}>
                {shipper.avatar ? (
                  <img src={shipper.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography sx={{ fontSize: 26, fontWeight: 800, color: '#fff' }}>{shipper.name?.[0] || 'S'}</Typography>
                  </Box>
                )}
              </Box>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: 20, fontWeight: 900, letterSpacing: 0.2 }}>{shipper.name || 'Shipper'}</Typography>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.75, flexWrap: 'wrap' }}>
                <Chip
                  label={`${(shipper.rating ?? 4.8).toFixed(1)}`}
                  size="small"
                  icon={<StarRateRoundedIcon sx={{ color: '#fff !important' }} />}
                  sx={{
                    height: 26,
                    color: '#fff',
                    background: 'linear-gradient(90deg, #f59e0b, #f97316)',
                    '& .MuiChip-icon': { color: '#fff' },
                    fontWeight: 700
                  }}
                />
                <Chip
                  label="Kim Cương"
                  size="small"
                  icon={<WorkspacePremiumOutlinedIcon />}
                  sx={{
                    height: 26,
                    color: '#0369a1',
                    background: '#e0f2fe',
                    '& .MuiChip-icon': { color: '#0284c7' },
                    fontWeight: 700
                  }}
                />
              </Stack>
              <Typography sx={{ fontSize: 12.5, opacity: 0.95, mt: 0.75 }}>Tham gia Tháng 3, 2023</Typography>
            </Box>
          </Stack>
        </Box>
      </Box>

      <Box sx={{ maxWidth: 390, mx: 'auto', px: 2.5, mt: 2 }}>
        {/* Thông tin liên hệ hiện đại */}
        <Paper elevation={2} sx={{ borderRadius: 2, p: 2, mb: 2 }}>
          <Typography sx={{ fontWeight: 700, mb: 1 }}>Thông tin liên hệ</Typography>
          <Stack spacing={1.25}>
            <Stack direction="row" spacing={1.25} alignItems="center">
              <Box sx={{ width: 36, height: 36, borderRadius: 1.25, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PhoneIphoneOutlinedIcon sx={{ color: '#4f46e5' }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 12, color: '#6B7280' }}>Số điện thoại</Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 700 }}>{shipper.phone || '0901234567'}</Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={1.25} alignItems="center">
              <Box sx={{ width: 36, height: 36, borderRadius: 1.25, background: '#f0f9ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <EmailOutlinedIcon sx={{ color: '#0284c7' }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 12, color: '#6B7280' }}>Email</Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 700 }}>{shipper.email || 'shipper@example.com'}</Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={1.25} alignItems="center">
              <Box sx={{ width: 36, height: 36, borderRadius: 1.25, background: '#ecfeff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LocationOnOutlinedIcon sx={{ color: '#06b6d4' }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 12, color: '#6B7280' }}>Khu vực hoạt động</Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 700 }}>{shipper.address?.district && shipper.address?.city ? `${shipper.address.district}, ${shipper.address.city}` : 'Quận 1, TP.HCM'}</Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={1.25} alignItems="center">
              <Box sx={{ width: 36, height: 36, borderRadius: 1.25, background: '#fdf2f8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TwoWheelerOutlinedIcon sx={{ color: '#db2777' }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 12, color: '#6B7280' }}>Biển số xe</Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 700 }}>{shipper.vehicle?.plate || '51A-12345'}</Typography>
              </Box>
            </Stack>
          </Stack>
        </Paper>

        {/* Thống kê tổng quan */}
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ fontWeight: 700, mb: 1 }}>Thống kê tổng quan</Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 1,
            }}
          >
            <Paper elevation={2} sx={{ borderRadius: 2, p: 1.25, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 36, height: 36, borderRadius: 1.25, background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircleRoundedIcon sx={{ color: '#16a34a' }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 12, color: '#6B7280' }}>Hoàn thành</Typography>
                <Typography sx={{ fontSize: 16, fontWeight: 800 }}>{completedOrders}</Typography>
              </Box>
            </Paper>
            <Paper elevation={2} sx={{ borderRadius: 2, p: 1.25, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 36, height: 36, borderRadius: 1.25, background: 'linear-gradient(135deg, #fee2e2, #fecaca)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <StarRateRoundedIcon sx={{ color: '#f59e0b' }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 12, color: '#6B7280' }}>Đánh giá</Typography>
                <Typography sx={{ fontSize: 16, fontWeight: 800 }}>{rating.toFixed(1)}</Typography>
              </Box>
            </Paper>
            <Paper elevation={2} sx={{ borderRadius: 2, p: 1.25, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 36, height: 36, borderRadius: 1.25, background: 'linear-gradient(135deg, #e0f2fe, #bae6fd)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MonetizationOnRoundedIcon sx={{ color: '#0284c7' }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 12, color: '#6B7280' }}>Thu nhập</Typography>
                <Typography sx={{ fontSize: 16, fontWeight: 800 }}>{earnings.toLocaleString()}đ</Typography>
              </Box>
            </Paper>
            <Paper elevation={2} sx={{ borderRadius: 2, p: 1.25, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 36, height: 36, borderRadius: 1.25, background: 'linear-gradient(135deg, #ffe4e6, #fecdd3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <HighlightOffRoundedIcon sx={{ color: '#ef4444' }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 12, color: '#6B7280' }}>Tỉ lệ hủy</Typography>
                <Typography sx={{ fontSize: 16, fontWeight: 800 }}>{cancelRate}%</Typography>
              </Box>
            </Paper>
          </Box>
        </Box>

        {/* Danh sách mục cấu hình/hành động */}
        <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <List disablePadding>
            {items.map((item, idx) => (
              <ListItemButton key={item.title} dense sx={{ py: 1.25 }} onClick={() => {
                if (item.title === 'Chỉnh sửa hồ sơ') navigate('/shipper/profile/edit');
                if (item.title === 'Phương thức thanh toán') navigate('/shipper/wallet');
              }}>
                <ListItemIcon sx={{ minWidth: 44 }}>
                  <Box sx={{ width: 36, height: 36, borderRadius: 1.25, background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.icon}
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>
                      {item.title}
                    </Typography>
                  }
                  secondary={
                    <Typography sx={{ fontSize: 12, color: '#6B7280', mt: 0.25 }}>
                      {item.subtitle}
                    </Typography>
                  }
                />
                <ChevronRightIcon sx={{ color: '#9CA3AF' }} />
                {idx < items.length - 1 && (
                  <Divider sx={{ position: 'absolute', left: 72, right: 0, bottom: 0 }} />
                )}
              </ListItemButton>
            ))}
          </List>
        </Paper>

        {/* Nút đăng xuất */}
        <Button startIcon={<LogoutOutlinedIcon />} variant="outlined" color="inherit" sx={{ mt: 2, width: '100%', height: 44, borderRadius: 1.5 }}>
          Đăng xuất
        </Button>
      </Box>
    </Box>
  );
};

export default Profile;

