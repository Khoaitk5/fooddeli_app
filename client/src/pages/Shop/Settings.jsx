import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Switch, 
  FormControlLabel,
  TextField,
  Button,
  Avatar
} from '@mui/material';
import { 
  Person as PersonIcon,
  Store as StoreIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon
} from '@mui/icons-material';

const ShopSettings = () => {
  const [user, setUser] = useState(null);

  // Gọi API lấy session
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/users/me', {
          credentials: 'include', // nếu bạn dùng cookie/session
        });
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
        }
      } catch (error) {
        console.error('Lỗi khi lấy session:', error);
      }
    };
    fetchUser();
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, fontSize: '24px', mb: 1 }}>
            Cài đặt
          </Typography>
          <Typography variant="body2" sx={{ color: '#717182', fontSize: '16px' }}>
            Quản lý cài đặt cửa hàng của bạn
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Profile Settings */}
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                borderRadius: '14px', 
                border: '0.8px solid rgba(0,0,0,0.1)',
                height: 'fit-content'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <PersonIcon sx={{ color: '#F9704B', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '18px' }}>
                  Thông tin cá nhân
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar 
                  sx={{ 
                    width: 64, 
                    height: 64, 
                    backgroundColor: '#F9704B',
                    fontSize: '24px',
                    mr: 2
                  }}
                >
                  {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'A'}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {user?.shop_profile?.shop_name || `Chủ cửa hàng #${user?.id || ''}`}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#717182' }}>
                    {user?.role === 'shop' ? 'Chủ cửa hàng' : 'Người dùng'}
                  </Typography>
                </Box>
              </Box>

              <TextField
                fullWidth
                label="Tên cửa hàng"
                value={user?.shop_profile?.shop_name || ''}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Email"
                value={user?.email || ''}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Số điện thoại"
                value={user?.phone || ''}
                sx={{ mb: 3 }}
              />
              
              <Button 
                variant="contained" 
                sx={{ 
                  backgroundColor: '#F9704B',
                  '&:hover': { backgroundColor: '#e55a3a' }
                }}
              >
                Cập nhật thông tin
              </Button>
            </Paper>
          </Grid>

          {/* Store Settings */}
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                borderRadius: '14px', 
                border: '0.8px solid rgba(0,0,0,0.1)',
                height: 'fit-content'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <StoreIcon sx={{ color: '#F9704B', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '18px' }}>
                  Cài đặt cửa hàng
                </Typography>
              </Box>

              <TextField
                fullWidth
                label="Địa chỉ cửa hàng"
                value={user?.shop_profile?.shop_address_id || ''}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Giờ mở cửa"
                value={user?.shop_profile?.open_hours || ''}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Giờ đóng cửa"
                value={user?.shop_profile?.closed_hours || ''}
                sx={{ mb: 3 }}
              />
              
              <Button 
                variant="contained" 
                sx={{ 
                  backgroundColor: '#F9704B',
                  '&:hover': { backgroundColor: '#e55a3a' }
                }}
              >
                Cập nhật cửa hàng
              </Button>
            </Paper>
          </Grid>

          {/* Notification Settings */}
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                borderRadius: '14px', 
                border: '0.8px solid rgba(0,0,0,0.1)'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <NotificationsIcon sx={{ color: '#F9704B', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '18px' }}>
                  Thông báo
                </Typography>
              </Box>

              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Thông báo đơn hàng mới"
              />
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Thông báo đánh giá"
              />
              <FormControlLabel
                control={<Switch />}
                label="Thông báo khuyến mãi"
              />
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Thông báo hệ thống"
              />
            </Paper>
          </Grid>

          {/* Security Settings */}
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                borderRadius: '14px', 
                border: '0.8px solid rgba(0,0,0,0.1)'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <SecurityIcon sx={{ color: '#F9704B', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '18px' }}>
                  Bảo mật
                </Typography>
              </Box>

              <TextField
                fullWidth
                label="Mật khẩu hiện tại"
                type="password"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Mật khẩu mới"
                type="password"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Xác nhận mật khẩu mới"
                type="password"
                sx={{ mb: 3 }}
              />
              
              <Button 
                variant="outlined" 
                sx={{ 
                  borderColor: '#F9704B',
                  color: '#F9704B',
                  '&:hover': { 
                    borderColor: '#e55a3a',
                    backgroundColor: 'rgba(249, 112, 75, 0.04)'
                  }
                }}
              >
                Đổi mật khẩu
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ShopSettings;
