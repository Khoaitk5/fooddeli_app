import React, { useState } from 'react';
import { Box, Typography, Button, IconButton, TextField, Grid } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const MenuManagement = () => {
  const [showAddForm, setShowAddForm] = useState(false);

  // Mock data bám sát thiết kế Figma
  const [menuItems, setMenuItems] = useState([
    {
      id: 1,
      name: 'Phở bò',
      description: 'Phở bò truyền thống với nước dùng đậm đà',
      price: 50000,
      timeMinutes: 15,
      categoryLabel: 'Món chính',
      status: 'active',
      hasVideo: true,
      image: 'https://www.figma.com/api/mcp/asset/320c8912-6ec7-4b28-b065-3a4da34643e4'
    },
    {
      id: 2,
      name: 'Bánh mì thịt nướng',
      description: 'Bánh mì giòn với thịt nướng thơm lừng',
      price: 25000,
      timeMinutes: 10,
      categoryLabel: 'Món nhẹ',
      status: 'active',
      hasVideo: false,
      image: 'https://www.figma.com/api/mcp/asset/d6ce77b7-6058-4112-a930-b5ec7e6e5a73'
    },
    {
      id: 3,
      name: 'Bún bò Huế',
      description: 'Bún bò Huế cay nồng đặc trưng miền Trung',
      price: 55000,
      timeMinutes: 20,
      categoryLabel: 'Món chính',
      status: 'active',
      hasVideo: true,
      image: 'https://www.figma.com/api/mcp/asset/2d27df10-8f18-4d0e-9306-00f9c4dd9739'
    }
  ]);

  // State form thêm món
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    timeMinutes: '',
    categoryLabel: '',
    image: '',
  });

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmitAdd = () => {
    if (!formData.name || !formData.price) {
      return;
    }
    const newItem = {
      id: Date.now(),
      name: formData.name,
      description: formData.description || '',
      price: Number(formData.price) || 0,
      timeMinutes: Number(formData.timeMinutes) || 0,
      categoryLabel: formData.categoryLabel || 'Món chính',
      status: 'active',
      hasVideo: false,
      image: formData.image || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop',
    };
    setMenuItems((prev) => [newItem, ...prev]);
    setShowAddForm(false);
    setFormData({ name: '', description: '', price: '', timeMinutes: '', categoryLabel: '', image: '' });
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      {/* Heading + Button theo Figma */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box>
          <Typography sx={{
            fontSize: '20px',
            color: '#000000',
            fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif"
          }}>
            Quản lý món ăn
          </Typography>
          <Typography sx={{
            fontSize: '16px',
            color: '#717182',
            fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif"
          }}>
            Quản lý menu và món ăn của shop
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowAddForm(true)}
          sx={{
            height: '36px',
            backgroundColor: '#ff6900',
            borderRadius: '8px',
            textTransform: 'none',
            fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif",
            '&:hover': { backgroundColor: '#e55a3a' }
          }}
        >
          Thêm món mới
        </Button>
      </Box>

      {/* Cards */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
        gap: '24px'
      }}>
        {menuItems.map((item) => (
          <Box
            key={item.id}
            sx={{
              backgroundColor: '#ffffff',
              border: '0.8px solid rgba(0,0,0,0.1)',
              borderRadius: '14px',
              padding: '16px',
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
              {item.hasVideo && (
                <Box sx={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  backgroundColor: '#fb2c36',
                  borderRadius: '8px',
                  px: '8.8px',
                  py: '2.8px'
                }}>
                  <Typography sx={{ color: '#fff', fontSize: '12px', fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif" }}>Video</Typography>
                </Box>
              )}
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
                marginBottom: '8px'
              }}>
                {item.description}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '12px' }}>
                <Box sx={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: '8px',
                  backgroundColor: '#eceef2'
                }}>
                  <Typography sx={{ fontSize: '12px', color: '#030213', fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif" }}>
                    {item.categoryLabel}
                  </Typography>
                </Box>
                <Box sx={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: '8px',
                  backgroundColor: item.status === 'active' ? '#dcfce7' : '#fee2e2'
                }}>
                  <Typography sx={{ fontSize: '12px', color: item.status === 'active' ? '#016630' : '#dc2626', fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif" }}>
                    {item.status === 'active' ? 'Đang bán' : 'Tạm dừng'}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Typography sx={{
                  fontSize: '14px',
                  color: '#000',
                  fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif"
                }}>
                  {item.price.toLocaleString('vi-VN')} ₫
                </Typography>
                <Typography sx={{
                  fontSize: '14px',
                  color: '#717182',
                  fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif"
                }}>
                  {item.timeMinutes} phút
                </Typography>
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box sx={{
              display: 'flex',
              gap: '8px',
              justifyContent: 'flex-start',
              alignItems: 'center',
              pt: '8px'
            }}>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                size="small"
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  height: '32px'
                }}
              >
                Sửa
              </Button>
              <Button
                variant="outlined"
                size="small"
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  height: '32px',
                  borderColor: 'rgba(0,0,0,0.1)'
                }}
              >
                Ẩn
              </Button>
              <IconButton size="small" sx={{ border: '0.8px solid rgba(0,0,0,0.1)', borderRadius: '8px', height: '32px', width: '32px' }}>
                <DeleteIcon sx={{ fontSize: '16px', color: '#7f1d1d' }} />
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
            borderRadius: '10px',
            padding: '24px',
            width: '512px',
            maxHeight: '80vh',
            overflow: 'auto',
            border: '0.8px solid rgba(0,0,0,0.1)'
          }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', mb: '16px' }}>
              <Typography sx={{ fontSize: '18px', fontWeight: 'bold', color: '#000' }}>Thêm món ăn mới</Typography>
              <Typography sx={{ fontSize: '14px', color: '#717182' }}>Điền thông tin chi tiết cho món ăn</Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Box>
                <Typography sx={{ fontSize: '14px', mb: '6px' }}>Tên món</Typography>
                <TextField fullWidth size="small" placeholder="Nhập tên món ăn" value={formData.name} onChange={handleChange('name')} sx={{ backgroundColor: '#f3f3f5', borderRadius: '8px' }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: '14px', mb: '6px' }}>Mô tả</Typography>
                <TextField fullWidth size="small" placeholder="Mô tả món ăn" multiline minRows={3} value={formData.description} onChange={handleChange('description')} sx={{ backgroundColor: '#f3f3f5', borderRadius: '8px' }} />
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography sx={{ fontSize: '14px', mb: '6px' }}>Giá (VND)</Typography>
                  <TextField fullWidth size="small" placeholder="50000" value={formData.price} onChange={handleChange('price')} sx={{ backgroundColor: '#f3f3f5', borderRadius: '8px' }} />
                </Grid>
                <Grid item xs={6}>
                  <Typography sx={{ fontSize: '14px', mb: '6px' }}>Thời gian (phút)</Typography>
                  <TextField fullWidth size="small" placeholder="15" value={formData.timeMinutes} onChange={handleChange('timeMinutes')} sx={{ backgroundColor: '#f3f3f5', borderRadius: '8px' }} />
                </Grid>
              </Grid>
              <Box>
                <Typography sx={{ fontSize: '14px', mb: '6px' }}>Danh mục</Typography>
                <TextField fullWidth size="small" placeholder="Món chính, Món nhẹ, Đồ uống..." value={formData.categoryLabel} onChange={handleChange('categoryLabel')} sx={{ backgroundColor: '#f3f3f5', borderRadius: '8px' }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: '14px', mb: '6px' }}>Hình ảnh URL</Typography>
                <TextField fullWidth size="small" placeholder="https://..." value={formData.image} onChange={handleChange('image')} sx={{ backgroundColor: '#f3f3f5', borderRadius: '8px' }} />
              </Box>

              {formData.image && (
                <Box sx={{ mt: '4px', border: '0.8px solid rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden' }}>
                  <img src={formData.image} alt="preview" style={{ width: '100%', height: 160, objectFit: 'cover' }} />
                </Box>
              )}
            </Box>

            <Box sx={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', mt: '16px' }}>
              <Button variant="contained" onClick={handleSubmitAdd} sx={{ backgroundColor: '#030213', borderRadius: '8px', textTransform: 'none' }}>
                Thêm món
              </Button>
              <Button variant="outlined" onClick={() => setShowAddForm(false)} sx={{ borderRadius: '8px', textTransform: 'none' }}>
                Hủy
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default MenuManagement;


