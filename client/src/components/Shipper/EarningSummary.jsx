import React from 'react';
import { Box, Stack, Typography, Divider } from '@mui/material';

const EarningSummary = ({ summary, list }) => {
  return (
    <Box>
      <Box sx={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 2, p: 2, mb: 2 }}>
        <Typography sx={{ fontWeight: 700, mb: 0.5 }}>Tổng thu nhập</Typography>
        <Typography sx={{ fontSize: 24, fontWeight: 800, color: '#111827' }}>{summary.total}đ</Typography>
        <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
          <Typography sx={{ color: '#6B7280' }}>Hôm nay: {summary.today}đ</Typography>
          <Typography sx={{ color: '#6B7280' }}>Tuần: {summary.week}đ</Typography>
        </Stack>
      </Box>
      <Box sx={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 2 }}>
        {list.map((item, idx) => (
          <Box key={idx} sx={{ p: 2 }}>
            <Stack direction="row" justifyContent="space-between">
              <Typography sx={{ fontWeight: 600 }}>{item.date}</Typography>
              <Typography sx={{ fontWeight: 700 }}>{item.amount}đ</Typography>
            </Stack>
            {idx < list.length - 1 && <Divider sx={{ mt: 1 }} />}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default EarningSummary;


