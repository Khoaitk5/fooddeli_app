import React from 'react';
import { useNavigate } from 'react-router-dom';
import BackArrow from '../../components/shared/BackArrow';
import BinIcon from '../../components/shared/BinIcon';

export default function Checkout() {
  const navigate = useNavigate();
  const [quantity, setQuantity] = React.useState(1);
  const selectedCoupon = (typeof window !== 'undefined' && localStorage.getItem('selectedCoupon')) || '';

  const basePrice = 69000;
  const subtotal = basePrice * quantity;

  // discount rules
  const discount = selectedCoupon === 'FOOD5' ? Math.round(subtotal * 0.05) : 0;
  const shippingBefore = 15000;
  const shipping = selectedCoupon === 'FREESHIP100' ? 0 : shippingBefore;

  const total = subtotal - discount + shipping;

  return (
    <div className="h-screen overflow-hidden relative mx-auto bg-white">
      <div className="absolute top-[7.125vh] left-[5.28vw]">
        <button onClick={() => navigate('/customer/cart')} style={{background: 'none', border: 'none', padding: 0}}>
          <BackArrow />
        </button>
      </div>
      <div>
        {/* Header */}
        <div
          style={{
            position: "absolute",
            top: "6.625vh",
            left: "50%",
            transform: "translateX(-50%)",
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
            color: "var(--Colors-Typography-500, #363A33)",
            fontSize: "1.7rem",
            fontFamily: "TikTok Sans",
            fontWeight: "700",
            wordWrap: "break-word",
          }}
        >
          Đặt hàng
        </div>

        {/* Item summary */}
        <div
          style={{
            width: '89.44vw',
            height: '11.125vh',
            background: 'white',
            borderRadius: 16,
            border: '1px #F4F7F2 solid',
            marginTop: '12.375vh',
            position: 'relative',
            left: '50%',
            transform: 'translateX(-50%)'
          }}
        >
          <img
            style={{
              width: '26.67vw',
              height: '10.125vh',
              borderTopLeftRadius: 12,
              borderTopRightRadius: 4,
              borderBottomRightRadius: 4,
              borderBottomLeftRadius: 12,
              border: '1px rgba(145, 149, 142, 0.06) solid',
              position: 'absolute',
              left: '1.11vw',
              objectFit: 'cover'
            }}
            src="/burger_b_c_m_kim_chi.png"
            alt="product"
            loading="lazy"
          />
          <div
            style={{
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: '#60655C',
              fontSize: '1.5rem',
              fontFamily: 'TikTok Sans',
              fontWeight: '400',
              wordWrap: 'break-word',
              position: 'absolute',
              top: '1.5vh',
              left: '32vw'
            }}
          >
            Burger Bò Cơm kim chi
          </div>
          <div
            style={{
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'var(--Colors-Typography-500, #363A33)',
              fontSize: '1.5rem',
              fontFamily: 'TikTok Sans',
              fontWeight: '600',
              wordWrap: 'break-word',
              position: 'absolute',
              top: '6.625vh',
              left: '32vw'
            }}
          >
            {subtotal.toLocaleString('vi-VN')} ₫
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: '1.5vh',
              right: '3.33vw',
              display: 'flex',
              alignItems: 'center',
              gap: '2.22rem',
              color: '#60655c'
            }}
          >
            <button aria-label={quantity > 1 ? "Giảm" : "Xóa"} onClick={quantity > 1 ? () => setQuantity(q => Math.max(1, q - 1)) : () => setQuantity(0)} style={{width: '8.89vw', height: '4vh', background: '#F4F7F2', borderRadius: 9999, display: 'grid', placeItems: 'center', border: 'none', color: '#60655c'}}>
              {quantity > 1 ? (
                <svg width="1rem" height="0.2rem" viewBox="0 0 10 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.66852 0.285835C9.0432 0.312598 9.3335 0.624367 9.3335 1C9.3335 1.37563 9.0432 1.6874 8.66852 1.71416L4.99931 1.97625C4.77794 1.99206 4.55572 1.99206 4.33434 1.97625L0.665132 1.71416C0.290454 1.6874 0.000159919 1.37563 0.000159935 0.999999C0.000159952 0.624366 0.290454 0.312597 0.665132 0.285835L4.33434 0.0237487C4.55572 0.00793624 4.77794 0.00793626 4.99931 0.0237488L8.66852 0.285835Z" fill="#60635E"/>
                </svg>
              ) : (
                <BinIcon />
              )}
            </button>
            <div style={{width: '100%', textBoxTrim: 'trim-both', textBoxEdge: 'cap alphabetic', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: '#60655C', fontSize: '1.5rem', fontFamily: 'TikTok Sans', fontWeight: '500', wordWrap: 'break-word'}}>{quantity}</div>
            <button aria-label="Tăng" onClick={() => setQuantity(q => q + 1)} style={{width: '8.89vw', height: '4vh', background: '#F4F7F2', borderRadius: 9999, display: 'grid', placeItems: 'center', border: 'none', color: '#60655c'}}>
              <svg width="1rem" height="1rem" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.66699 0C5.04248 0.000164651 5.3541 0.290467 5.38086 0.665039L5.59961 3.73242L8.66797 3.95215C9.04265 3.97891 9.33301 4.29136 9.33301 4.66699C9.33284 5.04248 9.04254 5.3541 8.66797 5.38086L5.59961 5.59961L5.38086 8.66797C5.3541 9.04254 5.04248 9.33284 4.66699 9.33301C4.29136 9.33301 3.97891 9.04265 3.95215 8.66797L3.73242 5.59961L0.665039 5.38086C0.290469 5.3541 0.000167321 5.04248 0 4.66699C1.64194e-08 4.29136 0.290361 3.97891 0.665039 3.95215L3.73242 3.73242L3.95215 0.665039C3.97891 0.290361 4.29136 0 4.66699 0Z" fill="#60635E"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Coupon */}
        <button onClick={() => navigate('/customer/add-coupon')} style={{
          width: '89.44vw',
          height: '5.5vh',
          background: '#F9FAF8',
          borderRadius: 8,
          border: 'none',
          position: 'absolute',
          top: '26vh',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 1vw',
          color: '#91958E',
          fontSize: '1.5rem',
          fontFamily: 'TikTok Sans',
          fontWeight: '400'
        }}>
          <span style={{position: 'absolute', left: '5.56vw', top: '50%', transform: 'translateY(-50%)'}}>
            <svg width="1.4rem" height="1.8rem" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.1111 0H10.01C9.66191 0.00318886 9.32478 0.11776 9.05154 0.325724C8.7783 0.533689 8.58441 0.82327 8.50033 1.149C8.41029 1.46613 8.21467 1.74594 7.94359 1.94539C7.67251 2.14484 7.34098 2.25288 7 2.25288C6.65902 2.25288 6.32749 2.14484 6.05641 1.94539C5.78532 1.74594 5.58971 1.46613 5.49967 1.149C5.41559 0.82327 5.2217 0.533689 4.94846 0.325724C4.67522 0.11776 4.33809 0.00318886 3.99 0H3.88889C2.85787 0.00119089 1.86943 0.396661 1.14039 1.09966C0.411353 1.80267 0.001235 2.7558 0 3.75V15.75C0 16.3467 0.245833 16.919 0.683418 17.341C1.121 17.7629 1.71449 18 2.33333 18H3.99C4.33809 17.9968 4.67522 17.8822 4.94846 17.6743C5.2217 17.4663 5.41559 17.1767 5.49967 16.851C5.58971 16.5339 5.78532 16.2541 6.05641 16.0546C6.32749 15.8552 6.65902 15.7471 7 15.7471C7.34098 15.7471 7.67251 15.8552 7.94359 16.0546C8.21467 16.2541 8.41029 16.5339 8.50033 16.851C8.58441 17.1767 8.7783 17.4663 9.05154 17.6743C9.32478 17.8822 9.66191 17.9968 10.01 18H11.6667C12.2855 18 12.879 17.7629 13.3166 17.341C13.7542 16.919 14 16.3467 14 15.75V3.75C13.9988 2.7558 13.5886 1.80267 12.8596 1.09966C12.1306 0.396661 11.1421 0.00119089 10.1111 0ZM11.6667 16.5L9.99989 16.4528C9.81721 15.8163 9.42186 15.2558 8.87516 14.8581C8.32846 14.4604 7.66095 14.2477 6.97615 14.2531C6.29135 14.2585 5.62752 14.4816 5.08762 14.8879C4.54771 15.2941 4.16189 15.8608 3.99 16.5H2.33333C2.12705 16.5 1.92922 16.421 1.78336 16.2803C1.6375 16.1397 1.55556 15.9489 1.55556 15.75V12.75H3.11111C3.31739 12.75 3.51522 12.671 3.66108 12.5303C3.80694 12.3897 3.88889 12.1989 3.88889 12C3.88889 11.8011 3.80694 11.6103 3.66108 11.4697C3.51522 11.329 3.31739 11.25 3.11111 11.25H1.55556V3.75C1.55556 3.15326 1.80139 2.58097 2.23897 2.15901C2.67656 1.73705 3.27005 1.5 3.88889 1.5L4.00011 1.54725C4.18229 2.17982 4.57411 2.73753 5.11577 3.13526C5.65743 3.53299 6.31918 3.74889 7 3.75C7.69001 3.74434 8.35921 3.52148 8.90579 3.11532C9.45236 2.70917 9.84638 2.14196 10.0279 1.5H10.1111C10.7299 1.5 11.3234 1.73705 11.761 2.15901C12.1986 2.58097 12.4444 3.15326 12.4444 3.75V11.25H10.8889C10.6826 11.25 10.4848 11.329 10.3389 11.4697C10.1931 11.6103 10.1111 11.8011 10.1111 12C10.1111 12.1989 10.1931 12.3897 10.3389 12.5303C10.4848 12.671 10.6826 12.75 10.8889 12.75H12.4444V15.75C12.4444 15.9489 12.3625 16.1397 12.2166 16.2803C12.0708 16.421 11.8729 16.5 11.6667 16.5Z" fill="#A9ADA5"/>
              <path d="M7.77769 11.25H6.22213C6.01585 11.25 5.81802 11.329 5.67216 11.4697C5.5263 11.6103 5.44435 11.8011 5.44435 12C5.44435 12.1989 5.5263 12.3897 5.67216 12.5303C5.81802 12.671 6.01585 12.75 6.22213 12.75H7.77769C7.98397 12.75 8.1818 12.671 8.32766 12.5303C8.47352 12.3897 8.55546 12.1989 8.55546 12C8.55546 11.8011 8.47352 11.6103 8.32766 11.4697C8.1818 11.329 7.98397 11.25 7.77769 11.25Z" fill="#A9ADA5"/>
            </svg>
          </span>
          <span style={{paddingLeft: '10vw', textAlign: 'left'}}>{selectedCoupon ? selectedCoupon : 'Áp mã giảm giá'}</span>
          <span style={{position: 'absolute', right: '4.46vw', top: '50%', transform: 'translateY(-50%)'}}>
            <svg width="0.9rem" height="1.4rem" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M1.174 13.1052C0.9085 12.7872 0.952001 12.3139 1.27 12.0492C2.50375 11.0164 5.36875 8.47768 6.3505 7.18768C5.35225 5.87593 2.5255 3.37393 1.27 2.32618C0.952001 2.06143 0.9085 1.58818 1.174 1.27018C1.43875 0.951426 1.912 0.908676 2.23075 1.17418C3.61 2.32318 6.58 4.91893 7.63075 6.39718C7.795 6.63118 7.9375 6.89518 7.9375 7.18768C7.9375 7.48018 7.795 7.74418 7.63075 7.97743C6.601 9.42643 3.5815 12.0739 2.23075 13.2004L2.23 13.2012C1.912 13.4667 1.43875 13.4232 1.174 13.1052Z" fill="#A9ADA5" stroke="#A9ADA5" strokeWidth="0.4"/>
            </svg>
          </span>
        </button>

        {/* Breakdown */}
        <div style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '89.44vw',
          top: '34.5vh',
          color: '#60655C',
          fontSize: '1.5rem',
          fontFamily: 'TikTok Sans',
          fontWeight: '400'
        }}>
          <div style={{display: 'flex', justifyContent: 'space-between', padding: '0.5vh 0'}}>
            <span>Tổng</span>
            <span style={{fontWeight: '600', color: '#363A33'}}>{subtotal.toLocaleString('vi-VN')} ₫</span>
          </div>
          {discount > 0 && (
            <div style={{display: 'flex', justifyContent: 'space-between', padding: '0.5vh 0'}}>
              <span>Giảm giá</span>
              <span style={{fontWeight: '600', color: '#363A33'}}>- {discount.toLocaleString('vi-VN')} ₫</span>
            </div>
          )}
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
      </div>

      {/* Bottom bar */}
      <div>
        <div className="flex items-center justify-between">
          <div
            style={{
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: '#363A33',
              fontSize: '2.3rem',
              fontFamily: 'TikTok Sans',
              fontWeight: '600',
              wordWrap: 'break-word',
              position: 'absolute',
              left: '5.28vw',
              top: '94.45vh',
              transform: 'translateY(-50%)'
            }}
          >
            {total.toLocaleString('vi-VN')} ₫
          </div>
          <button
            onClick={() => navigate('/customer/payment')}
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
              fontFamily: 'TikTok Sans',
              fontWeight: '700',
              border: 'none'
            }}
          >
            Tiếp tục
          </button>
        </div>
      </div>
    </div>
  );
}


