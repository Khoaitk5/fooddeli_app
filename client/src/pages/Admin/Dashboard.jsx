import React from 'react';
import { Typography, Box } from '@mui/material';

const Dashboard = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography variant="body1">
        Welcome to the admin panel. Here you can manage users, orders, etc.
      </Typography>
    </Box>
  );
};

export default Dashboard;