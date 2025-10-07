import React from 'react';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';

const Header = ({ activeTab }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Tổng quan';
      case 'menu':
        return 'Quản lý món ăn';
      case 'video':
        return 'Video Review';
      case 'orders':
        return 'Quản lý đơn hàng';
      default:
        return 'Tổng quan';
    }
  };

  // Trên mobile, Header sẽ được ẩn vì MobileAdminLayout đã có header riêng
  if (isMobile) {
    return null;
  }

  return (
    <Box sx={{
      height: '68.8px',
      backgroundColor: '#ffffff',
      borderBottom: '0.8px solid rgba(0,0,0,0.1)',
      padding: '16px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginLeft: '256px'
    }}>
      {/* Title */}
      <Typography sx={{
        fontSize: '24px',
        fontWeight: 'normal',
        color: '#000000',
        fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif"
      }}>
        {getTitle()}
      </Typography>

      {/* Greeting */}
      <Typography sx={{
        fontSize: '16px',
        fontWeight: 'normal',
        color: '#000000',
        fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif"
      }}>
        Xin chào, Shop Manager
      </Typography>
    </Box>
  );
};

export default Header;
