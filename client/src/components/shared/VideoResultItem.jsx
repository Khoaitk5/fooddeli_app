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
        backgroundColor: 'white',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 6px 24px rgba(254, 86, 33, 0.2)',
        },
        '&:hover .play-overlay': {
          opacity: 1,
        },
        '&:active': {
          transform: 'scale(0.98)',
        },
      }}
      onClick={() => navigate(`/customer/video/${video.video_id}`)}
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
            borderRadius: 0,
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
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
              color: 'white',
              p: 1.5,
              pt: 4,
            }}
          >
            <Typography 
              sx={{ 
                fontWeight: 600, 
                fontSize: '1.3rem',
                textShadow: '0 2px 4px rgba(0,0,0,0.6)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                lineHeight: 1.3,
                mb: 0.5,
              }}
            >
              {video.title || "Video không có tiêu đề"}
            </Typography>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: 0.5, 
                fontSize: '1.1rem',
              }}
            >
              <Visibility sx={{ fontSize: '1.4rem' }} /> 
              <Typography sx={{ fontSize: '1.1rem', fontWeight: 500 }}>
                {formatViews(views)}
              </Typography>
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
            background: 'linear-gradient(135deg, rgba(254, 86, 33, 0.6) 0%, rgba(255, 122, 80, 0.6) 100%)',
            opacity: 0,
            transition: 'opacity 0.3s ease',
          }}
        >
          <PlayCircleOutline 
            sx={{ 
              fontSize: 70, 
              color: 'white',
              filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.4))',
            }} 
          />
        </Box>

        {/* Duration Badge */}
        <Chip
          label={duration}
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.6) 100%)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            fontWeight: 700,
            fontSize: '1.1rem',
            height: 24,
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        />
      </Box>

      {/* Video Info */}
      <Box sx={{ p: 1.5, backgroundColor: 'white' }}>
        {/* Shop Info */}
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <Avatar
            src={video.shop_avatar || "https://placehold.co/32x32"}
            sx={{ 
              width: 28, 
              height: 28,
              border: '2px solid #F5F5F5',
              boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Typography
            variant="body2"
            sx={{
              color: '#333',
              fontSize: '1.25rem',
              fontWeight: 600,
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
        <Stack 
          direction="row" 
          spacing={0.5} 
          alignItems="center"
          sx={{
            backgroundColor: 'rgba(254, 86, 33, 0.08)',
            px: 1,
            py: 0.5,
            borderRadius: 1.5,
            width: 'fit-content',
          }}
        >
          <Visibility sx={{ fontSize: '1.4rem', color: '#FE5621' }} />
          <Typography
            variant="caption"
            sx={{
              color: '#FE5621',
              fontSize: '1.15rem',
              fontWeight: 600,
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
