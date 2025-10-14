import React from 'react';
import { useNavigate } from 'react-router-dom';
import BackArrow from '../../components/shared/BackArrow';

export default function Payment() {
  const navigate = useNavigate();

  const selectedCoupon = (typeof window !== 'undefined' && localStorage.getItem('selectedCoupon')) || '';
  const basePrice = 69000;
  const discount = selectedCoupon === 'FOOD5' ? Math.round(basePrice * 0.05) : 0;
  const shippingBefore = 15000;
  const shipping = selectedCoupon === 'FREESHIP100' ? 0 : shippingBefore;
  const total = basePrice - discount + shipping;

  return (
    <div className="h-screen overflow-hidden relative mx-auto bg-white">
      {/* Header */}
      <div
        style={{
          position: 'absolute',
          top: '7.125vh',
          left: '5.28vw'
        }}
        onClick={() => navigate(-1)}
      >
        <BackArrow />
      </div>
      <div
        style={{
          position: 'absolute',
          top: '6.5vh',
          left: '50%',
          transform: 'translateX(-50%)',
          justifyContent: 'center',
          display: 'flex',
          flexDirection: 'column',
          color: 'var(--Colors-Typography-500, #363A33)',
          fontSize: '1.7rem',
          fontFamily: 'Be Vietnam Pro',
          fontWeight: '700',
          wordWrap: 'break-word'
        }}
      >
        Thanh toán
      </div>

      {/* Address card */}
      <button
        onClick={() => navigate('/customer/address')}
        style={{
          width: '89.4vw',
          height: '8.625vh',
          background: '#F9FAF8',
          borderRadius: 8,
          border: 'none',
          position: 'absolute',
          top: '12.375vh',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1vw',
          color: '#363A33',
          fontSize: '1.3rem',
          fontFamily: 'Be Vietnam Pro',
          fontWeight: '400',
          textAlign: 'left'
        }}
      >
        <svg width="1.4rem" height="1.8rem" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg" style={{position: 'absolute', left: '5.56vw'}}>
          <path fillRule="evenodd" clipRule="evenodd" d="M6.75 7.5C7.16423 7.5 7.5 7.16423 7.5 6.75C7.5 6.33578 7.16423 6 6.75 6C6.33578 6 6 6.33578 6 6.75C6 7.16423 6.33578 7.5 6.75 7.5ZM6.75 9C7.99268 9 9 7.99268 9 6.75C9 5.50732 7.99268 4.5 6.75 4.5C5.50732 4.5 4.5 5.50732 4.5 6.75C4.5 7.99268 5.50732 9 6.75 9Z" fill="#60635E"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M6.75 1.5C3.8505 1.5 1.5 3.85051 1.5 6.75C1.5 8.84542 2.29973 10.7738 3.3315 12.3855C4.36208 13.9953 5.5968 15.2461 6.39675 15.9709C6.60503 16.1596 6.89498 16.1596 7.10325 15.9709C7.9032 15.2461 9.13793 13.9953 10.1685 12.3855C11.2003 10.7738 12 8.84542 12 6.75C12 3.85051 9.6495 1.5 6.75 1.5ZM0 6.75C0 3.02208 3.02205 0 6.75 0C10.478 0 13.5 3.02208 13.5 6.75C13.5 9.22755 12.557 11.4365 11.4318 13.1942C10.3052 14.954 8.96835 16.3051 8.11035 17.0825C7.33058 17.789 6.16943 17.789 5.38965 17.0825C4.53165 16.3051 3.19477 14.954 2.06823 13.1942C0.942937 11.4365 0 9.22755 0 6.75Z" fill="#60635E"/>
        </svg>
        <div>
        <div style={{position: 'absolute', left: '13.89vw', top: '1.625vh', opacity: 0.70, justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'var(--Colors-Typography-400, #60655C)', fontSize: '1.2rem', fontFamily: 'Be Vietnam Pro', fontWeight: '400', wordWrap: 'break-word'}}>Giao đến</div>
          <div style={{position: 'absolute', left: '13.89vw', bottom: '1.5vh', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'var(--Colors-Typography-500, #363A33)', fontSize: '1.5rem', fontFamily: 'Be Vietnam Pro', fontWeight: '400', wordWrap: 'break-word'}}>Nhà - Lê Đức Thọ, Điện Bàn...</div>
        </div>
        <svg width="0.9rem" height="1.4rem" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg" style={{position: 'absolute', right: '4.46vw'}}>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M1.174 13.1052C0.9085 12.7872 0.952001 12.3139 1.27 12.0492C2.50375 11.0164 5.36875 8.47768 6.3505 7.18768C5.35225 5.87593 2.5255 3.37393 1.27 2.32618C0.952001 2.06143 0.9085 1.58818 1.174 1.27018C1.43875 0.951426 1.912 0.908676 2.23075 1.17418C3.61 2.32318 6.58 4.91893 7.63075 6.39718C7.795 6.63118 7.9375 6.89518 7.9375 7.18768C7.9375 7.48018 7.795 7.74418 7.63075 7.97743C6.601 9.42643 3.5815 12.0739 2.23075 13.2004L2.23 13.2012C1.912 13.4667 1.43875 13.4232 1.174 13.1052Z" fill="#A9ADA5" stroke="#A9ADA5" stroke-width="0.4"/>
        </svg>
      </button>

      {/* Payment method card */}
      <button
        onClick={() => navigate('/customer/payment-method')}
        style={{
          width: '89.4vw',
          height: '8.625vh',
          background: '#F9FAF8',
          borderRadius: 8,
          border: 'none',
          position: 'absolute',
          top: '22vh',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1vw',
          color: '#363A33',
          fontSize: '1.3rem',
          fontFamily: 'Be Vietnam Pro',
          fontWeight: '400',
          textAlign: 'left'
        }}
      >
        <svg width="1.8rem" height="1.5rem" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg" style={{position: 'absolute', left: '4.44vw'}}>
          <path fillRule="evenodd" clipRule="evenodd" d="M16.2817 11.286C16.4625 10.377 16.5 9.192 16.5 7.5C16.5 5.808 16.4625 4.623 16.2817 3.714C16.1197 2.8815 15.882 2.53125 15.6337 2.32425C15.3457 2.08425 14.8132 1.8435 13.686 1.69125C12.5377 1.5345 11.0445 1.5 9 1.5C6.95625 1.5 5.46225 1.5345 4.314 1.69125C3.18675 1.8435 2.65425 2.08425 2.36625 2.32425C2.118 2.53125 1.88025 2.8815 1.71825 3.714C1.5375 4.623 1.5 5.808 1.5 7.5C1.5 9.192 1.5375 10.377 1.71825 11.286C1.88025 12.1185 2.118 12.4687 2.36625 12.6757C2.65425 12.9157 3.18675 13.1565 4.314 13.308C5.46225 13.4655 6.95625 13.5 9 13.5C11.0445 13.5 12.5377 13.4655 13.686 13.308C14.8132 13.1565 15.3457 12.9157 15.6337 12.6757C15.882 12.4687 16.1197 12.1185 16.2817 11.286ZM9 15C17.25 15 18 14.3752 18 7.5C18 0.62475 17.25 0 9 0C0.75 0 0 0.62475 0 7.5C0 14.3752 0.75 15 9 15Z" fill="#60635E"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M1.5 3.75H16.5V6.75H1.5V3.75Z" fill="#60635E"/>
        </svg>
        <div>
          <div style={{position: 'absolute', left: '13.89vw', top: '1.625vh', opacity: 0.70, justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'var(--Colors-Typography-400, #60655C)', fontSize: '1.2rem', fontFamily: 'Be Vietnam Pro', fontWeight: '400', wordWrap: 'break-word'}}>Phương thức thanh toán</div>
          <div style={{position: 'absolute', left: '13.89vw', bottom: '1.5vh', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'var(--Colors-Typography-500, #363A33)', fontSize: '1.5rem', fontFamily: 'Be Vietnam Pro', fontWeight: '400', wordWrap: 'break-word'}}>Tiền mặt</div>
        </div>
        <svg width="0.9rem" height="1.4rem" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg" style={{position: 'absolute', right: '4.46vw'}}>
          <path fillRule="evenodd" clipRule="evenodd" d="M1.174 13.1052C0.9085 12.7872 0.952001 12.3139 1.27 12.0492C2.50375 11.0164 5.36875 8.47768 6.3505 7.18768C5.35225 5.87593 2.5255 3.37393 1.27 2.32618C0.952001 2.06143 0.9085 1.58818 1.174 1.27018C1.43875 0.951426 1.912 0.908676 2.23075 1.17418C3.61 2.32318 6.58 4.91893 7.63075 6.39718C7.795 6.63118 7.9375 6.89518 7.9375 7.18768C7.9375 7.48018 7.795 7.74418 7.63075 7.97743C6.601 9.42643 3.5815 12.0739 2.23075 13.2004L2.23 13.2012C1.912 13.4667 1.43875 13.4232 1.174 13.1052Z" fill="#A9ADA5" stroke="#A9ADA5" strokeWidth="0.4"/>
        </svg>
      </button>

      {/* Breakdown */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '89.44vw',
          top: '32vh',
          color: '#60655C',
          fontSize: '1.5rem',
          fontFamily: 'Be Vietnam Pro',
          fontWeight: '400'
        }}
      >
        <div style={{display: 'flex', justifyContent: 'space-between', padding: '0.5vh 0'}}>
          <span>Tổng</span>
          <span style={{fontWeight: '600', color: '#363A33'}}>{basePrice.toLocaleString('vi-VN')} ₫</span>
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', padding: '0.5vh 0'}}>
          <span>Phí vận chuyển</span>
          <span style={{fontWeight: '600', color: '#363A33'}}>{shipping.toLocaleString('vi-VN')} ₫</span>
        </div>
        <hr style={{border: '1px solid #E8EBE6', margin: '0.5vh 0'}} />
        <div style={{display: 'flex', justifyContent: 'space-between', padding: '0.5vh 0', fontSize: '1.7rem'}}>
          <span style={{color: '#363A33'}}>Tổng cộng</span>
          <span style={{fontWeight: '700', color: '#363A33'}}>{total.toLocaleString('vi-VN')} ₫</span>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        style={{
          position: 'absolute',
          left: '5.28vw',
          top: '94.45vh',
          transform: 'translateY(-50%)',
          justifyContent: 'center',
          display: 'flex',
          flexDirection: 'column',
          color: '#363A33',
          fontSize: '2.3rem',
          fontFamily: 'Be Vietnam Pro',
          fontWeight: '600',
          wordWrap: 'break-word'
        }}
      >
        {total.toLocaleString('vi-VN')} ₫
      </div>
      <button
        onClick={() => navigate('/customer/order-confirmation')}
        style={{
          width: '59.72vw',
          height: '6.4vh',
          background: 'linear-gradient(0deg, #F9704B 0%, #F9704B 100%)',
          boxShadow: '0px 1px 0px white inset',
          borderRadius: 12,
          position: 'absolute',
          top: '91.25vh',
          right: '5.28vw',
          display: 'grid',
          placeItems: 'center',
          color: 'white',
          fontSize: '1.5rem',
          textDecoration: 'none',
          fontFamily: 'Be Vietnam Pro',
          fontWeight: '700',
          border: 'none'
        }}
      >
        Đặt hàng
      </button>
    </div>
  );
}


