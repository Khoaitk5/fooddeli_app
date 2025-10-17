import React from "react";
import { Box, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow, Button } from "@mui/material";

const AdminWalletPage = () => {
  const transactions = [
    { id: 1, detail: "Hoa hồng từ đơn hàng #1245", amount: "+₫450,000", date: "09/10/2025", color: "green" },
    { id: 2, detail: "Thanh toán phí hệ thống", amount: "-₫120,000", date: "07/10/2025", color: "red" },
    { id: 3, detail: "Nhận phí duy trì từ cửa hàng", amount: "+₫300,000", date: "05/10/2025", color: "green" },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
        Ví hệ thống
      </Typography>

      <Paper sx={{ p: 3, borderRadius: 2, border: "1px solid", borderColor: "divider", mb: 3 }}>
        <Typography variant="body1" color="text.secondary">
          Số dư hiện tại:
        </Typography>
        <Typography variant="h4" color="primary" sx={{ my: 1 }}>
          ₫ 2,870,000
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
                <TableCell>{t.detail}</TableCell>
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

export default AdminWalletPage;
