import React from 'react';
import { Typography, Box, Grid, Paper, Stack, Divider, Chip, Avatar } from '@mui/material';
import BarChartMini from '../../components/admin/charts/BarChartMini';
import LineChartMini from '../../components/admin/charts/LineChartMini';
import PieChartMini from '../../components/admin/charts/PieChartMini';

const Dashboard = () => {
  const StatCard = ({ title, value, sub, icon }) => (
    <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider', height: '100%' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography variant="subtitle2" color="text.secondary">{title}</Typography>
          <Typography variant="h5" sx={{ mt: 0.5 }}>{value}</Typography>
          <Typography variant="caption" color="success.main">{sub}</Typography>
        </Box>
        {icon}
      </Stack>
    </Paper>
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
        Dashboard Tổng quan
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Tổng quan về hoạt động và hiệu quả kinh doanh hệ thống đặt đồ ăn nhanh
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard title="Tổng doanh thu" value="₫ 12,450,000" sub="+12.5% so với tháng trước" icon={<Avatar sx={{ bgcolor: '#FFF1EC', color: 'primary.main' }}>$</Avatar>} />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard title="Đơn hàng hôm nay" value="234" sub="+8.2% so với hôm qua" icon={<Avatar sx={{ bgcolor: '#FFF1EC', color: 'primary.main' }}>📦</Avatar>} />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard title="Tổng người dùng" value="1,491" sub="+5.3% trong tuần này" icon={<Avatar sx={{ bgcolor: '#FFF1EC', color: 'primary.main' }}>👤</Avatar>} />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard title="Shipper hoạt động" value="89" sub="+2.1% trong ngày" icon={<Avatar sx={{ bgcolor: '#FFF1EC', color: 'primary.main' }}>🚚</Avatar>} />
        </Grid>
      </Grid>
      <Box sx={{ mt: 3 }}>
        <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
          <Grid item xs={12} sm={6} md={6} lg={6}>
            <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider', height: '100%' }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="subtitle1" fontWeight={600}>Doanh thu theo tháng</Typography>
                <Stack direction="row" spacing={1}>
                  <Chip size="small" label="6 tháng" color="primary" variant="outlined" />
                  <Chip size="small" label="12 tháng" variant="outlined" />
                </Stack>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Thống kê doanh thu gần đây</Typography>
              <BarChartMini />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6}>
            <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider', height: '100%' }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="subtitle1" fontWeight={600}>Đơn hàng trong tuần</Typography>
                <Stack direction="row" spacing={1}>
                  <Chip size="small" label="Tuần này" color="primary" variant="outlined" />
                  <Chip size="small" label="Tuần trước" variant="outlined" />
                </Stack>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Số lượng đơn hàng theo ngày</Typography>
              <LineChartMini />
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle1" gutterBottom fontWeight={600}>Phân bố người dùng</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Tỷ lệ các loại người dùng trong hệ thống</Typography>
              <PieChartMini />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle1" gutterBottom fontWeight={600}>Hoạt động gần đây</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Các sự kiện mới nhất trong hệ thống</Typography>
              <Stack spacing={1}>
                {[
                  'Cửa hàng "Phở Hà Nội" đã đăng ký thành công',
                  'Shipper Nguyễn Văn A đã hoàn thành 10 đơn hàng',
                  'Có 3 đăng ký shipper chờ duyệt',
                  'Doanh thu hôm nay đã đạt 45 triệu VND',
                ].map((txt, idx) => (
                  <Stack key={idx} direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 8, height: 8, bgcolor: ['success.main','info.main','warning.main','secondary.main'][idx], borderRadius: '50%' }} />
                    <Typography variant="body2">{txt}</Typography>
                    <Chip size="small" label={["5 phút trước","15 phút trước","30 phút trước","1 giờ trước"][idx]} variant="outlined" />
                  </Stack>
                ))}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;