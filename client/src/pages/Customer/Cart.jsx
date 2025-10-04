import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Button, IconButton, Divider, Card, CardContent } from '@mui/material';
import { Delete } from '@mui/icons-material';
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

  const fetchCart = () => {
    // Mock data - không cần API
    setCartItems([
      { product: { id: 1, name: 'Pizza', price: 12.99 }, quantity: 2 },
      { product: { id: 2, name: 'Burger', price: 8.99 }, quantity: 1 },
      { product: { id: 3, name: 'Salad', price: 6.99 }, quantity: 1 },
    ]);
    setLoading(false);
  };

  const updateQuantity = (productId, newQuantity) => {
    // Mock update - không cần API
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.product.id === productId 
          ? { ...item, quantity: Math.max(1, newQuantity) }
          : item
      )
    );
  };

  const removeItem = (productId) => {
    // Mock remove - không cần API
    setCartItems(prevItems => 
      prevItems.filter(item => item.product.id !== productId)
    );
  };

  const placeOrder = () => {
    // Mock order placement - không cần API
    alert('Order placed successfully!');
    setCartItems([]);
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