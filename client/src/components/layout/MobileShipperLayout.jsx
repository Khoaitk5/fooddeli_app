import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import BottomActionBar from '@/components/Shipper/BottomActionBar';
import ShipperProvider from '@/contexts/ShipperContext.jsx';

const MobileShipperLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Xác định key active cho BottomActionBar dựa trên path
  const getActiveKey = () => {
    const path = location.pathname;
    if (path.includes('/shipper/home')) return 'home';
    if (path.includes('/shipper/available')) return 'orders';
    if (path.includes('/shipper/delivering')) return 'delivering';
    if (path.includes('/shipper/profile')) return 'profile';
    return 'home';
  };

  const handleNavigate = (key) => {
    switch (key) {
      case 'home':
        navigate('/shipper/home');
        break;
      case 'orders':
        navigate('/shipper/available');
        break;
      case 'delivering':
        navigate('/shipper/delivering');
        break;
      case 'profile':
        navigate('/shipper/profile');
        break;
      default:
        break;
    }
  };

  return (
    <ShipperProvider>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100vh',
        backgroundColor: '#f8fafc'
      }}>
        {/* Main Content */}
        <Box sx={{ 
          flex: 1, 
          overflow: 'auto',
          paddingBottom: '80px' // Chừa chỗ cho bottom navigation
        }}>
          <Outlet />
        </Box>

        {/* Bottom Action Bar */}
        <BottomActionBar active={getActiveKey()} onNavigate={handleNavigate} />
      </Box>
    </ShipperProvider>
  );
};

export default MobileShipperLayout;
