import { Box, Typography, Avatar, Chip, Stack } from "@mui/material";
import { Star, Verified } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

/**
 * 🏪 ShopResultItem - Component hiển thị kết quả tìm kiếm theo cửa hàng
 * Hiển thị thông tin shop và danh sách món ăn của shop đó
 */
const ShopResultItem = ({ shop }) => {
  const navigate = useNavigate();

  if (!shop || !shop.products || shop.products.length === 0) return null;

  // Format giá tiền
  const formatPrice = (price) => {
    if (!price) return "N/A";
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(numPrice);
  };

  // Xử lý click vào shop để xem chi tiết
  const handleShopClick = () => {
    if (shop.shop_id) {
      navigate(`/shop/${shop.shop_id}`);
    }
  };

  // Xử lý click vào món ăn
  const handleProductClick = (productId) => {
    if (productId) {
      navigate(`/product/${productId}`);
    }
  };

  return (
    <Box
      sx={{
        mb: 3,
        backgroundColor: 'white',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      {/* Header: Thông tin cửa hàng */}
      <Box
        onClick={handleShopClick}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          p: 2,
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: '#FAFAFA',
          },
        }}
      >
        {/* Avatar cửa hàng */}
        <Avatar
          src={shop.shop_image || shop.avatar_url || "https://placehold.co/80x80?text=Shop"}
          alt={shop.shop_name}
          sx={{
            width: 60,
            height: 60,
            border: '2px solid #F5F5F5',
          }}
        />

        {/* Thông tin shop */}
        <Box sx={{ flex: 1 }}>
          {/* Tên shop + icon verified */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontSize: '1.5rem',
                color: '#333',
              }}
            >
              {shop.shop_name}
            </Typography>
            <Verified sx={{ fontSize: '1.6rem', color: '#F9704B' }} />
          </Box>

          {/* Rating và loại hình */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
              <Star sx={{ fontSize: '1.4rem', color: '#FFB800' }} />
              <Typography
                sx={{
                  fontSize: '1.3rem',
                  fontWeight: 500,
                  color: '#333',
                }}
              >
                {shop.rating || shop.avg_review_rating || '4.5'}
              </Typography>
              <Typography
                sx={{
                  fontSize: '1.2rem',
                  color: '#999',
                }}
              >
                ({shop.review_count || 0})
              </Typography>
            </Box>

            <Typography
              sx={{
                fontSize: '1.2rem',
                color: '#999',
              }}
            >
              •
            </Typography>

            <Typography
              sx={{
                fontSize: '1.2rem',
                color: '#666',
              }}
            >
              {shop.category || shop.products[0]?.category || 'Đồ ăn'}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Danh sách món ăn (horizontal scroll) */}
      <Box
        sx={{
          display: 'flex',
          gap: 1.5,
          px: 2,
          pb: 2,
          overflowX: 'auto',
          '&::-webkit-scrollbar': {
            height: 6,
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#F5F5F5',
            borderRadius: 3,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#DDD',
            borderRadius: 3,
            '&:hover': {
              backgroundColor: '#CCC',
            },
          },
        }}
      >
        {shop.products.slice(0, 10).map((product) => (
          <Box
            key={product.product_id}
            onClick={() => handleProductClick(product.product_id)}
            sx={{
              minWidth: 140,
              maxWidth: 140,
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
              },
            }}
          >
            {/* Hình ảnh món ăn */}
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                paddingTop: '100%', // 1:1 aspect ratio
                borderRadius: 2,
                overflow: 'hidden',
                backgroundColor: '#F5F5F5',
                mb: 1,
              }}
            >
              <Box
                component="img"
                src={product.image_url || "https://placehold.co/140x140?text=No+Image"}
                alt={product.name}
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />

              {/* Nút thêm (giống Grab/Shopee) */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 8,
                  right: 8,
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  fontSize: '2rem',
                  fontWeight: 500,
                  color: '#F9704B',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: '#F9704B',
                    color: 'white',
                  },
                }}
              >
                +
              </Box>
            </Box>

            {/* Giá tiền */}
            <Typography
              sx={{
                fontSize: '1.4rem',
                fontWeight: 700,
                color: '#333',
                mb: 0.3,
              }}
            >
              {formatPrice(product.price)}
            </Typography>

            {/* Tên món */}
            <Typography
              sx={{
                fontSize: '1.2rem',
                color: '#666',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                lineHeight: 1.3,
              }}
            >
              {product.name}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ShopResultItem;

