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
    <Box
      sx={{
        minHeight: "100vh",
        background: "#f9fafb",
        display: "flex",
        justifyContent: "center",
        py: 5,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 1000, p: { xs: 2, md: 4 } }}>
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: "#1E293B", mb: 1 }}
          >
            ⚙️ Cài đặt cửa hàng
          </Typography>
          <Typography sx={{ color: "#6B7280", fontSize: 16 }}>
            Quản lý thông tin và tùy chỉnh hoạt động cửa hàng của bạn
          </Typography>
        </Box>

        {/* THÔNG TIN CÁ NHÂN + CÀI ĐẶT CỬA HÀNG */}
        <Grid container spacing={3}>
          {/* Thông tin cá nhân */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 3,
                transition: "all 0.3s ease",
                "&:hover": { boxShadow: "0 6px 18px rgba(0,0,0,0.06)" },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <PersonIcon sx={{ color: "#F9704B", mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Thông tin cá nhân
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Avatar
                  sx={{
                    width: 70,
                    height: 70,
                    backgroundColor: "#F9704B",
                    fontSize: 26,
                    mr: 2,
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
                fullWidth
                sx={{
                  backgroundColor: "#F9704B",
                  textTransform: "none",
                  fontWeight: 600,
                  py: 1.2,
                  "&:hover": { backgroundColor: "#e55a3a" },
                }}
              >
                Cập nhật thông tin
              </Button>
            </Paper>
          </Grid>

          {/* Cài đặt cửa hàng */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 3,
                transition: "all 0.3s ease",
                "&:hover": { boxShadow: "0 6px 18px rgba(0,0,0,0.06)" },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <StoreIcon sx={{ color: "#F9704B", mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
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
                fullWidth
                sx={{
                  backgroundColor: "#F9704B",
                  textTransform: "none",
                  fontWeight: 600,
                  py: 1.2,
                  "&:hover": { backgroundColor: "#e55a3a" },
                }}
              >
                Cập nhật cửa hàng
              </Button>
            </Paper>
          </Grid>
        </Grid>

        {/* THÔNG BÁO + BẢO MẬT */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {[
            {
              icon: (
                <NotificationsIcon
                  sx={{ color: "#F9704B", fontSize: 30, mb: 1 }}
                />
              ),
              title: "Thông báo",
              desc: "Quản lý loại thông báo bạn muốn nhận.",
              button: "Chỉnh sửa",
              action: () => setOpenNotification(true),
            },
            {
              icon: (
                <SecurityIcon sx={{ color: "#F9704B", fontSize: 30, mb: 1 }} />
              ),
              title: "Bảo mật",
              desc: "Quản lý mật khẩu tài khoản của bạn.",
              button: "Đổi mật khẩu",
              action: () => setOpenPassword(true),
            },
          ].map((item, i) => (
            <Grid item xs={12} md={6} key={i}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  textAlign: "center",
                  height: "100%",
                  transition: "all 0.3s ease",
                  "&:hover": { boxShadow: "0 6px 18px rgba(0,0,0,0.06)" },
                }}
              >
                {item.icon}
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "#1E293B", mb: 1 }}
                >
                  {item.title}
                </Typography>
                <Typography sx={{ color: "#6B7280", mb: 2 }}>
                  {item.desc}
                </Typography>

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

        {/* Divider */}
        <Divider sx={{ my: 4 }} />

        {/* CHUYỂN SANG CUSTOMER */}
        <Box sx={{ textAlign: "center" }}>
          <Button
            variant="outlined"
            startIcon={<SwapHorizIcon />}
            sx={{
              backgroundColor: "#FFF3F0",
              borderColor: "#F9704B",
              color: "#F9704B",
              borderWidth: 1.5,
              borderRadius: 3,
              px: 3,
              py: 1.3,
              textTransform: "none",
              fontWeight: 600,
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#FFE6E0",
                borderColor: "#e55a3a",
              },
            }}
          >
            Chuyển sang Customer
          </Button>
        </Box>

        {/* Version */}
        <Typography align="center" sx={{ mt: 3, color: "#aaa", fontSize: 12 }}>
          Shop Management App v1.0.0
        </Typography>

        {/* Dialog - Thông báo */}
        <Dialog
          open={openNotification}
          onClose={() => setOpenNotification(false)}
        >
          <DialogTitle sx={{ fontWeight: 700, color: "#F9704B" }}>
            Cài đặt thông báo
          </DialogTitle>
          <DialogContent>
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
          </DialogContent>
          <DialogActions sx={{ pr: 3, pb: 2 }}>
            <Button onClick={() => setOpenNotification(false)}>Hủy</Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#F9704B",
                textTransform: "none",
                fontWeight: 600,
                "&:hover": { backgroundColor: "#e55a3a" },
              }}
            >
              Lưu thay đổi
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog - Bảo mật */}
        <Dialog open={openPassword} onClose={() => setOpenPassword(false)}>
          <DialogTitle sx={{ fontWeight: 700, color: "#F9704B" }}>
            Đổi mật khẩu
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Mật khẩu hiện tại"
              type="password"
              sx={{ mt: 1.5, mb: 2 }}
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
            />
          </DialogContent>
          <DialogActions sx={{ pr: 3, pb: 2 }}>
            <Button onClick={() => setOpenPassword(false)}>Hủy</Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#F9704B",
                textTransform: "none",
                fontWeight: 600,
                "&:hover": { backgroundColor: "#e55a3a" },
              }}
            >
              Xác nhận
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default ShopSettings;
