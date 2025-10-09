import { ShoppingBag } from 'lucide-react';

export function OrderDetailsCard({ order }) {
  return (
    <div style={{
      margin: '0 1.25rem',
      padding: '1.25rem',
      background: '#fff',
      borderRadius: '0.75rem',
      boxShadow: '0 0.125rem 0.5rem rgba(0,0,0,0.08)',
      marginBottom: '1.25rem'
    }} className="order-details-card">
      {/* Restaurant info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: '0.0625rem solid #f5f5f5' }}>
        <div style={{
          width: '3.5rem',
          height: '3.5rem',
          background: '#fff5f0',
          borderRadius: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }} className="order-details-restaurant-icon">
          <ShoppingBag size={28} color="#ee4d2d" />
        </div>
        <div>
          <div style={{ fontWeight: '700', fontSize: '1.25rem', color: '#333' }} className="order-details-restaurant-name">
            {order.restaurant}
          </div>
          <div style={{ fontSize: '1rem', color: '#999' }} className="order-details-order-id">
            Mã đơn: {order.orderId}
          </div>
        </div>
      </div>
      
      {/* Order items */}
      <div style={{ marginBottom: '1.25rem' }}>
        {order.items.map((item, index) => (
          <div key={index} style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: index < order.items.length - 1 ? '1rem' : 0
          }}>
            <div style={{
              width: '5rem',
              height: '5rem',
              borderRadius: '0.5rem',
              overflow: 'hidden',
              flexShrink: 0,
              background: '#f5f5f5'
            }} className="order-details-item-image">
              <img
                src={item.image}
                alt={item.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '1.125rem', color: '#333', marginBottom: '0.375rem' }} className="order-details-item-name">
                {item.quantity}x {item.name}
              </div>
              {item.note && (
                <div style={{ fontSize: '1rem', color: '#999', fontStyle: 'italic' }}>
                  Ghi chú: {item.note}
                </div>
              )}
            </div>
            <div style={{ fontSize: '1.125rem', color: '#333', fontWeight: '500' }} className="order-details-item-price">
              {item.price.toLocaleString('vi-VN')}đ
            </div>
          </div>
        ))}
      </div>
      
      {/* Total */}
      <div style={{
        paddingTop: '1.25rem',
        borderTop: '0.0625rem solid #f5f5f5',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={{ fontSize: '1.125rem', color: '#666' }}>Tổng cộng</span>
        <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ee4d2d' }} className="order-details-total">
          {order.total.toLocaleString('vi-VN')}đ
        </span>
      </div>
    </div>
  );
}
