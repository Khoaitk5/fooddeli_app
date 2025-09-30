import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => (
  <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #eee' }}>
    <div>
      <div style={{ fontWeight: 'bold' }}>{item.product.name}</div>
      <div style={{ color: '#666', fontSize: '0.875rem' }}>
        ${item.product.price} x {item.quantity} = ${(item.product.price * item.quantity).toFixed(2)}
      </div>
    </div>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <button
        style={{ padding: '4px 8px', margin: '0 4px', border: '1px solid #ccc', background: 'white', cursor: 'pointer' }}
        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
        disabled={item.quantity <= 1}
      >
        -
      </button>
      <span style={{ margin: '0 8px' }}>{item.quantity}</span>
      <button
        style={{ padding: '4px 8px', margin: '0 4px', border: '1px solid #ccc', background: 'white', cursor: 'pointer' }}
        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
      >
        +
      </button>
      <button
        style={{ padding: '4px 8px', margin: '0 4px', border: 'none', background: '#f44336', color: 'white', cursor: 'pointer', borderRadius: '4px' }}
        onClick={() => onRemove(item.product.id)}
      >
        🗑️
      </button>
    </div>
  </li>
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
    <div style={{ padding: '16px' }}>
      <h1 style={{ marginBottom: '16px', fontSize: '2.125rem', fontWeight: '400' }}>
        Your Cart
      </h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ padding: '16px' }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {cartItems.map((item) => (
                <CartItem
                  key={item.product.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </ul>
            <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #eee' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: '500' }}>Total: ${total.toFixed(2)}</h2>
            <button
              style={{
                width: '100%',
                padding: '12px',
                marginTop: '16px',
                background: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
              onClick={placeOrder}
            >
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;