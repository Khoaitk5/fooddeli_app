import React from 'react';
import { Box, Typography, LinearProgress, useMediaQuery, useTheme } from '@mui/material';

const DashboardOverview = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  // Asset icons từ Figma (node 44:342)
  // Icon đúng theo Figma node 44:342
  const STAT_ICON_DISHES = "https://www.figma.com/api/mcp/asset/a352638b-5df6-44a5-821b-cbcb1959faf2";
  const STAT_ICON_VIDEO = "https://www.figma.com/api/mcp/asset/dc7974ac-832f-479b-a7c1-94acff5323c5";
  const STAT_ICON_ORDERS = "https://www.figma.com/api/mcp/asset/a2d1713b-bbcd-405e-9582-45c2d5dcd200";
  const STAT_ICON_REVENUE = "https://www.figma.com/api/mcp/asset/c9e04d37-31b0-42a2-883f-a23a8b69c502";

  const statsData = [
    {
      title: 'Tổng món ăn',
      value: '24',
      subtitle: 'Đang phục vụ',
      iconImg: STAT_ICON_DISHES,
      iconBg: '#dbeafe' // blue-100
    },
    {
      title: 'Video Reviews',
      value: '18',
      subtitle: 'Video đã upload',
      iconImg: STAT_ICON_VIDEO,
      iconBg: '#e9d5ff' // purple-100
    },
    {
      title: 'Đơn hàng hôm nay',
      value: '42',
      subtitle: '+12% so với hôm qua',
      iconImg: STAT_ICON_ORDERS,
      iconBg: '#dcfce7' // green-100
    },
    {
      title: 'Doanh thu',
      value: '1.2M đ',
      subtitle: 'Trong ngày',
      iconImg: STAT_ICON_REVENUE,
      iconBg: '#ffedd4' // orange-100
    }
  ];

  // Theo thiết kế Figma, không có biểu đồ doanh thu ở khu vực giữa

  // Dữ liệu mẫu cho đơn hàng gần đây
  const recentOrders = [
    {
      id: '#001',
      customer: 'Nguyễn Văn A',
      items: 'Phở bò, Chả cá',
      total: '-',
      status: 'chờ',
      time: '2 phút trước',
      statusBg: '#fef9c2',
      statusTextColor: '#894b00'
    },
    {
      id: '#002',
      customer: 'Trần Thị B',
      items: 'Bún bò Huế',
      total: '-',
      status: 'chế biến',
      time: '5 phút trước',
      statusBg: '#dbeafe',
      statusTextColor: '#193cb8'
    },
    {
      id: '#003',
      customer: 'Lê Văn C',
      items: 'Cơm tấm, Nước ngọt',
      total: '-',
      status: 'hoàn tất',
      time: '10 phút trước',
      statusBg: '#dcfce7',
      statusTextColor: '#016630'
    },
    {
      id: '#004',
      customer: 'Phạm Thị D',
      items: 'Bánh mì, Cà phê',
      total: '-',
      status: 'chờ',
      time: '1 phút trước',
      statusBg: '#fef9c2',
      statusTextColor: '#894b00'
    },
  ];

  // Cấu hình hiệu suất bám sát Figma 44:342 (85% / 12% / 3%)
  const performanceBars = [
    { label: 'Đơn hoàn tất', percent: 85 },
    { label: 'Đơn đang chế biến', percent: 12 },
    { label: 'Đơn chờ xử lý', percent: 3 }
  ];

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: isMobile ? '16px' : '24px',
      padding: isMobile ? '16px' : '0'
    }}>
      {/* Stats Cards */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
        gap: isMobile ? '12px' : '24px',
        height: isMobile ? 'auto' : '117.575px'
      }}>
        {statsData.map((stat, index) => (
          <Box
            key={index}
            sx={{
              backgroundColor: '#ffffff',
              border: '0.8px solid rgba(0,0,0,0.1)',
              borderRadius: '14px',
              padding: isMobile ? '16px' : '24.8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: isMobile ? 'auto' : '100%',
              minHeight: isMobile ? '80px' : 'auto'
            }}
          >
            {/* Content */}
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 0,
              height: isMobile ? 'auto' : '67.975px',
              flex: 1
            }}>
              <Typography sx={{
                fontSize: isMobile ? '12px' : '14px',
                fontWeight: 'normal',
                color: '#717182',
                fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif",
                marginBottom: '4px'
              }}>
                {stat.title}
              </Typography>
              
              <Typography sx={{
                fontSize: isMobile ? '18px' : '24px',
                fontWeight: 'bold',
                color: '#000000',
                fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif",
                marginBottom: '4px'
              }}>
                {stat.value}
              </Typography>
              
              <Typography sx={{
                fontSize: isMobile ? '10px' : '12px',
                fontWeight: 'normal',
                color: '#717182',
                fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif"
              }}>
                {stat.subtitle}
              </Typography>
            </Box>

            {/* Icon */}
            <Box sx={{
              width: isMobile ? '36px' : '48px',
              height: isMobile ? '36px' : '48px',
              backgroundColor: stat.iconBg,
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {stat.iconImg ? (
                <img src={stat.iconImg} alt="" style={{ width: isMobile ? 18 : 24, height: isMobile ? 18 : 24 }} />
              ) : null}
            </Box>
          </Box>
        ))}
      </Box>

      {/* Bỏ khu vực biểu đồ theo thiết kế */}

      {/* Bottom Row (Recent Orders + Performance) */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? '16px' : '24px'
      }}>
        {/* Recent Orders */}
        <Box sx={{
          backgroundColor: '#ffffff',
          border: '0.8px solid rgba(0,0,0,0.1)',
          borderRadius: '14px',
          padding: isMobile ? '16px' : '24px',
          height: isMobile ? '350px' : '400px'
        }}>
          <Typography sx={{
            fontSize: isMobile ? '14px' : '16px',
            fontWeight: 'normal',
            color: '#000000',
            fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif",
            marginBottom: '6px'
          }}>
            Đơn hàng gần đây
          </Typography>
          <Typography sx={{
            fontSize: isMobile ? '12px' : '16px',
            fontWeight: 'normal',
            color: '#717182',
            fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif",
            marginBottom: isMobile ? '16px' : '24px'
          }}>
            Các đơn hàng mới nhất trong hệ thống
          </Typography>
          
          {/* Recent Orders List */}
          <Box sx={{
            height: isMobile ? '250px' : '300px',
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: '4px'
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#f1f1f1',
              borderRadius: '2px'
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#c1c1c1',
              borderRadius: '2px'
            }
          }}>
            {recentOrders.map((order, index) => (
              <Box key={index} sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 0',
                borderBottom: index < recentOrders.length - 1 ? '1px solid #f0f0f0' : 'none'
              }}>
                {/* Order Info */}
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <Typography sx={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#000000',
                      fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif"
                    }}>
                      {order.id}
                    </Typography>
                    <Box sx={{
                      backgroundColor: order.statusBg,
                      color: order.statusTextColor,
                      padding: '2px 8px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '500',
                      fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif"
                    }}>
                      {order.status}
                    </Box>
                  </Box>
                  
                  <Typography sx={{
                    fontSize: '12px',
                    color: '#717182',
                    fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif",
                    marginBottom: '2px'
                  }}>
                    {order.customer}
                  </Typography>
                  
                  <Typography sx={{
                    fontSize: '11px',
                    color: '#aaaaae',
                    fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif"
                  }}>
                    {order.items}
                  </Typography>
                </Box>

                {/* Order Details */}
                <Box sx={{ textAlign: 'right' }}>
                  <Typography sx={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#000000',
                    fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif",
                    marginBottom: '4px'
                  }}>
                    {order.total}
                  </Typography>
                  
                  <Typography sx={{
                    fontSize: '11px',
                    color: '#aaaaae',
                    fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif"
                  }}>
                    {order.time}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Performance */}
        <Box sx={{
          backgroundColor: '#ffffff',
          border: '0.8px solid rgba(0,0,0,0.1)',
          borderRadius: '14px',
          padding: isMobile ? '16px' : '24px',
          height: isMobile ? '350px' : '400px'
        }}>
          <Typography sx={{
            fontSize: isMobile ? '14px' : '16px',
            fontWeight: 'normal',
            color: '#000000',
            fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif",
            marginBottom: '6px'
          }}>
            Hiệu suất hôm nay
          </Typography>
          <Typography sx={{
            fontSize: isMobile ? '12px' : '16px',
            fontWeight: 'normal',
            color: '#717182',
            fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif",
            marginBottom: isMobile ? '16px' : '24px'
          }}>
            Tỷ lệ hoàn thành đơn hàng
          </Typography>
          {/* Performance Metrics 1:1 */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {performanceBars.map((bar) => (
              <Box key={bar.label}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <Typography sx={{ fontSize: '14px', color: '#000', fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif" }}>
                    {bar.label}
                  </Typography>
                  <Typography sx={{ fontSize: '14px', color: '#000', fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif" }}>
                    {bar.percent}%
                  </Typography>
                </Box>
                <Box sx={{ width: '100%', height: '8px', backgroundColor: 'rgba(3,2,19,0.2)', borderRadius: '26843500px', overflow: 'hidden' }}>
                  <Box sx={{ width: `${bar.percent}%`, height: '100%', backgroundColor: '#030213' }} />
                </Box>
              </Box>
            ))}
            
            {/* Bottom counters */}
            <Box sx={{ borderTop: '0.8px solid rgba(0,0,0,0.1)', pt: '16.8px', display: 'flex', justifyContent: 'space-between' }}>
              <Box sx={{ textAlign: 'center', width: '33.33%' }}>
                <Typography sx={{ fontSize: '24px', fontWeight: 'bold', color: '#00a63e', fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif" }}>36</Typography>
                <Typography sx={{ fontSize: '12px', color: '#717182', fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif" }}>Hoàn tất</Typography>
              </Box>
              <Box sx={{ textAlign: 'center', width: '33.33%' }}>
                <Typography sx={{ fontSize: '24px', fontWeight: 'bold', color: '#155dfc', fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif" }}>5</Typography>
                <Typography sx={{ fontSize: '12px', color: '#717182', fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif" }}>Đang chế biến</Typography>
              </Box>
              <Box sx={{ textAlign: 'center', width: '33.33%' }}>
                <Typography sx={{ fontSize: '24px', fontWeight: 'bold', color: '#d08700', fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif" }}>1</Typography>
                <Typography sx={{ fontSize: '12px', color: '#717182', fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif" }}>Chờ xử lý</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardOverview;


