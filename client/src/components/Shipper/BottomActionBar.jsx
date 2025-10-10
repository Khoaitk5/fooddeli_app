import React from 'react';
import { Box, Typography, Fade } from '@mui/material';
import {
  HomeRounded as HomeIcon,
  Inventory2Rounded as OrdersIcon,
  Route as DeliveringIcon,
  AccountCircle as ProfileIcon,
} from '@mui/icons-material';

// Bottom Navigation Bar - Modern responsive design với animations
const BottomActionBar = ({ active = 'home', onNavigate }) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const items = [
    { key: 'home', label: 'Trang chủ', icon: <HomeIcon />, color: '#3b82f6' },
    { key: 'orders', label: 'Đơn hàng', icon: <OrdersIcon />, color: '#8b5cf6' },
    { key: 'delivering', label: 'Đang giao', icon: <DeliveringIcon />, color: '#f59e0b' },
    { key: 'profile', label: 'Hồ sơ', icon: <ProfileIcon />, color: '#10b981' },
  ];

  return (
    <Fade in={mounted} timeout={800}>
      <Box
        sx={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#ffffff',
          borderTop: '1px solid rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          boxShadow: '0 -4px 24px rgba(0,0,0,0.1)',
          zIndex: 1200,
          px: 2,
          py: 1.5,
          backdropFilter: 'blur(10px)',
        }}
      >
        {items.map((t, idx) => {
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
                flex: 1,
                minHeight: 60,
                gap: 0.5,
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isActive ? 'scale(1.05)' : 'scale(1)',
                '&:active': {
                  transform: 'scale(0.95)',
                },
              }}
            >
              {/* Indicator khi active */}
              {isActive && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: -8,
                    width: 40,
                    height: 4,
                    borderRadius: 2,
                    background: `linear-gradient(90deg, ${t.color} 0%, ${t.color}cc 100%)`,
                    boxShadow: `0 4px 12px ${t.color}40`,
                    animation: 'slideDown 0.3s ease-out',
                    '@keyframes slideDown': {
                      '0%': { opacity: 0, transform: 'translateY(-8px)' },
                      '100%': { opacity: 1, transform: 'translateY(0)' },
                    },
                  }}
                />
              )}

              {/* Icon với animation */}
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isActive 
                    ? `linear-gradient(135deg, ${t.color}15 0%, ${t.color}25 100%)`
                    : 'transparent',
                  color: isActive ? t.color : '#9ca3af',
                  transition: 'all 0.3s ease',
                  boxShadow: isActive ? `0 4px 16px ${t.color}30` : 'none',
                  '& svg': { 
                    fontSize: 26,
                    transition: 'all 0.3s ease',
                  },
                }}
              >
                {t.icon}
              </Box>

              {/* Label */}
              <Typography 
                sx={{ 
                  fontSize: 11, 
                  fontWeight: isActive ? 800 : 600,
                  color: isActive ? t.color : '#6b7280',
                  transition: 'all 0.3s ease',
                  letterSpacing: '0.3px',
                }}
              >
                {t.label}
              </Typography>

              {/* Badge notification cho Orders */}
              {t.key === 'orders' && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 'calc(50% - 24px)',
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                    border: '2px solid #fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 10,
                    fontWeight: 800,
                    color: '#fff',
                    boxShadow: '0 4px 12px rgba(34,197,94,0.4)',
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                    '@keyframes pulse': {
                      '0%, 100%': { opacity: 1 },
                      '50%': { opacity: 0.7 },
                    },
                  }}
                >
                  3
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
    </Fade>
  );
};

export default BottomActionBar;


