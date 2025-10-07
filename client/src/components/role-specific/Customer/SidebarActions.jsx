import React from 'react';
import { Box, Typography } from '@mui/material';

const SidebarActions = ({ avatarSrc, likeIcon, bookmarkIcon, shareIcon, sx }) => {
  return (
    <Box sx={{ position: 'absolute', right: 7, top: 413, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', ...sx }}>
      <Box sx={{ position: 'relative', width: 48, height: 57 }}>
        <Box component="img" src={avatarSrc} alt="avatar" referrerPolicy="no-referrer" sx={{ width: 48, height: 48, borderRadius: '50%' }} />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 45 }}>
        <Box sx={{ position: 'relative', width: 30, height: 30, boxShadow: '1px 1px 1px rgba(0,0,0,0.25)' }}>
          <Box component="img" alt="like" src={likeIcon} referrerPolicy="no-referrer" sx={{ position: 'absolute', inset: '6% 3% 6% 3%' }} />
        </Box>
        <Typography sx={{ marginTop: '8px', fontSize: 12, fontWeight: 600, color: '#fff', textShadow: '1px 1px 1px rgba(0,0,0,0.25)' }}>250,5K</Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 45 }}>
        <Box sx={{ position: 'relative', width: 30, height: 30, boxShadow: '1px 1px 1px rgba(0,0,0,0.25)' }}>
          <Box component="img" alt="bookmark" src={bookmarkIcon} referrerPolicy="no-referrer" sx={{ position: 'absolute', inset: '6% 6% 7% 7%' }} />
        </Box>
        <Typography sx={{ marginTop: '8px', fontSize: 12, fontWeight: 600, color: '#fff', textShadow: '1px 1px 1px rgba(0,0,0,0.25)' }}>100K</Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 45 }}>
        <Box sx={{ position: 'relative', width: 30, height: 30, boxShadow: '1px 1px 1px rgba(0,0,0,0.25)' }}>
          <Box component="img" alt="share" src={shareIcon} referrerPolicy="no-referrer" sx={{ position: 'absolute', inset: '10% 13% 10% 13%' }} />
        </Box>
        <Typography sx={{ marginTop: '8px', fontSize: 12, fontWeight: 600, color: '#fff', textShadow: '1px 1px 1px rgba(0,0,0,0.25)' }}>132,5K</Typography>
      </Box>
    </Box>
  );
};

export default SidebarActions;



