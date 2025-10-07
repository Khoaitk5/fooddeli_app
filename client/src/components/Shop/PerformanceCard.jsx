import React from 'react';
import { Box, Typography } from '@mui/material';

const PerformanceCard = () => {
  const performanceData = [
    { label: 'Đơn hoàn tất', percentage: 85, count: 36, color: '#00a63e' },
    { label: 'Đơn đang chế biến', percentage: 12, count: 5, color: '#155dfc' },
    { label: 'Đơn chờ xử lý', percentage: 3, count: 1, color: '#d08700' }
  ];

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
          Hiệu suất hôm nay
        </Typography>
        <Typography sx={{
          fontSize: '16px',
          fontWeight: 'normal',
          color: '#717182',
          fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif"
        }}>
          Tỷ lệ hoàn thành đơn hàng
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {/* Progress Bars */}
        {performanceData.map((item, index) => (
          <Box key={index} sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {/* Label and Percentage */}
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Typography sx={{
                fontSize: '14px',
                fontWeight: 'normal',
                color: '#000000',
                fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif"
              }}>
                {item.label}
              </Typography>
              <Typography sx={{
                fontSize: '14px',
                fontWeight: 'normal',
                color: '#000000',
                fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif"
              }}>
                {item.percentage}%
              </Typography>
            </Box>

            {/* Progress Bar */}
            <Box sx={{
              height: '8px',
              backgroundColor: 'rgba(3,2,19,0.2)',
              borderRadius: '9999px',
              overflow: 'hidden'
            }}>
              <Box sx={{
                height: '100%',
                width: `${item.percentage}%`,
                backgroundColor: '#030213',
                borderRadius: 'inherit',
                transition: 'width 0.3s ease'
              }} />
            </Box>
          </Box>
        ))}

        {/* Summary Stats */}
        <Box sx={{
          borderTop: '0.8px solid rgba(0,0,0,0.1)',
          paddingTop: '16.8px',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px'
        }}>
          {performanceData.map((item, index) => (
            <Box key={index} sx={{
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              <Typography sx={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: item.color,
                fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif"
              }}>
                {item.count}
              </Typography>
              <Typography sx={{
                fontSize: '12px',
                fontWeight: 'normal',
                color: '#717182',
                fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif"
              }}>
                {item.label.split(' ').slice(1).join(' ')}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default PerformanceCard;


