import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Mock data
      setOrders([
        { id: 1, status: 'Delivered', total: 21.98, date: '2025-09-28', items: ['Pizza', 'Burger'] },
        { id: 2, status: 'In Progress', total: 12.99, date: '2025-09-27', items: ['Pizza'] },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return '#4caf50';
      case 'In Progress': return '#ff9800';
      case 'Cancelled': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div style={{ padding: '16px' }}>
      <h1 style={{ marginBottom: '16px', fontSize: '2.125rem', fontWeight: '400' }}>
        Order History
      </h1>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div>
          {orders.map((order) => (
            <div key={order.id} style={{ border: '1px solid #ddd', borderRadius: '8px', marginBottom: '16px', overflow: 'hidden' }}>
              <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: '500', margin: 0 }}>Order #{order.id}</h2>
                  <span style={{
                    background: getStatusColor(order.status),
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '0.75rem'
                  }}>
                    {order.status}
                  </span>
                </div>
                <p style={{ color: '#666', fontSize: '0.875rem', margin: '4px 0' }}>
                  Date: {order.date}
                </p>
                <p style={{ fontSize: '0.875rem', margin: '4px 0' }}>
                  Items: {order.items.join(', ')}
                </p>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '500', margin: '8px 0 0 0' }}>
                  Total: ${order.total}
                </h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;