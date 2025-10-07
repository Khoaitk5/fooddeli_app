import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Grid,
  Tabs,
  Tab,
  Divider,
  MenuItem,
} from "@mui/material";

// ✅ Icon đẹp cho từng tab
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PercentOutlinedIcon from "@mui/icons-material/PercentOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";

const System = () => {
  const [tab, setTab] = useState(0);
  const handleTabChange = (_, v) => setTab(v);

  return (
    <Box>
      {/* 🔝 Tiêu đề trang */}
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
        Cài đặt hệ thống
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Quản lý cấu hình và tùy chỉnh hệ thống quản trị
      </Typography>

      {/* 🧭 Tabs – làm đẹp */}
      <Tabs
        value={tab}
        onChange={handleTabChange}
        variant="fullWidth" // ✅ Trải đều chiều ngang container
        sx={{
          mb: 3,
          "& .MuiTabs-flexContainer": {
            justifyContent: "space-between", // ✅ Các tab dàn đều
          },
          "& .MuiTabs-indicator": { display: "none" },
          "& .MuiTab-root": {
            textTransform: "none",
            borderRadius: "10px",
            px: 3,
            py: 1,
            minHeight: 48,
            fontWeight: 500,
            flex: 1, // ✅ Mỗi tab chiếm đều không gian
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            color: "text.secondary",
            transition: "all 0.2s",
            "&:hover": {
              bgcolor: "rgba(249, 112, 75, 0.08)",
              color: "primary.main",
            },
          },
          "& .Mui-selected": {
            color: "primary.main",
            bgcolor: "rgba(249, 112, 75, 0.12)",
            borderColor: "primary.main",
            fontWeight: 600,
          },
        }}
      >
        <Tab
          icon={<SettingsOutlinedIcon fontSize="small" />}
          iconPosition="start"
          label="Tổng quan"
        />
        <Tab
          icon={<PercentOutlinedIcon fontSize="small" />}
          iconPosition="start"
          label="% Hoa hồng"
        />
        <Tab
          icon={<NotificationsNoneOutlinedIcon fontSize="small" />}
          iconPosition="start"
          label="Thông báo"
        />
        <Tab
          icon={<SecurityOutlinedIcon fontSize="small" />}
          iconPosition="start"
          label="Bảo mật"
        />
      </Tabs>

      {/* 📌 TAB 0: Tổng quan */}
      {tab === 0 && (
        <Stack spacing={3}>
          {/* Thông tin chung */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Thông tin chung
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Tên hệ thống"
                  defaultValue="FoodDelivery Admin"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email hỗ trợ"
                  defaultValue="support@fooddelivery.com"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Số điện thoại hỗ trợ"
                  defaultValue="1900-xxxx"
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Cài đặt hệ thống */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Cài đặt hệ thống
            </Typography>
            <Stack spacing={2}>
              <FormControlLabel control={<Switch />} label="Chế độ bảo trì" />
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Tự động sao lưu"
              />
              <TextField select label="Tần suất sao lưu" defaultValue="daily">
                <MenuItem value="daily">Mỗi ngày</MenuItem>
                <MenuItem value="weekly">Mỗi tuần</MenuItem>
              </TextField>
            </Stack>
          </Paper>
        </Stack>
      )}

      {/* 📊 TAB 1: Hoa hồng */}
      {tab === 1 && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Cài đặt hoa hồng
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Hoa hồng cửa hàng mặc định (%)"
                defaultValue={12}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Hoa hồng cửa hàng VIP (%)"
                defaultValue={8}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Hoa hồng shipper mặc định (%)"
                defaultValue={15}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Ước tính doanh thu
          </Typography>
          <Box
            sx={{
              p: 2.5,
              bgcolor: "rgba(249, 112, 75, 0.08)",
              borderRadius: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Doanh thu trung bình/tháng:
            </Typography>
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ mt: 1 }}
            >
              <Typography variant="body1" fontWeight={600}>
                Hoa hồng dự kiến (12%):
              </Typography>
              <Typography variant="body1" fontWeight={700}>
                33.600.000 VND
              </Typography>
            </Stack>
            <Typography
              variant="body2"
              align="right"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              Tổng doanh thu: 280.000.000 VND
            </Typography>
          </Box>
        </Paper>
      )}

      {/* 🔔 TAB 2: Thông báo */}
      {tab === 2 && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Cài đặt thông báo
          </Typography>
          <Stack spacing={2}>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Thông báo Email"
            />
            <FormControlLabel control={<Switch />} label="Thông báo SMS" />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Thông báo Push"
            />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Cảnh báo đơn hàng"
            />
          </Stack>
        </Paper>
      )}

      {/* 🛡️ TAB 3: Bảo mật */}
      {tab === 3 && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Cài đặt bảo mật
          </Typography>
          <Stack spacing={3}>
            <FormControlLabel
              control={<Switch />}
              label="Xác thực hai yếu tố (2FA)"
            />
            <TextField
              fullWidth
              label="Thời gian hết phiên (phút)"
              defaultValue={30}
            />
            <TextField
              fullWidth
              label="Hết hạn mật khẩu (ngày)"
              defaultValue={90}
            />
          </Stack>
        </Paper>
      )}

      {/* ✅ Nút hành động */}
      <Stack
        direction="row"
        justifyContent="flex-end"
        spacing={2}
        sx={{ mt: 4 }}
      >
        <Button variant="outlined">Khôi phục mặc định</Button>
        <Button variant="contained" color="primary">
          Lưu cài đặt
        </Button>
      </Stack>
    </Box>
  );
};

export default System;
