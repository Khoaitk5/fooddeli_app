import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Payment() {
  const navigate = useNavigate();

  const selectedCoupon = (typeof window !== 'undefined' && localStorage.getItem('selectedCoupon')) || '';
  const basePrice = 69000;
  const discount = selectedCoupon === 'FOOD5' ? Math.round(basePrice * 0.05) : 0;
  const shippingBefore = 15000;
  const shipping = selectedCoupon === 'FREESHIP100' ? 0 : shippingBefore;
  const total = basePrice - discount + shipping;

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-[390px] px-5 pt-5 pb-28">
        {/* Header */}
        <div className="mb-4 grid grid-cols-3 items-center">
          <button onClick={() => navigate(-1)} className="justify-self-start text-[#60635e]">←</button>
          <div className="text-center text-[17px] text-[#363a33] font-bold">Thanh toán</div>
          <div className="justify-self-end" />
        </div>

        {/* Address card */}
        <button className="w-full h-[64px] rounded-[12px] bg-[#f9faf8] px-4 text-left flex items-center justify-between">
          <div className="text-[13px] text-[#363a33] truncate">
            <div className="text-[12px] text-[#70756b] mb-1">Giao đến</div>
            <div className="truncate">Nhà - Lê Đức Thọ, Điện Bàn...</div>
          </div>
          <span className="text-[#a9ada5]">›</span>
        </button>

        {/* Payment method card */}
        <button className="mt-3 w-full h-[64px] rounded-[12px] bg-[#f9faf8] px-4 text-left flex items-center justify-between">
          <div className="text-[13px] text-[#363a33] truncate">
            <div className="text-[12px] text-[#70756b] mb-1">Phương thức thanh toán</div>
            <div className="truncate">Tiền mặt</div>
          </div>
          <span className="text-[#a9ada5]">›</span>
        </button>

        {/* Breakdown */}
        <div className="mt-4 text-[15px] text-[#60655c]">
          <div className="flex items-center justify-between py-2">
            <span>Tổng</span>
            <span className="font-semibold text-[#363a33]">{basePrice.toLocaleString('vi-VN')} ₫</span>
          </div>
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
          <button className="h-[51px] px-6 rounded-[12px] bg-[#f9704b] text-white text-[14.5px]">
            Đặt hàng
          </button>
        </div>
      </div>
    </div>
  );
}


