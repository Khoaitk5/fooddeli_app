import React from 'react';
import { Box, Stack, Typography, Switch } from '@mui/material';

const Settings = () => {
  const [notify, setNotify] = React.useState(true);
  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ background: '#fff', p: 2, borderRadius: 2, border: '1px solid #f0f0f0' }}>
        <Typography sx={{ fontWeight: 600 }}>Thông báo</Typography>
        <Switch checked={notify} onChange={(e) => setNotify(e.target.checked)} />
      </Stack>
    </Box>
  );
};

export default Settings;


