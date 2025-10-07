import React from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import RestaurantMenuOutlinedIcon from '@mui/icons-material/RestaurantMenuOutlined';
import OndemandVideoOutlinedIcon from '@mui/icons-material/OndemandVideoOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

const Sidebar = ({ activeTab, onTabChange }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: <HomeOutlinedIcon sx={{ fontSize: 20 }} /> },
    { id: 'menu', label: 'Quản lý món ăn', icon: <RestaurantMenuOutlinedIcon sx={{ fontSize: 20 }} /> },
    { id: 'video', label: 'Video Review', icon: <OndemandVideoOutlinedIcon sx={{ fontSize: 20 }} /> },
    { id: 'orders', label: 'Quản lý đơn hàng', icon: <AssignmentOutlinedIcon sx={{ fontSize: 20 }} /> }
  ];

  const pathById = {
    dashboard: '/shop/dashboard',
    menu: '/shop/menu',
    video: '/shop/video',
    orders: '/shop/orders'
  };

  const currentIdFromPath = () => {
    if (location.pathname.includes('/shop/menu')) return 'menu';
    if (location.pathname.includes('/shop/video')) return 'video';
    if (location.pathname.includes('/shop/orders')) return 'orders';
    return 'dashboard';
  };

  const resolvedActiveTab = activeTab || currentIdFromPath();

  const handleMenuClick = (itemId) => {
    if (onTabChange) onTabChange(itemId);
    const path = pathById[itemId] || '/shop/dashboard';
    navigate(path);
  };

  const handleLogout = () => {
    // TODO: Implement logout logic
    console.log('Logout');
    navigate('/login');
  };

  return (
    <Box sx={{
      width: '256px',
      height: '100vh',
      backgroundColor: '#ffffff',
      borderRight: '0.8px solid rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 1000
    }}>
      {/* Logo Section */}
      <Box sx={{
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        borderBottom: '0.8px solid rgba(0,0,0,0.1)'
      }}>
        <Box sx={{
          width: '32px',
          height: '32px',
          backgroundColor: '#F9704B',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <RestaurantMenuOutlinedIcon sx={{ color: '#fff', fontSize: 20 }} />
        </Box>
        <Typography sx={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#000000',
          fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif"
        }}>
          Shop Manager
        </Typography>
      </Box>

      {/* Menu Items */}
      <Box sx={{
        flex: 1,
        padding: '0 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
      }}>
        {menuItems.map((item) => {
          const isActive = (resolvedActiveTab === item.id);
          return (
            <Box
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
            sx={{
                height: '40px',
                padding: '0 12px',
                borderRadius: '12px',
                backgroundColor: isActive ? '#f3f3f5' : 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'background-color 0.2s',
                color: isActive ? '#030213' : '#0f172a',
                '&:hover': {
                  backgroundColor: isActive ? '#f3f3f5' : '#f8f8f8'
                }
              }}
            >
              <Box sx={{ color: isActive ? '#030213' : '#0f172a' }}>{item.icon}</Box>
              <Typography sx={{
                fontSize: '16px',
                color: isActive ? '#030213' : '#0f172a',
                fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif"
              }}>
                {item.label}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* Logout Button */}
      <Box sx={{
        padding: '16px',
        marginTop: 'auto'
      }}>
        <Box
          onClick={handleLogout}
          sx={{
            width: '100%',
            height: '44px',
            backgroundColor: '#ffffff',
            border: '0.8px solid rgba(0,0,0,0.1)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '0 16px',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            '&:hover': {
              backgroundColor: '#f9f9f9'
            }
          }}
        >
          <LogoutOutlinedIcon sx={{ fontSize: 20 }} />
          <Typography sx={{
            fontSize: '16px',
            color: '#000000',
            fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif"
          }}>
            Đăng xuất
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;


