import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Button, IconButton, Divider, Card, CardContent } from '@mui/material';
import { Delete } from '@mui/icons-material';
import api from '../../services/api';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => (
  <ListItem>
    <ListItemText
      primary={item.product.name}
      secondary={`$${item.product.price} x ${item.quantity} = $${(item.product.price * item.quantity).toFixed(2)}`}
    />
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Button size="small" onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</Button>
      <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
      <Button size="small" onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}>+</Button>
      <IconButton onClick={() => onRemove(item.product.id)}>
        <Delete />
      </IconButton>
    </Box>
  </ListItem>
);

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await api.get('/cart');
      setCartItems(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      // Mock data
      setCartItems([
        { product: { id: 1, name: 'Pizza', price: 12.99 }, quantity: 2 },
        { product: { id: 2, name: 'Burger', price: 8.99 }, quantity: 1 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    try {
      await api.put(`/cart/${productId}`, { quantity: newQuantity });
      fetchCart(); // Refresh cart
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeItem = async (productId) => {
    try {
      await api.delete(`/cart/${productId}`);
      fetchCart();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const placeOrder = async () => {
    try {
      await api.post('/orders', { items: cartItems });
      alert('Order placed successfully!');
      setCartItems([]);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order');
    }
  };

  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (loading) return <LoadingSpinner />;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Your Cart
      </Typography>
      {cartItems.length === 0 ? (
        <Typography>Your cart is empty.</Typography>
      ) : (
        <Card>
          <CardContent>
            <List>
              {cartItems.map((item) => (
                <CartItem
                  key={item.product.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </List>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6">Total: ${total.toFixed(2)}</Typography>
            <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={placeOrder}>
              Place Order
            </Button>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default Cart;