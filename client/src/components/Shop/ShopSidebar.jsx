// import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  Restaurant as RestaurantIcon,
  ShoppingCart as OrdersIcon,
  VideoLibrary as VideoIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import React, { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";


const ShopSidebar = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const menuItems = [
    {
      label: 'Tổng quan',
      icon: <DashboardIcon />,
      path: '/shop/dashboard',
      active: location.pathname === '/shop/dashboard'
    },
    {
      label: 'Quản lý món ăn',
      icon: <RestaurantIcon />,
      path: '/shop/menu',
      active: location.pathname === '/shop/menu'
    },
    {
      label: 'Đơn hàng',
      icon: <OrdersIcon />,
      path: '/shop/orders',
      active: location.pathname === '/shop/orders'
    },
    {
      label: 'Video Reviews',
      icon: <VideoIcon />,
      path: '/shop/video',
      active: location.pathname === '/shop/video'
    },
    {
      label: 'Cài đặt',
      icon: <SettingsIcon />,
      path: '/shop/settings',
      active: location.pathname === '/shop/settings'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const handleLogout = () => {
    // TODO: Implement logout logic
    console.log('Logout');
  };

  const drawerContent = (
    <Box sx={{ width: 280, height: '100%', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{
        p: 3,
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: '80px'
      }}>
        <Box>
          <Typography
            sx={{
              fontSize: '18px',
              color: '#F9704B',
              fontWeight: 700,
              textTransform: 'uppercase',
              lineHeight: 1.2,
              letterSpacing: '0.5px'
            }}
          >
            Bobo Food
          </Typography>
          <Typography
            sx={{
              fontSize: '14px',
              color: '#676767',
              lineHeight: 1.2,
              fontWeight: 500,
              mt: 0.5
            }}
          >
            Quản trị cửa hàng
          </Typography>
        </Box>

        {isMobile && (
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              color: '#676767',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.04)',
                color: '#F9704B'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      {/* User Info */}
      <Box sx={{ p: 3, borderBottom: '1px solid #f0f0f0', minHeight: '80px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 52,
              height: 52,
              backgroundColor: '#F9704B',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              color: 'white',
              fontWeight: 600,
              boxShadow: '0 2px 8px rgba(249, 112, 75, 0.3)'
            }}
          >
            A
          </Box>
          <Box>
            <Typography sx={{
              fontSize: '16px',
              fontWeight: 600,
              color: '#000',
              lineHeight: 1.2
            }}>
              {user?.shop_profile?.shop_name
                ? user.shop_profile.shop_name
                : `Chủ cửa hàng ${user ? `#${user.id}` : ''}`}
            </Typography>
            <Typography sx={{
              fontSize: '14px',
              color: '#676767',
              lineHeight: 1.2,
              mt: 0.5
            }}>
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Navigation Menu */}
      <Box sx={{ flex: 1, py: 1 }}>
        <List sx={{ px: 2 }}>
          {menuItems.map((item, index) => (
            <ListItem key={index} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: '12px',
                  backgroundColor: item.active ? '#F9704B' : 'transparent',
                  color: item.active ? '#ffffff' : '#676767',
                  py: 1.5,
                  px: 2,
                  '&:hover': {
                    backgroundColor: item.active ? '#F9704B' : '#f8f9fa',
                    color: item.active ? '#ffffff' : '#F9704B'
                  },
                  transition: 'all 0.2s ease-in-out',
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: item.active ? '4px' : '0px',
                    height: '20px',
                    backgroundColor: '#F9704B',
                    borderRadius: '0 2px 2px 0',
                    transition: 'width 0.2s ease-in-out'
                  }
                }}
              >
                <ListItemIcon sx={{
                  minWidth: 44,
                  color: item.active ? '#ffffff' : '#676767',
                  '& .MuiSvgIcon-root': {
                    fontSize: '22px'
                  }
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '15px',
                    fontWeight: item.active ? 600 : 500,
                    letterSpacing: '-0.2px'
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Logout Button */}
      <Box sx={{ p: 2, borderTop: '1px solid #f0f0f0', mt: 'auto' }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: '12px',
              color: '#dc3545',
              py: 1.5,
              px: 2,
              '&:hover': {
                backgroundColor: 'rgba(220, 53, 69, 0.08)',
                color: '#c82333'
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            <ListItemIcon sx={{
              minWidth: 44,
              color: '#dc3545',
              '& .MuiSvgIcon-root': {
                fontSize: '22px'
              }
            }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Đăng xuất"
              primaryTypographyProps={{
                fontSize: '15px',
                fontWeight: 500,
                letterSpacing: '-0.2px'
              }}
            />
          </ListItemButton>
        </ListItem>
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        anchor="left"
        open={open}
        onClose={onClose}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Box
      sx={{
        width: 280,
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        backgroundColor: '#ffffff',
        borderRight: '1px solid #f0f0f0',
        zIndex: 1000,
        boxShadow: '2px 0 10px rgba(0,0,0,0.05)'
      }}
    >
      {drawerContent}
    </Box>
  );
};

export default ShopSidebar;


