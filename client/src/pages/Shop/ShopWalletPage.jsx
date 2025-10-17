import React from "react";
import { Box, Typography, Paper, Button, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

const ShopWalletPage = () => {
  const transactions = [
    { id: 1, type: "Nhận thanh toán đơn hàng #1234", amount: "+₫250,000", date: "09/10/2025", color: "green" },
    { id: 2, type: "Rút tiền về tài khoản", amount: "-₫500,000", date: "08/10/2025", color: "red" },
    { id: 3, type: "Phí nền tảng tháng 10", amount: "-₫50,000", date: "05/10/2025", color: "red" }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
        Ví cửa hàng
      </Typography>

      <Paper sx={{ p: 3, borderRadius: 2, border: "1px solid", borderColor: "divider", mb: 3 }}>
        <Typography variant="body1" color="text.secondary">
          Số dư hiện tại:
        </Typography>
        <Typography variant="h4" color="primary" sx={{ my: 1 }}>
          ₫ 1,250,000
        </Typography>
        <Button variant="contained" color="primary">
          Rút tiền
        </Button>
      </Paper>

      <Typography variant="h6" sx={{ mb: 1 }}>
        Lịch sử giao dịch
      </Typography>

      <Paper sx={{ borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ngày</TableCell>
              <TableCell>Chi tiết</TableCell>
              <TableCell align="right">Số tiền</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((t) => (
              <TableRow key={t.id}>
                <TableCell>{t.date}</TableCell>
                <TableCell>{t.type}</TableCell>
                <TableCell align="right" sx={{ color: t.color === "green" ? "success.main" : "error.main" }}>
                  {t.amount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default ShopWalletPage;
