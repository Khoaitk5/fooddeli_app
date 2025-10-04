import React, { useState, useMemo } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Paper, 
  Box, 
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { useAuth } from '@/hooks/useAuth';

const MobileAdminLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  // Menu items cho admin
  const navigationItems = useMemo(() => [
    { id: 'dashboard', label: 'Tổng quan', icon: '📊', path: '/admin/dashboard', tab: 'dashboard' },
    { id: 'menu', label: 'Món ăn', icon: '🍽️', path: '/admin/menu', tab: 'menu' },
    { id: 'video', label: 'Video', icon: '🎥', path: '/admin/video', tab: 'video' },
    { id: 'orders', label: 'Đơn hàng', icon: '📋', path: '/admin/orders', tab: 'orders' },
  ], []);

  // Xác định active tab dựa trên current path
  const currentValue = useMemo(() => {
    return navigationItems.findIndex(item => 
      location.pathname === item.path || 
      location.pathname.startsWith(item.path)
    );
  }, [navigationItems, location.pathname]);


  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };


  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Header với hamburger menu */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #f0f0f0',
          position: 'sticky',
          top: 0,
          zIndex: 999
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <IconButton
            onClick={handleDrawerToggle}
            sx={{
              width: 40,
              height: 40,
              backgroundColor: '#f5f5f5',
              borderRadius: '12px',
              '&:hover': {
                backgroundColor: '#e8e8e8',
              }
            }}
          >
            ☰
          </IconButton>
          <Box>
            <Typography
              sx={{
                fontSize: '12px',
                color: '#F9704B',
                fontWeight: 600,
                textTransform: 'uppercase',
                lineHeight: 1
              }}
            >
              FoodDeli
            </Typography>
            <Typography
              sx={{
                fontSize: '14px',
                color: '#676767',
                lineHeight: 1,
                fontWeight: 500
              }}
            >
              Admin Dashboard
            </Typography>
          </Box>
        </Box>

        {/* User info */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              backgroundColor: '#F9704B',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              color: 'white'
            }}
          >
            A
          </Box>
        </Box>
      </Box>
      
      {/* Main Content */}
      <Box sx={{ pb: 2 }}>
        <Outlet />
      </Box>
      
      {/* Bottom Navigation - Đã ẩn */}
      {/* <Paper sx={bottomNavStyles} elevation={0}>
        <BottomNavigation
          showLabels={!isXs}
          value={currentValue >= 0 ? currentValue : value}
          onChange={handleNavigation}
          sx={{
            '& .MuiBottomNavigationAction-root': {
              color: '#95989f',
              '&.Mui-selected': {
                color: '#F9704B'
              }
            },
            '& .MuiBottomNavigationAction-label': {
              fontSize: { xs: '9px', sm: '10px' },
              fontWeight: 500,
              '&.Mui-selected': {
                fontSize: { xs: '9px', sm: '10px' },
                fontWeight: 600
              }
            }
          }}
        >
          {navigationItems.map((item) => (
            <BottomNavigationAction 
              key={item.label} 
              label={item.label} 
              icon={<Typography sx={{ fontSize: '20px' }}>{item.icon}</Typography>}
              role="button"
              aria-label={`Điều hướng đến ${item.label}`}
              tabIndex={0}
            />
          ))}
        </BottomNavigation>
      </Paper> */}

      {/* Drawer cho menu chi tiết */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            backgroundColor: '#f5f5f5'
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          {/* Logo Section */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px',
            padding: '16px',
            backgroundColor: '#ffffff',
            borderRadius: '12px'
          }}>
            <Box sx={{
              width: '40px',
              height: '40px',
              backgroundColor: '#F9704B',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Typography sx={{ fontSize: '24px' }}>🍽️</Typography>
            </Box>
            <Box>
              <Typography sx={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#000000',
                fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif"
              }}>
                Shop Manager
              </Typography>
              <Typography sx={{
                fontSize: '12px',
                color: '#717182',
                fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif"
              }}>
                Admin Dashboard
              </Typography>
            </Box>
          </Box>

          {/* Menu Items */}
          <List>
            {navigationItems.map((item) => (
              <ListItem
                key={item.id}
                onClick={() => {
                  navigate(item.path);
                  setDrawerOpen(false);
                }}
                sx={{
                  borderRadius: '8px',
                  marginBottom: '4px',
                  cursor: 'pointer',
                  backgroundColor: currentValue === navigationItems.indexOf(item) ? '#e5e5e5' : 'transparent',
                  '&:hover': {
                    backgroundColor: currentValue === navigationItems.indexOf(item) ? '#e5e5e5' : '#f0f0f0'
                  }
                }}
              >
                <ListItemIcon>
                  <Typography sx={{ fontSize: '20px' }}>{item.icon}</Typography>
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontSize: '14px',
                      fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif"
                    }
                  }}
                />
              </ListItem>
            ))}
          </List>

          {/* Logout Button */}
          <Box sx={{ marginTop: 'auto', padding: '16px' }}>
            <Box
              onClick={handleLogout}
              sx={{
                width: '100%',
                height: '44px',
                backgroundColor: '#ffffff',
                border: '1px solid rgba(0,0,0,0.1)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '0 16px',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                '&:hover': {
                  backgroundColor: '#f9f9f9'
                }
              }}
            >
              <Typography sx={{ fontSize: '18px' }}>🚪</Typography>
              <Typography sx={{
                fontSize: '14px',
                color: '#000000',
                fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif"
              }}>
                Đăng xuất
              </Typography>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default MobileAdminLayout;
