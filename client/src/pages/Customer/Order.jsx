import React, { useState } from 'react';
import '../../styles/customer-responsive.css';

const imgRectangle1994 = 'https://www.figma.com/api/mcp/asset/ac41a016-eaac-4e58-a801-bfecce5f5f2f';
const FALLBACK_IMG = 'data:image/svg+xml;utf8,\
<svg xmlns="http://www.w3.org/2000/svg" width="130" height="130" viewBox="0 0 130 130">\
  <rect width="100%" height="100%" rx="8" fill="%23f4f4f5"/>\
  <g fill="%23c0c4d0">\
    <circle cx="65" cy="55" r="18"/>\
    <rect x="34" y="82" width="62" height="10" rx="5"/>\
  </g>\
</svg>';

function TabSwitch({ active, onChange }) {
  return (
    <div className="mt-4 bg-[#f4f7f2] rounded-[8px] h-[49px] flex p-1">
      <button
        onClick={() => onChange('coming')}
        className={
          active === 'coming'
            ? 'relative flex-1 bg-white rounded-[6px] text-[14px] text-[#363a33] font-semibold leading-none shadow-[0_1px_0_rgba(0,0,0,0.02)]'
            : 'relative flex-1 text-[14px] text-[#91958e] leading-none'
        }
      >
        Đang đến
        {active === 'coming' && (
          <span className="absolute right-[10px] top-[8px] w-[7.68px] h-[7.68px] bg-[#e25839] rounded-full"></span>
        )}
      </button>
      <button
        onClick={() => onChange('delivered')}
        className={
          active === 'delivered'
            ? 'flex-1 bg-white rounded-[6px] text-[14px] text-[#363a33] font-semibold leading-none shadow-[0_1px_0_rgba(0,0,0,0.02)]'
            : 'flex-1 text-[14px] text-[#91958e] leading-none'
        }
      >
        Đã giao
      </button>
    </div>
  );
}

import { useNavigate } from 'react-router-dom';

function OrderCard() {
  const navigate = useNavigate();
  return (
    <div className="mt-4">
      <div className="flex items-center gap-3">
        <img
          src={imgRectangle1994}
          alt="thumb"
          className="w-[65px] h-[65px] rounded-[8px] object-cover bg-[#f4f4f5]"
          loading="lazy"
          onError={(e) => { e.currentTarget.src = FALLBACK_IMG; e.currentTarget.onerror = null; }}
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="text-[#363a33] text-[15px] font-[800]">Lotteria</div>
            <div className="text-[13.5px] text-[#6b6e82] underline">#162432</div>
          </div>
          <div className="mt-1 flex items-center gap-3 text-[12px] text-[#363a33]">
            <span className="font-semibold">69.000 ₫</span>
            <span className="h-[16px] w-px bg-[#e8ebe6]"></span>
            <span className="text-[#6b6e82]">1 min</span>
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <button onClick={() => navigate('/customer/order-tracking')} className="flex-1 h-10 rounded-[8px] border border-[#e8ebe6] text-[14.5px] text-[#363a33] bg-white">Theo dõi đơn hàng</button>
        <button className="w-10 h-10 rounded-[8px] border border-[#e8ebe6] grid place-items-center text-[#6b6e82]">⋯</button>
      </div>
    </div>
  );
}

function DeliveredCard() {
  return (
    <div className="mt-4">
      <div className="flex items-center gap-3">
        <img
          src={imgRectangle1994}
          alt="thumb"
          className="w-[65px] h-[65px] rounded-[8px] object-cover bg-[#f4f4f5]"
          loading="lazy"
          onError={(e) => { e.currentTarget.src = FALLBACK_IMG; e.currentTarget.onerror = null; }}
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="text-[#363a33] text-[15px] font-[800]">Lotteria</div>
            <div className="text-[13.5px] text-[#6b6e82] underline">#162432</div>
          </div>
          <div className="mt-1 flex items-center justify-between text-[12px]">
            <div className="flex items-center gap-3 text-[#6b6e82]">
              <span className="text-[#363a33] font-semibold">69.000 ₫</span>
              <span className="h-[16px] w-px bg-[#e8ebe6]"></span>
              <span>03/10/2025, 12:30</span>
            </div>
            <span className="text-[#6b6e82]">1 món</span>
          </div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <button className="h-10 rounded-[8px] border border-[#e8ebe6] text-[14.5px] text-[#363a33] bg-white">Đặt lại</button>
        <button className="h-10 rounded-[8px] border border-[#e8ebe6] text-[14.5px] text-[#363a33] bg-white">Đánh giá</button>
      </div>
    </div>
  );
}

export default function Order() {
  const [activeTab, setActiveTab] = useState('coming');

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-[390px] px-5 pb-24 pt-5">
        <div className="mb-2 text-center text-[16.3px] text-[#363a33] font-bold">Đơn hàng của tôi</div>
        <TabSwitch active={activeTab} onChange={setActiveTab} />
        {activeTab === 'coming' ? <OrderCard /> : <DeliveredCard />}
      </div>
    </div>
  );
}


