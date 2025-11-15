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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BlockIcon from "@mui/icons-material/Block";
import StarIcon from "@mui/icons-material/Star";
import { getShippers } from "../../api/adminApi";

const Shippers = () => {
  const [shippers, setShippers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedShipper, setSelectedShipper] = useState(null);

  // 🧭 Lấy danh sách shipper từ DB
  useEffect(() => {
    const fetchShippers = async () => {
      try {
        const data = await getShippers();
        setShippers(data);
      } catch (error) {
        console.error("❌ Lỗi khi tải danh sách shipper:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchShippers();
  }, []);

  // 🔍 Lọc theo ô tìm kiếm
  const filtered = shippers.filter((s) => {
    const keyword = search.toLowerCase();
    return (
      s.username?.toLowerCase().includes(keyword) ||
      s.email?.toLowerCase().includes(keyword) ||
      s.phone?.toLowerCase().includes(keyword)
    );
  });

  const handleViewDetail = (shipper) => {
    setSelectedShipper(shipper);
    setDetailOpen(true);
  };

  // 📊 Tính toán thống kê
  const totalShippers = shippers.length;
  const activeShippers = shippers.filter((s) => s.status === "approved").length;
  const pendingShippers = shippers.filter((s) => s.status === "pending").length;
  const avgRating = "4.7"; // tạm fix nếu chưa có cột rating

  // 🟩 Thẻ thống kê
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

  // 🕓 Hiển thị Loading
  if (loading) {
    return (
      <Stack alignItems="center" sx={{ mt: 6 }}>
        <CircularProgress size={40} />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Đang tải danh sách shipper...
        </Typography>
      </Stack>
    );
  }

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
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "nowrap",
          mb: 3,
        }}
      >
        <Grid item xs={12} sm={6} md={3} sx={{ flex: 1 }}>
          <StatCard
            title="Tổng Shipper"
            value={totalShippers}
            sub="+12 shipper mới"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ flex: 1 }}>
          <StatCard
            title="Đang hoạt động"
            value={activeShippers}
            sub="Shipper đã duyệt"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ flex: 1 }}>
          <StatCard
            title="Chờ duyệt"
            value={pendingShippers}
            sub="Cần xử lý"
            color="warning.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ flex: 1 }}>
          <StatCard
            title="Đánh giá TB"
            value={avgRating}
            sub="+0.1 điểm"
          />
        </Grid>
      </Grid>

      {/* Danh sách Shipper */}
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
              <TableCell>Shipper</TableCell>
              <TableCell>Thông tin</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Online</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.length > 0 ? (
              filtered.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    <Typography fontWeight={500}>{s.username}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      ID: {s.id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      SĐT: {s.phone || "Chưa có"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Email: {s.email || "Chưa có"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={
                        s.status === "approved"
                          ? "Đã duyệt"
                          : s.status === "rejected"
                          ? "Từ chối"
                          : "Chờ duyệt"
                      }
                      color={
                        s.status === "approved"
                          ? "success"
                          : s.status === "rejected"
                          ? "error"
                          : "warning"
                      }
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={
                        s.online_status === "online"
                          ? "Online"
                          : "Offline"
                      }
                      color={
                        s.online_status === "online"
                          ? "success"
                          : "default"
                      }
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleViewDetail(s)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error">
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
                    Không tìm thấy shipper phù hợp.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <Dialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Thông tin shipper</DialogTitle>
        <DialogContent dividers>
          {selectedShipper ? (
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                Thông tin cơ bản
              </Typography>
              <Typography variant="body2">
                <strong>Tên đăng nhập:</strong> {selectedShipper.username}
              </Typography>
              <Typography variant="body2">
                <strong>Số điện thoại:</strong> {selectedShipper.phone || "-"}
              </Typography>
              <Typography variant="body2">
                <strong>Email:</strong> {selectedShipper.email || "-"}
              </Typography>
              <Typography variant="body2">
                <strong>Trạng thái:</strong> {selectedShipper.status}
              </Typography>
              <Typography variant="body2">
                <strong>Online:</strong> {selectedShipper.online_status}
              </Typography>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Không có dữ liệu shipper.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailOpen(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Shippers;
