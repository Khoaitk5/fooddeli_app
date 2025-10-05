import React, { useState, useEffect } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { useLocation } from 'react-router-dom';
import Sidebar from '@/components/Admin/Sidebar';
import Header from '@/components/Admin/Header';
import DashboardOverview from '@/components/Admin/DashboardOverview';
import MenuManagement from '@/components/Admin/MenuManagement';
import VideoManagement from '@/components/Admin/VideoManagement';
import OrderManagement from '@/components/Admin/OrderManagement';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  // Đồng bộ activeTab với URL để mobile/desktop cùng điều hướng theo route
  useEffect(() => {
    if (location.pathname.includes('/shop/menu')) {
      setActiveTab('menu');
    } else if (location.pathname.includes('/shop/video')) {
      setActiveTab('video');
    } else if (location.pathname.includes('/shop/orders')) {
      setActiveTab('orders');
    } else {
      setActiveTab('dashboard');
    }
  }, [location.pathname]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'menu':
        return <MenuManagement />;
      case 'video':
        return <VideoManagement />;
      case 'orders':
        return <OrderManagement />;
      default:
        return <DashboardOverview />;
    }
  };

  // Nếu là mobile, chỉ render content vì MobileAdminLayout đã được wrap ở App.jsx
  if (isMobile) {
    return (
      <Box sx={{
        backgroundColor: '#f5f5f5',
        minHeight: '100vh',
        fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif"
      }}>
        {renderContent()}
      </Box>
    );
  }

  // Desktop layout
  return (
    <Box sx={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif"
    }}>
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Main Content */}
      <Box sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f5f5f5'
      }}>
        {/* Header */}
        <Header activeTab={activeTab} />
        
        {/* Dynamic Content */}
        <Box sx={{
          flex: 1,
          padding: '24px',
          overflow: 'auto',
          marginLeft: '256px'
        }}>
          {renderContent()}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;