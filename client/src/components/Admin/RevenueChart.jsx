import React from 'react';
import { Box, Typography } from '@mui/material';

const RevenueChart = () => {
  // Mock data for the chart
  const chartData = [
    { month: 'T1', value: 15 },
    { month: 'T2', value: 25 },
    { month: 'T3', value: 35 },
    { month: 'T4', value: 30 },
    { month: 'T5', value: 45 },
    { month: 'T6', value: 55 },
    { month: 'T7', value: 50 },
    { month: 'T8', value: 65 },
    { month: 'T9', value: 60 },
    { month: 'T10', value: 70 },
    { month: 'T11', value: 75 },
    { month: 'T12', value: 85 }
  ];

  const maxValue = Math.max(...chartData.map(d => d.value));

  return (
    <Box sx={{
      backgroundColor: '#ffffff',
      border: '0.8px solid rgba(0,0,0,0.1)',
      borderRadius: '14px',
      padding: '0.8px',
      height: '504.4px'
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
          Doanh thu theo tháng
        </Typography>
        <Typography sx={{
          fontSize: '16px',
          fontWeight: 'normal',
          color: '#717182',
          fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif"
        }}>
          Tổng quan doanh thu 12 tháng trong năm
        </Typography>
      </Box>

      {/* Chart Content */}
      <Box sx={{
        height: '408.8px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        {/* Chart Area */}
        <Box sx={{
          height: '300px',
          position: 'relative',
          display: 'flex',
          alignItems: 'end',
          justifyContent: 'space-between',
          paddingLeft: '34px',
          paddingRight: '34px',
          paddingBottom: '19.52px'
        }}>
          {/* Y-axis labels */}
          <Box sx={{
            position: 'absolute',
            left: '0',
            top: '0',
            height: '100%',
            width: '34px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            paddingRight: '6px'
          }}>
            {[36, 27, 18, 9, 0].map((value, index) => (
              <Box key={index} sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                height: '15px'
              }}>
                <Box sx={{
                  width: '6px',
                  height: '0px',
                  borderTop: '1px solid #000000'
                }} />
                <Typography sx={{
                  fontSize: '12px',
                  color: '#000000',
                  fontFamily: "'Inter', sans-serif"
                }}>
                  {value}M
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Chart Bars */}
          <Box sx={{
            display: 'flex',
            alignItems: 'end',
            justifyContent: 'space-between',
            width: '100%',
            height: '260px',
            gap: '8px'
          }}>
            {chartData.map((data, index) => (
              <Box key={index} sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                flex: 1
              }}>
                {/* Bar */}
                <Box sx={{
                  width: '100%',
                  height: `${(data.value / maxValue) * 100}%`,
                  backgroundColor: '#F9704B',
                  borderRadius: '4px 4px 0 0',
                  minHeight: '4px'
                }} />
                
                {/* Month Label */}
                <Typography sx={{
                  fontSize: '12px',
                  color: '#000000',
                  fontFamily: "'Inter', sans-serif"
                }}>
                  {data.month}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Summary Stats */}
        <Box sx={{
          borderTop: '0.8px solid rgba(0,0,0,0.1)',
          paddingTop: '16.8px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px'
        }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{
              fontSize: '14px',
              fontWeight: 'normal',
              color: '#717182',
              fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif",
              marginBottom: '4px'
            }}>
              Tổng doanh thu
            </Typography>
            <Typography sx={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#00a63e',
              fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif"
            }}>
              281.700.000 ₫
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{
              fontSize: '14px',
              fontWeight: 'normal',
              color: '#717182',
              fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif",
              marginBottom: '4px'
            }}>
              TB/tháng
            </Typography>
            <Typography sx={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#000000',
              fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif"
            }}>
              23.475.000 ₫
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{
              fontSize: '14px',
              fontWeight: 'normal',
              color: '#717182',
              fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif",
              marginBottom: '4px'
            }}>
              Tháng cao nhất
            </Typography>
            <Typography sx={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#f54900',
              fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif"
            }}>
              T12
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{
              fontSize: '14px',
              fontWeight: 'normal',
              color: '#717182',
              fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif",
              marginBottom: '4px'
            }}>
              Tổng đơn hàng
            </Typography>
            <Typography sx={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#000000',
              fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif"
            }}>
              5634
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default RevenueChart;
