import React from 'react';
import { ShipperContext } from './shipperContext';

const ShipperProvider = ({ children }) => {
  const [shipper, setShipper] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [isOnline, setIsOnline] = React.useState(false);
  const initialOrdersRef = React.useRef([
    { id: 1, pickupName: 'Nhà hàng Phở 24', pickupAddr: '123 Nguyễn Huệ, Q.1', dropName: 'Nguyễn Văn A', dropAddr: '456 Lê Lợi, Q.3', distance: 3.5, eta: '15–20 phút', weight: '2kg', cod: 45000, bonus: 5000 },
    { id: 2, pickupName: 'Bún Chả Hà Nội', pickupAddr: '45 Trần Hưng Đạo, Q.1', dropName: 'Trần B', dropAddr: '12 Hai Bà Trưng, Q.1', distance: 2.2, eta: '10–15 phút', weight: '1.5kg', cod: 38000, bonus: 4000 },
    { id: 3, pickupName: 'Cơm Tấm 68', pickupAddr: '68 Lê Lai, Q.1', dropName: 'Lê C', dropAddr: '200 Nguyễn Thị Minh Khai, Q.3', distance: 4.1, eta: '18–25 phút', weight: '3kg', cod: 52000, bonus: 6000 },
    { id: 4, pickupName: 'Trà sữa Gấu', pickupAddr: '99 Pasteur, Q.3', dropName: 'Phạm D', dropAddr: '15 Nguyễn Trãi, Q.5', distance: 3.0, eta: '12–18 phút', weight: '1kg', cod: 30000, bonus: 3000 },
    { id: 5, pickupName: 'Pizza 4U', pickupAddr: '12 Đinh Tiên Hoàng, Q.1', dropName: 'Đỗ E', dropAddr: '88 Võ Văn Tần, Q.3', distance: 5.0, eta: '20–28 phút', weight: '2.3kg', cod: 65000, bonus: 7000 },
  ]);
  const [availableOrders, setAvailableOrders] = React.useState(initialOrdersRef.current);
  const [currentOrder, setCurrentOrder] = React.useState(null);
  const resetAvailableOrders = React.useCallback(() => {
    setAvailableOrders(initialOrdersRef.current);
  }, []);

  React.useEffect(() => {
    // Mock data - thay bằng API thực tế
    const timer = setTimeout(() => {
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
        vehicle: { type: 'Xe máy', plate: '51A-12345' },
        address: { street: '123 Đường ABC', ward: 'Phường 1', district: 'Quận 1', city: 'TP.HCM' },
        bankAccount: { bank: 'Vietcombank', accountNumber: '1234567890', accountName: 'NGUYEN VAN A' },
      });
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const updateShipper = (data) => {
    setShipper((prev) => ({ ...(prev || {}), ...data }));
  };

  const value = React.useMemo(() => ({
    shipper,
    loading,
    isOnline,
    setIsOnline,
    updateShipper,
    availableOrders,
    setAvailableOrders,
    currentOrder,
    setCurrentOrder,
    resetAvailableOrders,
  }), [shipper, loading, isOnline, availableOrders, currentOrder, resetAvailableOrders]);

  return <ShipperContext.Provider value={value}>{children}</ShipperContext.Provider>;
};
export default ShipperProvider;

