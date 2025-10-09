import React from 'react';
import { Box, Switch, Typography, Stack, Button } from '@mui/material';
import { useShipper } from '@/hooks/useShipper';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { shipper, isOnline, setIsOnline } = useShipper();
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box sx={{ width: 56, height: 56, borderRadius: '50%', background: '#F9704B', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
          {shipper.name?.[0] || 'S'}
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 700 }}>{shipper.name}</Typography>
          <Typography sx={{ color: '#6B7280', fontSize: 13 }}>{shipper.phone}</Typography>
        </Box>
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ background: '#fff', p: 2, borderRadius: 2, border: '1px solid #f0f0f0' }}>
        <Typography sx={{ fontWeight: 600 }}>Sẵn sàng nhận đơn</Typography>
        <Switch checked={isOnline} onChange={(e) => setIsOnline(e.target.checked)} />
      </Stack>

      <Button variant="outlined" onClick={() => navigate('/shipper/settings')}>Cài đặt</Button>
    </Box>
  );
};

export default Profile;


