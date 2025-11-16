import { Box, Container } from "@mui/material";
import UserDistribution from "./UserDistribution";

/**
 * Demo page để xem component UserDistribution
 * Sử dụng mock data nếu API chưa sẵn sàng
 */
const UserDistributionDemo = () => {
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box
                sx={{
                    bgcolor: "#f8fafc",
                    minHeight: "100vh",
                    p: 3,
                }}
            >
                <UserDistribution />
            </Box>
        </Container>
    );
};

export default UserDistributionDemo;
