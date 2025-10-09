import React from 'react';
import { Box, Stack, Typography, Switch, Chip } from '@mui/material';
import { useShipper } from '@/hooks/useShipper';

const ShipperHeader = () => {
  const { shipper, isOnline, setIsOnline } = useShipper();

  return (
    <Box sx={{ px: 2, pt: 1.5, pb: 2, background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box sx={{ width: 44, height: 44, borderRadius: '50%', background: '#F9704B', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
            {shipper.name?.[0] || 'S'}
          </Box>
          <Box>
            <Typography sx={{ fontSize: 13, color: '#6B7280' }}>Xin chào,</Typography>
            <Typography sx={{ fontWeight: 800, fontSize: 18, letterSpacing: -0.2 }}>{shipper.name || 'Shipper'}</Typography>
          </Box>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography sx={{ fontSize: 12, color: '#6B7280', fontWeight: 600 }}>
            {isOnline ? 'Đang trực' : 'Ngoại tuyến'}
          </Typography>
          <Switch checked={isOnline} onChange={(e) => setIsOnline(e.target.checked)} size="small" />
        </Stack>
      </Stack>

      <Stack direction="row" spacing={1} sx={{ mt: 1.25 }}>
        <Chip label="Ca hôm nay: 0 đơn" size="small" variant="outlined" />
        <Chip label="Thu nhập hôm nay: 0đ" size="small" variant="outlined" />
      </Stack>
    </Box>
  );
};

export default ShipperHeader;


