import React from "react";
import { Box, Card, CardMedia, Typography, Avatar, Stack, Chip } from "@mui/material";
import { PlayCircleOutline, Visibility } from "@mui/icons-material";

/**
 * 🎥 VideoResultItem - Component hiển thị kết quả tìm kiếm video
 * Design theo phong cách TikTok/YouTube Shorts
 */
const VideoResultItem = ({ video }) => {
  if (!video) return null;

  // Format số lượt xem
  const formatViews = (views) => {
    if (!views) return "0 lượt xem";
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M lượt xem`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K lượt xem`;
    return `${views} lượt xem`;
  };

  // Giả lập dữ liệu nếu không có
  const views = video.views || Math.floor(Math.random() * 100000) + 1000;
  const duration = video.duration || "0:45";

  return (
    <Card
      sx={{
        position: 'relative',
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          transform: 'scale(1.02)',
        },
        '&:hover .play-overlay': {
          opacity: 1,
        },
      }}
    >
      {/* Thumbnail Video */}
      <Box sx={{ position: 'relative', paddingTop: '177.78%' }}> {/* 9:16 aspect ratio */}
        <CardMedia
          component="img"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          image={
            video.thumbnail_url ||
            video.video_url ||
            "https://placehold.co/270x480?text=Video"
          }
          alt={video.title}
        />

        {/* Play Overlay */}
        <Box
          className="play-overlay"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.3)',
            opacity: 0,
            transition: 'opacity 0.3s ease',
          }}
        >
          <PlayCircleOutline sx={{ fontSize: 60, color: 'white' }} />
        </Box>

        {/* Duration Badge */}
        <Chip
          label={duration}
          size="small"
          sx={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            fontWeight: 600,
            fontSize: '1rem',
            height: 20,
          }}
        />
      </Box>

      {/* Video Info */}
      <Box sx={{ p: 1.5 }}>
        {/* Title */}
        <Typography
          variant="body1"
          sx={{
            fontWeight: 500,
            fontSize: '1.3rem',
            mb: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.4,
          }}
        >
          {video.title || "Video không có tiêu đề"}
        </Typography>

        {/* Shop Info */}
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
          <Avatar
            src={video.shop_avatar || "https://placehold.co/32x32"}
            sx={{ width: 24, height: 24 }}
          />
          <Typography
            variant="body2"
            sx={{
              color: '#666',
              fontSize: '1.1rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1,
            }}
          >
            {video.shopName || `Cửa hàng #${video.shop_id}`}
          </Typography>
        </Stack>

        {/* Views */}
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Visibility sx={{ fontSize: '1.4rem', color: '#999' }} />
          <Typography
            variant="caption"
            sx={{
              color: '#999',
              fontSize: '1.1rem',
            }}
          >
            {formatViews(views)}
          </Typography>
        </Stack>
      </Box>
    </Card>
  );
};

export default VideoResultItem;
