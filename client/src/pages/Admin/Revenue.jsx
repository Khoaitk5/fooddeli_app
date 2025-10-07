import React from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Stack,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const dataBar = [
  { name: "T1", revenue: 140000000 },
  { name: "T2", revenue: 155000000 },
  { name: "T3", revenue: 185000000 },
  { name: "T4", revenue: 175000000 },
  { name: "T5", revenue: 210000000 },
  { name: "T6", revenue: 220000000 },
];

const dataLine = [
  { name: "T2", revenue: 110000000 },
  { name: "T3", revenue: 145000000 },
  { name: "T4", revenue: 130000000 },
  { name: "T5", revenue: 185000000 },
  { name: "T6", revenue: 210000000 },
  { name: "T7", revenue: 200000000 },
];

const pieData = [
  { name: "Cơm & Cơm tấm", value: 32 },
  { name: "Phở & Bún", value: 27 },
  { name: "Pizza & Fastfood", value: 26 },
  { name: "Đồ uống", value: 9 },
  { name: "Bánh & Đồ ăn vặt", value: 6 },
];

const COLORS = ["#F97352", "#FFB347", "#36A2EB", "#4BC0C0", "#9966FF"];

export default function Revenue() {
  return (
    <Box sx={{ width: "100%", px: 2, pb: 5 }}>
      {/* 🧾 Tiêu đề */}
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Thống kê doanh thu
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Phân tích chi tiết doanh thu và hiệu quả kinh doanh của hệ thống
      </Typography>

      {/* ✅ KPI Cards */}
      <Grid
        container
        spacing={2}
        sx={{
          display: "flex",
          flexWrap: "nowrap",
          justifyContent: "space-between",
        }}
        mb={4}
      >
        {[
          { label: "Doanh thu tháng này", value: "280M VND", sub: "+12.5% so với tháng trước" },
          { label: "Hoa hồng thu được", value: "33.6M VND", sub: "+5.2% trung bình" },
          { label: "Tổng đơn hàng", value: "5,800", sub: "-4.8% đơn hàng" },
          { label: "Giá trị TB/đơn", value: "48,000 VND", sub: "-3.8% so với tháng trước" },
        ].map((item, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx} sx={{ flex: 1, minWidth: 0 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography variant="subtitle2" color="text.secondary">
                {item.label}
              </Typography>
              <Typography variant="h5" fontWeight={700} sx={{ mt: 0.5 }}>
                {item.value}
              </Typography>
              <Typography variant="caption" color="success.main">
                {item.sub}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* 📊 Biểu đồ doanh thu */}
      <Grid container spacing={2} mb={4} sx={{ display: "flex", flexWrap: "nowrap" }}>
        <Grid item xs={12} md={6} sx={{ flex: 1, minWidth: 0 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              height: 460,
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="subtitle1" fontWeight={600}>
                Doanh thu theo tháng
              </Typography>
              <Stack direction="row" spacing={1}>
                <Chip size="small" label="6 tháng" color="primary" variant="outlined" />
                <Chip size="small" label="12 tháng" variant="outlined" />
              </Stack>
            </Stack>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={dataBar}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#F97352" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} sx={{ flex: 1, minWidth: 0 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              height: 460,
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="subtitle1" fontWeight={600}>
                Doanh thu trong tuần
              </Typography>
              <Stack direction="row" spacing={1}>
                <Chip size="small" label="Tuần này" color="primary" variant="outlined" />
                <Chip size="small" label="Tuần trước" variant="outlined" />
              </Stack>
            </Stack>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={dataLine}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#F97352" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* 🥧 Pie Chart + Top cửa hàng */}
      <Grid container spacing={2} mb={4} sx={{ display: "flex", flexWrap: "nowrap" }}>
        <Grid item xs={12} md={6} sx={{ flex: 1, minWidth: 0 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              height: 460,
            }}
          >
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Doanh thu theo danh mục
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={120}>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} sx={{ flex: 1, minWidth: 0 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              height: 460,
            }}
          >
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Top cửa hàng theo doanh thu
            </Typography>
            {["Pizza Italia", "Phở Hà Nội", "Cơm Tấm Sương", "Bánh Mì Sài Gòn", "Trà Sữa Gốc Phố"].map(
              (name, i) => (
                <Stack
                  key={i}
                  direction="row"
                  justifyContent="space-between"
                  sx={{ py: 1.2, borderBottom: "1px solid #eee" }}
                >
                  <Typography variant="body2">{i + 1}. {name}</Typography>
                  <Typography variant="body2" color="success.main">
                    +{[15.2, 12.8, 8.5, 13.8, 22.1][i]}%
                  </Typography>
                </Stack>
              )
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* 📊 Bảng chi tiết */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Báo cáo chi tiết theo danh mục
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Danh mục</TableCell>
              <TableCell>Doanh thu</TableCell>
              <TableCell>Đơn hàng</TableCell>
              <TableCell>Tỷ lệ</TableCell>
              <TableCell>TB/đơn</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[
              ["Cơm & Cơm tấm", "85.000.000 đ", "1250", "32%", "68.000 đ"],
              ["Phở & Bún", "72.000.000 đ", "980", "27%", "73.469 đ"],
              ["Pizza & Fastfood", "68.000.000 đ", "850", "26%", "80.000 đ"],
              ["Đồ uống", "25.000.000 đ", "420", "9%", "59.524 đ"],
              ["Bánh & Đồ ăn vặt", "15.000.000 đ", "300", "6%", "50.000 đ"],
            ].map((row, i) => (
              <TableRow key={i}>
                {row.map((cell, j) => (
                  <TableCell key={j}>{cell}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
