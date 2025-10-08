import React from 'react';
import { Box, Typography } from '@mui/material';
import {
  HomeRounded as HomeIcon,
  Inventory2Rounded as OrdersIcon,
  Route as DeliveringIcon,
  AccountCircle as ProfileIcon,
} from '@mui/icons-material';

// Thanh hành động dưới cùng theo thiết kế Figma (pill, bóng, mục active + badge)
// Giữ tên và export cũ để không phá vỡ import hiện có.
const BottomActionBar = ({ active = 'home', onNavigate }) => {
  const items = [
    { key: 'home', label: 'Trang chủ', icon: <HomeIcon /> },
    { key: 'orders', label: 'Đơn hàng', icon: <OrdersIcon /> },
    { key: 'delivering', label: 'Đang giao', icon: <DeliveringIcon /> },
    { key: 'profile', label: 'Hồ sơ', icon: <ProfileIcon /> },
  ];

  return (
    <Box
      sx={{
        position: 'fixed',
        left: 8,
        right: 8,
        bottom: 8,
        height: 64,
        backgroundColor: '#ffffff',
        borderTop: '1px solid #f3f4f6',
        borderRadius: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        boxShadow: '0px 25px 50px -12px rgba(0,0,0,0.25)',
        zIndex: 1200,
      }}
    >
      {items.map((t) => {
        const isActive = t.key === active;
        return (
          <Box
            key={t.key}
            onClick={() => onNavigate && onNavigate(t.key)}
            sx={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '25%',
              height: 49,
              gap: 0.5,
              color: isActive ? '#F9704B' : '#6B7280',
              borderRadius: 2,
              backgroundColor: isActive ? 'rgba(255,107,53,0.10)' : 'transparent',
              cursor: 'pointer',
              '& svg': { fontSize: 22 },
            }}
          >
            {/* Badge chấm xanh cho Đơn hàng */}
            {t.key === 'orders' && (
              <Box sx={{ position: 'absolute', right: '22%', top: 6 }}>
                <Box sx={{ width: 13, height: 13, borderRadius: '9999px', background: 'rgba(0,201,80,0.28)' }} />
                <Box sx={{ width: 8, height: 8, borderRadius: '9999px', background: '#00c950', mt: '-10.5px', ml: '2.5px' }} />
              </Box>
            )}

            <Box>{t.icon}</Box>
            <Typography sx={{ fontSize: 12, fontWeight: isActive ? 700 : 500 }}>{t.label}</Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default BottomActionBar;


