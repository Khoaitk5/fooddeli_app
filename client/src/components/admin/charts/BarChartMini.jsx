import React from 'react';

const BarChartMini = ({
  data = [14, 18, 22, 19, 25, 28],
  labels = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
  width = '100%',
  height = 280,
  color = '#F9704B'
}) => {
  const max = Math.max(...data, 1);
  const viewWidth = 620;
  const viewHeight = 280;
  const pad = 28;
  const barGap = 16;
  const innerWidth = viewWidth - pad * 2;
  const barWidth = (innerWidth - (data.length - 1) * barGap) / data.length;

  const scaleY = (v) => pad + (1 - v / max) * (viewHeight - pad * 2);

  const yGrid = 4;
  const gridLines = Array.from({ length: yGrid + 1 }, (_, i) => pad + (i * (viewHeight - pad * 2)) / yGrid);

  return (
    <svg viewBox={`0 0 ${viewWidth} ${viewHeight}`} width={width} height={height} style={{ display: 'block' }}>
      {gridLines.map((y, i) => (
        <line key={i} x1={pad} y1={y} x2={viewWidth - pad} y2={y} stroke="#eee" strokeWidth={1} />
      ))}
      {data.map((v, i) => {
        const x = pad + i * (barWidth + barGap);
        const y = scaleY(v);
        const h = viewHeight - pad - y;
        return <rect key={i} x={x} y={y} width={barWidth} height={h} rx={6} fill={color} />;
      })}
      {labels.map((t, i) => {
        const x = pad + i * (barWidth + barGap) + barWidth / 2;
        return (
          <text key={t} x={x} y={viewHeight - 6} fontSize={12} fill="#9aa1a9" textAnchor="middle">{t}</text>
        );
      })}
    </svg>
  );
};

export default BarChartMini;

