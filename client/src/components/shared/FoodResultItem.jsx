import React from "react";
import { Box, Card, CardContent, CardMedia, Typography, Chip, Stack } from "@mui/material";
import { Star, AccessTime, LocalOffer } from "@mui/icons-material";

/**
 * 🍔 FoodResultItem - Component hiển thị kết quả tìm kiếm món ăn
 * Design theo phong cách GrabFood/ShopeeFood
 */
const FoodResultItem = ({ product }) => {
  if (!product) return null;

  // Format giá tiền
  const formatPrice = (price) => {
    if (!price) return "N/A";
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(numPrice);
  };

  // Tính rating giả (nếu không có từ API)
  const rating = product.rating || (4 + Math.random()).toFixed(1);
  const reviewCount = product.review_count || Math.floor(Math.random() * 500) + 50;

  return (
    <Card
      sx={{
        display: 'flex',
        mb: 2,
        borderRadius: 3,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      {/* Hình ảnh sản phẩm */}
      <CardMedia
        component="img"
        sx={{
          width: 120,
          height: 120,
          objectFit: 'cover',
          borderRadius: 2,
          m: 1.5,
        }}
        image={product.image_url || "https://placehold.co/120x120?text=No+Image"}
        alt={product.name}
      />

      {/* Thông tin sản phẩm */}
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, py: 1.5, pr: 1.5 }}>
        <CardContent sx={{ flex: '1 0 auto', p: 0, '&:last-child': { pb: 0 } }}>
          {/* Tên món */}
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 600,
              fontSize: '1.5rem',
              mb: 0.5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {product.name}
          </Typography>

          {/* Mô tả */}
          {product.description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                fontSize: '1.2rem',
              }}
            >
              {product.description}
            </Typography>
          )}

          {/* Rating và thông tin */}
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <Chip
              icon={<Star sx={{ fontSize: '1.4rem', color: '#FFB800' }} />}
              label={`${rating} (${reviewCount})`}
              size="small"
              sx={{
                backgroundColor: '#FFF8E1',
                color: '#F57C00',
                fontWeight: 500,
                fontSize: '1.1rem',
                height: 24,
              }}
            />
            <Chip
              icon={<AccessTime sx={{ fontSize: '1.4rem' }} />}
              label="20-30 phút"
              size="small"
              sx={{
                backgroundColor: '#E3F2FD',
                color: '#1976D2',
                fontSize: '1.1rem',
                height: 24,
              }}
            />
          </Stack>

          {/* Giá */}
          <Typography
            variant="h6"
            sx={{
              color: '#F9704B',
              fontWeight: 700,
              fontSize: '1.6rem',
            }}
          >
            {formatPrice(product.price)}
          </Typography>

          {/* Khuyến mãi (nếu có) */}
          {product.discount && (
            <Chip
              icon={<LocalOffer sx={{ fontSize: '1.2rem' }} />}
              label={`Giảm ${product.discount}%`}
              size="small"
              sx={{
                mt: 0.5,
                backgroundColor: '#FFE0E0',
                color: '#D32F2F',
                fontWeight: 600,
                fontSize: '1rem',
                height: 22,
              }}
            />
          )}
        </CardContent>
      </Box>
    </Card>
  );
};

export default FoodResultItem;
