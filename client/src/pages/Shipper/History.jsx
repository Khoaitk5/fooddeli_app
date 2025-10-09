import React from 'react';
import { Box, Stack } from '@mui/material';
import OrderCard from '@/components/Shipper/OrderCard';
import { useHistoryOrders } from '@/hooks/useHistory';

const History = () => {
  const { orders } = useHistoryOrders();
  return (
    <Box sx={{ p: 2 }}>
      <Stack spacing={1.5}>
        {orders.map((o) => (
          <OrderCard key={o.id} order={o} variant="completed" />
        ))}
      </Stack>
    </Box>
  );
};

export default History;


