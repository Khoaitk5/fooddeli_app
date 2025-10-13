import React from 'react';

const HistoryIcon = ({ width = '1.4rem', height = '1.4rem', color = '#686868' }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M1 7C1 8.18669 1.35189 9.34672 2.01118 10.3334C2.67047 11.3201 3.60754 12.0891 4.7039 12.5433C5.80025 12.9974 7.00665 13.1162 8.17054 12.8847C9.33443 12.6532 10.4035 12.0818 11.2426 11.2426C12.0818 10.4035 12.6532 9.33443 12.8847 8.17054C13.1162 7.00665 12.9974 5.80025 12.5433 4.7039C12.0891 3.60754 11.3201 2.67047 10.3334 2.01118C9.34672 1.35189 8.18669 1 7 1C5.32263 1.00631 3.71265 1.66082 2.50667 2.82667L1 4.33333" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M1 1V4.33333H4.33333" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 3.66663V6.99996L9.66667 8.33329" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

export default HistoryIcon;