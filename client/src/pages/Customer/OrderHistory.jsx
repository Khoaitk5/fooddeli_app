import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Chip, Card, CardContent } from '@mui/material';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import '../../styles/customer-responsive.css';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    // Mock data - không cần API
    setOrders([
      { id: 1, status: 'Delivered', total: 21.98, date: '2025-09-28', items: ['Pizza', 'Burger'] },
      { id: 2, status: 'In Progress', total: 12.99, date: '2025-09-27', items: ['Pizza'] },
      { id: 3, status: 'Cancelled', total: 15.50, date: '2025-09-26', items: ['Salad'] },
    ]);
    setLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'success';
      case 'In Progress': return 'warning';
      case 'Cancelled': return 'error';
      default: return 'default';
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Order History
      </Typography>
      {orders.length === 0 ? (
        <Typography>No orders yet.</Typography>
      ) : (
        <List>
          {orders.map((order) => (
            <Card key={order.id} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">Order #{order.id}</Typography>
                  <Chip label={order.status} color={getStatusColor(order.status)} />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Date: {order.date}
                </Typography>
                <Typography variant="body2">
                  Items: {order.items.join(', ')}
                </Typography>
                <Typography variant="h6" sx={{ mt: 1 }}>
                  Total: ${order.total}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </List>
      )}
    </Box>
  );
};

export default OrderHistory;