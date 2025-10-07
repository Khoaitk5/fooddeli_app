import React, { useState } from 'react';
import { 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  Stack, 
  Chip, 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  MenuItem
} from '@mui/material';
import { Add, Edit, MoreVert } from '@mui/icons-material';

const MenuManagement = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [menuItems] = useState([
    {
      id: 1,
      name: 'Phở bò',
      description: 'Phở bò truyền thống với nước dùng đậm đà',
      price: 50000,
      time: 15,
      category: 'Món chính',
      status: 'Đang bán',
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop',
      hasVideo: true
    },
    {
      id: 2,
      name: 'Bánh mì thịt nướng',
      description: 'Bánh mì giòn với thịt nướng thơm lừng',
      price: 25000,
      time: 10,
      category: 'Món nhẹ',
      status: 'Đang bán',
      image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&h=300&fit=crop',
      hasVideo: false
    },
    {
      id: 3,
      name: 'Bún bò Huế',
      description: 'Bún bò Huế cay nồng đặc trưng miền Trung',
      price: 55000,
      time: 20,
      category: 'Món chính',
      status: 'Đang bán',
      image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400&h=300&fit=crop',
      hasVideo: true
    }
  ]);

  const handleAddMenu = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const MenuCard = ({ item }) => (
    <Paper 
      elevation={0} 
      sx={{ 
        borderRadius: '14px', 
        border: '0.8px solid rgba(0,0,0,0.1)', 
        overflow: 'hidden',
        height: '502px',
        transition: 'box-shadow 200ms ease, transform 200ms ease',
        '&:hover': {
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
          transform: 'translateY(-2px)'
        }
      }}
    >
      {/* Image Section */}
      <Box 
        sx={{ 
          height: '242px', 
          position: 'relative',
          backgroundImage: `url(${item.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {item.hasVideo && (
          <Chip
            label="Video"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: '#fb2c36',
              color: 'white',
              fontSize: '12px',
              height: '21px',
              borderRadius: '8px'
            }}
          />
        )}
      </Box>

      {/* Content Section */}
      <Box sx={{ p: 2, height: 'calc(100% - 242px)', display: 'flex', flexDirection: 'column' }}>
        {/* Title and Description */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '18px', mb: 0.5 }}>
            {item.name}
          </Typography>
          <Typography variant="body2" sx={{ color: '#717182', fontSize: '14px' }}>
            {item.description}
          </Typography>
        </Box>

        {/* Badges */}
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Chip 
            label={item.category}
            size="small"
            sx={{ 
              backgroundColor: '#eceef2',
              color: '#030213',
              fontSize: '12px',
              height: '21px',
              borderRadius: '8px'
            }}
          />
          <Chip 
            label={item.status}
            size="small"
            sx={{ 
              backgroundColor: '#dcfce7',
              color: '#016630',
              fontSize: '12px',
              height: '21px',
              borderRadius: '8px'
            }}
          />
        </Stack>

        {/* Price and Time */}
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography sx={{ fontSize: '16px' }}>₫</Typography>
            <Typography variant="body2" sx={{ fontSize: '14px' }}>
              {item.price.toLocaleString()} ₫
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography sx={{ fontSize: '16px' }}>⏱️</Typography>
            <Typography variant="body2" sx={{ color: '#717182', fontSize: '14px' }}>
              {item.time} phút
            </Typography>
          </Stack>
        </Stack>

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
              color: '#d08700',
              minWidth: '43px'
            }}
          >
            Ẩn
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
      {/* Sidebar */}
      <Box 
        sx={{ 
          width: 0,
          display: 'none'
        }}
      >
        {/* Logo removed as requested */}

        {/* Menu items removed as requested */}
        <Box sx={{ flex: 1 }} />

        {/* Logout button removed as requested */}
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, p: { xs: 2, md: 4 } }}>
        {/* Header removed as requested */}

        {/* Menu Management Section */}
        <Box sx={{ 
          backgroundColor: 'white',
          borderRadius: '14px',
          p: { xs: 2, md: 3 },
          border: '0.8px solid rgba(0,0,0,0.06)',
          boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
          maxWidth: 1200,
          mx: 'auto'
        }}>
          {/* Section Header - left title removed, keep action button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 3 }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddMenu}
              sx={{
                backgroundColor: '#ff6900',
                borderRadius: '8px',
                height: '36px',
                fontSize: '14px',
                px: 2,
                '&:hover': {
                  backgroundColor: '#e55a00'
                }
              }}
            >
              Thêm món mới
            </Button>
          </Box>

          {/* Menu Cards Grid */}
          <Grid container spacing={{ xs: 2, md: 3 }}>
            {menuItems.map((item) => (
              <Grid item xs={12} sm={6} md={6} lg={4} key={item.id}>
                <MenuCard item={item} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* Add Menu Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '10px',
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '18px', mb: 0.5 }}>
            Thêm món ăn mới
          </Typography>
          <Typography variant="body2" sx={{ color: '#717182', fontSize: '14px' }}>
            Điền thông tin chi tiết cho món ăn
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                size="small"
                margin="dense"
                label="Tên món"
                placeholder="Nhập tên món ăn"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#f3f3f5',
                    borderRadius: '8px'
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                margin="dense"
                type="number"
                label="Giá (VND)"
                placeholder="50000"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#f3f3f5',
                    borderRadius: '8px'
                  }
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                margin="dense"
                label="Mô tả"
                placeholder="Mô tả món ăn"
                multiline
                rows={3}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#f3f3f5',
                    borderRadius: '8px'
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                margin="dense"
                type="number"
                label="Thời gian (phút)"
                placeholder="15"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#f3f3f5',
                    borderRadius: '8px'
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                margin="dense"
                label="Danh mục"
                placeholder="Món chính, Món nhẹ, Đồ uống..."
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#f3f3f5',
                    borderRadius: '8px'
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                margin="dense"
                label="Trạng thái"
                select
                defaultValue="Đang bán"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#f3f3f5',
                    borderRadius: '8px'
                  }
                }}
              >
                <MenuItem value="Đang bán">Đang bán</MenuItem>
                <MenuItem value="Tạm ẩn">Tạm ẩn</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                margin="dense"
                label="Hình ảnh (URL)"
                placeholder="https://..."
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#f3f3f5',
                    borderRadius: '8px'
                  }
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 1, justifyContent: 'flex-end' }}>
          <Button
            onClick={handleCloseDialog}
            size="small"
            sx={{
              borderRadius: '8px',
              height: 36,
              fontSize: '14px',
              borderColor: 'rgba(0,0,0,0.1)',
              color: '#000'
            }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{
              backgroundColor: '#ff6900',
              borderRadius: '8px',
              height: 36,
              fontSize: '14px',
              px: 3,
              '&:hover': {
                backgroundColor: '#e55a00'
              }
            }}
          >
            Thêm món
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MenuManagement;