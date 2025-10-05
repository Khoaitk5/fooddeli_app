import React from 'react';
import { Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, Chip, Stack, TextField, Grid } from '@mui/material';

const VideoReports = () => {
  const rows = [
    { id: 1, videoId: 'VID123', reason: 'Spam', status: 'Pending' },
    { id: 2, videoId: 'VID456', reason: 'Inappropriate', status: 'Resolved' },
  ];

  return (
    <Box>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }} justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>Quản lý report videos</Typography>
        <TextField size="small" placeholder="Tìm video..." />
      </Stack>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={3}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle2" color="text.secondary">Tổng báo cáo</Typography>
            <Typography variant="h6">5</Typography>
            <Typography variant="caption" color="text.secondary">Video được báo cáo</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle2" color="text.secondary">Chờ xử lý</Typography>
            <Typography variant="h6">2</Typography>
            <Typography variant="caption" color="warning.main">Cần xem xét</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle2" color="text.secondary">Đang xem xét</Typography>
            <Typography variant="h6">1</Typography>
            <Typography variant="caption" color="info.main">Đang xử lý</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle2" color="text.secondary">Đã xử lý</Typography>
            <Typography variant="h6">1</Typography>
            <Typography variant="caption" color="success.main">Hoàn thành</Typography>
          </Paper>
        </Grid>
      </Grid>
      <Paper elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Video</TableCell>
              <TableCell>Lý do</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="right">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(r => (
              <TableRow key={r.id}>
                <TableCell>{r.id}</TableCell>
                <TableCell>{r.videoId}</TableCell>
                <TableCell>{r.reason}</TableCell>
                <TableCell>
                  <Chip label={r.status} color={r.status === 'Pending' ? 'warning' : 'success'} size="small" />
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button size="small">Xem</Button>
                    <Button size="small" color="success">Đánh dấu xử lý</Button>
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

export default VideoReports;

