import React, { useEffect, useState } from "react";
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
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BlockIcon from "@mui/icons-material/Block";
import { getCustomers, banCustomer, unbanCustomer } from "../../api/adminApi";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // 🧭 Lấy danh sách khách hàng từ DB
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getCustomers();
        setCustomers(data);
      } catch (error) {
        console.error("❌ Lỗi khi tải danh sách khách hàng:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  // 🔍 Lọc theo ô tìm kiếm
  const filtered = customers.filter((c) => {
    const keyword = search.toLowerCase();
    return (
      c.username?.toLowerCase().includes(keyword) ||
      c.email?.toLowerCase().includes(keyword) ||
      c.phone?.includes(search)
    );
  });

  // 🚫 / 🔓 Khóa hoặc mở khóa khách hàng
  const handleToggleBan = async (customer) => {
    const action =
      customer.status === "banned" ? "mở khóa" : "khóa tài khoản";
    if (
      !window.confirm(
        `Bạn có chắc muốn ${action} khách hàng "${customer.username}" không?`
      )
    )
      return;

    try {
      if (customer.status === "banned") {
        await unbanCustomer(customer.id);
        setCustomers((prev) =>
          prev.map((c) =>
            c.id === customer.id ? { ...c, status: "active" } : c
          )
        );
      } else {
        await banCustomer(customer.id);
        setCustomers((prev) =>
          prev.map((c) =>
            c.id === customer.id ? { ...c, status: "banned" } : c
          )
        );
      }
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật trạng thái khách hàng:", error);
    }
  };

  // 📊 Tính toán thống kê
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.status === "active").length;
  const bannedCustomers = customers.filter((c) => c.status === "banned").length;
  const avgRating =
    (
      customers.reduce((a, b) => a + (b.rating || 0), 0) /
      (customers.length || 1)
    ).toFixed(1) || "0.0";

  // 🟩 Thẻ thống kê
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

  // 🕓 Hiển thị Loading
  if (loading) {
    return (
      <Stack alignItems="center" sx={{ mt: 6 }}>
        <CircularProgress size={40} />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Đang tải danh sách khách hàng...
        </Typography>
      </Stack>
    );
  }

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
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "nowrap",
          mb: 3,
        }}
      >
        <Grid item xs={12} sm={6} md={3} sx={{ flex: 1 }}>
          <StatCard
            title="Tổng khách hàng"
            value={totalCustomers}
            sub="+8.2% tháng này"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ flex: 1 }}>
          <StatCard
            title="Đang hoạt động"
            value={activeCustomers}
            sub="Khách hàng khả dụng"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ flex: 1 }}>
          <StatCard title="Bị khóa" value={bannedCustomers} sub="Cần xem xét" />
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ flex: 1 }}>
          <StatCard
            title="Đánh giá TB"
            value={avgRating}
            sub="Điểm trung bình từ đánh giá"
          />
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
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Khách hàng</TableCell>
              <TableCell>Liên hệ</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Đánh giá</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.length > 0 ? (
              filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <Typography fontWeight={500}>{c.username}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      ID: {c.id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{c.email}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {c.phone}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={
                        c.status === "active"
                          ? "Hoạt động"
                          : c.status === "banned"
                          ? "Bị khóa"
                          : "Khác"
                      }
                      color={
                        c.status === "active"
                          ? "success"
                          : c.status === "banned"
                          ? "error"
                          : "default"
                      }
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{c.rating ?? "—"}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <IconButton size="small" color="primary">
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color={c.status === "banned" ? "success" : "error"}
                        onClick={() => handleToggleBan(c)}
                      >
                        <BlockIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body2" color="text.secondary">
                    Không tìm thấy khách hàng phù hợp.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default Customers;
