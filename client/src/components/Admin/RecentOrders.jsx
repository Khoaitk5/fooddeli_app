import React from 'react';
import { Box, Typography } from '@mui/material';

const RecentOrders = () => {
  const orders = [
    {
      id: '#001',
      customer: 'Nguyễn Văn A',
      items: 'Phở bò, Chả cá',
      status: 'chờ',
      statusColor: '#894b00',
      statusBg: '#fef9c2',
      timeAgo: '2 phút trước'
    },
    {
      id: '#002',
      customer: 'Trần Thị B',
      items: 'Bún bò Huế',
      status: 'chế biến',
      statusColor: '#193cb8',
      statusBg: '#dbeafe',
      timeAgo: '5 phút trước'
    },
    {
      id: '#003',
      customer: 'Lê Văn C',
      items: 'Cơm tấm, Nước ngọt',
      status: 'hoàn tất',
      statusColor: '#016630',
      statusBg: '#dcfce7',
      timeAgo: '10 phút trước'
    },
    {
      id: '#004',
      customer: 'Phạm Thị D',
      items: 'Bánh mì, Cà phê',
      status: 'chờ',
      statusColor: '#894b00',
      statusBg: '#fef9c2',
      timeAgo: '15 phút trước'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'chờ': return '⏳';
      case 'chế biến': return '👨‍🍳';
      case 'hoàn tất': return '✅';
      default: return '📋';
    }
  };

  return (
    <Box sx={{
      backgroundColor: '#ffffff',
      border: '0.8px solid rgba(0,0,0,0.1)',
      borderRadius: '14px',
      padding: '0.8px',
      height: '542px'
    }}>
      {/* Header */}
      <Box sx={{
        height: '70px',
        padding: '24px',
        borderBottom: '0.8px solid rgba(0,0,0,0.1)'
      }}>
        <Typography sx={{
          fontSize: '16px',
          fontWeight: 'normal',
          color: '#000000',
          fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif",
          marginBottom: '6px'
        }}>
          Đơn hàng gần đây
        </Typography>
        <Typography sx={{
          fontSize: '16px',
          fontWeight: 'normal',
          color: '#717182',
          fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif"
        }}>
          Các đơn hàng mới nhất trong hệ thống
        </Typography>
      </Box>

      {/* Orders List */}
      <Box sx={{
        padding: '24.8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {orders.map((order, index) => (
          <Box
            key={index}
            sx={{
              border: '0.8px solid rgba(0,0,0,0.1)',
              borderRadius: '10px',
              padding: '12.8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '93.6px'
            }}
          >
            {/* Order Info */}
            <Box sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              {/* Order ID and Status */}
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Typography sx={{
                  fontSize: '16px',
                  fontWeight: 'normal',
                  color: '#000000',
                  fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif"
                }}>
                  {order.id}
                </Typography>
                
                <Box sx={{
                  backgroundColor: order.statusBg,
                  border: '0.8px solid transparent',
                  borderRadius: '8px',
                  padding: '0.8px 8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Typography sx={{ fontSize: '12px' }}>
                    {getStatusIcon(order.status)}
                  </Typography>
                  <Typography sx={{
                    fontSize: '12px',
                    fontWeight: 'normal',
                    color: order.statusColor,
                    fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif"
                  }}>
                    {order.status}
                  </Typography>
                </Box>
              </Box>

              {/* Customer Name */}
              <Typography sx={{
                fontSize: '14px',
                fontWeight: 'normal',
                color: '#717182',
                fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif"
              }}>
                {order.customer}
              </Typography>

              {/* Items */}
              <Typography sx={{
                fontSize: '14px',
                fontWeight: 'normal',
                color: '#000000',
                fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif"
              }}>
                {order.items}
              </Typography>
            </Box>

            {/* Time */}
            <Typography sx={{
              fontSize: '12px',
              fontWeight: 'normal',
              color: '#717182',
              fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif"
            }}>
              {order.timeAgo}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default RecentOrders;
