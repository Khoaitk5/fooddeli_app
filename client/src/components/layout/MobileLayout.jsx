import React, { useState, useMemo, useCallback } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  BottomNavigation, 
  BottomNavigationAction, 
  Paper, 
  Box, 
  AppBar, 
  Toolbar, 
  Typography,
  useMediaQuery 
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { History, Map } from '@mui/icons-material';
import HomeIcon from '../shared/HomeIcon';
import DiscoverIcon from '../shared/DiscoverIcon';
import NotificationIcon from '../shared/NotificationIcon';
import ProfileIcon from '../shared/ProfileIcon';

const MobileLayout = () => {
  const [value, setValue] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));

  // Xác định role dựa trên path
  const isCustomer = useMemo(() => 
    location.pathname.startsWith('/customer'), 
    [location.pathname]
  );

  // Menu items được memoize để tránh re-render không cần thiết
  const navigationItems = useMemo(() => {
    if (isCustomer) {
      return [
        { label: 'Trang chủ', icon: <HomeIcon />, path: '/customer/home' },
        { label: 'Khám phá', icon: <DiscoverIcon />, path: '/customer/discover' },
        { label: 'Đơn hàng', icon: <NotificationIcon />, path: '/customer/orders' },
        { label: 'Thông báo', icon: <NotificationIcon />, path: '/customer/notifications' },
        { label: 'Hồ sơ', icon: <ProfileIcon />, path: '/customer/profile' },
      ];
    }
    
    return [
      { label: 'Đơn hàng', icon: <History />, path: '/shipper/orders' },
      { label: 'Bản đồ', icon: <Map />, path: '/shipper/map' },
      { label: 'Thông báo', icon: <NotificationIcon />, path: '/shipper/notification' },
      { label: 'Hồ sơ', icon: <ProfileIcon />, path: '/shipper/profile' },
    ];
  }, [isCustomer]);

  // Tự động cập nhật active tab dựa trên current path
  const currentValue = useMemo(() => {
    return navigationItems.findIndex(item => 
      location.pathname === item.path || 
      (item.path !== '/customer/home' && location.pathname.startsWith(item.path))
    );
  }, [navigationItems, location.pathname]);

  const handleNavigation = useCallback((event, newValue) => {
    if (newValue !== currentValue && navigationItems[newValue]) {
      setValue(newValue);
      navigate(navigationItems[newValue].path);
    }
  }, [currentValue, navigationItems, navigate]);


  // Styles được tách ra để tối ưu
  const bottomNavStyles = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: '50px',
    flexShrink: 0,
    background: '#FFF',
    boxShadow: '0 -4.69px 23.47px 0 rgba(63, 76, 95, 0.12)',
    zIndex: 1000
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Minimal Header - chỉ hiển thị khi cần */}
      {location.pathname === '/customer/home' && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #f0f0f0'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                backgroundColor: '#f5f5f5',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: '#e8e8e8',
                  transform: 'scale(1.05)'
                }
              }}
            >
              ☰
            </Box>
            <Box>
              <Typography
                sx={{
                  fontSize: '12px',
                  color: '#fc6e2a',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  lineHeight: 1
                }}
              >
                FoodDeli
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Typography
                  sx={{
                    fontSize: '14px',
                    color: '#676767',
                    lineHeight: 1,
                    fontWeight: 500
                  }}
                >
                  {isCustomer ? 'Customer' : 'Shipper'}
                </Typography>
                <Typography sx={{ fontSize: '10px', color: '#676767' }}>▼</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
      
      {/* Main Content */}
      <Box sx={{ pb: 10 }}>
        <Outlet />
      </Box>
      
      {/* Bottom Navigation */}
      <Paper sx={bottomNavStyles} elevation={0}>
        <BottomNavigation
          showLabels
          value={currentValue >= 0 ? currentValue : value}
          onChange={handleNavigation}
          sx={{
            '& .MuiBottomNavigationAction-root': {
              color: '#d3d1d8',
              gap: '4px',
              '&.Mui-selected': {
                color: '#fe724c'
              }
            },
            '& .MuiBottomNavigationAction-label': {
              fontSize: '12px',
              fontWeight: 500,
              '&.Mui-selected': {
                fontSize: '12px',
                fontWeight: 600
              }
            },
            '& .MuiBottomNavigationAction-root .MuiSvgIcon-root': {
              fontSize: '22px'
            }
          }}
        >
          {navigationItems.map((item) => (
            <BottomNavigationAction 
              key={item.label} 
              label={item.label} 
              icon={item.icon}
              role="button"
              aria-label={`Điều hướng đến ${item.label}`}
              tabIndex={0}
            />
          ))}
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default MobileLayout;