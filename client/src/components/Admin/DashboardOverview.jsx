import React from 'react';
import { Box, Typography, LinearProgress, useMediaQuery, useTheme } from '@mui/material';

const DashboardOverview = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const statsData = [
    {
      title: 'Tổng món ăn',
      value: '24',
      subtitle: 'Đang phục vụ',
      icon: '🍽️',
      iconBg: '#dbeafe' // blue-100
    },
    {
      title: 'Video Reviews',
      value: '18',
      subtitle: 'Video đã upload',
      icon: '🎥',
      iconBg: '#e9d5ff' // purple-100
    },
    {
      title: 'Đơn hàng hôm nay',
      value: '42',
      subtitle: '+12% so với hôm qua',
      icon: '📦',
      iconBg: '#dcfce7' // green-100
    },
    {
      title: 'Doanh thu',
      value: '1.2M đ',
      subtitle: 'Trong ngày',
      icon: '💰',
      iconBg: '#ffedd4' // orange-100
    }
  ];

  // Dữ liệu mẫu cho biểu đồ doanh thu theo tháng
  const revenueData = [
    { month: 'T1', revenue: 850000, orders: 120 },
    { month: 'T2', revenue: 920000, orders: 135 },
    { month: 'T3', revenue: 780000, orders: 98 },
    { month: 'T4', revenue: 1100000, orders: 156 },
    { month: 'T5', revenue: 1250000, orders: 178 },
    { month: 'T6', revenue: 980000, orders: 142 },
    { month: 'T7', revenue: 1350000, orders: 189 },
    { month: 'T8', revenue: 1420000, orders: 201 },
    { month: 'T9', revenue: 1180000, orders: 167 },
    { month: 'T10', revenue: 1280000, orders: 183 },
    { month: 'T11', revenue: 1450000, orders: 205 },
    { month: 'T12', revenue: 1620000, orders: 228 }
  ];

  // Dữ liệu mẫu cho đơn hàng gần đây
  const recentOrders = [
    {
      id: '#FD001',
      customer: 'Nguyễn Văn A',
      items: 'Phở bò, Bánh mì',
      total: '85,000 đ',
      status: 'Đang giao',
      time: '10 phút trước',
      statusColor: '#4caf50'
    },
    {
      id: '#FD002',
      customer: 'Trần Thị B',
      items: 'Bún chả, Nước cam',
      total: '65,000 đ',
      status: 'Đã hoàn thành',
      time: '25 phút trước',
      statusColor: '#2196f3'
    },
    {
      id: '#FD003',
      customer: 'Lê Văn C',
      items: 'Cơm tấm, Canh chua',
      total: '75,000 đ',
      status: 'Đang chuẩn bị',
      time: '35 phút trước',
      statusColor: '#ff9800'
    },
    {
      id: '#FD004',
      customer: 'Phạm Thị D',
      items: 'Bánh xèo, Nước dừa',
      total: '95,000 đ',
      status: 'Đang giao',
      time: '45 phút trước',
      statusColor: '#4caf50'
    },
    {
      id: '#FD005',
      customer: 'Hoàng Văn E',
      items: 'Chả cá, Bún',
      total: '120,000 đ',
      status: 'Đã hoàn thành',
      time: '1 giờ trước',
      statusColor: '#2196f3'
    }
  ];

  // Dữ liệu mẫu cho hiệu suất
  const performanceData = [
    {
      metric: 'Tỷ lệ hoàn thành đơn hàng',
      value: 94,
      target: 95,
      color: '#4caf50'
    },
    {
      metric: 'Thời gian giao hàng trung bình',
      value: 28,
      target: 25,
      unit: 'phút',
      color: '#ff9800'
    },
    {
      metric: 'Đánh giá khách hàng',
      value: 4.7,
      target: 4.5,
      unit: '/5',
      color: '#2196f3'
    },
    {
      metric: 'Tỷ lệ đơn hàng hủy',
      value: 3.2,
      target: 5,
      unit: '%',
      color: '#f44336'
    }
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
              <Typography sx={{ fontSize: isMobile ? '18px' : '24px' }}>{stat.icon}</Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Revenue Chart */}
      <Box sx={{
        backgroundColor: '#ffffff',
        border: '0.8px solid rgba(0,0,0,0.1)',
        borderRadius: '14px',
        padding: isMobile ? '16px' : '24px',
        height: isMobile ? '300px' : '400px'
      }}>
        <Typography sx={{
          fontSize: isMobile ? '14px' : '16px',
          fontWeight: 'normal',
          color: '#000000',
          fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif",
          marginBottom: '6px'
        }}>
          Doanh thu theo tháng
        </Typography>
        <Typography sx={{
          fontSize: isMobile ? '12px' : '16px',
          fontWeight: 'normal',
          color: '#717182',
          fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif",
          marginBottom: isMobile ? '16px' : '24px'
        }}>
          Tổng quan doanh thu 12 tháng trong năm
        </Typography>
        
        {/* Revenue Chart */}
        <Box sx={{
          height: isMobile ? '200px' : '300px',
          display: 'flex',
          alignItems: 'end',
          justifyContent: 'space-between',
          padding: isMobile ? '12px 0' : '20px 0',
          gap: isMobile ? '4px' : '8px'
        }}>
          {revenueData.map((data, index) => {
            const maxRevenue = Math.max(...revenueData.map(d => d.revenue));
            const height = (data.revenue / maxRevenue) * (isMobile ? 150 : 200);
            
            return (
              <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                {/* Bar */}
                <Box sx={{
                  width: '100%',
                  height: `${height}px`,
                  backgroundColor: '#F9704B',
                  borderRadius: '4px 4px 0 0',
                  marginBottom: '8px',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#fe724c',
                    transform: 'scale(1.05)'
                  }
                }}>
                  {/* Tooltip on hover */}
                  <Box sx={{
                    position: 'absolute',
                    top: '-40px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#333',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    whiteSpace: 'nowrap',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    '&:hover': {
                      opacity: 1
                    }
                  }}>
                    {data.revenue.toLocaleString('vi-VN')} đ
                  </Box>
                </Box>
                
                {/* Month label */}
                <Typography sx={{
                  fontSize: isMobile ? '10px' : '12px',
                  color: '#717182',
                  fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif"
                }}>
                  {data.month}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Bottom Row */}
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
                      backgroundColor: order.statusColor,
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '10px',
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
          
          {/* Performance Metrics */}
          <Box sx={{
            height: isMobile ? '250px' : '300px',
            display: 'flex',
            flexDirection: 'column',
            gap: isMobile ? '16px' : '20px'
          }}>
            {performanceData.map((metric, index) => (
              <Box key={index}>
                {/* Metric Header */}
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <Typography sx={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#000000',
                    fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif"
                  }}>
                    {metric.metric}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Typography sx={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: metric.color,
                      fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif"
                    }}>
                      {metric.value}{metric.unit || ''}
                    </Typography>
                    
                    {metric.target && (
                      <Typography sx={{
                        fontSize: '12px',
                        color: '#717182',
                        fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif"
                      }}>
                        / {metric.target}{metric.unit || ''}
                      </Typography>
                    )}
                  </Box>
                </Box>

                {/* Progress Bar */}
                <Box sx={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: '#f0f0f0',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <Box sx={{
                    width: `${Math.min((metric.value / metric.target) * 100, 100)}%`,
                    height: '100%',
                    backgroundColor: metric.color,
                    borderRadius: '4px',
                    transition: 'width 0.3s ease'
                  }} />
                </Box>

                {/* Status Indicator */}
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '4px'
                }}>
                  <Typography sx={{
                    fontSize: '11px',
                    color: '#aaaaae',
                    fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif"
                  }}>
                    {metric.value >= metric.target ? 'Đạt mục tiêu' : 'Chưa đạt mục tiêu'}
                  </Typography>
                  
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Box sx={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: metric.value >= metric.target ? '#4caf50' : '#ff9800'
                    }} />
                    <Typography sx={{
                      fontSize: '11px',
                      color: metric.value >= metric.target ? '#4caf50' : '#ff9800',
                      fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif",
                      fontWeight: '500'
                    }}>
                      {metric.value >= metric.target ? 'Tốt' : 'Cần cải thiện'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardOverview;
