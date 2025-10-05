import React from 'react';
import { Box, Typography, Paper, Stack, TextField, Button, Switch, FormControlLabel, Grid } from '@mui/material';

const System = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>Cài đặt hệ thống</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>Cấu hình chung</Typography>
            <Stack spacing={2}>
              <FormControlLabel control={<Switch defaultChecked />} label="Bảo trì hệ thống" />
              <TextField label="Phí giao hàng mặc định (₫)" type="number" size="small" />
              <TextField label="Tỷ lệ hoa hồng (%)" type="number" size="small" />
              <Stack direction="row" spacing={2}>
                <Button variant="contained">Lưu thay đổi</Button>
                <Button variant="outlined" color="secondary">Khôi phục mặc định</Button>
              </Stack>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>Thông tin hệ thống</Typography>
            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary">Phiên bản: 1.0.0</Typography>
              <Typography variant="body2" color="text.secondary">Kênh: Stable</Typography>
              <Typography variant="body2" color="text.secondary">Cập nhật lần cuối: hôm nay</Typography>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default System;

