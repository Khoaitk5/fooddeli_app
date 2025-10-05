import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemButton, ListItemText, Box, IconButton, Button, Divider, ListSubheader, Avatar, Stack } from '@mui/material';
import { Menu as MenuIcon, Dashboard, Settings, Verified, Report, People, Store, LocalShipping, BarChart, Timeline } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../utils/constants';

const drawerWidth = 240;

const DesktopLayout = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const auth = (typeof useAuth === 'function') ? useAuth() : undefined;
  const user = auth?.user;
  const logout = auth?.logout;
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const dashboardItems = [
    { text: 'Tổng quan', icon: <Dashboard />, path: '/admin/dashboard' },
    { text: 'Thống kê doanh thu', icon: <BarChart />, path: '/admin/dashboard' },
  ];

  const manageItems = [
    { text: 'Quản lý khách hàng', icon: <People />, path: '/admin/customers' },
    { text: 'Quản lý cửa hàng', icon: <Store />, path: '/admin/shops' },
    { text: 'Quản lý shipper', icon: <LocalShipping />, path: '/admin/shippers' },
    { text: 'Quản lý report videos', icon: <Report />, path: '/admin/video-reports' },
  ];

  const systemItems = [
    { text: 'Duyệt đăng ký', icon: <Verified />, path: '/admin/approvals' },
    { text: 'Cài đặt hệ thống', icon: <Settings />, path: '/admin/system' },
  ];

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ px: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>L</Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight={700}>FoodDelivery Admin</Typography>
            <Typography variant="caption" color="text.secondary">Hệ thống quản lý</Typography>
          </Box>
        </Stack>
      </Toolbar>
      <Divider />
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        <List subheader={<ListSubheader component="div">Dashboard</ListSubheader>}>
          {dashboardItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton onClick={() => navigate(item.path)} sx={{
                '&.Mui-selected': { bgcolor: 'primary.light', color: 'primary.contrastText' }
              }} selected={false}>
                {item.icon}
                <ListItemText primary={item.text} sx={{ ml: 1 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <List subheader={<ListSubheader component="div">Quản lý</ListSubheader>}>
          {manageItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton onClick={() => navigate(item.path)}>
                {item.icon}
                <ListItemText primary={item.text} sx={{ ml: 1 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <List subheader={<ListSubheader component="div">Hệ thống</ListSubheader>}>
          {systemItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton onClick={() => navigate(item.path)}>
                {item.icon}
                <ListItemText primary={item.text} sx={{ ml: 1 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar sx={{ bgcolor: 'primary.light' }}>AD</Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" noWrap>Admin User</Typography>
            <Typography variant="caption" color="text.secondary" noWrap>admin@fooddelivery.com</Typography>
          </Box>
        </Stack>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar color="inherit" position="fixed" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider', zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: 'background.paper' }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700 }}>
            Dashboard Tổng quan
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          {logout && (
            <Button color="inherit" onClick={logout}>Logout</Button>
          )}
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default DesktopLayout;