import React, { useState } from 'react';
import { Box, Typography, IconButton, Badge, TextField, InputAdornment, Chip, Fade, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Search, FilterList, ShoppingCart, Favorite, FavoriteBorder, Add, Remove } from '@mui/icons-material';

// Mock data
const categories = [
  { id: 1, name: 'Thức ăn nhanh', icon: '🍔', color: '#ff6b6b' },
  { id: 2, name: 'Cơm', icon: '🍚', color: '#4ecdc4' },
  { id: 3, name: 'Món Quốc Tế', icon: '🍝', color: '#45b7d1' },
  { id: 4, name: 'Bún - Phở - Cháo', icon: '🍲', color: '#f9ca24' },
  { id: 5, name: 'Cà Phê - Trà Sữa - Sinh Tố', icon: '☕', color: '#6c5ce7' }
];

const topPicks = [
  {
    id: 1,
    name: 'Taco Mexico',
    description: 'Bánh Taco mềm với thịt bò',
    price: 52000,
    currency: 'đ',
    rating: 4.5,
    reviews: 25,
    category: 'Thức ăn nhanh',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300',
    isFavorite: false,
    inCart: false,
    quantity: 0
  },
  {
    id: 2,
    name: 'Pizza Phô Mai',
    description: 'Bữa ăn Ý ngon miệng',
    price: 162000,
    currency: 'đ',
    rating: 4.5,
    reviews: 25,
    category: 'Món Quốc Tế',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300',
    isFavorite: true,
    inCart: false,
    quantity: 0
  },
  {
    id: 3,
    name: 'Gourmet Sushi',
    description: 'Tasty japanese meal',
    price: 162000,
    currency: 'đ',
    rating: 4.5,
    reviews: 25,
    category: 'Món Quốc Tế',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300',
    isFavorite: false,
    inCart: true,
    quantity: 2
  },
  {
    id: 4,
    name: 'Salmon Salad',
    description: 'Baked salmon fish healthy',
    price: 52000,
    currency: 'đ',
    rating: 4.5,
    reviews: 25,
    category: 'Món Quốc Tế',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300',
    isFavorite: false,
    inCart: false,
    quantity: 0
  },
  {
    id: 5,
    name: 'Cơm Tấm Sườn',
    description: 'Cơm tấm truyền thống',
    price: 45000,
    currency: 'đ',
    rating: 4.8,
    reviews: 32,
    category: 'Cơm',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300',
    isFavorite: false,
    inCart: false,
    quantity: 0
  },
  {
    id: 6,
    name: 'Phở Bò Tái',
    description: 'Phở truyền thống Việt Nam',
    price: 55000,
    currency: 'đ',
    rating: 4.7,
    reviews: 28,
    category: 'Bún - Phở - Cháo',
    image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=300',
    isFavorite: true,
    inCart: false,
    quantity: 0
  }
];

const CategoryItem = ({ category, isSelected, onClick }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minWidth: '60px',
      cursor: 'pointer',
      padding: '8px',
      borderRadius: '16px',
      backgroundColor: isSelected ? category.color : 'transparent',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        backgroundColor: isSelected ? category.color : '#f8f9fa'
      },
      '&:active': {
        transform: 'scale(0.95)'
      }
    }}
    onClick={onClick}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        onClick();
      }
    }}
    aria-label={`Chọn danh mục ${category.name}`}
  >
    <Box
      sx={{
        width: 50,
        height: 50,
        borderRadius: '16px',
        backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.9)' : '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '22px',
        marginBottom: 0.5,
        boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
        transition: 'all 0.3s ease'
      }}
    >
      {category.icon}
    </Box>
    <Typography
      variant="caption"
      sx={{
        fontSize: '10px',
        color: isSelected ? 'white' : '#565968',
        textAlign: 'center',
        lineHeight: 1.2,
        maxWidth: '70px',
        fontWeight: isSelected ? 600 : 400
      }}
    >
      {category.name}
    </Typography>
  </Box>
);

