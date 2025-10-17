// import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  Restaurant as RestaurantIcon,
  ShoppingCart as OrdersIcon,
  VideoLibrary as VideoIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  AccountBalanceWallet as WalletIcon
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

const ShopSidebar = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const menuItems = [
    {
      label: "Tổng quan",
      icon: <DashboardIcon />,
      path: "/shop/dashboard",
      active: location.pathname === "/shop/dashboard"
    },
    {
      label: "Quản lý món ăn",
      icon: <RestaurantIcon />,
      path: "/shop/menu",
      active: location.pathname === "/shop/menu"
    },
    {
      label: "Đơn hàng",
      icon: <OrdersIcon />,
      path: "/shop/orders",
      active: location.pathname === "/shop/orders"
    },
    {
      label: "Ví cửa hàng",
      icon: <WalletIcon />,
      path: "/shop/wallet",
      active: location.pathname === "/shop/wallet"
    },
    {
      label: "Video Reviews",
      icon: <VideoIcon />,
      path: "/shop/video",
      active: location.pathname === "/shop/video"
    },
    {
      label: "Cài đặt",
      icon: <SettingsIcon />,
      path: "/shop/settings",
      active: location.pathname === "/shop/settings"
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) onClose();
  };

  const handleLogout = () => {
    console.log("Logout");
  };

  const drawerContent = (
    <Box sx={{ width: 280, height: "100%", backgroundColor: "#fff", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Box sx={{
        p: 3,
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: '80px'
      }}>
        <Box>
          <Typography sx={{ fontSize: "18px", color: "#F9704B", fontWeight: 700, textTransform: "uppercase" }}>
            Bobo Food
          </Typography>
          <Typography sx={{ fontSize: "14px", color: "#676767", mt: 0.5, fontWeight: 500 }}>
            Quản trị cửa hàng
          </Typography>
        </Box>

        {isMobile && (
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              color: '#676767',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.04)',
                color: '#F9704B'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      {/* User Info */}
      <Box sx={{ p: 3, borderBottom: "1px solid #f0f0f0" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 52,
              height: 52,
              backgroundColor: "#F9704B",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              color: "#fff",
              fontWeight: 600,
              boxShadow: "0 2px 8px rgba(249, 112, 75, 0.3)"
            }}
          >
            A
          </Box>
          <Box>
            <Typography sx={{
              fontSize: '16px',
              fontWeight: 600,
              color: '#000',
              lineHeight: 1.2
            }}>
              {user?.shop_profile?.shop_name
                ? user.shop_profile.shop_name
                : `Chủ cửa hàng ${user ? `#${user.id}` : ''}`}
            </Typography>
            <Typography sx={{
              fontSize: '14px',
              color: '#676767',
              lineHeight: 1.2,
              mt: 0.5
            }}>
            </Typography>
            <Typography sx={{ fontSize: "14px", color: "#676767", mt: 0.5 }}>Online</Typography>
          </Box>
        </Box>
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, py: 1 }}>
        <List sx={{ px: 2 }}>
          {menuItems.map((item, i) => (
            <ListItem key={i} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: "12px",
                  backgroundColor: item.active ? "#F9704B" : "transparent",
                  color: item.active ? "#fff" : "#676767",
                  py: 1.5,
                  px: 2,
                  "&:hover": {
                    backgroundColor: item.active ? "#F9704B" : "#f8f9fa",
                    color: item.active ? "#fff" : "#F9704B"
                  }
                }}
              >
                <ListItemIcon sx={{
                  minWidth: 44,
                  color: item.active ? '#ffffff' : '#676767',
                  '& .MuiSvgIcon-root': {
                    fontSize: '22px'
                  }
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: "15px",
                    fontWeight: item.active ? 600 : 500
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Logout */}
      <Box sx={{ p: 2, borderTop: "1px solid #f0f0f0", mt: "auto" }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: "12px",
              color: "#dc3545",
              py: 1.5,
              px: 2,
              "&:hover": {
                backgroundColor: "rgba(220,53,69,0.08)",
                color: "#c82333"
              }
            }}
          >
            <ListItemIcon sx={{
              minWidth: 44,
              color: '#dc3545',
              '& .MuiSvgIcon-root': {
                fontSize: '22px'
              }
            }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Đăng xuất"
              primaryTypographyProps={{ fontSize: "15px", fontWeight: 500 }}
            />
          </ListItemButton>
        </ListItem>
      </Box>
    </Box>
  );

  return isMobile ? (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{ "& .MuiDrawer-paper": { width: 280, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" } }}
    >
      {drawerContent}
    </Drawer>
  ) : (
    <Box
      sx={{
        width: 280,
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        backgroundColor: "#fff",
        borderRight: "1px solid #f0f0f0",
        boxShadow: "2px 0 10px rgba(0,0,0,0.05)"
      }}
    >
      {drawerContent}
    </Box>
  );
};

export default ShopSidebar;
