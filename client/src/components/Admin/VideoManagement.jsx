import React, { useState } from 'react';
import { Box, Typography, Button, TextField, IconButton, Chip } from '@mui/material';
import { Add as AddIcon, PlayArrow as PlayIcon, Edit as EditIcon, Delete as DeleteIcon, Upload as UploadIcon } from '@mui/icons-material';

const VideoManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadForm, setShowUploadForm] = useState(false);

  // Mock data for video reviews
  const videoReviews = [
    {
      id: 1,
      title: 'Review Phở bò tái ngon nhất Sài Gòn',
      description: 'Món phở bò tái với nước dùng đậm đà, thịt bò tươi ngon',
      duration: '3:45',
      views: '12.5K',
      likes: '1.2K',
      status: 'published',
      thumbnail: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop',
      uploadDate: '2024-01-15',
      dishId: 1,
      dishName: 'Phở bò tái'
    },
    {
      id: 2,
      title: 'Bún bò Huế chuẩn vị Huế',
      description: 'Cách làm bún bò Huế đúng chuẩn với chả cua và thịt bò',
      duration: '5:20',
      views: '8.3K',
      likes: '856',
      status: 'draft',
      thumbnail: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop',
      uploadDate: '2024-01-14',
      dishId: 2,
      dishName: 'Bún bò Huế'
    },
    {
      id: 3,
      title: 'Cơm tấm sườn nướng thơm lừng',
      description: 'Hướng dẫn làm cơm tấm sườn nướng với nước mắm pha chuẩn',
      duration: '4:15',
      views: '15.2K',
      likes: '2.1K',
      status: 'published',
      thumbnail: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop',
      uploadDate: '2024-01-13',
      dishId: 3,
      dishName: 'Cơm tấm sườn'
    },
    {
      id: 4,
      title: 'Bánh mì thịt nướng giòn tan',
      description: 'Công thức làm bánh mì thịt nướng với pate và rau củ tươi',
      duration: '2:30',
      views: '6.7K',
      likes: '543',
      status: 'processing',
      thumbnail: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop',
      uploadDate: '2024-01-12',
      dishId: 4,
      dishName: 'Bánh mì thịt nướng'
    }
  ];

  const filteredVideos = videoReviews.filter(video =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.dishName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return { bg: '#dcfce7', color: '#166534', text: 'Đã xuất bản' };
      case 'draft':
        return { bg: '#fef3c7', color: '#92400e', text: 'Bản nháp' };
      case 'processing':
        return { bg: '#dbeafe', color: '#1e40af', text: 'Đang xử lý' };
      default:
        return { bg: '#f3f4f6', color: '#374151', text: 'Không xác định' };
    }
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      {/* Header Actions */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: '24px',
        borderRadius: '14px',
        border: '0.8px solid rgba(0,0,0,0.1)'
      }}>
        <Typography sx={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#000000',
          fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif"
        }}>
          Quản lý Video Review
        </Typography>
        
        <Box sx={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <TextField
            placeholder="Tìm kiếm video..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{
              width: '300px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px'
              }
            }}
          />
          <Button
            variant="contained"
            startIcon={<UploadIcon />}
            onClick={() => setShowUploadForm(true)}
            sx={{
              backgroundColor: '#F9704B',
              borderRadius: '8px',
              textTransform: 'none',
              fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif",
              '&:hover': {
                backgroundColor: '#e55a3a'
              }
            }}
          >
            Upload Video
          </Button>
        </Box>
      </Box>

      {/* Video Grid */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '24px'
      }}>
        {filteredVideos.map((video) => {
          const statusInfo = getStatusColor(video.status);
          
          return (
            <Box
              key={video.id}
              sx={{
                backgroundColor: '#ffffff',
                border: '0.8px solid rgba(0,0,0,0.1)',
                borderRadius: '14px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}
            >
              {/* Video Thumbnail */}
              <Box sx={{
                position: 'relative',
                width: '100%',
                height: '200px',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: '#f8f9fa'
              }}>
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                
                {/* Play Button Overlay */}
                <Box sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  borderRadius: '50%',
                  width: '60px',
                  height: '60px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.8)'
                  }
                }}>
                  <PlayIcon sx={{ color: '#ffffff', fontSize: '24px' }} />
                </Box>
                
                {/* Duration Badge */}
                <Box sx={{
                  position: 'absolute',
                  bottom: '8px',
                  right: '8px',
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  color: '#ffffff',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif"
                }}>
                  {video.duration}
                </Box>
              </Box>

              {/* Video Info */}
              <Box sx={{ flex: 1 }}>
                <Typography sx={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#000000',
                  fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif",
                  marginBottom: '8px',
                  lineHeight: 1.3
                }}>
                  {video.title}
                </Typography>
                
                <Typography sx={{
                  fontSize: '14px',
                  color: '#717182',
                  fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif",
                  marginBottom: '8px',
                  lineHeight: 1.4
                }}>
                  {video.description}
                </Typography>
                
                <Typography sx={{
                  fontSize: '14px',
                  color: '#717182',
                  fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif",
                  marginBottom: '12px'
                }}>
                  Món ăn: {video.dishName}
                </Typography>

                {/* Stats */}
                <Box sx={{
                  display: 'flex',
                  gap: '16px',
                  marginBottom: '12px'
                }}>
                  <Typography sx={{
                    fontSize: '12px',
                    color: '#717182',
                    fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif"
                  }}>
                    👁️ {video.views} lượt xem
                  </Typography>
                  <Typography sx={{
                    fontSize: '12px',
                    color: '#717182',
                    fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif"
                  }}>
                    ❤️ {video.likes} lượt thích
                  </Typography>
                </Box>

                {/* Status */}
                <Chip
                  label={statusInfo.text}
                  size="small"
                  sx={{
                    backgroundColor: statusInfo.bg,
                    color: statusInfo.color,
                    fontSize: '12px',
                    fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif",
                    marginBottom: '16px'
                  }}
                />
              </Box>

              {/* Action Buttons */}
              <Box sx={{
                display: 'flex',
                gap: '8px',
                justifyContent: 'flex-end'
              }}>
                <IconButton
                  size="small"
                  sx={{
                    backgroundColor: '#f3f4f6',
                    '&:hover': {
                      backgroundColor: '#e5e7eb'
                    }
                  }}
                >
                  <EditIcon sx={{ fontSize: '16px', color: '#374151' }} />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{
                    backgroundColor: '#fee2e2',
                    '&:hover': {
                      backgroundColor: '#fecaca'
                    }
                  }}
                >
                  <DeleteIcon sx={{ fontSize: '16px', color: '#dc2626' }} />
                </IconButton>
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Upload Form Modal Placeholder */}
      {showUploadForm && (
        <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <Box sx={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            padding: '32px',
            width: '600px',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <Typography sx={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#000000',
              fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif",
              marginBottom: '24px'
            }}>
              Upload Video Review
            </Typography>
            
            {/* Upload form content would go here */}
            <Typography sx={{
              color: '#6c757d',
              fontSize: '16px',
              fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif",
              textAlign: 'center',
              padding: '40px 0'
            }}>
              Form upload video sẽ được implement ở đây
            </Typography>
            
            <Box sx={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end',
              marginTop: '24px'
            }}>
              <Button
                variant="outlined"
                onClick={() => setShowUploadForm(false)}
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif"
                }}
              >
                Hủy
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#F9704B',
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif",
                  '&:hover': {
                    backgroundColor: '#e55a3a'
                  }
                }}
              >
                Upload Video
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default VideoManagement;
