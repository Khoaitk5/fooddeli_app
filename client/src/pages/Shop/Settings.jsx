import React, { useEffect, useState } from "react";
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
  DialogContent,
  CircularProgress,
  Switch,
  FormControlLabel,
  useMediaQuery,
} from "@mui/material";
import {
  Room as RoomIcon,
  Notifications as NotificationsIcon,
  Lock as LockIcon,
  Edit as EditIcon,
  Info as InfoIcon,
  AccessTime as AccessTimeIcon,
  LocalPhone as LocalPhoneIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import AddAddress from "../Auth/AddAdress";

const ShopSettings = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openAddress, setOpenAddress] = useState(false);
  const [openNotify, setOpenNotify] = useState(false);
  const [openSecurity, setOpenSecurity] = useState(false);
  const [notifications, setNotifications] = useState({
    order: true,
    rating: true,
    promo: false,
    system: true,
  });

  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/me", {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) setUser(data.user);
      } catch (err) {
        console.error("❌ Lỗi khi lấy session:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleAddressClick = () => {
    if (isMobile) {
      navigate("/address/add", { state: { from: "shop-settings" } });
    } else {
      setOpenAddress(true);
    }
  };

  if (loading)
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress sx={{ color: "#F9704B" }} />
      </Box>
    );

  if (!user)
    return (
      <Typography sx={{ textAlign: "center", mt: 10, color: "#888" }}>
        Không thể tải thông tin người dùng.
      </Typography>
    );

  const shop = user.shop_profile || {};
  const addr = shop.address?.address_line || {};

  const settingCards = [
    {
      icon: <RoomIcon sx={{ color: "#F9704B", mr: 1 }} />,
      title: "Địa chỉ cửa hàng",
      content: (
        <>
          <Typography>
            <b>Chi tiết:</b> {addr.detail || "Chưa có"}
          </Typography>
          <Typography>
            <b>Phường/Xã:</b> {addr.ward || "-"}
          </Typography>
          <Typography>
            <b>Quận/Huyện:</b> {addr.district || "-"}
          </Typography>
          <Typography>
            <b>Thành phố:</b> {addr.city || "-"}
          </Typography>
          <Typography>
            <b>Ghi chú:</b> {shop.address?.note || "Không có"}
          </Typography>
        </>
      ),
      buttonText: "Chỉnh sửa địa chỉ",
      onClick: handleAddressClick,
    },
    {
      icon: <NotificationsIcon sx={{ color: "#F9704B", mr: 1 }} />,
      title: "Cài đặt thông báo",
      content: <Typography>Quản lý các loại thông báo.</Typography>,
      buttonText: "Tùy chỉnh thông báo",
      onClick: () => setOpenNotify(true),
    },
    {
      icon: <LockIcon sx={{ color: "#F9704B", mr: 1 }} />,
      title: "Bảo mật tài khoản",
      content: <Typography>Đổi mật khẩu.</Typography>,
      buttonText: "Đổi mật khẩu",
      onClick: () => setOpenSecurity(true),
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#f9fafb",
        py: 6,
        px: { xs: 2, md: 5 },
        maxWidth: "1200px",
        mx: "auto",
      }}
    >
      <Box sx={{ textAlign: "center", mb: 5 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: "#1E293B", mb: 1 }}>
          ⚙️ Cài đặt cửa hàng
        </Typography>
        <Typography sx={{ color: "#6B7280", fontSize: 16 }}>
          Quản lý thông tin, địa chỉ, thông báo và bảo mật tài khoản của bạn.
        </Typography>
      </Box>

      {/* Thông tin chính */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 4,
          backgroundColor: "white",
          mb: 5,
          boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.03)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              mr: 3,
              bgcolor: "#F9704B",
              fontSize: 32,
              fontWeight: 600,
            }}
            src={user.avatar_url}
          >
            {user.full_name?.charAt(0).toUpperCase() || "S"}
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {shop.shop_name || "Tên cửa hàng"}
            </Typography>
            <Typography variant="body2" sx={{ color: "#6b7280" }}>
              {user.email}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Mô tả cửa hàng"
              value={shop.description || ""}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: <InfoIcon sx={{ mr: 1, color: "#F9704B" }} />,
              }}
            />
            <TextField
              fullWidth
              label="Giờ mở cửa"
              value={shop.open_hours || ""}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: <AccessTimeIcon sx={{ mr: 1, color: "#F9704B" }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Giờ đóng cửa"
              value={shop.closed_hours || ""}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: <AccessTimeIcon sx={{ mr: 1, color: "#F9704B" }} />,
              }}
            />
            <TextField
              fullWidth
              label="Số điện thoại"
              value={user.phone || ""}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: <LocalPhoneIcon sx={{ mr: 1, color: "#F9704B" }} />,
              }}
            />
          </Grid>
        </Grid>

        <Button
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: "#F9704B",
            textTransform: "none",
            fontWeight: 600,
            py: 1.3,
            borderRadius: 99,
            mt: 2,
            "&:hover": { backgroundColor: "#E85C2A" },
          }}
        >
          💾 Lưu thông tin
        </Button>
      </Paper>

      {/* Các thẻ cài đặt */}
      <Box
  sx={{
    display: "grid",
    gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
    gap: 3,
    width: "100%",
    maxWidth: "100%",
  }}
>
  {settingCards.map((item, index) => (
    <Paper
      key={index}
      sx={{
        p: 3,
        borderRadius: "16px",
        backgroundColor: "white",
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: 260,
        height: "100%",
        transition: "all 0.2s ease",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 6px 24px rgba(0,0,0,0.08)",
        },
      }}
    >
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          {item.icon}
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {item.title}
          </Typography>
        </Box>
        {item.content}
      </Box>
      <Box mt={2}>
        <Button
          variant="outlined"
          fullWidth
          startIcon={<EditIcon />}
          sx={{
            borderColor: "#F9704B",
            color: "#F9704B",
            fontWeight: 600,
            borderRadius: 99,
            textTransform: "none",
            "&:hover": { backgroundColor: "#FFF3F0" },
          }}
          onClick={item.onClick}
        >
          {item.buttonText}
        </Button>
      </Box>
    </Paper>
  ))}
</Box>

      {/* Popup AddAddress dành cho Desktop */}
      <Dialog
        open={openAddress}
        onClose={() => setOpenAddress(false)}
        fullWidth
        maxWidth="md"
        sx={{
          "& .MuiDialog-paper": {
            width: "100%",
            height: "90vh",
            borderRadius: 3,
            overflow: "hidden",
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <AddAddress
            onSubmit={(data) => {
              console.log("📦 Địa chỉ cập nhật:", data);
              setOpenAddress(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ShopSettings;
