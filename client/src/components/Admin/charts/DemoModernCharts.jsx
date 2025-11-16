import { Box, Container, Typography, Grid } from "@mui/material";
import { motion } from "motion/react";
import MonthlyRevenueCard from "./MonthlyRevenueCard";
import WeeklyOrdersCard from "./WeeklyOrdersCard";

/**
 * Demo component để hiển thị 2 chart cards hiện đại
 * Sử dụng trong Admin Dashboard
 */
const DemoModernCharts = () => {
    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Header */}
            <Box
                component={motion.div}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                sx={{ mb: 5, textAlign: "center" }}
            >
                <Typography
                    sx={{
                        fontSize: "2.5rem",
                        fontWeight: 900,
                        background: "linear-gradient(135deg, #f97316 0%, #0ea5e9 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        mb: 1,
                    }}
                >
                    Thống Kê Hiện Đại
                </Typography>
                <Typography
                    sx={{
                        fontSize: "1rem",
                        color: "#64748b",
                        fontWeight: 500,
                    }}
                >
                    Doanh thu và đơn hàng với animation bắt mắt
                </Typography>
            </Box>

            {/* Charts Grid */}
            <Grid container spacing={4}>
                {/* Monthly Revenue Card */}
                <Grid item xs={12} lg={6}>
                    <MonthlyRevenueCard months={6} />
                </Grid>

                {/* Weekly Orders Card */}
                <Grid item xs={12} lg={6}>
                    <WeeklyOrdersCard />
                </Grid>
            </Grid>

            {/* Usage Instructions */}
            <Box
                component={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                sx={{
                    mt: 6,
                    p: 4,
                    borderRadius: 3,
                    background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
                    border: "1px solid #e2e8f0",
                }}
            >
                <Typography
                    sx={{
                        fontSize: "1.25rem",
                        fontWeight: 700,
                        color: "#1e293b",
                        mb: 2,
                    }}
                >
                    📖 Cách sử dụng
                </Typography>

                <Box sx={{
                    "& pre": {
                        background: "#1e293b",
                        color: "#e2e8f0",
                        p: 2,
                        borderRadius: 2,
                        overflow: "auto",
                        fontSize: "0.875rem",
                        mb: 2,
                    }
                }}>
                    <Typography sx={{ fontSize: "0.9375rem", fontWeight: 600, color: "#64748b", mb: 1 }}>
                        1. Import components:
                    </Typography>
                    <pre>{`import { MonthlyRevenueCard, WeeklyOrdersCard } from './components/Admin/charts';`}</pre>

                    <Typography sx={{ fontSize: "0.9375rem", fontWeight: 600, color: "#64748b", mb: 1, mt: 3 }}>
                        2. Sử dụng trong component:
                    </Typography>
                    <pre>{`<Grid container spacing={4}>
  <Grid item xs={12} lg={6}>
    <MonthlyRevenueCard months={6} year={2024} />
  </Grid>
  <Grid item xs={12} lg={6}>
    <WeeklyOrdersCard endpoint="/api/admin/stats/dashboard/weekly" />
  </Grid>
</Grid>`}</pre>
                </Box>

                <Typography sx={{ fontSize: "0.875rem", color: "#64748b", mt: 3 }}>
                    💡 <strong>Tips:</strong> Cả 2 components đều responsive và có animation tự động.
                    Hover vào charts để xem tooltip với hiệu ứng đẹp mắt!
                </Typography>
            </Box>
        </Container>
    );
};

export default DemoModernCharts;
