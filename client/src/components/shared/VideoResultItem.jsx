import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Card, CardMedia, Typography, Avatar, Stack, Chip } from "@mui/material";
import { PlayCircleOutline, Visibility } from "@mui/icons-material";

/**
 * 🎥 VideoResultItem - Component hiển thị kết quả tìm kiếm video
 * Design theo phong cách TikTok/YouTube Shorts
 */
const VideoResultItem = ({ video }) => {
  const navigate = useNavigate();

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
        borderRadius: 2,
        overflow: 'hidden',
        backgroundColor: 'transparent',
        boxShadow: 'none',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        '&:hover': {
          transform: 'scale(1.02)',
        },
        '&:hover .play-overlay': {
          opacity: 1,
        },
      }}
      onClick={() => navigate('/customer/video-detail', { state: { video } })}
    >
      {/* Thumbnail Video */}
      <Box sx={{ position: 'relative', paddingTop: '177.78%' }}> {/* 9:16 aspect ratio */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: 2,
            overflow: 'hidden',
            backgroundColor: '#000',
          }}
        >
          {/* ✅ Nếu có video_url thì render video */}
          {video.video_url ? (
            <video
              src={video.video_url}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                backgroundColor: '#000',
              }}
              onError={(e) => {
                console.warn("❌ Lỗi load video:", e);
                e.target.poster = "/default-thumbnail.jpg";
              }}
            />
          ) : (
            // ✅ Nếu không có video_url thì fallback ảnh
            <img
              src={video.thumbnail_url || "/default-thumbnail.jpg"}
              alt={video.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              onError={(e) => (e.target.src = "/default-thumbnail.jpg")}
            />
          )}

          {/* 🔤 Tiêu đề + view overlay */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 8,
              left: 8,
              color: 'white',
              textShadow: '0 1px 3px rgba(0,0,0,0.6)',
            }}
          >
            <Typography sx={{ fontWeight: 600, fontSize: '1.2rem' }}>
              {video.title || "Video không có tiêu đề"}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, fontSize: '1rem', mt: 0.5 }}>
              <Visibility sx={{ fontSize: '1.2rem' }} /> {formatViews(views)}
            </Box>
          </Box>
        </Box>

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
            borderRadius: 2,
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
