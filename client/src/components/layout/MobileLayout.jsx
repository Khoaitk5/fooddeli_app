  import React from 'react';
  import { Outlet, useLocation } from 'react-router-dom';
  import { Box } from '@mui/material';
  import MobileTopBar from '../shared/MobileTopBar';
  import MobileBottomNav from '../shared/MobileBottomNav';

  const MobileLayout = () => {
    const location = useLocation();

    // Xác định role dựa trên path
    const isCustomer = location.pathname.startsWith('/customer');
    const title = isCustomer ? 'FoodDeli - Customer' : 'FoodDeli - Shipper';

    return (
      <Box sx={{ pb: 7 }}>
        <MobileTopBar title={title} />
        <Box sx={{ p: 2 }}>
          <Outlet />
        </Box>
        {isCustomer && <MobileBottomNav />}
      </Box>
    );
  };

  export default MobileLayout;