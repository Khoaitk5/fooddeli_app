import React from 'react';
import { useNavigate } from 'react-router-dom';
import BackArrow from '../../components/shared/BackArrow';

const OrderPlaced = () => {
  const navigate = useNavigate();

  const containerStyle = {
    height: '100vh',
    background: '#f8f9fa',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 5vw'
  };

  const cardStyle = {
    background: 'white',
    borderRadius: '20px',
    padding: '5vh 5vw',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    textAlign: 'center',
    maxWidth: '90vw',
    width: '100%'
  };

  const iconStyle = {
    fontSize: '8rem',
    color: '#28a745',
    marginBottom: '2vh'
  };

  const titleStyle = {
    fontSize: '2.5rem',
    fontFamily: 'Be Vietnam Pro',
    fontWeight: '700',
    color: '#333',
    marginBottom: '1vh'
  };

  const subtitleStyle = {
    fontSize: '1.5rem',
    fontFamily: 'Be Vietnam Pro',
    fontWeight: '400',
    color: '#666',
    marginBottom: '3vh'
  };

  const orderInfoStyle = {
    background: '#f8f9fa',
    borderRadius: '10px',
    padding: '2vh 3vw',
    marginBottom: '3vh'
  };

  const orderTextStyle = {
    fontSize: '1.4rem',
    fontFamily: 'Be Vietnam Pro',
    color: '#333',
    marginBottom: '1vh'
  };

  const buttonStyle = {
    width: '100%',
    padding: '2vh',
    borderRadius: '30px',
    fontSize: '1.6rem',
    fontFamily: 'Be Vietnam Pro',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    marginBottom: '2vh',
    transition: 'all 0.3s ease'
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    background: '#FF7622',
    color: 'white'
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    background: 'white',
    color: '#FF7622',
    border: '2px solid #FF7622'
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={iconStyle}>✓</div>
        <h1 style={titleStyle}>Đặt hàng thành công!</h1>
        <p style={subtitleStyle}>Đơn hàng của bạn đã được xác nhận và đang được chuẩn bị.</p>

        <div style={orderInfoStyle}>
          <p style={orderTextStyle}><strong>Mã đơn hàng:</strong> #FD20241009001</p>
          <p style={orderTextStyle}><strong>Thời gian giao hàng dự kiến:</strong> 30-45 phút</p>
          <p style={orderTextStyle}><strong>Địa chỉ giao:</strong> 123 Đường ABC, Quận 1, TP.HCM</p>
        </div>

        <button
          style={primaryButtonStyle}
          onClick={() => navigate('/customer/order-tracking')}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
        >
          Theo dõi đơn hàng
        </button>

        <button
          style={secondaryButtonStyle}
          onClick={() => navigate('/customer/home')}
          onMouseEnter={(e) => e.target.style.background = '#FFF5F0'}
          onMouseLeave={(e) => e.target.style.background = 'white'}
        >
          Về trang chủ
        </button>
      </div>
    </div>
  );
};

export default OrderPlaced;