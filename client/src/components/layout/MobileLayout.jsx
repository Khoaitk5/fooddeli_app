import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, Paper, Box, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { History, Map, Notifications } from '@mui/icons-material';
import HomeIcon from '../shared/HomeIcon';
import DiscoverIcon from '../shared/DiscoverIcon';
import NotificationIcon from '../shared/NotificationIcon';
import ProfileIcon from '../shared/ProfileIcon';

const MobileLayout = () => {
  const [value, setValue] = React.useState(0);
  // const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Xác định role dựa trên path
  const isCustomer = location.pathname.startsWith('/customer');
  const isShipper = location.pathname.startsWith('/shipper');

  const customerMenu = [
    { label: 'Trang chủ', icon: <HomeIcon />, path: '/customer/home' },
    { label: 'Khám phá', icon: <DiscoverIcon />, path: '/customer/discover' },
    { label: 'Thông báo', icon: <NotificationIcon />, path: '/customer/notifications' },
    { label: 'Hồ sơ', icon: <ProfileIcon />, path: '/customer/profile' },
  ];

  const shipperMenu = [
    { label: 'Đơn hàng', icon: <History />, path: '/shipper/orders' },
    { label: 'Bản đồ', icon: <Map />, path: '/shipper/map' },
    { label: 'Thông báo', icon: <NotificationIcon />, path: '/shipper/notification' },
    { label: 'Hồ sơ', icon: <ProfileIcon />, path: '/shipper/profile' },
  ];

  const navigationItems = isCustomer ? customerMenu : shipperMenu;

  const handleNavigation = (event, newValue) => {
    setValue(newValue);
    navigate(navigationItems[newValue].path);
  };

  const title = isCustomer ? 'FoodDeli - Customer' : 'FoodDeli - Shipper';

  return (
    <Box sx={{ pb: 7 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          {/* <IconButton color="inherit" onClick={logout}>
            Logout
          </IconButton> */}
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 2 }}>
        <Outlet />
      </Box>
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, width: '383px', height: '57.5px', flexShrink: 0, background: '#FFF', boxShadow: '0 -4.69px 23.47px 0 rgba(63, 76, 95, 0.12)' }} elevation={0}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={handleNavigation}
        >
          {navigationItems.map((item) => (
            <BottomNavigationAction key={item.label} label={item.label} icon={item.icon} />
          ))}
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default MobileLayout;