import { MapPin, Store, Clock } from 'lucide-react';

export function DeliveryAddressCard({ pickup, delivery, estimatedTime }) {
  return (
    <div style={{
      margin: '0 1.25rem',
      padding: '1.25rem',
      background: '#fff',
      borderRadius: '0.75rem',
      boxShadow: '0 0.125rem 0.5rem rgba(0,0,0,0.08)',
      marginBottom: '1.25rem'
    }} className="delivery-address-card">
      {/* Estimated time */}
      {estimatedTime && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.625rem',
          padding: '1rem',
          background: '#fff5f0',
          borderRadius: '0.5rem',
          marginBottom: '1.25rem'
        }}>
          <Clock size={20} color="#ee4d2d" />
          <span style={{ fontSize: '1rem', color: '#ee4d2d', fontWeight: '500' }}>
            Dự kiến giao hàng lúc {estimatedTime}
          </span>
        </div>
      )}
      
      {/* Pickup location */}
      <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '1.25rem' }}>
        <div style={{
          width: '3rem',
          height: '3rem',
          borderRadius: '50%',
          background: '#fff5f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginTop: '0.125rem'
        }} className="delivery-address-icon">
          <Store size={22} color="#ee4d2d" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '1.125rem', fontWeight: '600', color: '#333', marginBottom: '0.375rem' }}>
            Lấy hàng
          </div>
          <div style={{ fontSize: '1.125rem', color: '#666', lineHeight: '1.4' }} className="delivery-address-text">
            {pickup}
          </div>
        </div>
      </div>
      
      {/* Connecting dots */}
      <div style={{
        marginLeft: '1.25rem',
        height: '2rem',
        width: '0.0625rem',
        background: 'repeating-linear-gradient(to bottom, #ddd 0, #ddd 0.25rem, transparent 0.25rem, transparent 0.5rem)',
        marginBottom: '0.625rem'
      }} />
      
      {/* Delivery location */}
      <div style={{ display: 'flex', gap: '1.25rem' }}>
        <div style={{
          width: '3rem',
          height: '3rem',
          borderRadius: '50%',
          background: '#f0f9ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginTop: '0.125rem'
        }} className="delivery-address-icon">
          <MapPin size={22} color="#0ea5e9" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '1.125rem', fontWeight: '600', color: '#333', marginBottom: '0.375rem' }}>
            Giao đến
          </div>
          <div style={{ fontSize: '1.125rem', color: '#666', lineHeight: '1.4' }} className="delivery-address-text">
            {delivery}
          </div>
        </div>
      </div>
    </div>
  );
}
