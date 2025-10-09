import React from 'react';
import { Box, Typography } from '@mui/material';
import MapView from '@/components/Shipper/MapView';
import { useMyRuns } from '@/hooks/useMyRuns';

const Navigation = () => {
  const { runs } = useMyRuns();
  const current = runs[0];

  if (!current) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>Chưa có đơn đang chạy</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <MapView pickup={current.pickup} dropoff={current.dropoff} path={current.path} />
    </Box>
  );
};

export default Navigation;


