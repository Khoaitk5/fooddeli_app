import React from 'react';
import { Box, Typography } from '@mui/material';

const StatsCards = () => {
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

  return (
    <Box sx={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '24px',
      height: '117.575px'
    }}>
      {statsData.map((stat, index) => (
        <Box
          key={index}
          sx={{
            backgroundColor: '#ffffff',
            border: '0.8px solid rgba(0,0,0,0.1)',
            borderRadius: '14px',
            padding: '24.8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '100%'
          }}
        >
          {/* Content */}
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
            height: '67.975px'
          }}>
            <Typography sx={{
              fontSize: '14px',
              fontWeight: 'normal',
              color: '#717182',
              fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif",
              marginBottom: '4px'
            }}>
              {stat.title}
            </Typography>
            
            <Typography sx={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#000000',
              fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif",
              marginBottom: '4px'
            }}>
              {stat.value}
            </Typography>
            
            <Typography sx={{
              fontSize: '12px',
              fontWeight: 'normal',
              color: '#717182',
              fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif"
            }}>
              {stat.subtitle}
            </Typography>
          </Box>

          {/* Icon */}
          <Box sx={{
            width: '48px',
            height: '48px',
            backgroundColor: stat.iconBg,
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Typography sx={{ fontSize: '24px' }}>{stat.icon}</Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default StatsCards;
