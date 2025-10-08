import { useState, useEffect } from 'react';

export const useHistoryOrders = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, today, week, month

  useEffect(() => {
    // Mock data - thay thế bằng API call thực tế
    setTimeout(() => {
      setHistory([
        {
          id: 1,
          orderId: 'DH001',
          date: '2024-01-15',
          time: '14:30',
          pickup: 'Nhà hàng Phở 24',
          dropoff: 'Nguyễn Văn A',
          distance: 3.5,
          earnings: 45000,
          status: 'completed',
          rating: 5
        },
        {
          id: 2,
          orderId: 'DH002',
          date: '2024-01-15',
          time: '12:15',
          pickup: 'KFC Nguyễn Huệ',
          dropoff: 'Trần Thị B',
          distance: 2.1,
          earnings: 35000,
          status: 'completed',
          rating: 4
        },
        {
          id: 3,
          orderId: 'DH003',
          date: '2024-01-14',
          time: '18:45',
          pickup: 'McDonald\'s',
          dropoff: 'Lê Văn C',
          distance: 4.2,
          earnings: 55000,
          status: 'completed',
          rating: 5
        }
      ]);
      setLoading(false);
    }, 1000);
  }, [filter]);

  const filteredHistory = history.filter(item => {
    const itemDate = new Date(item.date);
    const now = new Date();
    
    switch (filter) {
      case 'today':
        return itemDate.toDateString() === now.toDateString();
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return itemDate >= weekAgo;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return itemDate >= monthAgo;
      default:
        return true;
    }
  });

  return { 
    orders: filteredHistory, 
    loading, 
    filter, 
    setFilter,
    totalEarnings: filteredHistory.reduce((sum, item) => sum + item.earnings, 0)
  };
};
