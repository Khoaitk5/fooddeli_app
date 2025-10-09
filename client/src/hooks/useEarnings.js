import { useState, useEffect } from 'react';

export const useEarnings = () => {
  const [summary, setSummary] = useState({
    today: 0,
    week: 0,
    month: 0,
    total: 0
  });

  const [list, setList] = useState([]);

  useEffect(() => {
    // Mock data - thay thế bằng API call thực tế
    setSummary({
      today: 150000,
      week: 850000,
      month: 3200000,
      total: 12500000
    });

    setList([
      {
        id: 1,
        date: '2024-01-15',
        amount: 45000,
        orderId: 'DH001',
        status: 'completed'
      },
      {
        id: 2,
        date: '2024-01-15',
        amount: 35000,
        orderId: 'DH002',
        status: 'completed'
      },
      {
        id: 3,
        date: '2024-01-14',
        amount: 55000,
        orderId: 'DH003',
        status: 'completed'
      }
    ]);
  }, []);

  return { summary, list };
};
