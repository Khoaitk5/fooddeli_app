import React from 'react';

const ClearIcon = ({ width = '1.6rem', height = '1.6rem', onClick }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        cursor: onClick ? 'pointer' : 'default'
      }}
      onClick={onClick}
    >
      <path d="M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15Z" fill="#646464" stroke="#646464" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10.0994 5.90002L5.89941 10.1" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5.89941 5.90002L10.0994 10.1" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

export default ClearIcon;