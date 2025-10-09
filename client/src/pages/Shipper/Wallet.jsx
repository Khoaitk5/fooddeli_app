import React from 'react';
import { Box, Typography, List, ListItemButton, ListItemIcon, ListItemText, Divider, Avatar, Card, CardActionArea, CardContent, Stack, Grid, Button, IconButton } from '@mui/material';
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
import { useShipper } from '@/hooks/useShipper';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';

const Wallet = () => {
  const { shipper: shipperRaw } = useShipper();
  const navigate = useNavigate();
  const shipper = shipperRaw ?? {};

  const cashBalance = shipper.wallet?.cash ?? 405; // VND (mock)
  const creditBalance = shipper.wallet?.credit ?? 310864; // VND (mock)

  return (
    <Box sx={{ maxWidth: 420, mx: 'auto', p: 2.5 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <IconButton onClick={() => navigate(-1)} size="small" sx={{ mr: 0.5 }}>
          <ArrowBackIosNewOutlinedIcon />
        </IconButton>
        <Typography sx={{ fontSize: 20, fontWeight: 800 }}>Ví</Typography>
      </Stack>

      {/* Thẻ tổng quan số dư nổi bật */}
      <Box sx={{
        borderRadius: 3,
        p: 2,
        background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
        color: '#fff',
        boxShadow: '0 12px 30px rgba(22,163,74,0.35)',
        position: 'relative',
        overflow: 'hidden',
        mb: 2
      }}>
        <Box sx={{ position: 'absolute', width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', right: -40, top: -30 }} />
        <Box sx={{ position: 'absolute', width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', right: 10, bottom: -25 }} />
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.65)', width: 44, height: 44 }}>
            <AccountBalanceWalletOutlinedIcon />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ opacity: 0.9 }}>Tổng số dư</Typography>
            <Typography sx={{ fontSize: 28, fontWeight: 900 }}>đ {(cashBalance + creditBalance).toLocaleString()}</Typography>
          </Box>
        </Stack>

        {/* Hành động chính */}
        <Grid container spacing={1.25} sx={{ mt: 1 }}>
          <Grid item xs={3}>
            <Button fullWidth variant="contained" sx={{
              height: 44,
              borderRadius: 2,
              textTransform: 'none',
              background: '#ffffff',
              color: '#16a34a',
              '&:hover': { background: '#f0fdf4' }
            }}>
              <NorthEastOutlinedIcon />
            </Button>
            <Typography sx={{ textAlign: 'center', fontSize: 12, mt: 0.5, color: '#e5e7eb' }}>Nạp</Typography>
          </Grid>
          <Grid item xs={3}>
            <Button fullWidth variant="contained" sx={{
              height: 44,
              borderRadius: 2,
              textTransform: 'none',
              background: '#ffffff',
              color: '#16a34a',
              '&:hover': { background: '#f0fdf4' }
            }}>
              <SouthWestOutlinedIcon />
            </Button>
            <Typography sx={{ textAlign: 'center', fontSize: 12, mt: 0.5, color: '#e5e7eb' }}>Rút</Typography>
          </Grid>
          <Grid item xs={3}>
            <Button fullWidth variant="contained" sx={{
              height: 44,
              borderRadius: 2,
              textTransform: 'none',
              background: '#ffffff',
              color: '#16a34a',
              '&:hover': { background: '#f0fdf4' }
            }}>
              <LinkOutlinedIcon />
            </Button>
            <Typography sx={{ textAlign: 'center', fontSize: 12, mt: 0.5, color: '#e5e7eb' }}>Liên kết</Typography>
          </Grid>
          <Grid item xs={3}>
            <Button fullWidth variant="contained" sx={{
              height: 44,
              borderRadius: 2,
              textTransform: 'none',
              background: '#ffffff',
              color: '#16a34a',
              '&:hover': { background: '#f0fdf4' }
            }}>
              <HistoryOutlinedIcon />
            </Button>
            <Typography sx={{ textAlign: 'center', fontSize: 12, mt: 0.5, color: '#e5e7eb' }}>Lịch sử</Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Danh sách ví tách riêng */}
      <Box sx={{ borderRadius: 2, overflow: 'hidden', bgcolor: '#fff' }}>
        <List disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <Avatar sx={{ bgcolor: '#10b981' }}>
                <AccountBalanceWalletOutlinedIcon />
              </Avatar>
            </ListItemIcon>
            <ListItemText
              primary={<Typography sx={{ fontWeight: 700 }}>Ví tiền mặt</Typography>}
              secondary={<Typography sx={{ color: '#6B7280' }}>đ {cashBalance.toLocaleString()}</Typography>}
            />
            <ChevronRightIcon sx={{ color: '#9CA3AF' }} />
          </ListItemButton>
          <Divider />
          <ListItemButton>
            <ListItemIcon>
              <Avatar sx={{ bgcolor: '#22c55e' }}>
                <CreditCardOutlinedIcon />
              </Avatar>
            </ListItemIcon>
            <ListItemText
              primary={<Typography sx={{ fontWeight: 700 }}>Ví tín dụng</Typography>}
              secondary={<Typography sx={{ color: '#6B7280' }}>đ {creditBalance.toLocaleString()}</Typography>}
            />
            <ChevronRightIcon sx={{ color: '#9CA3AF' }} />
          </ListItemButton>
        </List>
      </Box>

      <Typography sx={{ mt: 3, mb: 1.5, fontWeight: 800 }}>Nhiều tiện ích khác cùng Ví</Typography>

      <Stack spacing={1.25}>
        <Card elevation={1} sx={{ borderRadius: 2 }}>
          <CardActionArea>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: '#22c55e' }}>
                <BoltOutlinedIcon />
              </Avatar>
              <Box>
                <Typography sx={{ fontWeight: 700 }}>Nạp tiền</Typography>
                <Typography sx={{ color: '#6B7280' }}>Nạp tiền vào Ví tài khoản của bạn để nhận cuốc xe mới nhanh hơn!</Typography>
              </Box>
            </CardContent>
          </CardActionArea>
        </Card>

        <Card elevation={1} sx={{ borderRadius: 2 }}>
          <CardActionArea>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: '#10b981' }}>
                <UmbrellaOutlinedIcon />
              </Avatar>
              <Box>
                <Typography sx={{ fontWeight: 700 }}>Bảo hiểm</Typography>
                <Typography sx={{ color: '#6B7280' }}>Bảo vệ bạn và người thân với dịch vụ bảo hiểm</Typography>
              </Box>
            </CardContent>
          </CardActionArea>
        </Card>

        <Card elevation={1} sx={{ borderRadius: 2 }}>
          <CardActionArea>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: '#059669' }}>
                <SavingsOutlinedIcon />
              </Avatar>
              <Box>
                <Typography sx={{ fontWeight: 700 }}>Hỗ trợ tài chính</Typography>
                <Typography sx={{ color: '#6B7280' }}>Khám phá các hỗ trợ tài chính khác!</Typography>
              </Box>
            </CardContent>
          </CardActionArea>
        </Card>
      </Stack>
    </Box>
  );
};

export default Wallet;


