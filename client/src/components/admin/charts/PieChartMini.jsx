import React from 'react';

const PieChartMini = ({ data = [84, 6, 10], colors = ['#F9704B', '#FFB199', '#FFD6C9'], width = '100%', height = 260 }) => {
  const viewWidth = 260;
  const viewHeight = 260;
  const cx = viewWidth / 2;
  const cy = viewHeight / 2;
  const r = 100;
  const total = data.reduce((a, b) => a + b, 0) || 1;
  let startAngle = -Math.PI / 2;

  const toXY = (angle) => [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];

  const slices = data.map((value, i) => {
    const angle = (value / total) * Math.PI * 2;
    const endAngle = startAngle + angle;
    const [x1, y1] = toXY(startAngle);
    const [x2, y2] = toXY(endAngle);
    const largeArc = angle > Math.PI ? 1 : 0;
    const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    startAngle = endAngle;
    return <path key={i} d={d} fill={colors[i % colors.length]} />;
  });

  return (
    <svg viewBox={`0 0 ${viewWidth} ${viewHeight}`} width={width} height={height} style={{ display: 'block' }}>
      {slices}
    </svg>
  );
};

export default PieChartMini;

