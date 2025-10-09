import { useState, useEffect } from 'react';

export const useShipper = () => {
  const [shipper, setShipper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    // Mock data - thay thế bằng API call thực tế
    setTimeout(() => {
      setShipper({
        id: 1,
        name: 'Nguyễn Văn A',
        phone: '0123456789',
        email: 'shipper@example.com',
        avatar: null,
        rating: 4.8,
        totalDeliveries: 1250,
        totalEarnings: 12500000,
        status: 'active',
        vehicle: {
          type: 'Xe máy',
          plate: '51A-12345'
        },
        address: {
          street: '123 Đường ABC',
          ward: 'Phường 1',
          district: 'Quận 1',
          city: 'TP.HCM'
        },
        bankAccount: {
          bank: 'Vietcombank',
          accountNumber: '1234567890',
          accountName: 'NGUYEN VAN A'
        }
      });
      setLoading(false);
    }, 1000);
  }, []);

  const updateShipper = (data) => {
    setShipper(prev => ({ ...prev, ...data }));
  };

  return { shipper, loading, updateShipper, isOnline, setIsOnline };
};
