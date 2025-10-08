import React from 'react';
import { Box, Stack } from '@mui/material';
import OrderCard from '@/components/Shipper/OrderCard';
import { useMyRuns } from '@/hooks/useMyRuns';

const MyRuns = () => {
  const { runs } = useMyRuns();

  return (
    <Box>
      <Stack spacing={1.5}>
        {runs.map((o) => (
          <OrderCard key={o.id} order={o} variant="active" />
        ))}
      </Stack>
    </Box>
  );
};

export default MyRuns;


