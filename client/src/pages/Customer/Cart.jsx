import { useState } from 'react';
import { Minus, Plus, Trash2, ShoppingCart, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BackArrow from '../../components/shared/BackArrow';

export function CartPage({ isMobile, isTablet, onCheckout }) {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Phở bò tái',
      price: 40000,
      quantity: 2,
      note: 'Ít hành',
      image: 'https://images.unsplash.com/photo-1656945843375-207bb6e47750?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwZm9vZCUyMG5vb2RsZXN8ZW58MXx8fHwxNzU5OTkyOTMwfDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 2,
      name: 'Gỏi cuốn tôm thịt',
      price: 30000,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1693494869603-09f1981f28e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwc3ByaW5nJTIwcm9sbHN8ZW58MXx8fHwxNzYwMzIxMDY1fDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 3,
      name: 'Bánh mì đặc biệt',
      price: 25000,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1599719455360-ff0be7c4dd06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYmFuaCUyMG1pfGVufDF8fHx8MTc2MDQxNDUxOHww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 4,
      name: 'Cà phê sữa đá',
      price: 25000,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1664515725366-e8328e9dc834?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwY29mZmVlfGVufDF8fHx8MTc2MDMyMTA2NXww&ixlib=rb-4.1.0&q=80&w=1080'
    }
  ]);

  const padding = isMobile ? '1rem' : isTablet ? '1.25rem' : '1.5rem';

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const updateQuantity = (id, delta) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 15000;
  const total = subtotal + deliveryFee;

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        position: 'absolute',
        top: isMobile ? '4.5rem' : '2.5rem',
        left: isMobile ? '1rem' : '1.5rem',
        zIndex: 10
      }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{
            background: 'none', 
            border: 'none', 
            padding: 0,
            cursor: 'pointer'
          }}
        >
          <BackArrow />
        </button>
      </div>
      <div style={{
        position: 'absolute',
        top: isMobile ? '4.5rem' : '2.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        color: '#333',
        fontSize: isMobile ? '1.375rem' : '1.625rem',
        fontWeight: '700',
        zIndex: 10
      }}>
        Giỏ hàng
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        background: '#f5f5f5',
        paddingTop: isMobile ? '6.5rem' : '5rem'
      }}>
        {cartItems.length > 0 ? (
          <>
            {/* Cart Items */}
            <div style={{ padding: padding }}>
              <div style={{
                background: '#fff',
                borderRadius: isMobile ? '1rem' : '1.25rem',
                overflow: 'hidden',
                boxShadow: '0 0.125rem 1rem rgba(0, 0, 0, 0.06)'
              }}>
                {cartItems.map((item, index) => (
                  <div
                    key={item.id}
                    style={{
                      padding: isMobile ? '1rem' : '1.25rem',
                      borderBottom: index < cartItems.length - 1 ? '0.0625rem solid #f5f5f5' : 'none',
                      display: 'flex',
                      gap: isMobile ? '0.75rem' : '1rem'
                    }}
                  >
                    {/* Image */}
                    <div style={{
                      width: isMobile ? '5rem' : '6rem',
                      height: isMobile ? '5rem' : '6rem',
                      borderRadius: '0.75rem',
                      overflow: 'hidden',
                      flexShrink: 0
                    }}>
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '0.5rem'
                      }}>
                        <div style={{ flex: 1, paddingRight: '0.5rem' }}>
                          <h3 style={{
                            margin: 0,
                            fontSize: isMobile ? '1.125rem' : '1.25rem',
                            fontWeight: '600',
                            color: '#333',
                            marginBottom: '0.25rem'
                          }}>
                            {item.name}
                          </h3>
                          {item.note && (
                            <div style={{
                              fontSize: isMobile ? '1.1875rem' : '1.25rem',
                              color: '#999',
                              fontStyle: 'italic'
                            }}>
                              Ghi chú: {item.note}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          style={{
                            width: isMobile ? '2rem' : '2.25rem',
                            height: isMobile ? '2rem' : '2.25rem',
                            borderRadius: '0.5rem',
                            background: '#fff',
                            border: '0.0625rem solid #f5f5f5',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            flexShrink: 0
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#fee';
                            e.currentTarget.style.borderColor = '#fcc';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#fff';
                            e.currentTarget.style.borderColor = '#f5f5f5';
                          }}
                        >
                          {/* <Trash2 size={isMobile ? 16 : 18} color="#ef4444" strokeWidth={2} /> */}
                          {/* Fallback text if icon doesn't show */}
                          <span style={{color: '#ef4444', fontSize: '16px'}}>🗑️</span>
                        </button>
                      </div>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 'auto'
                      }}>
                        <div style={{
                          fontSize: isMobile ? '1.125rem' : '1.25rem',
                          fontWeight: '600',
                          color: '#ee4d2d'
                        }}>
                          {formatPrice(item.price)}
                        </div>

                        {/* Quantity Controls */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          background: '#f5f5f5',
                          borderRadius: '0.625rem',
                          padding: '0.25rem'
                        }}>
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            disabled={item.quantity <= 1}
                            style={{
                              width: isMobile ? '1.75rem' : '2rem',
                              height: isMobile ? '1.75rem' : '2rem',
                              borderRadius: '0.5rem',
                              background: item.quantity <= 1 ? '#e5e5e5' : '#fff',
                              border: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              if (item.quantity > 1) {
                                e.currentTarget.style.background = '#ee4d2d';
                                // e.currentTarget.querySelector('svg').setAttribute('stroke', '#fff');
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (item.quantity > 1) {
                                e.currentTarget.style.background = '#fff';
                                // e.currentTarget.querySelector('svg').setAttribute('stroke', '#666');
                              }
                            }}
                          >
                            {/* <Minus size={isMobile ? 14 : 16} color={item.quantity <= 1 ? '#999' : '#666'} strokeWidth={2.5} /> */}
                            <span style={{ fontSize: '16px', fontWeight: 'bold', color: item.quantity <= 1 ? '#999' : '#666' }}>-</span>
                          </button>

                          <span style={{
                            fontSize: isMobile ? '1.1875rem' : '1.25rem',
                            fontWeight: '600',
                            color: '#333',
                            minWidth: '1.5rem',
                            textAlign: 'center'
                          }}>
                            {item.quantity}
                          </span>

                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            style={{
                              width: isMobile ? '1.75rem' : '2rem',
                              height: isMobile ? '1.75rem' : '2rem',
                              borderRadius: '0.5rem',
                              background: '#fff',
                              border: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#ee4d2d';
                              // e.currentTarget.querySelector('svg').setAttribute('stroke', '#fff');
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = '#fff';
                              // e.currentTarget.querySelector('svg').setAttribute('stroke', '#666');
                            }}
                          >
                            {/* <Plus size={isMobile ? 14 : 16} color="#666" strokeWidth={2.5} /> */}
                            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#666' }}>+</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div style={{
              padding: `0 ${padding} ${padding}`,
              paddingBottom: isMobile ? '9rem' : '10rem'
            }}>
              <div style={{
                background: '#fff',
                borderRadius: isMobile ? '1rem' : '1.25rem',
                padding: isMobile ? '1.25rem' : '1.5rem',
                boxShadow: '0 0.125rem 1rem rgba(0, 0, 0, 0.06)'
              }}>
                <h3 style={{
                  margin: 0,
                  fontSize: isMobile ? '1.1875rem' : '1.25rem',
                  fontWeight: '600',
                  color: '#333',
                  marginBottom: '1rem'
                }}>
                  Tóm tắt đơn hàng
                </h3>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '0.75rem'
                }}>
                  <span style={{
                    fontSize: isMobile ? '1.1875rem' : '1.25rem',
                    color: '#666'
                  }}>
                    Tạm tính
                  </span>
                  <span style={{
                    fontSize: isMobile ? '1.1875rem' : '1.25rem',
                    color: '#333',
                    fontWeight: '500'
                  }}>
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '1rem',
                  paddingBottom: '1rem',
                  borderBottom: '0.0625rem solid #f5f5f5'
                }}>
                  <span style={{
                    fontSize: isMobile ? '1.1875rem' : '1.25rem',
                    color: '#666'
                  }}>
                    Phí giao hàng
                  </span>
                  <span style={{
                    fontSize: isMobile ? '1.1875rem' : '1.25rem',
                    color: '#333',
                    fontWeight: '500'
                  }}>
                    {formatPrice(deliveryFee)}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{
                    fontSize: isMobile ? '1.1875rem' : '1.25rem',
                    fontWeight: '600',
                    color: '#333'
                  }}>
                    Tổng cộng
                  </span>
                  <span style={{
                    fontSize: isMobile ? '1.375rem' : '1.5rem',
                    fontWeight: '600',
                    color: '#ee4d2d'
                  }}>
                    {formatPrice(total)}
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            textAlign: 'center'
          }}>
            <ShoppingCart size={isMobile ? 64 : 80} color="#ccc" strokeWidth={1.5} />
            <h2 style={{
              fontSize: isMobile ? '1.375rem' : '1.625rem',
              color: '#333',
              margin: '1.5rem 0 0.5rem'
            }}>
              Giỏ hàng trống
            </h2>
            <p style={{
              fontSize: isMobile ? '1.1875rem' : '1.25rem',
              color: '#999',
              margin: 0
            }}>
              Hãy thêm món ăn yêu thích vào giỏ hàng
            </p>
          </div>
        )}
      </div>

      {/* Checkout Button - Fixed at bottom */}
      {cartItems.length > 0 && (
        <div style={{
          position: 'fixed',
          bottom: isMobile ? '4rem' : '4.5rem',
          left: 0,
          right: 0,
          padding: padding,
          background: '#fff',
          borderTop: '0.0625rem solid #e5e5e5',
          boxShadow: '0 -0.25rem 1rem rgba(0, 0, 0, 0.05)',
          zIndex: 20,
          maxWidth: isMobile ? '100%' : isTablet ? '640px' : '800px',
          margin: '0 auto'
        }}>
          <button
            onClick={onCheckout}
            style={{
              width: '100%',
              padding: isMobile ? '1rem' : '1.125rem',
              background: 'linear-gradient(135deg, #ee4d2d 0%, #ff6b35 100%)',
              border: 'none',
              borderRadius: isMobile ? '0.875rem' : '1rem',
              color: '#fff',
              fontSize: isMobile ? '1.125rem' : '1.25rem',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 0.25rem 1rem rgba(238, 77, 45, 0.4)',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-0.125rem)';
              e.currentTarget.style.boxShadow = '0 0.375rem 1.25rem rgba(238, 77, 45, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 0.25rem 1rem rgba(238, 77, 45, 0.4)';
            }}
          >
            Đặt hàng • {formatPrice(total)}
          </button>
        </div>
      )}
    </div>
  );
}
