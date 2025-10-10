import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
} from "@mui/material";
import {
  Person as PersonIcon,
  Store as StoreIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  SwapHoriz as SwapHorizIcon,
} from "@mui/icons-material";

const ShopSettings = () => {
  const [openPassword, setOpenPassword] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);

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
                  A
                </Avatar>
                <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: 18 }}>
                    Admin
                  </Typography>
                  <Typography sx={{ color: "#717182", fontSize: 14 }}>
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

                <Button
                  variant="outlined"
                  fullWidth
                  onClick={item.action}
                  sx={{
                    borderColor: "#F9704B",
                    color: "#F9704B",
                    fontWeight: 600,
                    textTransform: "none",
                    "&:hover": {
                      borderColor: "#e55a3a",
                      backgroundColor: "rgba(249, 112, 75, 0.04)",
                    },
                  }}
                >
                  {item.button}
                </Button>
              </Paper>
            </Grid>
          ))}
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
