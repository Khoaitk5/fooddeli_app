import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Tabs,
  Tab,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Stack,
  IconButton,
  InputAdornment,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import DescriptionIcon from "@mui/icons-material/Description";

const Approvals = () => {
  const [tab, setTab] = useState(0);
  const handleTabChange = (_, v) => setTab(v);

  const shops = [
    {
      id: 1,
      name: "Quán Cơm Nhà",
      address: "123 Nguyễn Văn Cừ, Quận 5, TP.HCM",
      owner: "Nguyễn Thị Mai",
      phone: "0123456789",
      category: "Cơm & Cơm Tấm",
      date: "25/9/2024",
      docs: 3,
      status: "Chờ duyệt",
    },
    {
      id: 2,
      name: "Bánh Tráng Nướng Đà Lạt",
      address: "456 Phan Văn Trị, Gò Vấp, TP.HCM",
      owner: "Lê Văn Tùng",
      phone: "0987654321",
      category: "Bánh & Đồ ăn vặt",
      date: "28/9/2024",
      docs: 2,
      status: "Chờ duyệt",
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
      <Typography variant="caption" color={color || "text.secondary"}>
        {sub}
      </Typography>
    </Paper>
  );

  return (
    <Box>
      {/* Tiêu đề */}
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
        Duyệt đăng ký
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Xem xét và phê duyệt đăng ký từ cửa hàng và shipper mới tham gia hệ thống
      </Typography>

      {/* Thẻ thống kê */}
      <Grid
        container
        spacing={2}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "nowrap",
          mb: 3,
        }}
      >
        <Grid item xs={12} sm={6} md={3} sx={{ flex: 1 }}>
          <StatCard title="Chờ duyệt cửa hàng" value="2" sub="Cần xử lý" color="warning.main" />
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ flex: 1 }}>
          <StatCard title="Chờ duyệt shipper" value="2" sub="Cần xử lý" color="warning.main" />
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ flex: 1 }}>
          <StatCard title="Đã duyệt tuần này" value="12" sub="+8 cửa hàng, +4 shipper" />
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ flex: 1 }}>
          <StatCard title="Tỷ lệ chấp nhận" value="87%" sub="+5% so với tháng trước" />
        </Grid>
      </Grid>

      {/* Tabs */}
      <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Đăng ký cửa hàng" />
        <Tab label="Đăng ký shipper" />
      </Tabs>

      {/* Bảng danh sách */}
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
        {tab === 0 ? "Đăng ký cửa hàng" : "Đăng ký shipper"}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {tab === 0
          ? "Xem xét và phê duyệt đăng ký từ các cửa hàng mới"
          : "Xem xét và phê duyệt đăng ký từ các shipper mới"}
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <TextField
          size="small"
          placeholder={
            tab === 0
              ? "Tìm kiếm theo tên cửa hàng hoặc chủ cửa hàng..."
              : "Tìm kiếm theo tên shipper hoặc số điện thoại..."
          }
          sx={{ maxWidth: 400 }}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextField select size="small" label="Tất cả trạng thái" sx={{ width: 180 }} />
      </Stack>

      <Paper elevation={0} sx={{ borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Cửa hàng</TableCell>
              <TableCell>Chủ cửa hàng</TableCell>
              <TableCell>Danh mục</TableCell>
              <TableCell>Ngày đăng ký</TableCell>
              <TableCell>Giấy tờ</TableCell>
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
                <TableCell>{s.date}</TableCell>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <DescriptionIcon fontSize="small" color="action" />
                    <Typography variant="body2">{s.docs} tài liệu</Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Chip size="small" label={s.status} color="warning" />
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <IconButton size="small" color="primary">
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton size="small" color="default">
                      <CloseIcon />
                    </IconButton>
                    <IconButton size="small" sx={{ bgcolor: "primary.main", color: "white" }}>
                      <CheckIcon />
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

export default Approvals;
