import React from 'react';
import { Box } from '@mui/material';
import EarningSummary from '@/components/Shipper/EarningSummary';
import { useEarnings } from '@/hooks/useEarnings';

const Earnings = () => {
  const { summary, list } = useEarnings();
  return (
    <Box sx={{ p: 2 }}>
      <EarningSummary summary={summary} list={list} />
    </Box>
  );
};

export default Earnings;


