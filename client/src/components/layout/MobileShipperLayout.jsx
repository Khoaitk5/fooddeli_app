import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Box, BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import HistoryIcon from '@mui/icons-material/History';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PersonIcon from '@mui/icons-material/Person';

const MobileShipperLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Xác định tab hiện tại dựa trên path
  const getCurrentTab = () => {
    const path = location.pathname;
    if (path.includes('/shipper/home')) return 0;
    if (path.includes('/shipper/available') || path.includes('/shipper/my-runs') || path.includes('/shipper/order/') || path.includes('/shipper/navigation')) return 1;
    if (path.includes('/shipper/history')) return 2;
    if (path.includes('/shipper/earnings')) return 3;
    if (path.includes('/shipper/profile') || path.includes('/shipper/settings')) return 4;
    return 0;
  };

  const handleTabChange = (event, newValue) => {
    switch (newValue) {
      case 0:
        navigate('/shipper/home');
        break;
      case 1:
        navigate('/shipper/available');
        break;
      case 2:
        navigate('/shipper/history');
        break;
      case 3:
        navigate('/shipper/earnings');
        break;
      case 4:
        navigate('/shipper/profile');
        break;
      default:
        break;
    }
  };

  return (
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

      {/* Bottom Navigation */}
      <Paper 
        elevation={8}
        sx={{ 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          zIndex: 1000,
          borderRadius: '16px 16px 0 0'
        }}
      >
        <BottomNavigation
          value={getCurrentTab()}
          onChange={handleTabChange}
          showLabels
          sx={{
            height: 80,
            '& .MuiBottomNavigationAction-root': {
              minWidth: 'auto',
              padding: '6px 0',
              '&.Mui-selected': {
                color: '#ff6b35',
              },
            },
            '& .MuiBottomNavigationAction-label': {
              fontSize: '10px',
              fontWeight: 500,
              marginTop: '4px',
            },
          }}
        >
          <BottomNavigationAction
            label="Trang chủ"
            icon={<HomeIcon />}
            sx={{ color: getCurrentTab() === 0 ? '#ff6b35' : '#6b7280' }}
          />
          <BottomNavigationAction
            label="Đơn hàng"
            icon={<LocalShippingIcon />}
            sx={{ color: getCurrentTab() === 1 ? '#ff6b35' : '#6b7280' }}
          />
          <BottomNavigationAction
            label="Lịch sử"
            icon={<HistoryIcon />}
            sx={{ color: getCurrentTab() === 2 ? '#ff6b35' : '#6b7280' }}
          />
          <BottomNavigationAction
            label="Thu nhập"
            icon={<AccountBalanceWalletIcon />}
            sx={{ color: getCurrentTab() === 3 ? '#ff6b35' : '#6b7280' }}
          />
          <BottomNavigationAction
            label="Cá nhân"
            icon={<PersonIcon />}
            sx={{ color: getCurrentTab() === 4 ? '#ff6b35' : '#6b7280' }}
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default MobileShipperLayout;
