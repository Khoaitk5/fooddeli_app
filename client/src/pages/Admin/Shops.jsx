import React from 'react';
import { Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, TextField, Stack, Button, Chip, Grid } from '@mui/material';

const Shops = () => {
  return (
    <Box>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }} justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>Cửa hàng</Typography>
        <TextField size="small" placeholder="Tìm cửa hàng..." />
      </Stack>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={3}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle2" color="text.secondary">Tổng cửa hàng</Typography>
            <Typography variant="h6">85</Typography>
            <Typography variant="caption" color="success.main">+5 cửa hàng mới</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle2" color="text.secondary">Đang hoạt động</Typography>
            <Typography variant="h6">72</Typography>
            <Typography variant="caption" color="success.main">84.7% tổng số</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle2" color="text.secondary">Chờ duyệt</Typography>
            <Typography variant="h6">8</Typography>
            <Typography variant="caption" color="warning.main">Cần xử lý</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle2" color="text.secondary">Đánh giá TB</Typography>
            <Typography variant="h6">4.6</Typography>
            <Typography variant="caption" color="success.main">+0.2 điểm</Typography>
          </Paper>
        </Grid>
      </Grid>
      <Paper elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Đơn/tháng</TableCell>
              <TableCell align="right">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[1,2,3].map(id => (
              <TableRow key={id}>
                <TableCell>{id}</TableCell>
                <TableCell>Shop {id}</TableCell>
                <TableCell><Chip label={id%2? 'Đang mở' : 'Tạm dừng'} color={id%2? 'success':'warning'} size="small" /></TableCell>
                <TableCell>{id*120}</TableCell>
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

export default Shops;