const FoodCard = ({ food, onToggleFavorite, onUpdateCart }) => {
  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onToggleFavorite(food.id);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onUpdateCart(food.id, food.quantity + 1);
  };

  const handleRemoveFromCart = (e) => {
    e.stopPropagation();
    onUpdateCart(food.id, Math.max(0, food.quantity - 1));
  };

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN');
  };

  return (
    <Box
      sx={{
        width: 150,
        height: 220,
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0px 2px 8px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
        flexShrink: 0,
        transition: 'all 0.2s ease',
        '&:active': {
          transform: 'scale(0.96)'
        }
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          // Navigate to food detail
        }
      }}
      aria-label={`Xem chi tiết ${food.name}`}
    >
      {/* Food Image */}
      <Box
        sx={{
          height: '110px',
          backgroundImage: `url(${food.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative'
        }}
      >
        {/* Price Badge */}
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '12px',
            padding: '6px 8px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}
        >
          <Typography
            sx={{
              fontSize: '11px',
              fontWeight: 600,
              color: '#111719'
            }}
          >
            {formatPrice(food.price)} {food.currency}
          </Typography>
        </Box>
        
        {/* Favorite Button */}
        <IconButton
          sx={{
            position: 'absolute',
            top: 6,
            right: 6,
            width: 28,
            height: 28,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            minWidth: '28px',
            '&:active': {
              transform: 'scale(0.9)'
            }
          }}
          onClick={handleFavoriteClick}
          aria-label={food.isFavorite ? 'Bỏ yêu thích' : 'Yêu thích'}
        >
          {food.isFavorite ? (
            <Favorite sx={{ fontSize: '14px', color: '#ff6b6b' }} />
          ) : (
            <FavoriteBorder sx={{ fontSize: '14px', color: '#ccc' }} />
          )}
        </IconButton>

        {/* In Cart Indicator */}
        {food.inCart && food.quantity > 0 && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 6,
              right: 6,
              backgroundColor: '#4caf50',
              color: 'white',
              borderRadius: '50%',
              width: 24,
              height: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 600
            }}
            aria-label="Đã có trong giỏ hàng"
          >
            {food.quantity}
          </Box>
        )}
      </Box>

      {/* Food Info */}
      <Box sx={{ padding: '10px' }}>
        <Typography
          sx={{
            fontSize: '13px',
            fontWeight: 600,
            color: '#000',
            marginBottom: '3px',
            lineHeight: 1.2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {food.name}
        </Typography>
        <Typography
          sx={{
            fontSize: '10px',
            color: '#9796a1',
            marginBottom: '6px',
            lineHeight: 1.2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {food.description}
        </Typography>
        
        {/* Rating */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '3px 6px',
            boxShadow: '0px 1px 4px rgba(254,114,76,0.15)',
            width: 'fit-content',
            marginBottom: '6px'
          }}
        >
          <Typography
            sx={{
              fontSize: '9px',
              fontWeight: 600,
              color: '#000'
            }}
          >
            {food.rating}
          </Typography>
          <Typography sx={{ fontSize: '9px', color: '#ffc107' }}>⭐</Typography>
          <Typography
            sx={{
              fontSize: '7px',
              color: '#9796a1'
            }}
          >
            ({food.reviews}+)
          </Typography>
        </Box>

        {/* Cart Controls */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px'
          }}
        >
          {food.quantity > 0 ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#fe724c',
                borderRadius: '20px',
                padding: '4px 8px'
              }}
            >
              <IconButton
                size="small"
                onClick={handleRemoveFromCart}
                sx={{
                  color: 'white',
                  width: 20,
                  height: 20,
                  minWidth: '20px',
                  '&:active': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)'
                  }
                }}
                aria-label="Giảm số lượng"
              >
                <Remove sx={{ fontSize: '12px' }} />
              </IconButton>
              <Typography
                sx={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'white',
                  minWidth: '16px',
                  textAlign: 'center'
                }}
              >
                {food.quantity}
              </Typography>
              <IconButton
                size="small"
                onClick={handleAddToCart}
                sx={{
                  color: 'white',
                  width: 20,
                  height: 20,
                  minWidth: '20px',
                  '&:active': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)'
                  }
                }}
                aria-label="Tăng số lượng"
              >
                <Add sx={{ fontSize: '12px' }} />
              </IconButton>
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fe724c',
                color: 'white',
                borderRadius: '16px',
                padding: '6px 12px',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: 600,
                transition: 'all 0.2s ease',
                width: '100%',
                minHeight: '32px',
                '&:active': {
                  backgroundColor: '#e55a3a',
                  transform: 'scale(0.95)'
                }
              }}
              onClick={handleAddToCart}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleAddToCart(e);
                }
              }}
              aria-label="Thêm vào giỏ hàng"
            >
              + Thêm
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

const Discover = () => {
  const navigate = useNavigate();
  
  // State management
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [foods, setFoods] = useState(topPicks);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Calculate total cart items
  const totalCartItems = foods.reduce((total, food) => total + food.quantity, 0);

  // Filter foods based on selected category and search
  const filteredFoods = foods.filter(food => {
    const matchesCategory = !selectedCategory || food.category === selectedCategory.name;
    const matchesSearch = !searchQuery || 
      food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(selectedCategory?.id === category.id ? null : category);
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  // Handle favorite toggle
  const handleToggleFavorite = (foodId) => {
    setFoods(prev => prev.map(food => 
      food.id === foodId 
        ? { ...food, isFavorite: !food.isFavorite }
        : food
    ));
  };

  // Handle cart update
  const handleUpdateCart = (foodId, quantity) => {
    setFoods(prev => prev.map(food => 
      food.id === foodId 
        ? { ...food, quantity, inCart: quantity > 0 }
        : food
    ));
  };

  // Handle cart navigation
  const handleCartClick = () => {
    navigate('/customer/cart');
  };

  // Get current time greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Chào buổi sáng!';
    if (hour < 18) return 'Chào buổi chiều!';
    return 'Chào buổi tối!';
  };

  return (
    <Box
      sx={{
        backgroundColor: '#ffffff',
        minHeight: { xs: 'calc(100vh - 56px)', sm: 'calc(100vh - 64px)' },
        padding: 0,
        position: 'relative',
        width: '100%',
        maxWidth: '100vw',
        overflowX: 'hidden'
      }}
    >
      {/* Content Container */}
      <Box sx={{ 
        padding: { xs: '12px', sm: '16px' },
        paddingBottom: { xs: '72px', sm: '88px' },
        width: '100%',
        maxWidth: '100%'
      }}>
        {/* Header với Cart */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: { xs: '16px', sm: '18px' },
                color: '#1e1d1d',
                fontWeight: 500,
                lineHeight: 1.2
              }}
            >
              Hey A, <span style={{ fontWeight: 700 }}>{getGreeting()}</span>
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: '11px', sm: '12px' },
                color: '#95989f',
                marginTop: '2px'
              }}
            >
              Bạn đang thèm gì nào?
            </Typography>
          </Box>

          {/* Cart */}
          <Box sx={{ position: 'relative', cursor: 'pointer' }} onClick={handleCartClick}>
            <Badge 
              badgeContent={totalCartItems} 
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: { xs: '9px', sm: '10px' },
                  minWidth: { xs: '16px', sm: '18px' },
                  height: { xs: '16px', sm: '18px' }
                }
              }}
            >
              <Box
                sx={{
                  width: { xs: 36, sm: 40 },
                  height: { xs: 36, sm: 40 },
                  backgroundColor: '#f5f5f5',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: '#e8e8e8',
                    transform: 'scale(1.05)'
                  }
                }}
              >
                <ShoppingCart sx={{ fontSize: { xs: '18px', sm: '20px' }, color: '#666' }} />
              </Box>
            </Badge>
          </Box>
        </Box>

        {/* Search Bar */}
        <Box
          sx={{
            display: 'flex',
            gap: '12px',
            marginBottom: { xs: '16px', sm: '20px' },
            width: '100%'
          }}
        >
          <TextField
            fullWidth
            placeholder="Tìm kiếm món ăn..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: '#fe724c', fontSize: { xs: '18px', sm: '20px' } }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '16px',
                backgroundColor: '#f6f6f6',
                height: { xs: '44px', sm: '48px' },
                '& fieldset': {
                  borderColor: 'transparent',
                },
                '&:hover fieldset': {
                  borderColor: 'transparent',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#fe724c',
                  borderWidth: 2,
                },
              },
              '& .MuiInputBase-input': {
                padding: '12px 14px',
                fontSize: { xs: '13px', sm: '14px' },
                '&::placeholder': {
                  color: '#95989f',
                  opacity: 1
                }
              }
            }}
          />
          <IconButton
            onClick={() => setShowFilters(!showFilters)}
            sx={{
              width: { xs: 44, sm: 48 },
              height: { xs: 44, sm: 48 },
              backgroundColor: '#f6f6f6',
              borderRadius: '16px',
              minWidth: '48px',
              '&:hover': {
                backgroundColor: '#e8e8e8'
              }
            }}
            aria-label="Bộ lọc"
          >
            <FilterList sx={{ color: '#666', fontSize: { xs: '18px', sm: '20px' } }} />
          </IconButton>
        </Box>

        {/* Filter Chips */}
        {showFilters && (
          <Fade in={showFilters}>
            <Box
              sx={{
                display: 'flex',
                gap: '8px',
                marginBottom: '20px',
                overflowX: 'auto',
                paddingBottom: '8px',
                '&::-webkit-scrollbar': {
                  display: 'none'
                }
              }}
            >
              {['Phổ biến', 'Giá thấp', 'Giá cao', 'Đánh giá cao'].map((filter) => (
                <Chip
                  key={filter}
                  label={filter}
                  size="small"
                  sx={{
                    backgroundColor: '#f0f0f0',
                    '&:hover': {
                      backgroundColor: '#e0e0e0'
                    }
                  }}
                />
              ))}
            </Box>
          </Fade>
        )}

        {/* Categories */}
        <Box
          sx={{
            display: 'flex',
            gap: { xs: '10px', sm: '12px' },
            overflowX: 'auto',
            paddingBottom: { xs: '6px', sm: '8px' },
            marginBottom: { xs: '16px', sm: '20px' },
            width: '100%',
            '&::-webkit-scrollbar': {
              display: 'none'
            },
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {categories.map((category) => (
            <CategoryItem 
              key={category.id} 
              category={category}
              isSelected={selectedCategory?.id === category.id}
              onClick={() => handleCategorySelect(category)}
            />
          ))}
        </Box>

        {/* Promo Banner */}
        <Box
          sx={{
            height: { xs: '110px', sm: '140px' },
            borderRadius: '16px',
            backgroundImage: 'linear-gradient(135deg, #fe724c, #ff8a65)',
            marginBottom: { xs: '16px', sm: '20px' },
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            width: '100%',
            '&:active': {
              transform: 'scale(0.98)'
            }
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: '15px', sm: '18px' },
              fontWeight: 700,
              color: 'white',
              textAlign: 'center',
              padding: '0 16px'
            }}
          >
            🍕 Khuyến mãi đặc biệt! 🍕
          </Typography>
        </Box>

        {/* Results Section */}
        <Box sx={{ marginBottom: '20px' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}
          >
            <Typography
              sx={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#3b3230'
              }}
            >
              {selectedCategory ? selectedCategory.name : 'Top Picks'}
            </Typography>
            <Typography
              sx={{
                fontSize: '14px',
                color: '#95989f',
                cursor: 'pointer',
                '&:hover': {
                  color: '#fe724c'
                }
              }}
            >
              View All {'>'}
            </Typography>
          </Box>

          {/* Loading State */}
          {isLoading && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '200px'
              }}
            >
              <CircularProgress size={40} sx={{ color: '#fe724c' }} />
            </Box>
          )}

          {/* Food Cards */}
          {!isLoading && (
            <Box
              sx={{
                display: 'flex',
                gap: { xs: '10px', sm: '12px' },
                overflowX: 'auto',
                paddingBottom: { xs: '6px', sm: '8px' },
                width: '100%',
                '&::-webkit-scrollbar': {
                  display: 'none'
                },
                scrollbarWidth: 'none',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {filteredFoods.map((food) => (
                <FoodCard 
                  key={food.id} 
                  food={food}
                  onToggleFavorite={handleToggleFavorite}
                  onUpdateCart={handleUpdateCart}
                />
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Discover;
