import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  CardMedia,
  Chip
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([
    {
      id: 1,
      name: 'Phở bò',
      description: 'Phở bò truyền thống với nước dùng đậm đà',
      price: 50000,
      category: 'Món chính',
      image: 'https://images.unsplash.com/photo-1677837914128-2367031a11e7?auto=format&fit=crop&w=1200&q=80',
      status: 'active',
      hasVideo: true,
      preparationTime: 15
    },
    {
      id: 2,
      name: 'Bánh mì thịt nướng',
      description: 'Bánh mì giòn với thịt nướng thơm lừng',
      price: 25000,
      category: 'Món nhẹ',
      image: 'https://images.unsplash.com/photo-1599719455360-ff0be7c4dd06?auto=format&fit=crop&w=1200&q=80',
      status: 'active',
      hasVideo: false,
      preparationTime: 10
    },
    {
      id: 3,
      name: 'Bún bò Huế',
      description: 'Bún bò Huế cay nồng đặc trưng miền Trung',
      price: 55000,
      category: 'Món chính',
      image: 'https://images.unsplash.com/photo-1710702418104-6bf5419ab03d?auto=format&fit=crop&w=1200&q=80',
      status: 'active',
      hasVideo: true,
      preparationTime: 20
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    preparationTime: ''
  });
  const [imagePreview, setImagePreview] = useState('');

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: String(item.price),
      category: item.category,
      image: item.image,
      preparationTime: String(item.preparationTime)
    });
    setImagePreview(item.image);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({ name: '', description: '', price: '', category: '', image: '', preparationTime: '' });
    setImagePreview('');
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.price) {
      setIsDialogOpen(false);
      return;
    }
    if (editingItem) {
      setMenuItems((items) => items.map((it) => (
        it.id === editingItem.id
          ? {
              ...it,
              ...formData,
              price: parseInt(formData.price, 10) || 0,
              preparationTime: parseInt(formData.preparationTime, 10) || 0
            }
          : it
      )));
    } else {
      const newItem = {
        id: Date.now(),
        ...formData,
        price: parseInt(formData.price, 10) || 0,
        preparationTime: parseInt(formData.preparationTime, 10) || 0,
        status: 'active',
        hasVideo: false
      };
      setMenuItems((items) => [newItem, ...items]);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id) => setMenuItems((items) => items.filter((it) => it.id !== id));

  const toggleStatus = (id) => {
    setMenuItems((items) => items.map((it) => (
      it.id === id ? { ...it, status: it.status === 'active' ? 'inactive' : 'active' } : it
    )));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageData = reader.result;
      setFormData((prev) => ({ ...prev, image: imageData }));
      setImagePreview(imageData);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h6">Quản lý món ăn</Typography>
          <Typography variant="body2" color="text.secondary">Quản lý menu và món ăn của shop</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd} sx={{ bgcolor: '#ff6900', '&:hover': { bgcolor: '#e55a3a' } }}>
          Thêm món mới
        </Button>
      </Box>

      <Grid container spacing={3}>
        {menuItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card sx={{ overflow: 'hidden' }}>
              <Box sx={{ position: 'relative' }}>
                <CardMedia component="img" height="200" image={item.image} alt={item.name} />
                {item.hasVideo && (
                  <Chip size="small" color="error" icon={<VideoLibraryIcon sx={{ fontSize: 16 }} />} label="Video" sx={{ position: 'absolute', top: 8, right: 8 }} />
                )}
              </Box>
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box>
                    <Typography fontWeight={600} noWrap>{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.description}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Chip label={item.category} variant="outlined" size="small" />
                    <Chip label={item.status === 'active' ? 'Đang bán' : 'Tạm ngưng'} size="small" color={item.status === 'active' ? 'success' : 'default'} />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'text.secondary' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AttachMoneyIcon sx={{ fontSize: 18 }} />
                      <Typography color="text.primary" fontWeight={500}>{formatPrice(item.price)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AccessTimeIcon sx={{ fontSize: 18 }} />
                      <Typography>{item.preparationTime} phút</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, pt: 1 }}>
                    <Button variant="outlined" size="small" startIcon={<EditIcon />} onClick={() => handleEdit(item)} sx={{ flex: 1 }}>Sửa</Button>
                    <Button variant="outlined" size="small" onClick={() => toggleStatus(item.id)}>
                      {item.status === 'active' ? 'Ẩn' : 'Bán'}
                    </Button>
                    <IconButton size="small" onClick={() => handleDelete(item.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {menuItems.length === 0 && (
        <Card sx={{ p: 6, textAlign: 'center' }}>
          <Typography fontWeight={600} sx={{ mb: 1 }}>Chưa có món ăn nào</Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>Hãy thêm món ăn đầu tiên cho menu của bạn</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd} sx={{ bgcolor: '#ff6900', '&:hover': { bgcolor: '#e55a3a' } }}>Thêm món đầu tiên</Button>
        </Card>
      )}

      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{ backdrop: { sx: { zIndex: 1500 } } }}
        sx={{ '& .MuiDialog-paper': { zIndex: 1600 } }}
      >
        <DialogTitle>{editingItem ? 'Chỉnh sửa món ăn' : 'Thêm món ăn mới'}</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Tên món" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} fullWidth size="small" />
            <TextField label="Mô tả" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} fullWidth size="small" multiline minRows={3} />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField type="number" label="Giá (VND)" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} fullWidth size="small" />
              </Grid>
              <Grid item xs={6}>
                <TextField type="number" label="Thời gian (phút)" value={formData.preparationTime} onChange={(e) => setFormData({ ...formData, preparationTime: e.target.value })} fullWidth size="small" />
              </Grid>
            </Grid>
            <TextField label="Danh mục" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} fullWidth size="small" />
            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>Hình ảnh</Typography>
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ width: '100%' }} />
            </Box>
            {imagePreview && (
              <Box sx={{ mt: 1, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 1, overflow: 'hidden' }}>
                <img src={imagePreview} alt="Preview" style={{ width: '100%', height: 160, objectFit: 'cover' }} />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSave} variant="contained">{editingItem ? 'Cập nhật' : 'Thêm món'}</Button>
          <Button onClick={() => setIsDialogOpen(false)} variant="outlined">Hủy</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MenuManagement;


