import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Stack, Typography, Chip } from '@mui/material';

const OrderCard = ({ order, variant = 'available' }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/shipper/order/${order.id}`);
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        background: '#fff',
        border: '1px solid #f0f0f0',
        borderRadius: 2,
        p: 2,
        cursor: 'pointer',
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography sx={{ fontWeight: 700 }}>#{order.code}</Typography>
        <Chip size="small" label={variant === 'available' ? 'Khả dụng' : variant === 'active' ? 'Đang chạy' : 'Hoàn tất'} color={variant === 'available' ? 'default' : variant === 'active' ? 'primary' : 'success'} />
      </Stack>
      <Typography sx={{ color: '#6B7280', mt: 0.5 }}>{order.pickup.name} → {order.dropoff.name}</Typography>
      <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
        <Typography sx={{ fontWeight: 700 }}>{order.fee}đ</Typography>
        <Typography sx={{ color: '#6B7280' }}>{order.distance} km</Typography>
        <Typography sx={{ color: '#6B7280' }}>{order.eta} phút</Typography>
      </Stack>
    </Box>
  );
};

export default OrderCard;


