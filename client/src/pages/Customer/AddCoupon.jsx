import React from 'react';
import { useNavigate } from 'react-router-dom';

const COUPONS = [
  { code: 'FOOD5', description: 'Giảm 5% giá món.' },
  { code: 'FREESHIP100', description: 'Miễn phí giao hàng 100%.' }
];

export default function AddCoupon() {
  const navigate = useNavigate();
  const [selected, setSelected] = React.useState(() => localStorage.getItem('selectedCoupon') || '');
  const [manual, setManual] = React.useState('');

  const save = () => {
    const code = (manual || selected).trim().toUpperCase();
    if (!code) return navigate(-1);
    localStorage.setItem('selectedCoupon', code);
    navigate(-1);
  };

  const addManual = () => {
    const code = manual.trim().toUpperCase();
    if (!code) return;
    localStorage.setItem('selectedCoupon', code);
    navigate(-1);
  };

  const cancel = () => navigate(-1);
  const canAdd = Boolean(manual && manual.trim());

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-[390px] px-5 pt-5 pb-10">
        {/* Header */}
        <div className="mb-4 grid grid-cols-3 items-center">
          <button onClick={cancel} className="justify-self-start text-[15px] text-[#60655c]">Hủy</button>
          <div className="text-center text-[17px] text-[#363a33] font-bold">Thêm mã giảm giá</div>
          <button onClick={save} className="justify-self-end text-[15px] text-[#f9704b]">Lưu</button>
        </div>

        {/* Constrain inner content to 322px like Figma */}
        <div className="mx-auto w-[322px]">
          {/* Manual code */}
          <div className="flex gap-3">
            <input
              className="flex-1 h-[47px] rounded-[12px] border border-[#e8ebe6] px-3 text-[15px] placeholder-[#91958e] outline-none"
              placeholder="Nhập mã giảm giá"
              value={manual}
              onChange={(e) => setManual(e.target.value)}
            />
            <button
              onClick={addManual}
              disabled={!canAdd}
              className={`h-[47px] w-[61px] rounded-[8px] text-[15px] transition-colors ${canAdd ? 'bg-[#f9704b] text-white border border-[#f9704b]' : 'bg-transparent text-[#b6b8b6] border border-[#e8ebe6]'}`}
            >
              Thêm
            </button>
          </div>

          <hr className="mt-4 border-[#e8ebe6]" />

          <div className="mt-5 text-[12px] text-[#70756b]">Chọn một voucher</div>

          <div className="mt-2 space-y-3">
            {COUPONS.map((c) => (
              <div
                key={c.code}
                className={"w-[322px] h-[69px] rounded-[8px] bg-[#f9faf8] px-4 flex items-center"}
              >
                <div className="flex items-center justify-between gap-3 w-full">
                  <div className="min-w-0">
                    <div className="text-[12px] text-[#60655c] tracking-wide uppercase">{c.code}</div>
                    <div className="text-[15px] text-[#363a33] mt-1 truncate">{c.description}</div>
                  </div>
                  <button
                    onClick={() => setSelected(c.code)}
                    aria-label={`Chọn mã ${c.code}`}
                    className={`relative grid place-items-center w-6 h-6 rounded-full flex-shrink-0 ${selected === c.code ? 'border-2 border-[#f9704b]' : 'border border-[#e8ebe6] bg-[#f4f7f2]'}`}
                  >
                    {selected === c.code ? (
                      <span className="block w-3 h-3 rounded-full bg-[#f9704b]"></span>
                    ) : null}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


