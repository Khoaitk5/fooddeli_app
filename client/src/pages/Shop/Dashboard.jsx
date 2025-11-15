import React, { useContext, useEffect, useState } from 'react';
import { Typography, Box, Grid, Paper, Stack, Chip, LinearProgress, Divider, CircularProgress } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ShopContext } from '../../contexts/ShopContext';

const API_BASE = 'http://localhost:5000/api/shops';

const Dashboard = () => {
  const shopId = useContext(ShopContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const formatCurrency = (value) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(value || 0);

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!shopId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/${shopId}/dashboard`, {
          credentials: 'include',
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          console.error('❌ Lỗi lấy dashboard shop:', data);
          setStats(null);
        } else {
          setStats(data.data);
        }
      } catch (err) {
        console.error('❌ Lỗi gọi API dashboard shop:', err);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [shopId]);

  const revenueData = (stats?.monthly || []).map((m) => ({
    month: `T${m.month}`,
    revenue: m.revenue,
    orders: m.orders,
  }));

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const averageRevenue = revenueData.length
    ? Math.round(totalRevenue / revenueData.length)
    : 0;
  const maxMonth = revenueData.length
    ? revenueData.reduce((max, item) => (item.revenue > max.revenue ? item : max))
    : { month: '-', revenue: 0 };
  const totalOrders = revenueData.reduce((sum, item) => sum + item.orders, 0);

  const today = stats?.today || { totalOrders: 0, revenue: 0, statusCounts: {} };
  const statusCounts = today.statusCounts || {};
  const totalToday = today.totalOrders || 0;
  const completedCount = statusCounts.completed || 0;
  const inProgressCount = (statusCounts.cooking || 0) + (statusCounts.shipping || 0);
  const pendingCount = statusCounts.pending || 0;
  const base = totalToday > 0 ? totalToday : 1;
  const completedPct = Math.round((completedCount * 100) / base);
  const inProgressPct = Math.round((inProgressCount * 100) / base);
  const pendingPct = Math.round((pendingCount * 100) / base);

  const statusConfig = (status) => {
    switch (status) {
      case 'pending':
        return { text: 'chờ', color: { bg: '#fef9c2', text: '#894b00' } };
      case 'cooking':
        return { text: 'chế biến', color: { bg: '#dbeafe', text: '#193cb8' } };
      case 'shipping':
        return { text: 'đang giao', color: { bg: '#e0f2fe', text: '#075985' } };
      case 'completed':
        return { text: 'hoàn tất', color: { bg: '#dcfce7', text: '#016630' } };
      case 'cancelled':
        return { text: 'đã huỷ', color: { bg: '#fee2e2', text: '#991b1b' } };
      default:
        return { text: status || 'khác', color: { bg: '#e5e7eb', text: '#111827' } };
    }
  };

  const StatCard = ({ title, value, sub, iconBg, icon }) => (
    <Paper 
      elevation={0} 
      sx={{ 
        p: { xs: 2, sm: 3 }, 
        borderRadius: '16px', 
        border: '1px solid rgba(0,0,0,0.08)', 
        height: { xs: '100px', sm: '120px' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
          border: '1px solid rgba(249, 112, 75, 0.2)'
        }
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" sx={{ color: '#717182', fontSize: { xs: '12px', sm: '14px' }, mb: 1, fontWeight: 500 }}>
          {title}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: '20px', sm: '24px', md: '28px' }, color: '#000', mb: 0.5, lineHeight: 1.2 }}>
          {value}
        </Typography>
        <Typography variant="caption" sx={{ color: '#717182', fontSize: { xs: '11px', sm: '12px' }, fontWeight: 500 }}>
          {sub}
        </Typography>
      </Box>
      <Box 
        sx={{ 
          width: { xs: 40, sm: 48 }, 
          height: { xs: 40, sm: 48 }, 
          borderRadius: '12px', 
          backgroundColor: iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        <Typography sx={{ fontSize: { xs: '20px', sm: '24px' } }}>
          {icon}
        </Typography>
      </Box>
    </Paper>
  );

  const OrderItem = ({ id, statusText, statusColor, customer, items, time }) => (
    <Box 
      sx={{ 
        border: '1px solid rgba(0,0,0,0.08)', 
        borderRadius: '12px', 
        p: { xs: 1.5, sm: 2 }, 
        mb: 2,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          border: '1px solid rgba(249, 112, 75, 0.2)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0, mr: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: { xs: '14px', sm: '16px' }, flexShrink: 0 }}>
            {id}
          </Typography>
          <Chip 
            label={statusText} 
            size="small" 
            sx={{ backgroundColor: statusColor.bg, color: statusColor.text, fontSize: { xs: '10px', sm: '12px' }, height: { xs: '20px', sm: '22px' }, borderRadius: '8px', fontWeight: 500, flexShrink: 0 }} 
          />
        </Stack>
        <Typography variant="body2" sx={{ color: '#717182', fontSize: { xs: '13px', sm: '14px' }, mb: 0.5, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {customer}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: { xs: '13px', sm: '14px' }, fontWeight: 500, maxHeight: '2.5em', lineHeight: 1.25, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {items}
        </Typography>
      </Box>
      <Typography variant="caption" sx={{ color: '#717182', fontSize: { xs: '11px', sm: '12px' }, fontWeight: 500, flexShrink: 0, minWidth: 'fit-content', textAlign: 'right' }}>
        {time}
      </Typography>
    </Box>
  );

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f9fafb', p: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
        <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: '20px', sm: '24px', md: '28px' }, mb: 1, letterSpacing: '-0.5px' }}>
          Tổng quan
        </Typography>
        <Typography variant="body2" sx={{ color: '#717182', fontSize: { xs: '14px', sm: '16px' }, fontWeight: 500 }}>
          Hiệu suất hoạt động cửa hàng hôm nay
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(1, minmax(0, 1fr))', sm: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' }, gap: { xs: 2, sm: 3 }, mb: { xs: 3, sm: 4 } }}>
        <StatCard title="Tổng món ăn" value={stats?.totalProducts ?? 0} sub="Đang phục vụ" iconBg="#dbeafe" icon="🍲" />
        <StatCard title="Video Reviews" value={stats?.totalVideos ?? 0} sub="Video đã upload" iconBg="#f3e8ff" icon="🎬" />
        <StatCard title="Đơn hàng hôm nay" value={today.totalOrders} sub="Trong ngày" iconBg="#dcfce7" icon="🧾" />
        <StatCard title="Doanh thu" value={formatCurrency(today.revenue)} sub="Trong ngày" iconBg="#ffedd4" icon="$" />
      </Box>

      {/* Revenue Chart */}
      <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, borderRadius: '16px', border: '1px solid rgba(0,0,0,0.08)', mb: { xs: 3, sm: 4 }, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: '16px', sm: '18px' }, mb: 1, letterSpacing: '-0.3px' }}>
            Doanh thu theo tháng
          </Typography>
          <Typography variant="body2" sx={{ color: '#717182', fontSize: { xs: '14px', sm: '16px' }, fontWeight: 500 }}>
            Tổng quan doanh thu 12 tháng trong năm
          </Typography>
        </Box>
        <Box sx={{ height: { xs: 250, sm: 300, md: 350 } }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData} margin={{ top: 8, right: 16, left: -8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v/1000000).toFixed(0)}M`} />
              <Tooltip 
                formatter={(value) => [`${(value/1000000).toFixed(1)}M ₫`, 'Doanh thu']}
                labelStyle={{ color: '#111827' }}
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
              />
              <Line type="monotone" dataKey="revenue" stroke="#ff6900" strokeWidth={3} dot={{ r: 4, fill: '#ff6900' }} activeDot={{ r: 6, strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Paper>

      <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, borderRadius: '16px', border: '1px solid rgba(0,0,0,0.08)', mb: { xs: 3, sm: 4 }, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: '16px', sm: '18px' }, mb: 1, letterSpacing: '-0.3px' }}>
            Tóm tắt hiệu suất
          </Typography>
          <Typography variant="body2" sx={{ color: '#717182', fontSize: { xs: '14px', sm: '16px' }, fontWeight: 500 }}>
            Tổng quan nhanh về doanh thu và đơn hàng
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 2, sm: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center', p: 2, borderRadius: '12px', backgroundColor: 'rgba(0, 166, 62, 0.05)', border: '1px solid rgba(0, 166, 62, 0.1)' }}>
              <Typography variant="body2" sx={{ color: '#717182', fontSize: { xs: '12px', sm: '14px' }, mb: 1, fontWeight: 500 }}>Tổng doanh thu</Typography>
              <Typography variant="h6" sx={{ color: '#00a63e', fontWeight: 700, fontSize: { xs: '16px', sm: '18px' } }}>
                {formatCurrency(totalRevenue)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center', p: 2, borderRadius: '12px', backgroundColor: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.08)' }}>
              <Typography variant="body2" sx={{ color: '#717182', fontSize: { xs: '12px', sm: '14px' }, mb: 1, fontWeight: 500 }}>TB/tháng</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: '16px', sm: '18px' } }}>
                {formatCurrency(averageRevenue)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center', p: 2, borderRadius: '12px', backgroundColor: 'rgba(245, 73, 0, 0.05)', border: '1px solid rgba(245, 73, 0, 0.1)' }}>
              <Typography variant="body2" sx={{ color: '#717182', fontSize: { xs: '12px', sm: '14px' }, mb: 1, fontWeight: 500 }}>Tháng cao nhất</Typography>
              <Typography variant="h6" sx={{ color: '#f54900', fontWeight: 700, fontSize: { xs: '16px', sm: '18px' } }}>
                {maxMonth.month}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center', p: 2, borderRadius: '12px', backgroundColor: 'rgba(249, 112, 75, 0.05)', border: '1px solid rgba(249, 112, 75, 0.1)' }}>
              <Typography variant="body2" sx={{ color: '#717182', fontSize: { xs: '12px', sm: '14px' }, mb: 1, fontWeight: 500 }}>Tổng đơn hàng</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: '16px', sm: '18px' }, color: '#F9704B' }}>
                {totalOrders.toLocaleString()}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(1, minmax(0, 1fr))', sm: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' }, gap: { xs: 2, sm: 3 } }}>
        <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, borderRadius: '16px', border: '1px solid rgba(0,0,0,0.08)', height: { xs: 'auto', md: '542px' }, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ mb: 3, flexShrink: 0 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: '16px', sm: '18px' }, mb: 1, letterSpacing: '-0.3px' }}>
                Đơn hàng gần đây
              </Typography>
              <Typography variant="body2" sx={{ color: '#717182', fontSize: { xs: '14px', sm: '16px' }, fontWeight: 500 }}>
                Các đơn hàng mới nhất trong hệ thống
              </Typography>
            </Box>
            <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
              {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((o) => {
                  const cfg = statusConfig(o.status);
                  const customerLabel = o.customerPhone
                    ? `${o.customerName || 'Khách hàng'} (${o.customerPhone})`
                    : o.customerName || 'Khách hàng';
                  const timeLabel = o.createdAt
                    ? new Date(o.createdAt).toLocaleString('vi-VN')
                    : '';
                  return (
                    <OrderItem
                      key={o.id}
                      id={`#${o.id}`}
                      statusText={cfg.text}
                      statusColor={cfg.color}
                      customer={customerLabel}
                      items={o.itemsSummary || ''}
                      time={timeLabel}
                    />
                  );
                })
              ) : (
                <Typography variant="body2" sx={{ color: '#717182' }}>
                  Chưa có đơn hàng nào.
                </Typography>
              )}
            </Box>
        </Paper>
        <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, borderRadius: '16px', border: '1px solid rgba(0,0,0,0.08)', height: { xs: 'auto', md: '542px' }, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: '16px', sm: '18px' }, mb: 1, letterSpacing: '-0.3px' }}>
                Hiệu suất hôm nay
              </Typography>
              <Typography variant="body2" sx={{ color: '#717182', fontSize: { xs: '14px', sm: '16px' }, fontWeight: 500 }}>
                Tỷ lệ hoàn thành đơn hàng
              </Typography>
            </Box>
            <Stack spacing={2.5} sx={{ mb: 3 }}>
              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1.5 }}>
                  <Typography variant="body2" sx={{ fontSize: { xs: '13px', sm: '14px' }, fontWeight: 500 }}>Đơn hoàn tất</Typography>
                  <Typography variant="body2" sx={{ fontSize: { xs: '13px', sm: '14px' }, fontWeight: 600, color: '#00a63e' }}>{completedPct}%</Typography>
                </Stack>
                <LinearProgress variant="determinate" value={completedPct} sx={{ height: 8, borderRadius: '999px', backgroundColor: 'rgba(0, 166, 62, 0.1)', '& .MuiLinearProgress-bar': { backgroundColor: '#00a63e' } }} />
              </Box>
              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1.5 }}>
                  <Typography variant="body2" sx={{ fontSize: { xs: '13px', sm: '14px' }, fontWeight: 500 }}>Đơn đang chế biến</Typography>
                  <Typography variant="body2" sx={{ fontSize: { xs: '13px', sm: '14px' }, fontWeight: 600, color: '#155dfc' }}>{inProgressPct}%</Typography>
                </Stack>
                <LinearProgress variant="determinate" value={inProgressPct} sx={{ height: 8, borderRadius: '999px', backgroundColor: 'rgba(21, 93, 252, 0.1)', '& .MuiLinearProgress-bar': { backgroundColor: '#155dfc' } }} />
              </Box>
              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1.5 }}>
                  <Typography variant="body2" sx={{ fontSize: { xs: '13px', sm: '14px' }, fontWeight: 500 }}>Đơn chờ xử lý</Typography>
                  <Typography variant="body2" sx={{ fontSize: { xs: '13px', sm: '14px' }, fontWeight: 600, color: '#d08700' }}>{pendingPct}%</Typography>
                </Stack>
                <LinearProgress variant="determinate" value={pendingPct} sx={{ height: 8, borderRadius: '999px', backgroundColor: 'rgba(208, 135, 0, 0.1)', '& .MuiLinearProgress-bar': { backgroundColor: '#d08700' } }} />
              </Box>
            </Stack>
            <Divider sx={{ my: 3 }} />
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Stack alignItems="center" spacing={1}>
                  <Typography variant="h5" sx={{ color: '#00a63e', fontWeight: 700, fontSize: { xs: '20px', sm: '24px' } }}>{completedCount}</Typography>
                  <Typography variant="caption" sx={{ color: '#717182', fontSize: { xs: '11px', sm: '12px' }, fontWeight: 500 }}>Hoàn tất</Typography>
                </Stack>
              </Grid>
              <Grid item xs={4}>
                <Stack alignItems="center" spacing={1}>
                  <Typography variant="h5" sx={{ color: '#155dfc', fontWeight: 700, fontSize: { xs: '20px', sm: '24px' } }}>{inProgressCount}</Typography>
                  <Typography variant="caption" sx={{ color: '#717182', fontSize: { xs: '11px', sm: '12px' }, fontWeight: 500 }}>Đang chế biến</Typography>
                </Stack>
              </Grid>
              <Grid item xs={4}>
                <Stack alignItems="center" spacing={1}>
                  <Typography variant="h5" sx={{ color: '#d08700', fontWeight: 700, fontSize: { xs: '20px', sm: '24px' } }}>{pendingCount}</Typography>
                  <Typography variant="caption" sx={{ color: '#717182', fontSize: { xs: '11px', sm: '12px' }, fontWeight: 500 }}>Chờ xử lý</Typography>
                </Stack>
              </Grid>
            </Grid>
        </Paper>
      </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;


