import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Stack,
  Card,
  Button,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Fade,
  Slide,
  CircularProgress,
  Grid,
  Paper,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  ArrowBackIosNew,
  TrendingUp,
  Assessment,
  EmojiEvents,
  Star,
  LocalShipping,
  MonetizationOn,
  CheckCircle,
  Speed,
  EmojiEvents as AchievementIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useShipper } from '@/hooks/useShipper';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const Earnings = () => {
  const navigate = useNavigate();
  const { shipper } = useShipper();

  // State management
  const [period, setPeriod] = useState('month');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalOrders: 127,
    completedOrders: 124,
    cancelledOrders: 3,
    totalEarnings: 45800000,
    avgRating: 4.8,
    completionRate: 97.6,
    avgDeliveryTime: 18.5,
  });

  // Mock data for charts
  const revenueChartData = [
    { date: '01/01', earnings: 1200000, orders: 15 },
    { date: '02/01', earnings: 1450000, orders: 18 },
    { date: '03/01', earnings: 1100000, orders: 12 },
    { date: '04/01', earnings: 1650000, orders: 21 },
    { date: '05/01', earnings: 1380000, orders: 16 },
    { date: '06/01', earnings: 1520000, orders: 19 },
    { date: '07/01', earnings: 1800000, orders: 23 },
  ];

  const ratingDistribution = [
    { name: '5⭐', value: 95, fill: '#fbbf24' },
    { name: '4⭐', value: 20, fill: '#60a5fa' },
    { name: '3⭐', value: 5, fill: '#34d399' },
    { name: '2⭐', value: 2, fill: '#f87171' },
    { name: '1⭐', value: 2, fill: '#ec4899' },
  ];

  const leaderboard = [
    { rank: 1, name: 'Nguyễn Văn A', earnings: 52000000, orders: 156 },
    { rank: 2, name: 'Trần Thị B', earnings: 48500000, orders: 142 },
    { rank: 3, name: 'Lê Văn C', earnings: 45800000, orders: 127 },
    { rank: 4, name: 'Phạm Hữu D', earnings: 43200000, orders: 118 },
    { rank: 5, name: 'Hoàng Minh E', earnings: 40100000, orders: 105 },
  ];

  const achievements = [
    { id: 1, name: 'First Order', description: 'Hoàn thành đơn hàng đầu tiên', icon: '🎬', unlocked: true },
    { id: 2, name: '50 Orders', description: 'Hoàn thành 50 đơn hàng', icon: '🚀', unlocked: true },
    { id: 3, name: '100 Orders', description: 'Hoàn thành 100 đơn hàng', icon: '⭐', unlocked: true },
    { id: 4, name: '500 Orders', description: 'Hoàn thành 500 đơn hàng', icon: '👑', unlocked: false, progress: 127 / 500 },
    { id: 5, name: '5-Star Rating', description: 'Đạt rating 5 sao', icon: '💎', unlocked: false, progress: 4.8 / 5 },
    { id: 6, name: 'Speedy Delivery', description: 'Giao hàng trung bình < 15 phút', icon: '⚡', unlocked: false, progress: 18.5 / 15 },
  ];

  // Fetch data based on period
  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        setLoading(true);
        // TODO: Call API with period parameter
        // const data = await getShipperEarnings(shipperId, period);
        // setStats(data);
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, [period, shipper?.id]);

  const handlePeriodChange = (event, newPeriod) => {
    if (newPeriod) {
      setPeriod(newPeriod);
    }
  };

  const KPICard = ({ icon: Icon, label, value, unit, gradient, color }) => (
    <Fade in timeout={800}>
      <Card
        sx={{
          borderRadius: 3,
          p: 2,
          background: gradient,
          border: `1px solid ${color}20`,
          boxShadow: `0 8px 16px ${color}20`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Stack spacing={1}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                bgcolor: `${color}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon sx={{ color, fontSize: 20 }} />
            </Box>
            <Typography sx={{ fontSize: 12, color: '#6b7280', fontWeight: 600 }}>
              {label}
            </Typography>
          </Stack>
          <Typography sx={{ fontSize: 20, fontWeight: 900, color }}>
            {value}
            {unit && <span style={{ fontSize: 14, fontWeight: 600 }}> {unit}</span>}
          </Typography>
        </Stack>
      </Card>
    </Fade>
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fff5f2 0%, #f0f9ff 100%)',
        pb: 12,
      }}
    >
      {/* Header */}
      <Slide direction="down" in timeout={600}>
        <Box
          sx={{
            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
            color: '#fff',
            p: 3,
            mb: 3,
            boxShadow: '0 16px 48px rgba(251,191,36,0.25)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 250,
              height: 250,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              transform: 'translate(30%, -30%)',
            }}
          />

          <Stack direction="row" alignItems="center" spacing={2} sx={{ position: 'relative', zIndex: 1 }}>
            <IconButton
              onClick={() => navigate('/shipper/profile')}
              size="small"
              sx={{
                color: '#fff',
                bgcolor: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
              }}
            >
              <ArrowBackIosNew fontSize="small" />
            </IconButton>
            <Stack flex={1}>
              <Typography sx={{ fontSize: 24, fontWeight: 900, color: '#fff' }}>
                Thống kê hiệu suất
              </Typography>
              <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.9)', mt: 0.5 }}>
                Theo dõi doanh thu và hiệu suất của bạn
              </Typography>
            </Stack>
            <TrendingUp sx={{ fontSize: 32, color: 'rgba(255,255,255,0.8)' }} />
          </Stack>
        </Box>
      </Slide>

      {/* Content */}
      <Box sx={{ px: 2.5, maxWidth: 900, mx: 'auto' }}>
        {/* Period Toggle */}
        <Fade in timeout={700}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
            <ToggleButtonGroup
              value={period}
              exclusive
              onChange={handlePeriodChange}
              sx={{
                background: 'rgba(255,255,255,0.9)',
                borderRadius: 2.5,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                '& .MuiToggleButton-root': {
                  textTransform: 'none',
                  fontWeight: 700,
                  color: '#6b7280',
                  borderColor: 'transparent',
                  '&.Mui-selected': {
                    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                    color: '#fff',
                  },
                },
              }}
            >
              <ToggleButton value="today">Hôm nay</ToggleButton>
              <ToggleButton value="week">Tuần</ToggleButton>
              <ToggleButton value="month">Tháng</ToggleButton>
              <ToggleButton value="all">Tất cả</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Fade>

        {/* KPI Cards */}
        <Fade in timeout={800}>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6} sm={6}>
              <KPICard
                icon={LocalShipping}
                label="Tổng đơn"
                value={stats.completedOrders}
                unit="đơn"
                gradient="linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)"
                color="#1d4ed8"
              />
            </Grid>
            <Grid item xs={6} sm={6}>
              <KPICard
                icon={MonetizationOn}
                label="Thu nhập"
                value={`${(stats.totalEarnings / 1000000).toFixed(1)}M`}
                unit="đ"
                gradient="linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)"
                color="#16a34a"
              />
            </Grid>
            <Grid item xs={6} sm={6}>
              <KPICard
                icon={Star}
                label="Rating TB"
                value={stats.avgRating}
                unit="⭐"
                gradient="linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)"
                color="#c2410c"
              />
            </Grid>
            <Grid item xs={6} sm={6}>
              <KPICard
                icon={CheckCircle}
                label="Tỉ lệ HT"
                value={stats.completionRate.toFixed(1)}
                unit="%"
                gradient="linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)"
                color="#7c3aed"
              />
            </Grid>
          </Grid>
        </Fade>

        {/* Revenue Chart */}
        <Fade in timeout={900}>
          <Card
            sx={{
              borderRadius: 4,
              p: 3,
              mb: 3,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.8)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
            }}
          >
            <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#111827', mb: 2 }}>
              📈 Doanh thu theo ngày
            </Typography>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      background: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: 8,
                    }}
                    formatter={(value) => `₫${(value / 1000000).toFixed(1)}M`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="earnings"
                    stroke="#fbbf24"
                    strokeWidth={3}
                    dot={{ fill: '#fbbf24', r: 5 }}
                    name="Doanh thu"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Fade>

        {/* Performance Metrics Row */}
        <Fade in timeout={1000}>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {/* Rating Distribution */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  borderRadius: 4,
                  p: 3,
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.8)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
                }}
              >
                <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#111827', mb: 2 }}>
                  ⭐ Phân bố đánh giá
                </Typography>

                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={ratingDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name} (${value})`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {ratingDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} reviews`} />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Grid>

            {/* Completion Rate & Avg Time */}
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Card
                  sx={{
                    borderRadius: 4,
                    p: 3,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.8)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
                    <CheckCircle sx={{ color: '#16a34a', fontSize: 20 }} />
                    <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>
                      Tỉ lệ hoàn thành
                    </Typography>
                  </Stack>
                  <Typography sx={{ fontSize: 24, fontWeight: 900, color: '#16a34a', mb: 1 }}>
                    {stats.completionRate.toFixed(1)}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={stats.completionRate}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      background: 'rgba(22,163,74,0.1)',
                      '& .MuiLinearProgress-bar': {
                        background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                      },
                    }}
                  />
                </Card>

                <Card
                  sx={{
                    borderRadius: 4,
                    p: 3,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.8)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
                    <Speed sx={{ color: '#0ea5e9', fontSize: 20 }} />
                    <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>
                      Thời gian giao TB
                    </Typography>
                  </Stack>
                  <Typography sx={{ fontSize: 24, fontWeight: 900, color: '#0ea5e9' }}>
                    {stats.avgDeliveryTime.toFixed(1)}
                    <span style={{ fontSize: 14, fontWeight: 600 }}> phút</span>
                  </Typography>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </Fade>

        {/* Leaderboard */}
        <Fade in timeout={1100}>
          <Card
            sx={{
              borderRadius: 4,
              p: 3,
              mb: 3,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.8)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
            }}
          >
            <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#111827', mb: 2 }}>
              🏆 Top 5 Shippers
            </Typography>

            <Stack spacing={1.5}>
              {leaderboard.map((item) => (
                <Paper
                  key={item.rank}
                  sx={{
                    p: 2,
                    background: item.rank === 3 ? 'linear-gradient(135deg, #fef3c7 0%, #fde047 100%)' : '#f9fafb',
                    border: item.rank === 3 ? '2px solid #fbbf24' : '1px solid #e5e7eb',
                    borderRadius: 2.5,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: item.rank <= 3 ? `hsl(${item.rank === 1 ? 40 : item.rank === 2 ? 0 : 45}, 100%, 60%)` : '#e5e7eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                        color: item.rank <= 3 ? '#fff' : '#6b7280',
                      }}
                    >
                      {item.rank <= 3 ? ['🥇', '🥈', '🥉'][item.rank - 1] : item.rank}
                    </Box>
                    <Stack>
                      <Typography sx={{ fontWeight: 700, color: '#111827' }}>
                        {item.name}
                      </Typography>
                      <Typography sx={{ fontSize: 12, color: '#6b7280' }}>
                        {item.orders} đơn hàng
                      </Typography>
                    </Stack>
                  </Stack>
                  <Typography sx={{ fontWeight: 900, color: '#059669' }}>
                    ₫{(item.earnings / 1000000).toFixed(1)}M
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </Card>
        </Fade>

        {/* Achievements */}
        <Fade in timeout={1200}>
          <Card
            sx={{
              borderRadius: 4,
              p: 3,
              mb: 6,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.8)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
            }}
          >
            <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#111827', mb: 2 }}>
              🎖️ Thành tích
            </Typography>

            <Grid container spacing={2}>
              {achievements.map((achievement) => (
                <Grid item xs={6} sm={4} key={achievement.id}>
                  <Paper
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      background: achievement.unlocked
                        ? 'linear-gradient(135deg, #fef3c7 0%, #fde047 100%)'
                        : '#f5f5f5',
                      border: achievement.unlocked ? '2px solid #fbbf24' : '1px solid #e5e7eb',
                      borderRadius: 2.5,
                      opacity: achievement.unlocked ? 1 : 0.6,
                    }}
                  >
                    <Typography sx={{ fontSize: 32, mb: 1 }}>
                      {achievement.icon}
                    </Typography>
                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#111827', mb: 0.5 }}>
                      {achievement.name}
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: '#6b7280', mb: 1 }}>
                      {achievement.description}
                    </Typography>

                    {!achievement.unlocked && achievement.progress && (
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(achievement.progress * 100, 100)}
                        sx={{
                          height: 4,
                          borderRadius: 2,
                          background: '#e5e7eb',
                          '& .MuiLinearProgress-bar': {
                            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                          },
                        }}
                      />
                    )}

                    {achievement.unlocked && (
                      <Chip
                        label="Hoàn thành"
                        size="small"
                        icon={<AchievementIcon />}
                        sx={{ fontWeight: 700, color: '#c2410c' }}
                      />
                    )}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Card>
        </Fade>
      </Box>
    </Box>
  );
};

export default Earnings;
