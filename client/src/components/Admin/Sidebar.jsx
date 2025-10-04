import React from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ activeTab, onTabChange }) => {
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: '📊' },
    { id: 'menu', label: 'Quản lý món ăn', icon: '🍽️' },
    { id: 'video', label: 'Video Review', icon: '🎥' },
    { id: 'orders', label: 'Quản lý đơn hàng', icon: '📋' }
  ];

  const handleMenuClick = (itemId) => {
    onTabChange(itemId);
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
      backgroundColor: '#f5f5f5',
      borderRight: '0.8px solid #000000',
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
        gap: '8px'
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
          <Typography sx={{ fontSize: '20px' }}>🍽️</Typography>
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
        {menuItems.map((item) => (
          <Box
            key={item.id}
            onClick={() => handleMenuClick(item.id)}
            sx={{
              padding: '8px',
              borderRadius: '8px',
              backgroundColor: activeTab === item.id ? '#e5e5e5' : 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background-color 0.2s',
              '&:hover': {
                backgroundColor: activeTab === item.id ? '#e5e5e5' : '#f0f0f0'
              }
            }}
          >
            <Typography sx={{ fontSize: '16px' }}>{item.icon}</Typography>
            <Typography sx={{
              fontSize: '14px',
              color: activeTab === item.id ? '#000000' : '#000000',
              fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif"
            }}>
              {item.label}
            </Typography>
          </Box>
        ))}
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
            height: '36px',
            backgroundColor: '#ffffff',
            border: '0.8px solid rgba(0,0,0,0.1)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '0 12.8px',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            '&:hover': {
              backgroundColor: '#f9f9f9'
            }
          }}
        >
          <Typography sx={{ fontSize: '16px' }}>🚪</Typography>
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
  );
};

export default Sidebar;
