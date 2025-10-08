import React from 'react';
import { pxW, pxH } from '../../utils/scale.js';
import '../../styles/customer-responsive.css';

export default function OrderSummary() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-[390px] pb-6">
        {/* Map placeholder and floating cards can be reused visually */}
        <div className={`relative h-[${pxH(360)}] bg-[#f2f2f2]`} />

        {/* Summary card (matches node 264:3227) */}
        <div className="mx-auto -mt-24 w-[346px] rounded-[16px] border border-[#e5eaf0] bg-white p-5 shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-[28px] text-[#1a1a1a] font-semibold">Đang xử lí</div>
              <span className="text-[22px]">🔥</span>
            </div>
            <button className="text-[18px] text-[#3478f6]">Hủy</button>
          </div>
          <div className="mt-2 text-[18px] text-[#505050]">Đang gửi đơn...</div>

          {/* Items */}
          <div className="mt-5">
            <div className="text-[14px] text-[#1a1a1a] font-semibold">Lotteria</div>
            <div className="mt-4 flex items-start justify-between text-[18px] text-[#1a1a1a]">
              <span>Tổng cộng</span>
              <div className="text-right">
                <div className="font-semibold">69.000 ₫</div>
                <div className="text-[14px] text-[#7b7b7b] line-through">75.000 ₫</div>
              </div>
            </div>
            <hr className="my-4 border-[#e5eaf0]" />
            <div className="flex items-start justify-between text-[14px] text-[#1a1a1a]">
              <div className="flex items-center gap-3">
                <span className="font-semibold">1x</span>
                <span>Burger Bò Cơm kim chi</span>
              </div>
              <span className="font-semibold">69.000 ₫</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



