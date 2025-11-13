import React, { useState, useEffect } from 'react';
import { MapPin, Star, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CompletedOrderCard = ({ order, cardMargin }) => {
  const navigate = useNavigate();
  const [shipperRated, setShipperRated] = useState(false);
  const [shopRated, setShopRated] = useState(false);
  const [loading, setLoading] = useState(true);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // Kiểm tra trạng thái đánh giá
  useEffect(() => {
    const checkReviewStatus = async () => {
      if (!order.id) {
        console.log('⚠️ Missing order ID');
        setLoading(false);
        return;
      }

      try {
        const API_BASE_URL = import.meta.env?.VITE_API_URL || "http://localhost:5000/api";
        
        console.log('🔍 Checking review status for order:', order.id);
        
        // Gọi API mới để check review status cho đơn hàng này
        const response = await fetch(`${API_BASE_URL}/reviews/order/${order.id}/status`, {
          credentials: 'include'
        });
        
        const result = await response.json();
        console.log('📊 Review status from API:', result);
        
        if (result.success) {
          setShipperRated(result.data.shipperReviewed);
          setShopRated(result.data.shopReviewed);
          console.log('✅ Updated review status:', {
            shipperRated: result.data.shipperReviewed,
            shopRated: result.data.shopReviewed
          });
        }

      } catch (error) {
        console.error('Error checking review status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkReviewStatus();
  }, [order.id]);

  const handleReviewClick = () => {
    // Không cho phép click nếu đã đánh giá cả shipper và shop
    if (shipperRated && shopRated) {
      return;
    }

    if (!shipperRated) {
      // Chuyển đến đánh giá shipper
      navigate('/customer/shipper-review', {
        state: {
          orderId: order.id,
          shipperName: order.shipperName,
          shipperAvatar: order.shipperAvatar,
          shopName: order.restaurant,
          shopAvatar: order.shop_image,
        }
      });
    } else if (!shopRated) {
      // Chuyển đến đánh giá shop
      navigate('/customer/order-review', {
        state: {
          orderId: order.id,
          shopName: order.restaurant,
          shopAvatar: order.shop_image,
        }
      });
    }
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
              color: '#5EAD1D',
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
            e.currentTarget.style.borderColor = '#5EAD1D';
            e.currentTarget.style.color = '#5EAD1D';
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
            background: (shipperRated && shopRated) ? '#f5f5f5' : 'linear-gradient(90deg, #5EAD1D 0%, #54A312 100%)',
            border: 'none',
            borderRadius: '0.75rem',
            color: (shipperRated && shopRated) ? '#999' : '#fff',
            fontSize: '1.375rem',
            fontWeight: '600',
            cursor: (shipperRated && shopRated) ? 'default' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            boxShadow: (shipperRated && shopRated) ? 'none' : '0 0.25rem 0.75rem rgba(238, 77, 45, 0.3)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            if (!(shipperRated && shopRated)) {
              e.currentTarget.style.transform = 'translateY(-0.125rem)';
              e.currentTarget.style.boxShadow = '0 0.375rem 1rem rgba(238, 77, 45, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (!(shipperRated && shopRated)) {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 0.25rem 0.75rem rgba(238, 77, 45, 0.3)';
            }
          }}
          onClick={handleReviewClick}
        >
          <Star size={20} strokeWidth={2} fill={(shipperRated && shopRated) ? '#999' : 'none'} />
          {(shipperRated && shopRated) ? 'Đã đánh giá' : 
           !shipperRated ? 'Đánh giá shipper' : 'Đánh giá quán'}
        </button>
      </div>
    </div>
  );
};

export default CompletedOrderCard;