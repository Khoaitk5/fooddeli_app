import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export const useOrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - thay thế bằng API call thực tế
    setTimeout(() => {
      setOrder({
        id: id,
        orderId: `DH${id.padStart(3, '0')}`,
        status: 'in_progress', // pending, in_progress, completed, cancelled
        pickup: {
          name: 'Nhà hàng Phở 24',
          address: '123 Nguyễn Huệ, Q.1, TP.HCM',
          phone: '0123456789',
          coordinates: { lat: 10.7769, lng: 106.7009 },
          instructions: 'Gọi trước khi đến'
        },
        dropoff: {
          name: 'Nguyễn Văn A',
          address: '456 Lê Lợi, Q.3, TP.HCM',
          phone: '0987654321',
          coordinates: { lat: 10.7829, lng: 106.7009 },
          instructions: 'Giao tại cổng chính'
        },
        items: [
          { name: 'Phở Bò', quantity: 2, price: 45000 },
          { name: 'Nước ngọt', quantity: 1, price: 15000 }
        ],
        totalAmount: 105000,
        deliveryFee: 15000,
        codAmount: 120000, // Thu hộ
        distance: 3.5,
        estimatedTime: 15,
        createdAt: '2024-01-15T14:30:00Z',
        notes: 'Đơn hàng gấp, ưu tiên giao nhanh'
      });
      setLoading(false);
    }, 1000);
  }, [id]);

  const updateOrderStatus = (status) => {
    setOrder(prev => ({ ...prev, status }));
  };

  const acceptOrder = () => {
    updateOrderStatus('in_progress');
  };

  const completeOrder = () => {
    updateOrderStatus('completed');
  };

  const cancelOrder = () => {
    updateOrderStatus('cancelled');
  };

  return { 
    order, 
    loading, 
    acceptOrder, 
    completeOrder, 
    cancelOrder,
    updateOrderStatus 
  };
};
