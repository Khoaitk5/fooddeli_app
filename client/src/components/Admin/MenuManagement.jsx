import React, { useState } from 'react';
import { Box, Typography, Button, TextField, IconButton } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon } from '@mui/icons-material';

const MenuManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Mock data for menu items
  const menuItems = [
    {
      id: 1,
      name: 'Phở bò tái',
      price: '45000',
      category: 'Phở',
      status: 'active',
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=100&h=100&fit=crop'
    },
    {
      id: 2,
      name: 'Bún bò Huế',
      price: '50000',
      category: 'Bún',
      status: 'active',
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=100&h=100&fit=crop'
    },
    {
      id: 3,
      name: 'Cơm tấm sườn',
      price: '40000',
      category: 'Cơm',
      status: 'inactive',
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=100&h=100&fit=crop'
    },
    {
      id: 4,
      name: 'Bánh mì thịt nướng',
      price: '25000',
      category: 'Bánh mì',
      status: 'active',
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=100&h=100&fit=crop'
    }
  ];

  const filteredItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          Quản lý món ăn
        </Typography>
        
        <Box sx={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <TextField
            placeholder="Tìm kiếm món ăn..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{
              width: '300px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px'
              }
            }}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: '#717182', mr: 1 }} />
            }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowAddForm(true)}
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
            Thêm món ăn
          </Button>
        </Box>
      </Box>

      {/* Menu Items Grid */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '24px'
      }}>
        {filteredItems.map((item) => (
          <Box
            key={item.id}
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
            {/* Item Image */}
            <Box sx={{
              width: '100%',
              height: '200px',
              borderRadius: '8px',
              overflow: 'hidden',
              backgroundColor: '#f8f9fa'
            }}>
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </Box>

            {/* Item Info */}
            <Box sx={{ flex: 1 }}>
              <Typography sx={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#000000',
                fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif",
                marginBottom: '8px'
              }}>
                {item.name}
              </Typography>
              
              <Typography sx={{
                fontSize: '14px',
                color: '#717182',
                fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif",
                marginBottom: '4px'
              }}>
                Danh mục: {item.category}
              </Typography>
              
              <Typography sx={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#F9704B',
                fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif",
                marginBottom: '12px'
              }}>
                {parseInt(item.price).toLocaleString('vi-VN')} ₫
              </Typography>

              <Box sx={{
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: '20px',
                backgroundColor: item.status === 'active' ? '#dcfce7' : '#fee2e2',
                marginBottom: '16px'
              }}>
                <Typography sx={{
                  fontSize: '12px',
                  fontWeight: 'medium',
                  color: item.status === 'active' ? '#166534' : '#dc2626',
                  fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif"
                }}>
                  {item.status === 'active' ? 'Đang bán' : 'Tạm dừng'}
                </Typography>
              </Box>
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
        ))}
      </Box>

      {/* Add Form Modal Placeholder */}
      {showAddForm && (
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
            width: '500px',
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
              Thêm món ăn mới
            </Typography>
            
            {/* Form content would go here */}
            <Typography sx={{
              color: '#6c757d',
              fontSize: '16px',
              fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif",
              textAlign: 'center',
              padding: '40px 0'
            }}>
              Form thêm món ăn sẽ được implement ở đây
            </Typography>
            
            <Box sx={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end',
              marginTop: '24px'
            }}>
              <Button
                variant="outlined"
                onClick={() => setShowAddForm(false)}
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
                Thêm món ăn
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default MenuManagement;
