import React from 'react';
import { Box, Typography, List, ListItemButton, ListItemIcon, ListItemText, Avatar, Card, CardActionArea, CardContent, Stack, Grid, Button, IconButton, Paper, Chip } from '@mui/material';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import UmbrellaOutlinedIcon from '@mui/icons-material/UmbrellaOutlined';
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import SouthWestOutlinedIcon from '@mui/icons-material/SouthWestOutlined';
import NorthEastOutlinedIcon from '@mui/icons-material/NorthEastOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import { useShipper } from '@/hooks/useShipper';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';

const Wallet = () => {
  const { shipper: shipperRaw } = useShipper();
  const navigate = useNavigate();
  const shipper = shipperRaw ?? {};

  const cashBalance = shipper.wallet?.cash ?? 405; // VND (mock)
  const creditBalance = shipper.wallet?.credit ?? 310864; // VND (mock)

  const actionButtons = [
    { icon: <NorthEastOutlinedIcon />, label: 'Nạp tiền', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { icon: <SouthWestOutlinedIcon />, label: 'Rút tiền', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { icon: <LinkOutlinedIcon />, label: 'Liên kết', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    { icon: <HistoryOutlinedIcon />, label: 'Lịch sử', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)',
      pb: 4
    }}>
      {/* Header */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        pt: 2,
        pb: 8,
        px: 2.5,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative circles */}
        <Box sx={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', right: -50, top: -80 }} />
        <Box sx={{ position: 'absolute', width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', left: -40, top: 50 }} />
        
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ position: 'relative', zIndex: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton 
              onClick={() => navigate(-1)} 
              size="small" 
              sx={{ 
                color: '#fff',
                bgcolor: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
              }}
            >
              <ArrowBackIosNewOutlinedIcon fontSize="small" />
            </IconButton>
            <Typography sx={{ fontSize: 22, fontWeight: 900, color: '#fff' }}>Ví của tôi</Typography>
          </Stack>
          <Chip 
            icon={<StarRoundedIcon sx={{ color: '#fbbf24 !important' }} />}
            label="VIP" 
            size="small"
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.95)',
              color: '#10b981',
              fontWeight: 700,
              fontSize: 11
            }} 
          />
        </Stack>
      </Box>

      <Box sx={{ maxWidth: 420, mx: 'auto', px: 2.5, mt: -6, position: 'relative', zIndex: 2 }}>
        {/* Main Balance Card - Glassmorphism */}
        <Paper sx={{
          borderRadius: 4,
          p: 3,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.8)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.12), 0 0 1px rgba(0,0,0,0.05)',
          position: 'relative',
          overflow: 'hidden',
          mb: 3
        }}>
          {/* Subtle gradient overlay */}
          <Box sx={{ 
            position: 'absolute', 
            top: 0, 
            right: 0, 
            width: '50%', 
            height: '100%',
            background: 'linear-gradient(135deg, transparent 0%, rgba(16,185,129,0.08) 100%)',
            pointerEvents: 'none'
          }} />
          
          <Stack spacing={2.5} sx={{ position: 'relative', zIndex: 1 }}>
            <Box>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                <Typography sx={{ fontSize: 13, color: '#6B7280', fontWeight: 600, letterSpacing: 0.5 }}>
                  TỔNG SỐ DÒ KHẢ DỤNG
                </Typography>
                <TrendingUpIcon sx={{ fontSize: 16, color: '#10b981' }} />
              </Stack>
              <Typography sx={{ 
                fontSize: 38, 
                fontWeight: 900, 
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: -1
              }}>
                ₫{(cashBalance + creditBalance).toLocaleString()}
              </Typography>
            </Box>

            {/* Action Buttons Grid */}
            <Grid container spacing={1.5}>
              {actionButtons.map((action, index) => (
                <Grid item xs={3} key={index}>
                  <Stack alignItems="center" spacing={0.8}>
                    <IconButton sx={{
                      width: 56,
                      height: 56,
                      background: action.gradient,
                      color: '#fff',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': { 
                        transform: 'translateY(-4px) scale(1.05)',
                        boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
                      }
                    }}>
                      {action.icon}
                    </IconButton>
                    <Typography sx={{ 
                      fontSize: 12, 
                      fontWeight: 600, 
                      color: '#374151',
                      textAlign: 'center'
                    }}>
                      {action.label}
                    </Typography>
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Paper>

        {/* Wallet Types */}
        <Typography sx={{ mb: 2, fontWeight: 800, fontSize: 18, color: '#111827' }}>
          Tài khoản
        </Typography>
        
        <Stack spacing={2} sx={{ mb: 3 }}>
          {/* Cash Wallet */}
          <Paper 
            elevation={0}
            sx={{ 
              borderRadius: 3,
              overflow: 'hidden',
              border: '2px solid #f0fdf4',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: '#10b981',
                boxShadow: '0 8px 24px rgba(16,185,129,0.15)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            <ListItemButton sx={{ p: 2.5 }}>
              <ListItemIcon>
                <Box sx={{
                  width: 52,
                  height: 52,
                  borderRadius: 2.5,
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 20px rgba(16,185,129,0.3)'
                }}>
                  <AccountBalanceWalletOutlinedIcon sx={{ color: '#fff', fontSize: 28 }} />
                </Box>
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography sx={{ fontWeight: 700, fontSize: 16, mb: 0.5, color: '#111827' }}>
                    Ví tiền mặt
                  </Typography>
                }
                secondary={
                  <Typography sx={{ fontWeight: 700, fontSize: 18, color: '#10b981' }}>
                    ₫{cashBalance.toLocaleString()}
                  </Typography>
                }
              />
              <ChevronRightIcon sx={{ color: '#9CA3AF' }} />
            </ListItemButton>
          </Paper>

          {/* Credit Wallet */}
          <Paper 
            elevation={0}
            sx={{ 
              borderRadius: 3,
              overflow: 'hidden',
              border: '2px solid #f0fdf4',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: '#10b981',
                boxShadow: '0 8px 24px rgba(16,185,129,0.15)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            <ListItemButton sx={{ p: 2.5 }}>
              <ListItemIcon>
                <Box sx={{
                  width: 52,
                  height: 52,
                  borderRadius: 2.5,
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 20px rgba(59,130,246,0.3)'
                }}>
                  <CreditCardOutlinedIcon sx={{ color: '#fff', fontSize: 28 }} />
                </Box>
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography sx={{ fontWeight: 700, fontSize: 16, mb: 0.5, color: '#111827' }}>
                    Ví tín dụng
                  </Typography>
                }
                secondary={
                  <Typography sx={{ fontWeight: 700, fontSize: 18, color: '#3b82f6' }}>
                    ₫{creditBalance.toLocaleString()}
                  </Typography>
                }
              />
              <ChevronRightIcon sx={{ color: '#9CA3AF' }} />
            </ListItemButton>
          </Paper>
        </Stack>

        {/* Features Section */}
        <Typography sx={{ mb: 2, fontWeight: 800, fontSize: 18, color: '#111827' }}>
          Dịch vụ & Tiện ích
        </Typography>

        <Stack spacing={2}>
          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: 3,
              border: '1px solid #f3f4f6',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: '#10b981',
                boxShadow: '0 8px 24px rgba(16,185,129,0.12)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            <CardActionArea>
              <CardContent sx={{ p: 2.5 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2.5,
                    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 20px rgba(251,191,36,0.3)'
                  }}>
                    <BoltOutlinedIcon sx={{ color: '#fff', fontSize: 28 }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: 15, mb: 0.5, color: '#111827' }}>
                      Nạp tiền nhanh
                    </Typography>
                    <Typography sx={{ fontSize: 13, color: '#6B7280', lineHeight: 1.5 }}>
                      Nạp tiền ngay để nhận thêm nhiều đơn hàng hấp dẫn
                    </Typography>
                  </Box>
                  <ChevronRightIcon sx={{ color: '#D1D5DB' }} />
                </Stack>
              </CardContent>
            </CardActionArea>
          </Card>

          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: 3,
              border: '1px solid #f3f4f6',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: '#10b981',
                boxShadow: '0 8px 24px rgba(16,185,129,0.12)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            <CardActionArea>
              <CardContent sx={{ p: 2.5 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2.5,
                    background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 20px rgba(236,72,153,0.3)'
                  }}>
                    <UmbrellaOutlinedIcon sx={{ color: '#fff', fontSize: 28 }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: 15, mb: 0.5, color: '#111827' }}>
                      Bảo hiểm tài xế
                    </Typography>
                    <Typography sx={{ fontSize: 13, color: '#6B7280', lineHeight: 1.5 }}>
                      Bảo vệ toàn diện cho bạn và gia đình
                    </Typography>
                  </Box>
                  <ChevronRightIcon sx={{ color: '#D1D5DB' }} />
                </Stack>
              </CardContent>
            </CardActionArea>
          </Card>

          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: 3,
              border: '1px solid #f3f4f6',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: '#10b981',
                boxShadow: '0 8px 24px rgba(16,185,129,0.12)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            <CardActionArea>
              <CardContent sx={{ p: 2.5 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2.5,
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 20px rgba(139,92,246,0.3)'
                  }}>
                    <SavingsOutlinedIcon sx={{ color: '#fff', fontSize: 28 }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: 15, mb: 0.5, color: '#111827' }}>
                      Vay vốn & Tài chính
                    </Typography>
                    <Typography sx={{ fontSize: 13, color: '#6B7280', lineHeight: 1.5 }}>
                      Giải pháp tài chính linh hoạt cho tài xế
                    </Typography>
                  </Box>
                  <ChevronRightIcon sx={{ color: '#D1D5DB' }} />
                </Stack>
              </CardContent>
            </CardActionArea>
          </Card>
        </Stack>
      </Box>
    </Box>
  );
};

export default Wallet;


