import React, { useState } from 'react';
import { 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  Stack, 
  Chip, 
  Button,
  IconButton
} from '@mui/material';
import { Add, Edit, MoreVert, PlayArrow, Visibility } from '@mui/icons-material';

const ShopVideo = () => {
  const [videos] = useState([
    {
      id: 1,
      title: 'Review Phở bò đặc biệt',
      description: 'Video review chi tiết về món phở bò với nước dùng đậm đà',
      status: 'Đã đăng',
      category: 'Phở bò',
      views: 1245,
      uploadDate: '15/1/2024',
      duration: '2:35',
      thumbnail: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop',
      statusColor: '#dcfce7',
      textColor: '#016630'
    },
    {
      id: 2,
      title: 'Cách làm Bún bò Huế',
      description: 'Hướng dẫn cách chế biến món bún bò Huế chuẩn vị miền Trung',
      status: 'Đã đăng',
      category: 'Bún bò Huế',
      views: 892,
      uploadDate: '10/1/2024',
      duration: '4:12',
      thumbnail: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400&h=300&fit=crop',
      statusColor: '#dcfce7',
      textColor: '#016630'
    },
    {
      id: 3,
      title: 'Bánh mì thịt nướng ngon',
      description: 'Giới thiệu bánh mì thịt nướng với nguyên liệu tươi ngon',
      status: 'Bản nháp',
      category: 'Bánh mì',
      views: 567,
      uploadDate: '5/1/2024',
      duration: '1:45',
      thumbnail: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&h=300&fit=crop',
      statusColor: '#fef9c2',
      textColor: '#894b00'
    }
  ]);

  const VideoCard = ({ video }) => (
    <Paper 
      elevation={0} 
      sx={{ 
        borderRadius: '14px', 
        border: '0.8px solid rgba(0,0,0,0.1)', 
        overflow: 'hidden',
        height: '550px',
        transition: 'box-shadow 200ms ease, transform 200ms ease',
        '&:hover': {
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
          transform: 'translateY(-2px)'
        }
      }}
    >
      {/* Video Thumbnail */}
      <Box 
        sx={{ 
          height: '242px', 
          position: 'relative',
          backgroundImage: `url(${video.thumbnail})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Play Button Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              backgroundColor: 'rgba(255,255,255,0.9)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <PlayArrow sx={{ fontSize: 24, color: '#000' }} />
          </Box>
        </Box>

        {/* Duration Badge */}
        <Chip
          label={video.duration}
          size="small"
          sx={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            fontSize: '12px',
            height: '21px',
            borderRadius: '8px'
          }}
        />
      </Box>

      {/* Content Section */}
      <Box sx={{ p: 2, height: 'calc(100% - 242px)', display: 'flex', flexDirection: 'column' }}>
        {/* Title and Description */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '18px', mb: 0.5 }}>
            {video.title}
          </Typography>
          <Typography variant="body2" sx={{ color: '#717182', fontSize: '14px' }}>
            {video.description}
          </Typography>
        </Box>

        {/* Status and Category Badges */}
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Chip 
            label={video.status}
            size="small"
            sx={{ 
              backgroundColor: video.statusColor,
              color: video.textColor,
              fontSize: '12px',
              height: '21px',
              borderRadius: '8px'
            }}
          />
          <Chip 
            label={video.category}
            size="small"
            sx={{ 
              backgroundColor: '#f3f4f6',
              color: '#000',
              fontSize: '12px',
              height: '21px',
              borderRadius: '8px',
              border: '0.8px solid rgba(0,0,0,0.1)'
            }}
          />
        </Stack>

        {/* Views and Upload Date */}
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Visibility sx={{ fontSize: 16, color: '#717182' }} />
            <Typography variant="body2" sx={{ color: '#717182', fontSize: '14px' }}>
              {video.views.toLocaleString()} lượt xem
            </Typography>
          </Stack>
        </Stack>

        <Typography variant="body2" sx={{ color: '#717182', fontSize: '12px', mb: 2 }}>
          Ngày upload: {video.uploadDate}
        </Typography>

        {/* Actions */}
        <Box sx={{ mt: 'auto', display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Edit />}
            sx={{ 
              flex: 1,
              height: '32px',
              fontSize: '14px',
              borderRadius: '8px',
              borderColor: 'rgba(0,0,0,0.1)',
              color: '#000'
            }}
          >
            Sửa
          </Button>
          <Button
            variant="outlined"
            sx={{ 
              height: '32px',
              fontSize: '14px',
              borderRadius: '8px',
              borderColor: 'rgba(0,0,0,0.1)',
              color: video.status === 'Bản nháp' ? '#00a63e' : '#d08700',
              minWidth: video.status === 'Bản nháp' ? '59px' : '43px'
            }}
          >
            {video.status === 'Bản nháp' ? 'Đăng' : 'Ẩn'}
          </Button>
          <IconButton
            sx={{ 
              height: '32px',
              width: '37px',
              borderRadius: '8px',
              border: '0.8px solid rgba(0,0,0,0.1)'
            }}
          >
            <MoreVert sx={{ fontSize: '16px' }} />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      {/* Sidebar - Hidden as per previous request */}
      <Box 
        sx={{ 
          width: 0,
          display: 'none'
        }}
      />

      {/* Main Content */}
      <Box sx={{ flex: 1, p: { xs: 2, md: 4 } }}>
        {/* Header removed as requested */}

        {/* Content Card */}
        <Box sx={{ 
          backgroundColor: 'white',
          borderRadius: '14px',
          p: { xs: 2, md: 3 },
          border: '0.8px solid rgba(0,0,0,0.06)',
          boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
          maxWidth: 1200,
          mx: 'auto'
        }}>
          {/* Action Bar (right-aligned) */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              sx={{
                backgroundColor: '#ad46ff',
                borderRadius: '8px',
                height: '36px',
                fontSize: '14px',
                px: 2,
                '&:hover': {
                  backgroundColor: '#9c3de6'
                }
              }}
            >
              Upload video mới
            </Button>
          </Box>

          {/* Video Cards Grid */}
          <Grid container spacing={{ xs: 2, md: 3 }}>
            {videos.map((video) => (
              <Grid item xs={12} sm={6} md={4} key={video.id}>
                <VideoCard video={video} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default ShopVideo;


