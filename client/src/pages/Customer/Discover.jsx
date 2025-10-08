import React, { useMemo, useState } from 'react';
import '../../styles/customer-responsive.css';

// Figma assets from node 14:342
const imgCard1 = 'http://localhost:3845/assets/19f7681c284f44c0003cd59a3e52f8e817eed67d.png';
const imgPizza = 'http://localhost:3845/assets/5765ae42c5bf22e7d503446b957d3db9aa1bba69.png';
const imgPizzaAlt = 'http://localhost:3845/assets/d65abefff2a76f8b95d3a8521e9c8826d11a05da.png';
const imgNoodles = 'http://localhost:3845/assets/8633db0b8662916c08a72569c8d87ce0837fa6eb.png';
const bannerImg = 'http://localhost:3845/assets/7336c3d18ba5137a5f41dbe1d48119b4bd741d43.png';

const categories = [
  { id: 1, name: 'Thức ăn nhanh', img: 'http://localhost:3845/assets/e3bff7ba8cdfa33e95e92de839c68e14df1340e2.png' },
  { id: 2, name: 'Cơm', img: 'http://localhost:3845/assets/3aa505b2fc94da6cf491d3c0631033cc20e99452.png' },
  { id: 3, name: 'Món Quốc Tế', img: 'http://localhost:3845/assets/0b81bf833edac0a164c13e974a3f79ec93eb33af.png' },
  { id: 4, name: 'Bún - Phở - Cháo', img: 'http://localhost:3845/assets/ddaa5dfa9dd02713ff1d31b96d62d5287b9c6fe1.png' },
  { id: 5, name: 'Cà Phê - Trà Sữa - Sinh Tố', img: 'http://localhost:3845/assets/a4b78dfbae32ced0c3b70fe4f347f9bb769c9399.png' },
];

const cards = [
  { id: 1, title: 'Taco', desc: 'Bánh Taco mềm', price: '52.000 đ', rating: '4.5', reviews: '(25+)', img: imgCard1 },
  { id: 2, title: 'Pizza Phô Mai', desc: 'Bữa ăn Ý ngon miệng', price: '162.000 đ', rating: '4.5', reviews: '(25+)', img: imgPizza },
  { id: 3, title: 'Gourmet sushi', desc: 'Tasty japanese meal', price: 'LKR 2600.00', rating: '4.5', reviews: '(25+)', img: imgPizzaAlt },
  { id: 4, title: 'Salmon Salad', desc: 'Baked salmon fish', price: 'LKR 900.00', rating: '4.5', reviews: '(25+)', img: imgNoodles },
];

function PriceBadge({ text }) {
  return (
    <div className="absolute left-2 top-2 rounded-[12px] bg-white/95 border border-white/30 px-2 py-1 text-[11px] font-semibold text-[#111719]">
      {text}
    </div>
  );
}

function RatingPill({ rating, reviews }) {
  return (
    <div className="absolute left-4 top-[135px] shadow-[0_5px_20px_rgba(254,114,76,0.2)] bg-white rounded-full px-1.5 py-1 flex items-center gap-1 text-[10px]">
      <span className="font-semibold text-black">{rating}</span>
      <span className="text-[8px] text-[#9796a1]">{reviews}</span>
    </div>
  );
}

function FoodCard({ item }) {
  return (
    <div className="relative w-[140px] sm:w-[156px] h-[236px] shrink-0">
      <div className="absolute left-0 top-0 w-[154.43px] h-[235.893px] rounded-[15px] bg-white shadow-[0_4px_9.4px_rgba(0,0,0,0.08)]"></div>
      <div className="absolute left-0 top-0 h-[147.36px] w-[154.43px] overflow-hidden rounded-t-[15px]">
        <img src={item.img} alt="food" className="w-full h-full object-cover" />
      </div>
      <PriceBadge text={item.price} />
      <RatingPill rating={item.rating} reviews={item.reviews} />
      <div className="absolute left-3 right-3 top-[170px]">
        <div className="text-[14px] font-semibold text-black truncate">{item.title}</div>
        <div className="text-[11px] text-[#9796a1] truncate mt-0.5">{item.desc}</div>
      </div>
    </div>
  );
}

export default function Discover() {
  const [selected, setSelected] = useState(null);
  const cartCount = useMemo(() => 2, []);

  return (
    <div className="bg-white w-full min-h-[calc(100vh-56px)]">
      <div className="px-4 pb-20 pt-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[12px] uppercase text-[#fc6e2a] font-bold">Giao đến</div>
            <div className="text-[14px] text-[#676767]">Nhà</div>
          </div>
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-[#f5f5f5] grid place-items-center"></div>
            <div className="absolute -top-1 -right-1 bg-[#fe724c] text-white w-6 h-6 rounded-full grid place-items-center text-[12px]">{cartCount}</div>
          </div>
        </div>

        <div className="mt-1">
          <p className="text-[15.4px] text-[#1e1d1d]"><span>Hey A, </span><span className="font-bold">Chào buổi sáng!</span></p>
        </div>

        <div className="mt-3">
          <div className="h-[43px] rounded-full bg-[#f6f6f6] flex items-center px-4 text-[#ef5126] text-[13px]">Bạn đang thèm gì nào?</div>
        </div>

        <div className="mt-4 flex gap-4 overflow-x-auto no-scrollbar pb-1">
          {categories.map((c) => (
            <button key={c.id} onClick={() => setSelected(c.id === selected ? null : c.id)} className="flex flex-col items-center min-w-[57px]">
              <img src={c.img} alt={c.name} className="w-[57px] h-[57px] rounded-[12px] object-cover" />
              <div className="mt-2 text-[10px] text-[#565968] text-center leading-3 max-w-[83px]">{c.name}</div>
            </button>
          ))}
        </div>

        <div className="mt-4 w-full h-[140px] sm:h-[184px] rounded-[13px] overflow-hidden">
          <img src={bannerImg} alt="promo" className="w-full h-full object-cover" />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-[#3b3230] text-[15px] font-bold">Top Picks</div>
          <div className="text-[#95989f] text-[11px]">View All {'>'}</div>
        </div>

        <div className="mt-3 flex gap-[15px] overflow-x-auto no-scrollbar">
          {cards.map((it) => (
            <FoodCard key={it.id} item={it} />
          ))}
        </div>
      </div>
    </div>
  );
}
