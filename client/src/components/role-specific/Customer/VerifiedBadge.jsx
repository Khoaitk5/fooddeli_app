import React from 'react';
import { Box } from '@mui/material';

const VerifiedBadge = ({ ringSrc, tickSrc, sx }) => {
  return (
    <Box sx={{ position: 'relative', width: 20, height: 20, ...sx }}>
      <Box component="img" src={ringSrc} alt="verified ring" sx={{ position: 'absolute', inset: 0 }} />
      <Box component="img" src={tickSrc} alt="verified tick" sx={{ position: 'absolute', left: '28.33%', right: '25%', top: '35%', bottom: '32.5%' }} />
    </Box>
  );
};

export default VerifiedBadge;



