import React, { useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { 
  Box, 
  useMediaQuery 
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

const MobileLayout = () => {
  const location = useLocation();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));

  // Xác định role dựa trên path
  const isCustomer = useMemo(() => 
    location.pathname.startsWith('/customer'), 
    [location.pathname]
  );

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Main Content */}
      <Box>
        <Outlet />
      </Box>
    </Box>
  );
};

export default MobileLayout;