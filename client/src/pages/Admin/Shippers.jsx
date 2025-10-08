import React from "react";
import { pxW, pxH } from '../../utils/scale.js';
import '../../styles/customer-responsive.css';
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
import PedalBikeIcon from "@mui/icons-material/PedalBike";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";

const Shippers = () => {
  const shippers = [
    {
      id: 1,
      name: "Nguyễn Văn Tốc",
      address: "Quận 1, TP.HCM",
      email: "nguyenvantoc@email.com",
      phone: "0123456789",
      vehicle: "Xe máy",
      plate: "59H1-12345",
      rating: 4.8,
      deliveries: 1250,
      income: "45.000.000 ₫",
      complete: "98.5%",
      performance: "Xuất sắc",
      status: "Hoạt động",
    },
    {
      id: 2,
      name: "Trần Thị Nhanh",
      address: "Quận 3, TP.HCM",
      email: "tranthinhanh@email.com",
      phone: "0987654321",
      vehicle: "Xe máy",
      plate: "59G1-67890",
      rating: 4.6,
      deliveries: 890,
      income: "32.000.000 ₫",
      complete: "96.2%",
      performance: "Xuất sắc",
      status: "Hoạt động",
    },
    {
      id: 3,
      name: "Lê Minh Chậm",
      address: "Quận 7, TP.HCM",
      email: "leminhcham@email.com",
      phone: "0765432198",
      vehicle: "Xe đạp",
      plate: "",
      rating: 4.2,
      deliveries: 567,
      income: "18.000.000 ₫",
      complete: "92.1%",
      performance: "Tốt",
      status: "Không hoạt động",
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
        backgroundColor: "background.paper",
        height: "100%",
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
        Quản lý Shipper
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Quản lý thông tin và hoạt động của đội ngũ shipper trong hệ thống
      </Typography>

      {/* Thẻ thống kê */}
      <Grid
        container
        spacing={2}
        sx={{ display: "flex", justifyContent: "space-between", flexWrap: "nowrap", mb: 3 }}
      >
        <Grid item xs={12} sm={6} md={3} sx={{ flex: 1 }}>
          <StatCard title="Tổng Shipper" value="156" sub="+12 shipper mới" />
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ flex: 1 }}>
          <StatCard title="Đang hoạt động" value="89" sub="57% tổng số" />
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ flex: 1 }}>
          <StatCard title="Chờ duyệt" value="15" sub="Cần xử lý" color="warning.main" />
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ flex: 1 }}>
          <StatCard title="Đánh giá TB" value="4.7" sub="+0.1 điểm" />
        </Grid>
      </Grid>

      {/* Danh sách shipper */}
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
        Danh sách Shipper
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Quản lý và theo dõi hoạt động của các shipper
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
              <TableCell>Shipper</TableCell>
              <TableCell>Liên hệ</TableCell>
              <TableCell>Phương tiện</TableCell>
              <TableCell>Đánh giá</TableCell>
              <TableCell>Giao hàng</TableCell>
              <TableCell>Thu nhập</TableCell>
              <TableCell>Hoàn thành</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shippers.map((s) => (
              <TableRow key={s.id}>
                <TableCell>
                  <Typography fontWeight={500}>{s.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {s.address}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{s.email}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {s.phone}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    {s.vehicle === "Xe máy" ? (
                      <TwoWheelerIcon fontSize="small" color="primary" />
                    ) : (
                      <PedalBikeIcon fontSize="small" color="secondary" />
                    )}
                    <Typography variant="body2">{s.vehicle}</Typography>
                  </Stack>
                  {s.plate && (
                    <Typography variant="caption" color="text.secondary">
                      {s.plate}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <StarIcon fontSize="small" sx={{ color: "warning.main" }} />
                    <Typography variant="body2">{s.rating}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>{s.deliveries} đơn hàng</TableCell>
                <TableCell>{s.income}</TableCell>
                <TableCell>
                  <Typography variant="body2">{s.complete}</Typography>
                  <Typography variant="caption" color="success.main">
                    {s.performance}
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

export default Shippers;
