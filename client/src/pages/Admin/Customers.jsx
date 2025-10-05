import React from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Stack,
  Grid,
  Chip,
  IconButton,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BlockIcon from "@mui/icons-material/Block";

const Customers = () => {
  const customers = [
    {
      id: 1,
      name: "Nguyễn Văn An",
      email: "nguyenvanan@email.com",
      phone: "0123456789",
      orders: 45,
      total: "2.500.000 ₫",
      status: "Hoạt động",
      lastOrder: "28/9/2024",
    },
    {
      id: 2,
      name: "Trần Thị Bình",
      email: "tranthibinh@email.com",
      phone: "0987654321",
      orders: 32,
      total: "1.800.000 ₫",
      status: "Hoạt động",
      lastOrder: "30/9/2024",
    },
    {
      id: 3,
      name: "Lê Minh Cường",
      email: "leminhcuong@email.com",
      phone: "0765432198",
      orders: 18,
      total: "950.000 ₫",
      status: "Không hoạt động",
      lastOrder: "15/8/2024",
    },
  ];

  const StatCard = ({ title, value, sub }) => (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        height: "100%",
      }}
    >
      <Typography variant="subtitle2" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 600, mt: 0.5 }}>
        {value}
      </Typography>
      <Typography variant="caption" color="success.main">
        {sub}
      </Typography>
    </Paper>
  );

  return (
    <Box>
      {/* Header */}
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
        Quản lý khách hàng
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Quản lý thông tin và hoạt động của khách hàng trong hệ thống
      </Typography>

      {/* Thẻ thống kê */}
      <Grid
        container
        spacing={2}
        sx={{ display: "flex", justifyContent: "space-between", flexWrap: "nowrap", mb: 3 }}
      >
        <Grid item xs={12} sm={6} md={3} sx={{ flex: 1 }}>
          <StatCard title="Tổng khách hàng" value="1,250" sub="+8.2% tháng này" />
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ flex: 1 }}>
          <StatCard title="Khách hàng VIP" value="89" sub="+12% tháng này" />
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ flex: 1 }}>
          <StatCard title="Khách hàng mới" value="156" sub="+23% tuần này" />
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ flex: 1 }}>
          <StatCard title="Giá trị TB/khách" value="2.1M" sub="+5.3% tháng này" />
        </Grid>
      </Grid>

      {/* Danh sách khách hàng */}
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
        Danh sách khách hàng
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Quản lý và theo dõi thông tin khách hàng
      </Typography>

      <TextField
        size="small"
        placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
        fullWidth
        sx={{ mb: 2, maxWidth: 400 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <Paper elevation={0} sx={{ borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Khách hàng</TableCell>
              <TableCell>Liên hệ</TableCell>
              <TableCell>Đơn hàng</TableCell>
              <TableCell>Tổng chi tiêu</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Lần cuối đặt</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  <Typography fontWeight={500}>{c.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Tham gia: {c.lastOrder}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{c.email}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {c.phone}
                  </Typography>
                </TableCell>
                <TableCell>{c.orders} đơn</TableCell>
                <TableCell>{c.total}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={c.status}
                    color={c.status === "Hoạt động" ? "success" : "default"}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{c.lastOrder}</TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <IconButton size="small" color="primary">
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <BlockIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default Customers;
