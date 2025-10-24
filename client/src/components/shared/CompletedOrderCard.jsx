import React from 'react';
import { MapPin, Star, RotateCcw } from 'lucide-react';

const CompletedOrderCard = ({ order, cardMargin }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '1.25rem',
        overflow: 'hidden',
        marginBottom: cardMargin,
        boxShadow: '0 0.125rem 1rem rgba(0, 0, 0, 0.06)'
      }}
    >
      {/* Order Header */}
      <div style={{
        padding: '1.25rem',
        borderBottom: '0.0625rem solid #f5f5f5'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div style={{ flex: 1 }}>
            <h3 style={{
              margin: 0,
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#333',
              marginBottom: '0.25rem'
            }}>
              {order.restaurant}
            </h3>
            <div style={{
              fontSize: '1.125rem',
              color: '#999',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              <MapPin size={14} strokeWidth={2} />
              {order.restaurantAddress}
            </div>
          </div>
          {order.rated && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              marginLeft: '0.75rem'
            }}>
              <Star size={16} fill="#f59e0b" color="#f59e0b" strokeWidth={2} />
              <span style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#f59e0b'
              }}>
                {order.rating}
              </span>
            </div>
          )}
        </div>
        <div style={{
          fontSize: '1.125rem',
          color: '#16a34a',
          marginTop: '0.5rem'
        }}>
          Đã giao • {order.deliveredAt}
        </div>
      </div>

      {/* Order Items */}
      <div style={{
        padding: '1.25rem',
        borderBottom: '0.0625rem solid #f5f5f5'
      }}>
        <div style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'flex-start'
        }}>
          <div style={{
            width: '6.5rem',
            height: '6.5rem',
            borderRadius: '0.75rem',
            overflow: 'hidden',
            flexShrink: 0
          }}>
          </div>
          <div style={{ flex: 1 }}>
            {order.items.map((item, idx) => (
              <div
                key={idx}
                style={{
                  fontSize: '1.375rem',
                  color: '#666',
                  marginBottom: idx < order.items.length - 1 ? '0.25rem' : 0
                }}
              >
                {item.quantity}x {item.name}
              </div>
            ))}
            <div style={{
              fontSize: '1.375rem',
              fontWeight: '700',
              color: '#ee4d2d',
              marginTop: '0.5rem'
            }}>
              {formatPrice(order.total)}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{
        padding: '1.25rem',
        display: 'flex',
        gap: '1rem'
      }}>
        <button
          style={{
            flex: 1,
            padding: '1.125rem',
            background: '#fff',
            border: '0.125rem solid #e5e5e5',
            borderRadius: '0.75rem',
            color: '#666',
            fontSize: '1.375rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#ee4d2d';
            e.currentTarget.style.color = '#ee4d2d';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e5e5e5';
            e.currentTarget.style.color = '#666';
          }}
        >
          <RotateCcw size={20} strokeWidth={2} />
          Đặt lại
        </button>
        <button
          style={{
            flex: 1,
            padding: '1.125rem',
            background: order.rated ? '#f5f5f5' : 'linear-gradient(135deg, #ee4d2d 0%, #ff6b35 100%)',
            border: 'none',
            borderRadius: '0.75rem',
            color: order.rated ? '#999' : '#fff',
            fontSize: '1.375rem',
            fontWeight: '600',
            cursor: order.rated ? 'default' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            boxShadow: order.rated ? 'none' : '0 0.25rem 0.75rem rgba(238, 77, 45, 0.3)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            if (!order.rated) {
              e.currentTarget.style.transform = 'translateY(-0.125rem)';
              e.currentTarget.style.boxShadow = '0 0.375rem 1rem rgba(238, 77, 45, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (!order.rated) {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 0.25rem 0.75rem rgba(238, 77, 45, 0.3)';
            }
          }}
          disabled={order.rated}
        >
          <Star size={20} strokeWidth={2} fill={order.rated ? '#999' : 'none'} />
          {order.rated ? 'Đã đánh giá' : 'Đánh giá'}
        </button>
      </div>
    </div>
  );
};

export default CompletedOrderCard;