import React, { useMemo, useRef, useState } from 'react';
import { Box, Typography, Button, Stack, Avatar, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ShareIcon from '@mui/icons-material/Share';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

const Home = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [muted, setMuted] = useState(true);

  // Demo feed data – replace with API data later via services/api.js
  const feedItems = useMemo(
    () => [
      {
        id: 'prod-1',
        title: 'Spicy Ramen Bowl',
        price: 6.99,
        videoUrl:
          'https://cdn.coverr.co/videos/coverr-stir-fry-in-a-wok-3997/1080p.mp4',
        imageUrl:
          'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1974&auto=format&fit=crop',
        shop: 'Tokyo Eats',
      },
      {
        id: 'prod-2',
        title: 'Sushi Deluxe Platter',
        price: 12.49,
        videoUrl:
          'https://cdn.coverr.co/videos/coverr-chef-prepares-a-sushi-plate-9388/1080p.mp4',
        imageUrl:
          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2069&auto=format&fit=crop',
        shop: 'Sushi House',
      },
      {
        id: 'prod-3',
        title: 'Korean Fried Chicken',
        price: 8.49,
        videoUrl:
          'https://cdn.coverr.co/videos/coverr-cooking-fried-chicken-8382/1080p.mp4',
        imageUrl:
          'https://images.unsplash.com/photo-1513262599279-d8b5d2947f58?q=80&w=2070&auto=format&fit=crop',
        shop: 'Seoul Bites',
      },
    ],
    []
  );

  const handleBuy = (productId) => {
    // Navigate to cart for now; later integrate add-to-cart via api
    navigate('/customer/cart', { state: { from: '/customer/home', productId } });
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        height: '100svh',
        width: '100%',
        overflowY: 'auto',
        scrollSnapType: 'y mandatory',
        backgroundColor: '#000',
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px))',
      }}
    >
      {feedItems.map((item) => (
        <Box
          key={item.id}
          sx={{
            position: 'relative',
            height: '100svh',
            width: '100%',
            scrollSnapAlign: 'start',
            overflow: 'hidden',
            bgcolor: '#000',
          }}
        >
          {/* Media layer */}
          <Box
            component="video"
            src={item.videoUrl}
            autoPlay
            muted={muted}
            loop
            playsInline
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            onError={(e) => {
              // Fallback to image if video errors
              e.currentTarget.style.display = 'none';
              const img = e.currentTarget.nextSibling;
              if (img) img.style.display = 'block';
            }}
          />
          <Box
            component="img"
            src={item.imageUrl}
            alt={item.title}
            sx={{
              display: 'none',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />

          {/* Gradient overlays for readability */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.05) 40%), linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 30%)',
              pointerEvents: 'none',
            }}
          />

          {/* Right action bar */}
          <Stack
            spacing={2}
            sx={{
              position: 'absolute',
              right: 12,
              bottom: { xs: 96, sm: 100 },
              alignItems: 'center',
              color: '#fff',
            }}
          >
            <Avatar
              alt={item.shop}
              src={item.imageUrl}
            sx={{ width: { xs: 36, sm: 44 }, height: { xs: 36, sm: 44 }, border: '2px solid #fff' }}
            />
            <Stack alignItems="center" spacing={0.5}>
            <IconButton color="inherit" sx={{ color: '#fff' }} aria-label="like" size="small">
                <FavoriteBorderIcon />
              </IconButton>
              <Typography variant="caption">1.2k</Typography>
            </Stack>
            <Stack alignItems="center" spacing={0.5}>
            <IconButton color="inherit" sx={{ color: '#fff' }} aria-label="comment" size="small">
                <ChatBubbleOutlineIcon />
              </IconButton>
              <Typography variant="caption">324</Typography>
            </Stack>
            <Stack alignItems="center" spacing={0.5}>
            <IconButton color="inherit" sx={{ color: '#fff' }} aria-label="share" size="small">
                <ShareIcon />
              </IconButton>
              <Typography variant="caption">Share</Typography>
            </Stack>
            <IconButton
              onClick={() => setMuted((m) => !m)}
              color="inherit"
            sx={{ color: '#fff' }}
              aria-label={muted ? 'unmute' : 'mute'}
            size="small"
            >
              {muted ? <VolumeOffIcon /> : <VolumeUpIcon />}
            </IconButton>
          </Stack>

          {/* Bottom content: title, shop, price and Buy */}
          <Stack
            spacing={1}
            sx={{
              position: 'absolute',
              bottom: 'calc(88px + env(safe-area-inset-bottom, 0px))',
              left: 12,
              right: 12,
              color: '#fff',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: 16, sm: 20 }, textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>
              {item.title}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, fontSize: { xs: 12, sm: 14 }, textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>
              {item.shop}
            </Typography>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: 16, sm: 20 } }}>
                ${item.price.toFixed(2)}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="medium"
                onClick={() => handleBuy(item.id)}
                sx={{
                  borderRadius: 999,
                  px: { xs: 2, sm: 3 },
                  py: { xs: 0.75, sm: 1 },
                  textTransform: 'none',
                  fontWeight: 700,
                  boxShadow: '0 6px 16px rgba(0,0,0,0.35)',
                }}
              >
                Buy
              </Button>
            </Stack>
          </Stack>
        </Box>
      ))}
    </Box>
  );
};

export default Home;