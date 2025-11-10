import { Box, Typography, Avatar, Chip, Stack } from "@mui/material";
import { Star, Verified } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

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
      navigate("/customer/restaurant-details", {
        state: { shopId: shop.shop_id },
      });
    } else {
      console.warn("No shop_id found:", shop);
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
        mb: 2.5,
        backgroundColor: 'white',
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 4px 20px rgba(254, 86, 33, 0.15)',
          transform: 'translateY(-2px)',
        },
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
          background: 'linear-gradient(135deg, rgba(254, 86, 33, 0.03) 0%, rgba(255, 122, 80, 0.03) 100%)',
          borderBottom: '1px solid #F5F5F5',
          transition: 'background 0.2s ease',
          '&:hover': {
            background: 'linear-gradient(135deg, rgba(254, 86, 33, 0.08) 0%, rgba(255, 122, 80, 0.08) 100%)',
          },
        }}
      >
        {/* Avatar cửa hàng */}
        <Avatar
          src={shop.shop_image || shop.avatar_url || "https://placehold.co/80x80?text=Shop"}
          alt={shop.shop_name}
          sx={{
            width: 64,
            height: 64,
            border: '2.5px solid white',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
        />

        {/* Thông tin shop */}
        <Box sx={{ flex: 1 }}>
          {/* Tên shop + icon verified */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: '1.6rem',
                color: '#222',
                letterSpacing: '-0.3px',
              }}
            >
              {shop.shop_name}
            </Typography>
            <Verified sx={{ fontSize: '1.8rem', color: '#FE5621' }} />
          </Box>

          {/* Rating và loại hình */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 0.4,
                backgroundColor: 'rgba(255, 184, 0, 0.1)',
                px: 1,
                py: 0.3,
                borderRadius: 1.5,
              }}
            >
              <Star sx={{ fontSize: '1.5rem', color: '#FFB800' }} />
              <Typography
                sx={{
                  fontSize: '1.35rem',
                  fontWeight: 600,
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
                color: '#DDD',
              }}
            >
              •
            </Typography>

            <Chip
              label={shop.category || shop.products[0]?.category || 'Đồ ăn'}
              size="small"
              sx={{
                fontSize: '1.2rem',
                fontWeight: 500,
                height: 'auto',
                py: 0.4,
                px: 1,
                backgroundColor: 'rgba(254, 86, 33, 0.1)',
                color: '#FE5621',
                border: 'none',
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Danh sách món ăn (horizontal scroll) */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          px: 2,
          pb: 2,
          pt: 1.5,
          overflowX: 'auto',
          '&::-webkit-scrollbar': {
            height: 5,
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#E0E0E0',
            borderRadius: 3,
            '&:hover': {
              backgroundColor: '#FE5621',
            },
          },
        }}
      >
        {shop.products.slice(0, 10).map((product) => (
          <Box
            key={product.product_id}
            onClick={() => handleProductClick(product.product_id)}
            sx={{
              minWidth: 145,
              maxWidth: 145,
              cursor: 'pointer',
              transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-6px)',
              },
              '&:active': {
                transform: 'scale(0.97)',
              },
            }}
          >
            {/* Hình ảnh món ăn */}
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                paddingTop: '100%',
                borderRadius: 2.5,
                overflow: 'hidden',
                backgroundColor: '#F5F5F5',
                mb: 1,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
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

              {/* Nút thêm */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 8,
                  right: 8,
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FE5621 0%, #FF7A50 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 3px 12px rgba(254, 86, 33, 0.4)',
                  fontSize: '2rem',
                  fontWeight: 600,
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    boxShadow: '0 4px 16px rgba(254, 86, 33, 0.6)',
                  },
                  '&:active': {
                    transform: 'scale(0.95)',
                  },
                }}
              >
                +
              </Box>
            </Box>

            {/* Giá tiền */}
            <Typography
              sx={{
                fontSize: '1.45rem',
                fontWeight: 700,
                color: '#FE5621',
                mb: 0.3,
                letterSpacing: '-0.3px',
              }}
            >
              {formatPrice(product.price)}
            </Typography>

            {/* Tên món */}
            <Typography
              sx={{
                fontSize: '1.25rem',
                fontWeight: 500,
                color: '#555',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                lineHeight: 1.35,
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

