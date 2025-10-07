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
  Avatar,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const VideoReports = () => {
  const reports = [
    {
      id: 1,
      video: {
        title: "Review món ăn tại Phở Hà Nội",
        thumbnail: "https://via.placeholder.com/60",
        duration: "3:45",
        date: "25/9/2024",
      },
      reporter: { name: "Nguyễn Văn A", email: "nguyenvana@email.com" },
      store: "Phở Hà Nội",
      reason: "Nội dung không phù hợp",
      date: "28/9/2024",
      views: "1.250",
      status: "Chờ xử lý",
    },
    {
      id: 2,
      video: {
        title: "Đánh giá shipper giao hàng chậm",
        thumbnail: "https://via.placeholder.com/60",
        duration: "2:18",
        date: "27/9/2024",
      },
      reporter: { name: "Lê Thị C", email: "lethic@email.com" },
      store: "Pizza Italia",
      reason: "Xúc phạm danh dự",
      date: "29/9/2024",
      views: "890",
      status: "Đang xem xét",
    },
    {
      id: 3,
      video: {
        title: "Unboxing đồ ăn từ Bánh Mì Sài Gòn",
        thumbnail: "https://via.placeholder.com/60",
        duration: "5:22",
        date: "22/9/2024",
      },
      reporter: { name: "Phạm Văn D", email: "phamvand@email.com" },
      store: "Bánh Mì Sài Gòn",
      reason: "Spam",
      date: "30/9/2024",
      views: "2.100",
      status: "Đã xử lý",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Chờ xử lý":
        return "warning";
      case "Đang xem xét":
        return "info";
      case "Đã xử lý":
        return "success";
      default:
        return "default";
    }
  };

  const getReasonColor = (reason) => {
    if (reason.includes("phù hợp")) return "error";
    if (reason.includes("danh dự")) return "warning";
    return "secondary";
  };

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
        Quản lý Report Videos
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Xem xét và xử lý các video bị báo cáo vi phạm nội dung trong hệ thống
      </Typography>

      {/* Thẻ thống kê */}
      <Grid
        container
        spacing={2}
        sx={{ display: "flex", justifyContent: "space-between", flexWrap: "nowrap", mb: 3 }}
      >
        <Grid item xs={12} sm={6} md={3} sx={{ flex: 1 }}>
          <StatCard title="Tổng báo cáo" value="5" sub="Video được báo cáo" />
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ flex: 1 }}>
          <StatCard title="Chờ xử lý" value="2" sub="Cần xem xét" color="warning.main" />
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ flex: 1 }}>
          <StatCard title="Đang xem xét" value="1" sub="Đang xử lý" color="info.main" />
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ flex: 1 }}>
          <StatCard title="Đã xử lý" value="1" sub="Hoàn thành" color="success.main" />
        </Grid>
      </Grid>

      {/* Danh sách video */}
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
        Danh sách video bị báo cáo
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Xem xét và xử lý các báo cáo vi phạm từ người dùng
      </Typography>

      <TextField
        size="small"
        placeholder="Tìm kiếm theo tên video, người báo cáo..."
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
              <TableCell>Video</TableCell>
              <TableCell>Người báo cáo</TableCell>
              <TableCell>Cửa hàng liên quan</TableCell>
              <TableCell>Lý do</TableCell>
              <TableCell>Ngày báo cáo</TableCell>
              <TableCell>Lượt xem</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map((r) => (
              <TableRow key={r.id}>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar src={r.video.thumbnail} variant="rounded" sx={{ width: 56, height: 40 }} />
                    <Box>
                      <Typography fontWeight={500}>{r.video.title}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {r.video.duration} • {r.video.date}
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{r.reporter.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {r.reporter.email}
                  </Typography>
                </TableCell>
                <TableCell>{r.store}</TableCell>
                <TableCell>
                  <Chip size="small" label={r.reason} color={getReasonColor(r.reason)} variant="outlined" />
                </TableCell>
                <TableCell>{r.date}</TableCell>
                <TableCell>{r.views}</TableCell>
                <TableCell>
                  <Chip size="small" label={r.status} color={getStatusColor(r.status)} />
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <IconButton size="small" color="primary">
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <WarningAmberIcon fontSize="small" />
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

export default VideoReports;
