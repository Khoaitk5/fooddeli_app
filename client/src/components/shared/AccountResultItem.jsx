import React, { useState } from "react";
import { Box, Card, Avatar, Typography, Button, Stack, Chip } from "@mui/material";
import { PersonAdd, CheckCircle, VideoLibrary, Restaurant } from "@mui/icons-material";

/**
 * 👤 AccountResultItem - Component hiển thị kết quả tìm kiếm tài khoản
 * Design theo phong cách Instagram/TikTok
 */
const AccountResultItem = ({ account }) => {
  const [isFollowed, setIsFollowed] = useState(false);

  if (!account) return null;

  // Format số followers
  const formatFollowers = (count) => {
    if (!count) return "0";
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  // Giả lập dữ liệu nếu không có
  const followers = account.followers || Math.floor(Math.random() * 100000) + 1000;
  const videoCount = account.video_count || Math.floor(Math.random() * 50) + 5;
  const productCount = account.product_count || Math.floor(Math.random() * 30) + 3;

  const handleFollow = () => {
    setIsFollowed(!isFollowed);
  };

  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: 3,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          {/* Avatar */}
          <Avatar
            src={account.avatar_url || "https://placehold.co/80x80"}
            sx={{
              width: 70,
              height: 70,
              border: '3px solid #F9704B',
            }}
          />

          {/* Thông tin tài khoản */}
          <Box sx={{ flex: 1 }}>
            {/* Tên và role */}
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  fontSize: '1.5rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {account.full_name || account.username}
              </Typography>
              {account.role === 'shop' && (
                <CheckCircle sx={{ fontSize: '1.6rem', color: '#1976D2' }} />
              )}
            </Stack>

            {/* Username */}
            <Typography
              variant="body2"
              sx={{
                color: '#666',
                fontSize: '1.2rem',
                mb: 1,
              }}
            >
              @{account.username}
            </Typography>

            {/* Stats */}
            <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Typography sx={{ fontWeight: 600, fontSize: '1.2rem' }}>
                  {formatFollowers(followers)}
                </Typography>
                <Typography sx={{ color: '#666', fontSize: '1.1rem' }}>
                  followers
                </Typography>
              </Stack>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <VideoLibrary sx={{ fontSize: '1.4rem', color: '#666' }} />
                <Typography sx={{ color: '#666', fontSize: '1.1rem' }}>
                  {videoCount} videos
                </Typography>
              </Stack>
              {account.role === 'shop' && (
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Restaurant sx={{ fontSize: '1.4rem', color: '#666' }} />
                  <Typography sx={{ color: '#666', fontSize: '1.1rem' }}>
                    {productCount} món
                  </Typography>
                </Stack>
              )}
            </Stack>

            {/* Role Badge */}
            {account.role && (
              <Chip
                label={account.role === 'shop' ? 'Cửa hàng' : account.role === 'shipper' ? 'Shipper' : 'Khách hàng'}
                size="small"
                sx={{
                  backgroundColor: account.role === 'shop' ? '#E3F2FD' : account.role === 'shipper' ? '#FFF3E0' : '#F5F5F5',
                  color: account.role === 'shop' ? '#1976D2' : account.role === 'shipper' ? '#F57C00' : '#666',
                  fontWeight: 600,
                  fontSize: '1rem',
                  height: 22,
                }}
              />
            )}
          </Box>

          {/* Follow Button */}
          <Button
            variant={isFollowed ? "outlined" : "contained"}
            startIcon={isFollowed ? <CheckCircle /> : <PersonAdd />}
            onClick={handleFollow}
            sx={{
              borderRadius: 20,
              px: 2.5,
              py: 0.8,
              fontSize: '1.2rem',
              fontWeight: 600,
              textTransform: 'none',
              backgroundColor: isFollowed ? 'transparent' : '#F9704B',
              borderColor: isFollowed ? '#F9704B' : 'transparent',
              color: isFollowed ? '#F9704B' : 'white',
              '&:hover': {
                backgroundColor: isFollowed ? 'rgba(249, 112, 75, 0.08)' : '#E85A3A',
                borderColor: '#F9704B',
              },
            }}
          >
            {isFollowed ? 'Đã follow' : 'Follow'}
          </Button>
        </Stack>
      </Box>
    </Card>
  );
};

export default AccountResultItem;
