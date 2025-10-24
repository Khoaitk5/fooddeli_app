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
import StarIcon from "@mui/icons-material/Star";
import { getShops } from "../../api/adminApi"; // 🔹 đường dẫn tới file api bạn đã tạo

const Shops = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // 🟢 Gọi API khi component mount
  useEffect(() => {
    async function fetchShops() {
      try {
        const data = await getShops();
        setShops(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách cửa hàng:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchShops();
  }, []);

  // 🔍 Lọc cửa hàng theo từ khóa tìm kiếm
  const filteredShops = shops.filter(
    (s) =>
      s.shop_name?.toLowerCase().includes(search.toLowerCase()) ||
      s.username?.toLowerCase().includes(search.toLowerCase())
  );

  // 📊 Thẻ thống kê (giữ nguyên giao diện)
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
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "nowrap",
          mb: 3,
        }}
      >
        <Grid item xs={12} sm={6} md={3} sx={{ flex: 1 }}>
          <StatCard
            title="Tổng cửa hàng"
            value={shops.length}
            sub="+5 cửa hàng mới"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ flex: 1 }}>
          <StatCard
            title="Đang mở"
            value={shops.filter((s) => s.shop_status === "open").length}
            sub="Hoạt động"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ flex: 1 }}>
          <StatCard
            title="Đang đóng"
            value={shops.filter((s) => s.shop_status === "closed").length}
            sub="Tạm ngừng"
            color="warning.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ flex: 1 }}>
          <StatCard
            title="Đang chờ duyệt"
            value={shops.filter((s) => s.shop_status === "pending").length}
            sub="Cần xử lý"
            color="error.main"
          />
        </Grid>
      </Grid>

      {/* Danh sách cửa hàng */}
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
        Danh sách cửa hàng
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Quản lý và theo dõi hoạt động của các cửa hàng đối tác
      </Typography>

      {/* Ô tìm kiếm */}
      <TextField
        size="small"
        placeholder="Tìm kiếm theo tên cửa hàng, chủ cửa hàng..."
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

      {/* Hiển thị Loading */}
      {loading ? (
        <Stack alignItems="center" sx={{ mt: 4 }}>
          <CircularProgress size={40} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Đang tải dữ liệu...
          </Typography>
        </Stack>
      ) : (
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
                <TableCell>Cửa hàng</TableCell>
                <TableCell>Chủ cửa hàng</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Số sản phẩm</TableCell>
                <TableCell align="right">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredShops.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    <Typography fontWeight={500}>{s.shop_name}</Typography>
                  </TableCell>
                  <TableCell>{s.username}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={
                        s.shop_status === "open"
                          ? "Hoạt động"
                          : s.shop_status === "pending"
                          ? "Chờ duyệt"
                          : "Tạm dừng"
                      }
                      color={
                        s.shop_status === "open"
                          ? "success"
                          : s.shop_status === "pending"
                          ? "warning"
                          : "default"
                      }
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{s.total_products || 0}</TableCell>
                  <TableCell align="right">
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="flex-end"
                    >
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
              {filteredShops.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body2" color="text.secondary">
                      Không tìm thấy cửa hàng phù hợp.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
};

export default Shops;
