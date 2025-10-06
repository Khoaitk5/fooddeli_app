                                            import React from 'react';
import { useNavigate } from 'react-router-dom';

const MAP_PLACEHOLDER = 'data:image/svg+xml;utf8,\
<svg xmlns="http://www.w3.org/2000/svg" width="428" height="300">\
  <rect width="100%" height="100%" fill="%23f2f2f2"/>\
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23bdbdbd" font-size="16">Map</text>\
</svg>';

export default function OrderTracking() {
  useNavigate();

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-[390px] pb-6">
        {/* Map area */}
        <div className="relative h-[360px] w-full overflow-hidden bg-[#f2f2f2]">
          <img src={MAP_PLACEHOLDER} alt="map" className="absolute inset-0 w-full h-full object-cover" />
          {/* Location floating card */}
          <div className="absolute left-1/2 top-6 w-[346px] -translate-x-1/2 rounded-[16px] bg-white border border-[#e5eaf0] p-4 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
            <div className="flex items-center gap-3 text-[18px] text-[#1a1a1a]">
              <span className="text-[#49a2cb]">•</span>
              <span className="truncate">Lotte Mart, 06 Nại Nam,....</span>
            </div>
            <div className="mt-2 flex items-center gap-3 text-[18px] text-[#1a1a1a]">
              <span className="text-[#ed6c66]">•</span>
              <span className="truncate">Lê Đức Thọ, Điện Bàn Đông</span>
            </div>
          </div>
          {/* Map pin */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-[16px] h-[16px] bg-[#02b150] rounded-full border-4 border-white shadow-[0_4px_10px_rgba(0,0,0,0.12)]" />
          </div>
        </div>

        {/* Processing card */}
        <div className="mx-auto mt-4 w-[346px] rounded-[16px] border border-[#e5eaf0] bg-white p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-[28px] text-[#1a1a1a] font-semibold">Đang xử lí</div>
              <span className="text-[22px]">🔥</span>
            </div>
            <button className="text-[18px] text-[#3478f6]">Hủy</button>
          </div>
          <div className="mt-2 text-[18px] text-[#505050]">Đang gửi đơn...</div>

          {/* Progress icons (grab -> cook -> bike -> house) */}
          <div className="mt-5 grid grid-cols-4 items-center gap-6">
            <div className="flex items-center gap-3 col-span-4">
              <div className="text-[22px] text-[#02b150]">G</div>
              <div className="flex-1 h-[6px] rounded-full bg-[#e6f3ea]" />
              <div className="text-[22px] text-[#02b150]">🍳</div>
              <div className="flex-1 h-[6px] rounded-full bg-[#e6f3ea]" />
              <div className="text-[22px] text-[#02b150]">🏍️</div>
              <div className="flex-1 h-[6px] rounded-full bg-[#e6f3ea]" />
              <div className="text-[22px] opacity-50">🏠</div>
            </div>
          </div>
        </div>

        {/* Driver/summary card */}
        <div className="mx-auto mt-4 w-[346px] rounded-[16px] border border-[#e5eaf0] bg-white p-5">
          <div className="flex items-center gap-3">
            {/* Avatar theo node 264:2750 (Foto Restoran) */}
            <div className="relative shrink-0 rounded-full overflow-hidden w-[48px] h-[48px]">
              <div className="absolute top-0 left-[-12px] h-[48px] w-[70px]">
                <img src="https://www.figma.com/api/mcp/asset/d0edd5bd-f470-4754-ad90-8b43d82f6d95" alt="store" className="absolute top-0 left-[15.71%] h-full w-[68.57%] max-w-none" />
              </div>
            </div>
            <div className="text-[18px] text-[#1a1a1a] font-semibold flex-1">Lotteria</div>
          </div>
          <div className="mt-5 flex items-start justify-between text-[18px] text-[#1a1a1a]">
            <span>Tổng cộng</span>
            <div className="text-right">
              <div className="font-semibold">69.000 ₫</div>
              <div className="text-[14px] text-[#7b7b7b] line-through">75.000 ₫</div>
            </div>
          </div>
          <div className="mt-4 flex items-start justify-between text-[18px] text-[#1a1a1a]">
            <span>Phương thức thanh toán</span>
            <div className="font-semibold">69.000 ₫</div>
          </div>
          <hr className="my-5 border-[#e5eaf0]" />
          <div className="flex items-center justify-between">
            <a href="/customer/order-summary" className="text-[18px] text-[#3478f6]">Xem tóm tắt đơn hàng</a>
            <div className="w-6 h-6 rounded-full bg-[#e5eaf0] grid place-items-center rotate-180">
              <span className="block w-3 h-0.5 bg-[#1a1a1a]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


