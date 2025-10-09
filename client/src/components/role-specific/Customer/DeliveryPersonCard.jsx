import { Phone, MessageCircle, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function DeliveryPersonCard({ driver }) {
  const navigate = useNavigate();
  return (
    <div style={{
      margin: '0 1.25rem',
      padding: '1.25rem',
      background: '#fff',
      borderRadius: '0.75rem',
      boxShadow: '0 0.125rem 0.5rem rgba(0,0,0,0.08)',
      marginBottom: '1.25rem'
    }} className="delivery-person-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Avatar */}
        <div style={{
          width: '5rem',
          height: '5rem',
          borderRadius: '50%',
          overflow: 'hidden',
          border: '0.15rem solid #ee4d2d',
          flexShrink: 0
        }} className="delivery-person-avatar">
          <img
            src={driver.avatar}
            alt={driver.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        
        {/* Info */}
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: '700', fontSize: '1.25rem', color: '#333', marginBottom: '0.375rem' }} className="delivery-person-name">
            {driver.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Star size={18} fill="#ffa500" color="#ffa500" />
              <span style={{ fontSize: '1rem', color: '#666' }} className="delivery-person-rating">{driver.rating}</span>
            </div>
            <span style={{ fontSize: '1rem', color: '#999' }}>•</span>
            <span style={{ fontSize: '1rem', color: '#666' }} className="delivery-person-vehicle">{driver.vehicle}</span>
          </div>
        </div>
        
        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '0.625rem' }}>
          <button style={{
            width: '3.5rem',
            height: '3.5rem',
            borderRadius: '50%',
            background: '#fff',
            border: '0.0625rem solid #e5e5e5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }} className="delivery-person-btn" onClick={() => navigate('/customer/delivery-man-message')}>
            <MessageCircle size={22} color="#666" />
          </button>
          <button style={{
            width: '3.5rem',
            height: '3.5rem',
            borderRadius: '50%',
            background: '#ee4d2d',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }} className="delivery-person-btn" onClick={() => navigate('/customer/delivery-man-call')}>
            <Phone size={22} color="#fff" />
          </button>
        </div>
      </div>
    </div>
  );
}
