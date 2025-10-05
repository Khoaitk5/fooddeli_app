import React from 'react';

const LineChartMini = ({
  data = [112, 140, 168, 130, 175, 190, 170],
  labels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
  width = '100%',
  height = 280,
  color = '#F9704B'
}) => {
  const viewWidth = 620;
  const viewHeight = 280;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const pad = 28;
  const stepX = (viewWidth - pad * 2) / (data.length - 1);
  const scaleY = (v) => {
    const norm = (v - min) / (max - min || 1);
    return viewHeight - pad - norm * (viewHeight - pad * 2);
  };

  const points = data.map((v, i) => [pad + i * stepX, scaleY(v)]);
  const pathD = points.map((p, i) => (i === 0 ? `M ${p[0]},${p[1]}` : `L ${p[0]},${p[1]}`)).join(' ');

  const yGrid = 4;
  const gridLines = Array.from({ length: yGrid + 1 }, (_, i) => pad + (i * (viewHeight - pad * 2)) / yGrid);

  return (
    <svg viewBox={`0 0 ${viewWidth} ${viewHeight}`} width={width} height={height} style={{ display: 'block' }}>
      {gridLines.map((y, i) => (
        <line key={i} x1={pad} y1={y} x2={viewWidth - pad} y2={y} stroke="#eee" strokeWidth={1} />
      ))}
      <path d={pathD} fill="none" stroke={color} strokeWidth={3} />
      {points.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={3} fill={color} />
      ))}
      {labels.map((t, i) => (
        <text key={t} x={pad + i * stepX} y={viewHeight - 6} fontSize={12} fill="#9aa1a9" textAnchor="middle">{t}</text>
      ))}
    </svg>
  );
};

export default LineChartMini;

