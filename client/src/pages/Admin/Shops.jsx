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
import StarIcon from "@mui/icons-material/Star";

const Shops = () => {
  const shops = [
    {
      id: 1,
      name: "Phở Hà Nội",
      address: "Hai Bà Trưng, Hà Nội",
      owner: "Nguyễn Văn Minh",
      phone: "0123456789",
      category: "Phở & Bún",
      rating: 4.8,
      orders: 1250,
      revenue: "85.000.000 ₫",
      commission: "15%",
      status: "Hoạt động",
    },
    {
      id: 2,
      name: "Bánh Mì Sài Gòn",
      address: "Quận 1, TP.HCM",
      owner: "Trần Thị Lan",
      phone: "0987654321",
      category: "Bánh Mì & Sandwich",
      rating: 4.6,
      orders: 890,
      revenue: "42.000.000 ₫",
      commission: "12%",
      status: "Hoạt động",
    },
    {
      id: 3,
      name: "Cơm Tấm Sướng",
      address: "Quận 1, TP.HCM",
      owner: "Lê Văn Tài",
      phone: "0765432198",
      category: "Cơm & Cơm Tấm",
      rating: 4.4,
      orders: 567,
      revenue: "38.000.000 ₫",
      commission: "10%",
      status: "Tạm dừng",
    },
  ];

  const StatCard = ({ title, value, sub, color }) => (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        height: "100%",
        backgroundColor: "background.paper",
      }}
    >
      <Typography variant="subtitle2" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 600, mt: 0.5 }}>
        {value}
      </Typography>
      <Typography variant="caption" color={color || "success.main"}>
        {sub}
      </Typography>
    </Paper>
  );

  return (
    <Box>
      {/* Tiêu đề */}
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
        Quản lý cửa hàng
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Quản lý thông tin và hoạt động của các cửa hàng đối tác trong hệ thống
      </Typography>

      {/* Thẻ thống kê */}
      <Grid
        container
        spacing={2}
        sx={{ display: "flex", justifyContent: "space-between", flexWrap: "nowrap", mb: 3 }}
      >
        <Grid item xs={12} sm={6} md={3} sx={{ flex: 1 }}>
          <StatCard title="Tổng cửa hàng" value="85" sub="+5 cửa hàng mới" />
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ flex: 1 }}>
          <StatCard title="Đang hoạt động" value="72" sub="84.7% tổng số" />
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ flex: 1 }}>
          <StatCard title="Chờ duyệt" value="8" sub="Cần xử lý" color="warning.main" />
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ flex: 1 }}>
          <StatCard title="Đánh giá TB" value="4.6" sub="+0.2 điểm" />
        </Grid>
      </Grid>

      {/* Danh sách cửa hàng */}
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
        Danh sách cửa hàng
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Quản lý và theo dõi hoạt động của các cửa hàng đối tác
      </Typography>

      <TextField
        size="small"
        placeholder="Tìm kiếm theo tên cửa hàng, chủ cửa hàng..."
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
              <TableCell>Cửa hàng</TableCell>
              <TableCell>Chủ cửa hàng</TableCell>
              <TableCell>Danh mục</TableCell>
              <TableCell>Đánh giá</TableCell>
              <TableCell>Đơn hàng</TableCell>
              <TableCell>Doanh thu</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shops.map((s) => (
              <TableRow key={s.id}>
                <TableCell>
                  <Typography fontWeight={500}>{s.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {s.address}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{s.owner}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {s.phone}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip size="small" label={s.category} variant="outlined" />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <StarIcon fontSize="small" sx={{ color: "warning.main" }} />
                    <Typography variant="body2">{s.rating}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>{s.orders}</TableCell>
                <TableCell>
                  <Typography variant="body2">{s.revenue}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Hoa hồng: {s.commission}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={s.status}
                    color={s.status === "Hoạt động" ? "success" : "default"}
                    variant="outlined"
                  />
                </TableCell>
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

export default Shops;
