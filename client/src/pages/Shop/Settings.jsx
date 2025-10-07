import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Switch, 
  FormControlLabel,
  TextField,
  Button,
  Divider,
  Avatar
} from '@mui/material';
import { 
  Person as PersonIcon,
  Store as StoreIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon
} from '@mui/icons-material';

const ShopSettings = () => {
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
                  A
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Admin
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#717182' }}>
                    Quản trị viên
                  </Typography>
                </Box>
              </Box>

              <TextField
                fullWidth
                label="Tên cửa hàng"
                defaultValue="Bobo Food"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Email"
                defaultValue="admin@bobofood.com"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Số điện thoại"
                defaultValue="+84 123 456 789"
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
                defaultValue="123 Đường ABC, Quận 1, TP.HCM"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Giờ mở cửa"
                defaultValue="08:00"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Giờ đóng cửa"
                defaultValue="22:00"
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

              <Box sx={{ mb: 2 }}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Thông báo đơn hàng mới"
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Thông báo đánh giá"
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <FormControlLabel
                  control={<Switch />}
                  label="Thông báo khuyến mãi"
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Thông báo hệ thống"
                />
              </Box>
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
