import React from 'react';
import { useNavigate } from 'react-router-dom';

const IMG_PRODUCT = 'https://www.figma.com/api/mcp/asset/56e5d031-1b03-4cb4-a96e-b203c7d5682b';
const FALLBACK_IMG = 'data:image/svg+xml;utf8,\
<svg xmlns="http://www.w3.org/2000/svg" width="96" height="81" viewBox="0 0 96 81">\
  <rect width="100%" height="100%" rx="12" fill="%23f4f4f5"/>\
  <g fill="%23c0c4d0">\
    <circle cx="48" cy="36" r="14"/>\
    <rect x="24" y="61" width="48" height="8" rx="4"/>\
  </g>\
</svg>';

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
    <div className="bg-white">
      <div className="mx-auto max-w-[390px] px-5 pt-5 pb-28">
        {/* Header */}
        <div className="mb-4 grid grid-cols-3 items-center">
          <button onClick={() => navigate(-1)} className="justify-self-start text-[#60635e]">←</button>
          <div className="text-center text-[17px] text-[#363a33] font-bold">Đặt hàng</div>
          <div className="justify-self-end" />
        </div>

        {/* Item summary */}
        <div className="rounded-[16px] border border-[#f4f7f2] p-3">
          <div className="flex items-center gap-3">
            <img
              src={IMG_PRODUCT}
              alt="product"
              className="w-[96px] h-[81px] rounded-tl-[12px] rounded-tr-[4px] rounded-bl-[12px] rounded-br-[4px] object-cover border border-[rgba(145,149,142,0.06)]"
              onError={(e) => { e.currentTarget.src = FALLBACK_IMG; e.currentTarget.onerror = null; }}
            />
            <div className="flex-1 min-w-0">
              <div className="text-[15px] text-[#60655c] truncate">Burger Bò Cơm kim chi</div>
              <div className="mt-2 text-[15px] text-[#363a33] font-semibold">{subtotal.toLocaleString('vi-VN')} ₫</div>
            </div>
            <div className="flex items-center gap-2 text-[#60655c]">
              <button aria-label="Giảm" onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-8 h-8 rounded-full bg-[#f6f6f6] grid place-items-center">-</button>
              <span className="w-6 text-center text-[15px]">{quantity}</span>
              <button aria-label="Tăng" onClick={() => setQuantity(q => q + 1)} className="w-8 h-8 rounded-full bg-[#f6f6f6] grid place-items-center">+</button>
              <button aria-label="Xóa món" onClick={() => setQuantity(0)} className="ml-2 w-8 h-8 grid place-items-center rounded-full bg-[#fff] border border-[#e8ebe6] text-[#60655c]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 6h18" stroke="#60655c" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="#60655c" strokeWidth="1.5"/>
                  <path d="M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14" stroke="#60655c" strokeWidth="1.5"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Coupon */}
        <button onClick={() => navigate('/customer/add-coupon')} className="mt-4 flex items-center h-[47px] rounded-[8px] bg-[#f9faf8] px-4 text-[15px] text-[#91958e] w-full text-left">
          <span className="mr-3">🏷️</span>
          <span className="flex-1">{selectedCoupon ? selectedCoupon : 'Áp mã giảm giá'}</span>
          <span className="text-[#a9ada5]">›</span>
        </button>

        {/* Breakdown */}
        <div className="mt-4 text-[15px] text-[#60655c]">
          <div className="flex items-center justify-between py-2">
            <span>Tổng</span>
            <span className="font-semibold text-[#363a33]">{subtotal.toLocaleString('vi-VN')} ₫</span>
          </div>
          {discount > 0 && (
            <div className="flex items-center justify-between py-2">
              <span>Giảm giá</span>
              <span className="font-semibold text-[#363a33]">- {discount.toLocaleString('vi-VN')} ₫</span>
            </div>
          )}
          <div className="flex items-center justify-between py-2">
            <span>Phí vận chuyển</span>
            <span className="font-semibold text-[#363a33]">{shipping.toLocaleString('vi-VN')} ₫</span>
          </div>
          <hr className="my-2 border-[#e8ebe6]" />
          <div className="flex items-center justify-between py-2 text-[17px]">
            <span className="text-[#363a33]">Tổng cộng</span>
            <span className="font-bold text-[#363a33]">{total.toLocaleString('vi-VN')} ₫</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="fixed left-0 right-0 bottom-0 w-full bg-white">
        <div className="mx-auto max-w-[390px] px-5 py-4 flex items-center justify-between">
          <div className="text-[23px] text-[#363a33] font-semibold">{total.toLocaleString('vi-VN')} ₫</div>
          <button onClick={() => navigate('/customer/payment')} className="h-[51px] px-6 rounded-[12px] bg-[#f9704b] text-white text-[14.5px] shadow-[inset_0_-1px_0_#f9704b,inset_0_1px_0_#ffffff]">
            Tiếp tục
          </button>
        </div>
      </div>
    </div>
  );
}


