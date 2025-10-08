import React from 'react';
import { Box, Typography } from '@mui/material';

const ProductMiniCard = ({
  thumbSrc,
  flashIcon,
  starIcon,
  title,
  price,
  oldPrice,
  containerSx,
}) => {
  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      width: { xs: '100%', sm: 300 },
      maxWidth: 300,
      minHeight: 84,
      backgroundColor: '#ffffff',
      borderRadius: 8,
      padding: '8px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
      ...containerSx,
    }}>
      <Box sx={{ width: 72, height: 72, borderRadius: 6, overflow: 'hidden', flexShrink: 0 }}>
        <Box component="img" src={thumbSrc} alt="thumb" referrerPolicy="no-referrer" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </Box>

      <Box sx={{ marginLeft: '10px', flex: 1, minWidth: 0 }}>
        <Typography sx={{ color: '#000', fontSize: 13, fontWeight: 600, lineHeight: 1.2 }} noWrap>
          {title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '4px' }}>
          <Box sx={{ width: 14, height: 14, backgroundColor: '#fdeee7', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '6px' }}>
            <Box component="img" src={flashIcon} alt="flash" referrerPolicy="no-referrer" sx={{ width: 8, height: 8 }} />
          </Box>
          <Typography sx={{ fontSize: 11, color: '#000' }}>Flash Sale 12:00:00</Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
          <Box component="img" src={starIcon} alt="star" referrerPolicy="no-referrer" sx={{ width: 10, height: 10 }} />
          <Typography sx={{ fontSize: 11, color: '#868686' }}>4.8 | Bán 1M trực tuyến</Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
          <Typography sx={{ color: '#ed4e30', fontWeight: 700 }}>
            <span style={{ fontSize: 12 }}>₫</span>
            <span style={{ fontSize: 16 }}>{price}</span>
          </Typography>
          <Typography sx={{ fontSize: 11, color: '#b8b6bd', textDecoration: 'line-through' }}>{oldPrice}</Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', marginLeft: '8px' }}>
        <Box sx={{ backgroundColor: '#fdefef', height: 28, borderTopLeftRadius: 6, borderBottomLeftRadius: 6, paddingX: '8px', display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ fontSize: 11, color: '#ed4e30', fontWeight: 700 }}>-20%</Typography>
        </Box>
        <Box sx={{ backgroundColor: '#ed4e30', height: 28, borderTopRightRadius: 6, borderBottomRightRadius: 6, paddingX: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography sx={{ fontSize: 12, color: '#fff', fontWeight: 700 }}>Mua ngay</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ProductMiniCard;
