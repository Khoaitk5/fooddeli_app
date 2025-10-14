import { useState, useEffect, useRef } from 'react';
import { MapPin, Clock, ChevronRight, ShoppingBag, Star, RotateCcw } from 'lucide-react';
import Navbar from '../../components/shared/Navbar';
import { useNavigate } from 'react-router-dom';
import { useTheme, useMediaQuery } from '@mui/material';

function OrdersPage({ isMobile = false, isTablet = false, onTrackOrder = () => {} }) {
  const [activeTab, setActiveTab] = useState('ongoing');
  const navigate = useNavigate();
  const paddingApplied = useRef(false);
  const theme = useTheme();
  const isMobileDetected = useMediaQuery(theme.breakpoints.down('sm'));

  // Add safe area padding for mobile status bar
  useEffect(() => {
    console.log('isMobileDetected:', isMobileDetected, 'paddingApplied:', paddingApplied.current);
    if (isMobileDetected && !paddingApplied.current) {
      const originalPadding = document.body.style.paddingTop;
      document.body.style.paddingTop = '3rem';
      paddingApplied.current = true;
      console.log('Applied padding, original was:', originalPadding);
      
      return () => {
        document.body.style.paddingTop = originalPadding;
        paddingApplied.current = false;
        console.log('Removed padding, restored to:', originalPadding);
      };
    }
  }, [isMobileDetected]);

  // Mock data for ongoing orders
  const ongoingOrders = [
    {
      id: '2024100912345',
      restaurant: 'Quán Phở Ngon',
      restaurantAddress: '123 Nguyễn Huệ, Q.1',
      status: 'Đang giao hàng',
      estimatedTime: '14:30',
      items: [
        { name: 'Phở bò tái', quantity: 2, price: 80000 },
        { name: 'Gỏi cuốn tôm thịt', quantity: 1, price: 30000 },
        { name: 'Trà sữa trân châu', quantity: 1, price: 35000 }
      ],
      total: 145000,
      image: 'https://images.unsplash.com/photo-1656945843375-207bb6e47750?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwZm9vZCUyMG5vb2RsZXN8ZW58MXx8fHwxNzU5OTkyOTMwfDA&ixlib=rb-4.1.0&q=80&w=1080'
    }
  ];

  // Mock data for completed orders
  const completedOrders = [
    {
      id: '2024100812344',
      restaurant: 'Bún Chả Hà Nội',
      restaurantAddress: '789 Trần Hưng Đạo, Q.5',
      deliveredAt: 'Hôm qua, 12:30',
      items: [
        { name: 'Bún chả Hà Nội', quantity: 2, price: 70000 },
        { name: 'Nem cua bể', quantity: 1, price: 40000 }
      ],
      total: 110000,
      image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYnVuJTIwY2hhfGVufDF8fHx8MTc2MDAyNjkzMHww&ixlib=rb-4.1.0&q=80&w=1080',
      rated: false
    },
    {
      id: '2024100712343',
      restaurant: 'Cơm Tấm Sườn Bì',
      restaurantAddress: '321 Võ Văn Tần, Q.3',
      deliveredAt: '2 ngày trước, 19:15',
      items: [
        { name: 'Cơm tấm sườn bì chả', quantity: 1, price: 45000 },
        { name: 'Trà đá', quantity: 1, price: 5000 }
      ],
      total: 50000,
      image: 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaWNlJTIwZGlzaCUyMHZpZXRuYW1lc2V8ZW58MXx8fHwxNzYwMDI2OTMwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      rated: true,
      rating: 5
    },
    {
      id: '2024100612342',
      restaurant: 'Bánh Mì Huỳnh Hoa',
      restaurantAddress: '26 Lê Thị Riêng, Q.1',
      deliveredAt: '3 ngày trước, 08:45',
      items: [
        { name: 'Bánh mì đặc biệt', quantity: 3, price: 75000 }
      ],
      total: 75000,
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW5oJTIwbWl8ZW58MXx8fHwxNzYwMDI2OTMwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      rated: true,
      rating: 4
    }
  ];

  const padding = isMobileDetected ? '1.25rem' : isTablet ? '1.5rem' : '2rem';
  const cardMargin = isMobileDetected ? '1rem' : '1.25rem';

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const renderOngoingOrder = (order) => (
    <div
      key={order.id}
      style={{
        background: '#fff',
        borderRadius: isMobileDetected ? '1rem' : '1.25rem',
        overflow: 'hidden',
        marginBottom: cardMargin,
        boxShadow: '0 0.125rem 1rem rgba(0, 0, 0, 0.06)'
      }}
    >
      {/* Order Header */}
      <div style={{
        padding: isMobileDetected ? '1rem' : '1.25rem',
        borderBottom: '0.0625rem solid #f5f5f5'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '0.5rem'
        }}>
          <div style={{ flex: 1 }}>
            <h3 style={{
              margin: 0,
              fontSize: isMobileDetected ? '1.375rem' : '1.5rem',
              fontWeight: '700',
              color: '#333',
              marginBottom: '0.25rem'
            }}>
              {order.restaurant}
            </h3>
            <div style={{
              fontSize: isMobileDetected ? '1.0625rem' : '1.125rem',
              color: '#999',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              <MapPin size={14} strokeWidth={2} />
              {order.restaurantAddress}
            </div>
          </div>
          <div style={{
            background: order.status === 'Đang giao hàng' ? '#fff7ed' : '#f0fdf4',
            color: order.status === 'Đang giao hàng' ? '#ea580c' : '#16a34a',
            padding: '0.375rem 0.75rem',
            borderRadius: '0.5rem',
            fontSize: isMobileDetected ? '1.25rem' : '1.375rem',
            fontWeight: '500',
            whiteSpace: 'nowrap',
            marginLeft: '0.75rem'
          }}>
            {order.status}
          </div>
        </div>
        <div style={{
          fontSize: isMobileDetected ? '1.0625rem' : '1.125rem',
          color: '#666',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem'
        }}>
          <Clock size={14} strokeWidth={2} />
          Dự kiến {order.estimatedTime}
        </div>
      </div>

      {/* Order Items */}
      <div style={{
        padding: isMobileDetected ? '1rem' : '1.25rem',
        borderBottom: '0.0625rem solid #f5f5f5'
      }}>
        <div style={{
          display: 'flex',
          gap: isMobileDetected ? '0.75rem' : '1rem',
          alignItems: 'flex-start'
        }}>
          <div style={{
            width: isMobileDetected ? '5rem' : '6.5rem',
            height: isMobileDetected ? '5rem' : '6.5rem',
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
                  fontSize: isMobileDetected ? '1.25rem' : '1.375rem',
                  color: '#666',
                  marginBottom: idx < order.items.length - 1 ? '0.25rem' : 0
                }}
              >
                {item.quantity}x {item.name}
              </div>
            ))}
            <div style={{
              fontSize: isMobileDetected ? '1.25rem' : '1.375rem',
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
      <div style={{ padding: isMobileDetected ? '1rem' : '1.25rem' }}>
        <button
          onClick={() => navigate('/customer/order-tracking')}
          style={{
            width: '100%',
            padding: isMobileDetected ? '1rem' : '1.125rem',
            background: 'linear-gradient(135deg, #ee4d2d 0%, #ff6b35 100%)',
            border: 'none',
            borderRadius: '0.75rem',
            color: '#fff',
            fontSize: isMobileDetected ? '1.25rem' : '1.375rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            boxShadow: '0 0.25rem 0.75rem rgba(238, 77, 45, 0.3)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-0.125rem)';
            e.currentTarget.style.boxShadow = '0 0.375rem 1rem rgba(238, 77, 45, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 0.25rem 0.75rem rgba(238, 77, 45, 0.3)';
          }}
        >
          Theo dõi đơn hàng
          <ChevronRight size={isMobileDetected ? 18 : 20} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );

  const renderCompletedOrder = (order) => (
    <div
      key={order.id}
      style={{
        background: '#fff',
        borderRadius: isMobileDetected ? '1rem' : '1.25rem',
        overflow: 'hidden',
        marginBottom: cardMargin,
        boxShadow: '0 0.125rem 1rem rgba(0, 0, 0, 0.06)'
      }}
    >
      {/* Order Header */}
      <div style={{
        padding: isMobileDetected ? '1rem' : '1.25rem',
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
              fontSize: isMobileDetected ? '1.375rem' : '1.5rem',
              fontWeight: '700',
              color: '#333',
              marginBottom: '0.25rem'
            }}>
              {order.restaurant}
            </h3>
            <div style={{
              fontSize: isMobileDetected ? '1.0625rem' : '1.125rem',
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
                fontSize: isMobileDetected ? '1.0625rem' : '1.125rem',
                fontWeight: '600',
                color: '#f59e0b'
              }}>
                {order.rating}
              </span>
            </div>
          )}
        </div>
        <div style={{
          fontSize: isMobileDetected ? '1.0625rem' : '1.125rem',
          color: '#16a34a',
          marginTop: '0.5rem'
        }}>
          Đã giao • {order.deliveredAt}
        </div>
      </div>

      {/* Order Items */}
      <div style={{
        padding: isMobileDetected ? '1rem' : '1.25rem',
        borderBottom: '0.0625rem solid #f5f5f5'
      }}>
        <div style={{
          display: 'flex',
          gap: isMobileDetected ? '0.75rem' : '1rem',
          alignItems: 'flex-start'
        }}>
          <div style={{
            width: isMobileDetected ? '5rem' : '6.5rem',
            height: isMobileDetected ? '5rem' : '6.5rem',
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
                  fontSize: isMobileDetected ? '1.25rem' : '1.375rem',
                  color: '#666',
                  marginBottom: idx < order.items.length - 1 ? '0.25rem' : 0
                }}
              >
                {item.quantity}x {item.name}
              </div>
            ))}
            <div style={{
              fontSize: isMobileDetected ? '1.25rem' : '1.375rem',
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
        padding: isMobileDetected ? '1rem' : '1.25rem',
        display: 'flex',
        gap: isMobileDetected ? '0.75rem' : '1rem'
      }}>
        <button
          style={{
            flex: 1,
            padding: isMobileDetected ? '1rem' : '1.125rem',
            background: '#fff',
            border: '0.125rem solid #e5e5e5',
            borderRadius: '0.75rem',
            color: '#666',
            fontSize: isMobileDetected ? '1.25rem' : '1.375rem',
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
          <RotateCcw size={isMobileDetected ? 18 : 20} strokeWidth={2} />
          Đặt lại
        </button>
        <button
          style={{
            flex: 1,
            padding: isMobileDetected ? '1rem' : '1.125rem',
            background: order.rated ? '#f5f5f5' : 'linear-gradient(135deg, #ee4d2d 0%, #ff6b35 100%)',
            border: 'none',
            borderRadius: '0.75rem',
            color: order.rated ? '#999' : '#fff',
            fontSize: isMobileDetected ? '1.25rem' : '1.375rem',
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
          <Star size={isMobileDetected ? 18 : 20} strokeWidth={2} fill={order.rated ? '#999' : 'none'} />
          {order.rated ? 'Đã đánh giá' : 'Đánh giá'}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        background: '#fff',
        padding: padding,
        boxShadow: '0 0.125rem 0.5rem rgba(238, 77, 45, 0.3)'
      }}>
        <h1 style={{
          margin: 0,
          color: '#333',
          fontSize: isMobileDetected ? '1.75rem' : isTablet ? '2.25rem' : '2.75rem',
          fontWeight: '700',
          marginBottom: isMobileDetected ? '1.25rem' : '1.5rem',
          letterSpacing: '-0.025em'
        }}>
          Đơn hàng của tôi
        </h1>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          background: '#f5f5f5',
          padding: '0.25rem',
          borderRadius: '0.75rem',
          backdropFilter: 'blur(10px)'
        }}>
          <button
            onClick={() => setActiveTab('ongoing')}
            style={{
              flex: 1,
              padding: isMobileDetected ? '0.75rem' : '0.875rem',
              background: activeTab === 'ongoing' ? '#ee4d2d' : 'transparent',
              border: 'none',
              borderRadius: '0.625rem',
              color: activeTab === 'ongoing' ? '#fff' : '#666',
              fontSize: isMobileDetected ? '1.25rem' : '1.375rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: activeTab === 'ongoing' ? '0 0.125rem 0.5rem rgba(0, 0, 0, 0.1)' : 'none'
            }}
          >
            Đang đến ({ongoingOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            style={{
              flex: 1,
              padding: isMobileDetected ? '0.75rem' : '0.875rem',
              background: activeTab === 'completed' ? '#ee4d2d' : 'transparent',
              border: 'none',
              borderRadius: '0.625rem',
              color: activeTab === 'completed' ? '#fff' : '#666',
              fontSize: isMobileDetected ? '1.25rem' : '1.375rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: activeTab === 'completed' ? '0 0.125rem 0.5rem rgba(0, 0, 0, 0.1)' : 'none'
            }}
          >
            Đã giao ({completedOrders.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        padding: padding,
        paddingBottom: isMobileDetected ? '8rem' : '9rem',
        background: '#f5f5f5'
      }}>
        {activeTab === 'ongoing' ? (
          ongoingOrders.length > 0 ? (
            ongoingOrders.map(order => renderOngoingOrder(order))
          ) : (
            <div style={{
              textAlign: 'center',
              padding: isMobileDetected ? '3rem 1rem' : '4rem 2rem',
              color: '#999'
            }}>
              <ShoppingBag size={isMobileDetected ? 48 : 64} color="#ccc" strokeWidth={1.5} />
              <p style={{ marginTop: '1rem', fontSize: isMobileDetected ? '1.125rem' : '1.25rem' }}>
                Chưa có đơn hàng nào đang giao
              </p>
            </div>
          )
        ) : (
          completedOrders.length > 0 ? (
            completedOrders.map(order => renderCompletedOrder(order))
          ) : (
            <div style={{
              textAlign: 'center',
              padding: isMobileDetected ? '3rem 1rem' : '4rem 2rem',
              color: '#999'
            }}>
              <ShoppingBag size={isMobileDetected ? 48 : 64} color="#ccc" strokeWidth={1.5} />
              <p style={{ marginTop: '1rem', fontSize: isMobileDetected ? '1.125rem' : '1.25rem' }}>
                Chưa có đơn hàng nào đã giao
              </p>
            </div>
          )
        )}
      </div>
      <Navbar isProfilePage={false} />
    </div>
  );
}

export default OrdersPage;
