import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { 
  Paper, 
  Box, 
  Typography,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import ShopSidebar from '@/components/Shop/ShopSidebar';

const MobileShopLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Sidebar */}
      <ShopSidebar open={sidebarOpen} onClose={handleSidebarClose} />
      
      {/* Main Content Area */}
      <Box sx={{ 
        marginLeft: isMobile ? 0 : '280px',
        minHeight: '100vh',
        transition: 'margin-left 0.3s ease-in-out'
      }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: { xs: '16px 20px', md: '20px 24px' },
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #f0f0f0',
            position: 'sticky',
            top: 0,
            zIndex: 999,
            minHeight: '64px'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isMobile && (
              <IconButton 
                onClick={handleSidebarToggle}
                sx={{ 
                  color: '#F9704B',
                  p: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(249, 112, 75, 0.08)'
                  }
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
            {isMobile && (
              <Typography
                sx={{
                  fontSize: '20px',
                  color: '#000',
                  fontWeight: 700,
                  letterSpacing: '-0.5px'
                }}
              >
                Quản trị cửa hàng
              </Typography>
            )}
          </Box>

          {/* User info */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                backgroundColor: '#F9704B',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                color: 'white',
                fontWeight: 600,
                boxShadow: '0 2px 8px rgba(249, 112, 75, 0.3)'
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
      </Box>
    </Box>
  );
};

export default MobileShopLayout;


