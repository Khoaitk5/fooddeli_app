import React from 'react';
import { Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, TextField, Stack, Button, Grid } from '@mui/material';

const Customers = () => {
  return (
    <Box>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }} justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>Khách hàng</Typography>
        <TextField size="small" placeholder="Tìm khách hàng..." />
      </Stack>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={3}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle2" color="text.secondary">Tổng khách hàng</Typography>
            <Typography variant="h6">1,250</Typography>
            <Typography variant="caption" color="success.main">+8.2% tháng này</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle2" color="text.secondary">Khách hàng VIP</Typography>
            <Typography variant="h6">89</Typography>
            <Typography variant="caption" color="success.main">+12% tháng này</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle2" color="text.secondary">Khách hàng mới</Typography>
            <Typography variant="h6">156</Typography>
            <Typography variant="caption" color="success.main">+23% tuần này</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle2" color="text.secondary">Giá trị TB/khách</Typography>
            <Typography variant="h6">2.1M</Typography>
            <Typography variant="caption" color="success.main">+5.3% tháng này</Typography>
          </Paper>
        </Grid>
      </Grid>
      <Paper elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Số đơn</TableCell>
              <TableCell align="right">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[1,2,3].map(id => (
              <TableRow key={id}>
                <TableCell>{id}</TableCell>
                <TableCell>Customer {id}</TableCell>
                <TableCell>c{id}@example.com</TableCell>
                <TableCell>{id*3}</TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button size="small">Xem</Button>
                    <Button size="small" color="error">Khóa</Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default Customers;

