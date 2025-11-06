import { ArrowLeft, MapPin } from 'lucide-react';
import { OrderStatusTimeline } from '@/components/role-specific/Customer/OrderStatusTimeline';
import { DeliveryPersonCard } from '@/components/role-specific/Customer/DeliveryPersonCard';
import { OrderDetailsCard } from '@/components/role-specific/Customer/OrderDetailsCard';
import { DeliveryAddressCard } from '@/components/role-specific/Customer/DeliveryAddressCard';
import { useNavigate } from 'react-router-dom';
import '../../styles/OrderTrackingResponsive.css';

export default function OrderTracking() {
  const navigate = useNavigate();
  // Mock data
  const driverData = {
    name: 'Nguyễn Văn A',
    rating: 4.9,
    vehicle: 'Xe máy',
    avatar: 'https://images.unsplash.com/photo-1587215255721-e7e21e059732?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMGRlbGl2ZXJ5JTIwZHJpdmVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU5OTkyOTMwfDA&ixlib=rb-4.1.0&q=80&w=1080'
  };

  const orderData = {
    orderId: '2024100912345',
    restaurant: 'Quán Phở Ngon',
    items: [
      {
        name: 'Phở bò tái',
        quantity: 2,
        price: 80000,
        note: 'Ít hành',
        image: 'https://images.unsplash.com/photo-1656945843375-207bb6e47750?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwZm9vZCUyMG5vb2RsZXN8ZW58MXx8fHwxNzU5OTkyOTMwfDA&ixlib=rb-4.1.0&q=80&w=1080'
      },
      {
        name: 'Gỏi cuốn tôm thịt',
        quantity: 1,
        price: 30000,
        image: 'https://images.unsplash.com/photo-1595238734477-ae7f8a79ce02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcHJpbmclMjByb2xscyUyMHZpZXRuYW1lc2V8ZW58MXx8fHwxNzU5OTkyNzI5fDA&ixlib=rb-4.1.0&q=80&w=1080'
      },
      {
        name: 'Trà sữa trân châu',
        quantity: 1,
        price: 35000,
        image: 'https://images.unsplash.com/photo-1670468642364-6cacadfb7bb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWJibGUlMjB0ZWElMjBkcmlua3xlbnwxfHx8fDE3NTk5MDE2OTF8MA&ixlib=rb-4.1.0&q=80&w=1080'
      }
    ],
    total: 145000
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: '#f5f5f5',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '500px',
      margin: '0 auto',
      boxShadow: '0 0 2rem rgba(0,0,0,0.1)'
    }} className="order-tracking-container">
      {/* Header */}
      <div style={{
        background: 'linear-gradient(90deg, #5EAD1D 0%, #54A312 100%)',
        padding: '2rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        boxShadow: '0 0.125rem 0.5rem rgba(238, 77, 45, 0.3)',
        position: 'relative',
        zIndex: 10
      }} className="order-tracking-header">
        <button style={{
          width: '4rem',
          height: '4rem',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.2)',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          backdropFilter: 'blur(10px)'
        }} className="order-tracking-back-btn" onClick={() => navigate('/customer/orders')}>
          <ArrowLeft size={32} color="#fff" strokeWidth={2.5} />
        </button>
        <div>
          <h1 style={{
            margin: 0,
            color: '#fff',
            fontSize: '1.75rem',
            fontWeight: '700'
          }} className="order-tracking-title">
            Đơn hàng đang giao
          </h1>
          <div style={{
            fontSize: '1.125rem',
            color: 'rgba(255, 255, 255, 0.9)',
            marginTop: '0.375rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }} className="order-tracking-subtitle">
            <MapPin size={20} />
            <span>Cách bạn 2.5 km</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch'
      }}>
        {/* Status Timeline */}
        <div style={{
          background: '#fff',
          marginBottom: '1rem'
        }}>
          <OrderStatusTimeline currentStatus="delivering" />
        </div>

        {/* Delivery Person Card */}
        <DeliveryPersonCard driver={driverData} />

        {/* Delivery Address */}
        <DeliveryAddressCard 
          pickup="Quán Phở Ngon, 123 Nguyễn Huệ, Quận 1"
          delivery="Số 456 Lê Lợi, Quận 1, TP. Hồ Chí Minh"
          estimatedTime="14:30"
        />

        {/* Order Details */}
        <OrderDetailsCard order={orderData} />

        {/* Spacer for bottom padding */}
        <div style={{ height: '1rem' }} />
      </div>
    </div>
  );
}
