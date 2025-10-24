import { X, Gift, Calendar, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export function VouchersDialog({ isOpen, onClose, isMobile, isTablet }) {
  const [copiedId, setCopiedId] = useState(null);

  const vouchers = [
    {
      id: 1,
      code: 'FREESHIP50K',
      title: 'Miễn phí ship 50K',
      description: 'Áp dụng cho đơn từ 100K',
      discount: 'Giảm 50.000đ',
      expiry: '31/12/2024',
      color: '#ee4d2d'
    },
    {
      id: 2,
      code: 'FOOD30K',
      title: 'Giảm 30K đơn hàng',
      description: 'Áp dụng cho đơn từ 150K',
      discount: 'Giảm 30.000đ',
      expiry: '25/12/2024',
      color: '#ec4899'
    },
    {
      id: 3,
      code: 'COMBO50',
      title: 'Giảm 50% combo',
      description: 'Tối đa 100K',
      discount: 'Giảm 50%',
      expiry: '20/12/2024',
      color: '#8b5cf6'
    },
    {
      id: 4,
      code: 'NEWUSER100',
      title: 'Người dùng mới',
      description: 'Giảm ngay cho đơn đầu',
      discount: 'Giảm 100.000đ',
      expiry: '15/01/2025',
      color: '#f59e0b'
    },
    {
      id: 5,
      code: 'WEEKEND20',
      title: 'Cuối tuần vui vẻ',
      description: 'T7, CN giảm 20%',
      discount: 'Giảm 20%',
      expiry: '31/12/2024',
      color: '#10b981'
    }
  ];

  const padding = isMobile ? '1.5rem' : isTablet ? '1.75rem' : '2rem';

  const handleCopy = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div 
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)'
        }}
      />

      <div style={{
        position: 'relative',
        background: '#fff',
        borderRadius: isMobile ? '1.25rem' : '1.5rem',
        width: isMobile ? 'calc(100% - 2rem)' : isTablet ? '540px' : '600px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 1.25rem 3.75rem rgba(0, 0, 0, 0.3)',
        animation: 'slideUp 0.3s ease-out'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #ee4d2d 0%, #ff6b35 100%)',
          padding: padding,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h2 style={{
            margin: 0,
            color: '#fff',
            fontSize: isMobile ? '1.125rem' : '1.25rem',
            fontWeight: '600'
          }}>
            Voucher & Ưu đãi
          </h2>
          <button
            onClick={onClose}
            style={{
              width: isMobile ? '2rem' : '2.25rem',
              height: isMobile ? '2rem' : '2.25rem',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
          >
            <X size={isMobile ? 18 : 20} color="#fff" strokeWidth={2.5} />
          </button>
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: padding
        }}>
          {vouchers.map((voucher, index) => (
            <div
              key={voucher.id}
              style={{
                background: '#fff',
                border: `0.125rem solid ${voucher.color}20`,
                borderRadius: '1rem',
                padding: isMobile ? '1rem' : '1.25rem',
                marginBottom: index < vouchers.length - 1 ? '1rem' : 0,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Decorative circles */}
              <div style={{
                position: 'absolute',
                left: '-0.5rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '1rem',
                height: '1rem',
                borderRadius: '50%',
                background: '#f5f5f5'
              }} />
              <div style={{
                position: 'absolute',
                right: '-0.5rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '1rem',
                height: '1rem',
                borderRadius: '50%',
                background: '#f5f5f5'
              }} />

              <div style={{
                display: 'flex',
                gap: isMobile ? '0.875rem' : '1rem',
                alignItems: 'flex-start'
              }}>
                <div style={{
                  width: isMobile ? '3.5rem' : '4rem',
                  height: isMobile ? '3.5rem' : '4rem',
                  borderRadius: '0.75rem',
                  background: `${voucher.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Gift size={isMobile ? 24 : 28} color={voucher.color} strokeWidth={2} />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: isMobile ? '1rem' : '1.0625rem',
                    fontWeight: '600',
                    color: '#333',
                    marginBottom: '0.25rem'
                  }}>
                    {voucher.title}
                  </div>
                  <div style={{
                    fontSize: isMobile ? '0.8125rem' : '0.875rem',
                    color: '#999',
                    marginBottom: '0.5rem'
                  }}>
                    {voucher.description}
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    fontSize: isMobile ? '0.8125rem' : '0.875rem',
                    color: '#666',
                    marginBottom: '0.75rem'
                  }}>
                    <Calendar size={14} strokeWidth={2} />
                    HSD: {voucher.expiry}
                  </div>

                  <div style={{
                    display: 'flex',
                    gap: '0.75rem',
                    alignItems: 'center'
                  }}>
                    <div style={{
                      flex: 1,
                      background: `${voucher.color}10`,
                      borderRadius: '0.5rem',
                      padding: '0.5rem 0.75rem',
                      fontSize: isMobile ? '0.8125rem' : '0.875rem',
                      fontWeight: '600',
                      color: voucher.color,
                      fontFamily: 'monospace'
                    }}>
                      {voucher.code}
                    </div>
                    <button
                      onClick={() => handleCopy(voucher.code, voucher.id)}
                      style={{
                        padding: '0.5rem 0.875rem',
                        background: copiedId === voucher.id ? '#10b981' : voucher.color,
                        border: 'none',
                        borderRadius: '0.5rem',
                        color: '#fff',
                        fontSize: isMobile ? '0.8125rem' : '0.875rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                        transition: 'all 0.2s',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {copiedId === voucher.id ? (
                        <>
                          <Check size={14} strokeWidth={2.5} />
                          Đã copy
                        </>
                      ) : (
                        <>
                          <Copy size={14} strokeWidth={2.5} />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                fontSize: isMobile ? '0.875rem' : '0.9375rem',
                fontWeight: '600',
                color: voucher.color
              }}>
                {voucher.discount}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>
        {`
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(1rem);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}
