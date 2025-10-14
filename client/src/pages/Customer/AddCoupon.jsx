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
          <div
            onClick={cancel}
            style={{
              position: 'absolute',
              left: '5.28vw',
              top: '6.625vh',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'var(--Colors-Typography-400, #60655C)',
              fontSize: '1.5rem',
              fontFamily: 'Be Vietnam Pro',
              fontWeight: '700',
              wordWrap: 'break-word',
              cursor: 'pointer'
            }}
          >
            Hủy
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
            Thêm mã giảm giá
          </div>
          <div
            onClick={save}
            style={{
              position: 'absolute',
              top: '6.625vh',
              right: '5.28vw',
              textAlign: 'right',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: '#F9704B',
              fontSize: '1.5rem',
              fontFamily: 'Be Vietnam Pro',
              fontWeight: '700',
              wordWrap: 'break-word',
              cursor: 'pointer'
            }}
          >
            Lưu
          </div>
        </div>

        {/* Constrain inner content to 322px like Figma */}
        <div className="mx-auto w-[322px]">
          {/* Manual code */}
          <div className="flex" style={{position: 'absolute', top: '12.375vh', justifyContent: 'flex-end', gap: '2.5vw'}}>
            <div style={{position: 'relative'}}>
              <input
                style={{
                  width: '70vw',
                  height: '5.875vh',
                  background: 'white',
                  borderRadius: 12,
                  border: '1px #E8EBE6 solid',
                  paddingLeft: '4.17vw',
                  paddingRight: '1vw',
                  fontSize: '1.5rem',
                  color: '#363A33',
                  outline: 'none',
                  fontWeight: '400',
                  fontFamily: 'Be Vietnam Pro'
                }}
                value={manual}
                onChange={(e) => setManual(e.target.value)}
              />
              {!manual && (
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '4.17vw',
                    transform: 'translateY(-50%)',
                    justifyContent: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    color: 'var(--Colors-Typography-200, #91958E)',
                    fontSize: '1.5rem',
                    fontFamily: 'Be Vietnam Pro',
                    fontWeight: '400',
                    wordWrap: 'break-word',
                    pointerEvents: 'none'
                  }}
                >
                  Nhập mã giảm giá
                </div>
              )}
            </div>
            <div
              onClick={canAdd ? addManual : undefined}
              style={{
                width: '16.94vw',
                height: '5.875vh',
                background: canAdd ? '#F9704B' : '#E8EBE6',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: canAdd ? 'white' : '#B6B8B6',
                fontSize: '1.5rem',
                fontFamily: 'Be Vietnam Pro',
                fontWeight: '700',
                cursor: canAdd ? 'pointer' : 'not-allowed',
                marginRight: '5.28vw'
              }}
            >
              Thêm
            </div>
          </div>

          <div style={{position: 'absolute', top: '21.125vh'}}>
            <div style={{width: '89.44vw', outline: '1px var(--Colors-Grey-200, #E8EBE6) solid', outlineOffset: '-0.50px'}}></div>

          <div style={{position: 'absolute', top: '2.875vh', left: '7.5vw', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'var(--Colors-Typography-300, #70756B)', fontSize: '1.2rem', fontFamily: 'Be Vietnam Pro', fontWeight: '600', wordWrap: 'break-word', whiteSpace: 'nowrap', zIndex: 10}}>Chọn một voucher</div>

            <div style={{position: 'absolute', top: '6.25vh', display: 'flex', flexDirection: 'column', gap: '1.875vh'}}>
              {COUPONS.map((c) => (
                <div
                  key={c.code}
                  style={{
                    width: '89.44vw',
                    height: '8.625vh',
                    background: '#F9FAF8',
                    borderRadius: 8,
                    paddingLeft: '16px',
                    paddingRight: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative'
                  }}
                >
                  <div className="flex items-center justify-between gap-3 w-full">
                    <div className="min-w-0">
                      <div style={{position: 'absolute', top: '2vh', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'var(--Colors-Typography-400, #60655C)', fontSize: '1.2rem', fontFamily: 'Be Vietnam Pro', fontWeight: '400', wordWrap: 'break-word'}}>{c.code}</div>
                      <div style={{position: 'absolute', top: '4.125vh', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'var(--Colors-Typography-500, #363A33)', fontSize: '1.5rem', fontFamily: 'Be Vietnam Pro', fontWeight: '400', wordWrap: 'break-word'}}>{c.description}</div>
                    </div>
                    <div
                      onClick={() => setSelected(selected === c.code ? '' : c.code)}
                      aria-label={`Chọn mã ${c.code}`}
                      data-selected={selected === c.code ? "True" : "False"}
                      data-type="Default"
                      style={{
                        width: '6.67vw',
                        height: '3vh',
                        position: 'relative',
                        background: 'var(--Colors-Grey-100, #F4F7F2)',
                        borderRadius: 24,
                        border: '1px var(--Colors-Grey-200, #E8EBE6) solid',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        outline: selected === c.code ? '2px #F9704B solid' : 'none',
                        outlineOffset: selected === c.code ? '-2px' : '0'
                      }}
                    >
                      {selected === c.code ? (
                        <div style={{
                          width: '3.33vw',
                          height: '1.5vh',
                          background: '#F9704B',
                          borderRadius: 9999
                        }} />
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


