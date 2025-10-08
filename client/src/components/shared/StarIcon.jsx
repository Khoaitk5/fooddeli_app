import React from 'react';

const StarIcon = ({ width = "9", height = "9", fill = "#868686" }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.48946 7.22222L1.70726 9L2.44496 5.66667L0 3.42222L3.22482 3.13333L4.48946 0L5.7541 3.13333L9 3.42222L6.53396 5.66667L7.27166 9L4.48946 7.22222Z" fill={fill}/>
    </svg>
  );
};

export default StarIcon;