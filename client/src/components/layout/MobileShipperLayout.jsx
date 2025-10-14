import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Box, Fade } from '@mui/material';
import BottomActionBar from '@/components/Shipper/BottomActionBar';
import ShipperProvider from '@/contexts/ShipperContext.jsx';

const MobileShipperLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Xác định key active cho BottomActionBar dựa trên path
  const getActiveKey = () => {
    const path = location.pathname;
    if (path.includes('/shipper/home')) return 'home';
    if (path.includes('/shipper/available')) return 'orders';
    if (path.includes('/shipper/delivering')) return 'delivering';
    if (path.includes('/shipper/profile')) return 'profile';
    return 'home';
  };

  // Ẩn thanh bar ở các trang cụ thể
  const hideBottomBar = ['/shipper/history', '/shipper/wallet'].some(path =>
    location.pathname.includes(path)
  );

  // Điều hướng khi nhấn vào thanh bar
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
      <Fade in={mounted} timeout={600}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)',
            position: 'relative',
          }}
        >
          {/* Main Content với smooth scrolling */}
          <Box
            sx={{
              flex: 1,
              overflow: 'auto',
              overflowX: 'hidden',
              paddingBottom: hideBottomBar ? 0 : '90px', // Chừa chỗ cho bottom navigation nếu có
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch',
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'transparent',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '3px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: 'rgba(0,0,0,0.3)',
              },
            }}
          >
            <Outlet />
          </Box>

          {/* Bottom Action Bar — ẩn ở History & Wallet */}
          {!hideBottomBar && (
            <BottomActionBar
              active={getActiveKey()}
              onNavigate={handleNavigate}
            />
          )}
        </Box>
      </Fade>
    </ShipperProvider>
  );
};

export default MobileShipperLayout;
