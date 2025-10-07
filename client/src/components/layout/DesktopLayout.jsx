import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  IconButton,
  Button,
  Divider,
  ListSubheader,
  Avatar,
  Stack,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard,
  Settings,
  Verified,
  Report,
  People,
  Store,
  LocalShipping,
  BarChart,
} from "@mui/icons-material";
import { useAuth } from "../../hooks/useAuth";

const drawerWidth = 230;

const DesktopLayout = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const dashboardItems = [
    { text: "Tổng quan", icon: <Dashboard fontSize="small" />, path: "/admin/dashboard" },
    { text: "Thống kê doanh thu", icon: <BarChart fontSize="small" />, path: "/admin/revenue" },
  ];

  const manageItems = [
    { text: "Quản lý khách hàng", icon: <People fontSize="small" />, path: "/admin/customers" },
    { text: "Quản lý cửa hàng", icon: <Store fontSize="small" />, path: "/admin/shops" },
    { text: "Quản lý shipper", icon: <LocalShipping fontSize="small" />, path: "/admin/shippers" },
    { text: "Quản lý report videos", icon: <Report fontSize="small" />, path: "/admin/video-reports" },
  ];

  const systemItems = [
    { text: "Duyệt đăng ký", icon: <Verified fontSize="small" />, path: "/admin/approvals" },
    { text: "Cài đặt hệ thống", icon: <Settings fontSize="small" />, path: "/admin/system" },
  ];

  const renderMenuGroup = (title, items) => (
    <List
      subheader={
        <ListSubheader
          component="div"
          sx={{
            fontWeight: 600,
            bgcolor: "transparent",
            color: "text.secondary",
            fontSize: "0.8rem",
            pl: 2,
          }}
        >
          {title}
        </ListSubheader>
      }
    >
      {items.map((item) => {
        const selected = location.pathname.startsWith(item.path);
        return (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => navigate(item.path)}
              selected={selected}
              sx={{
                mx: 1,
                mb: 0.3,
                py: 0.6,
                borderRadius: 1.5,
                color: selected ? "primary.main" : "text.primary",
                bgcolor: selected ? "rgba(249, 112, 75, 0.1)" : "transparent",
                "&:hover": {
                  bgcolor: "rgba(249, 112, 75, 0.08)",
                  color: "primary.main",
                },
                "&.Mui-selected:hover": {
                  bgcolor: "rgba(249, 112, 75, 0.15)",
                },
              }}
            >
              {item.icon}
              <ListItemText
                primary={item.text}
                sx={{
                  ml: 1,
                  "& .MuiListItemText-primary": {
                    fontWeight: selected ? 600 : 400,
                    fontSize: "0.88rem", // ✅ chữ nhỏ gọn hơn
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );

  const drawer = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        borderRight: "1px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar sx={{ px: 2, py: 1.5 }}>
        <Stack direction="row" spacing={1.2} alignItems="center">
          <Avatar sx={{ bgcolor: "primary.main", width: 32, height: 32, fontSize: "0.9rem" }}>FD</Avatar>
          <Box>
            <Typography variant="subtitle2" fontWeight={700}>
              FoodDelivery Admin
            </Typography>
            <Typography variant="caption" color="text.secondary" fontSize="0.75rem">
              Hệ thống quản lý
            </Typography>
          </Box>
        </Stack>
      </Toolbar>

      <Divider />

      {/* ✅ Sidebar Menu - không còn scroll */}
      <Box
        sx={{
          flex: 1,
          overflow: "hidden", // ❌ bỏ thanh cuộn
          mt: 0.5,
          "& svg": { fontSize: "1.1rem" },
        }}
      >
        {renderMenuGroup("Dashboard", dashboardItems)}
        {renderMenuGroup("Quản lý", manageItems)}
        {renderMenuGroup("Hệ thống", systemItems)}
      </Box>

      <Divider />

      {/* ✅ Footer Admin */}
      <Box sx={{ p: 2 }}>
        <Stack direction="row" spacing={1.2} alignItems="center">
          <Avatar sx={{ bgcolor: "primary.light", width: 30, height: 30, fontSize: "0.85rem" }}>AD</Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" fontSize="0.85rem" noWrap>
              Admin User
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap fontSize="0.75rem">
              admin@fooddelivery.com
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        color="inherit"
        position="fixed"
        elevation={0}
        sx={{
          borderBottom: "1px solid",
          borderColor: "divider",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: "background.paper",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ fontWeight: 700 }}>
            Dashboard Tổng quan
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          {logout && (
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* 📂 Sidebar */}
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              borderRight: "1px solid",
              borderColor: "divider",
              overflow: "hidden", // ✅ không scroll
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* 📊 Nội dung */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default DesktopLayout;
