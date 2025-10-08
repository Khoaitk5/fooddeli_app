import React from 'react';
import { Box, Typography } from '@mui/material';

const MapView = ({ pickup, dropoff }) => {
  return (
    <Box sx={{ height: 220, background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography sx={{ color: '#6B7280' }}>
        Bản đồ (placeholder) — {pickup?.name} → {dropoff?.name}
      </Typography>
    </Box>
  );
};

export default MapView;


