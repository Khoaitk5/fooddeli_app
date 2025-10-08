import React from 'react';

const ArrowIcon = ({ width = "9", height = "14", fill = "#60635E", stroke = "#60635E", strokeWidth = "0.4" }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.7635 13.1052C8.029 12.7872 7.9855 12.3139 7.6675 12.0492C6.43375 11.0164 3.56875 8.47768 2.587 7.18768C3.58525 5.87593 6.412 3.37393 7.6675 2.32618C7.9855 2.06143 8.029 1.58818 7.7635 1.27018C7.49875 0.951426 7.0255 0.908676 6.70675 1.17418C5.3275 2.32318 2.3575 4.91893 1.30675 6.39718C1.1425 6.63118 1 6.89518 1 7.18768C1 7.48018 1.1425 7.74418 1.30675 7.97743C2.3365 9.42642 5.356 12.0739 6.70675 13.2004L6.7075 13.2012C7.0255 13.4667 7.49875 13.4232 7.7635 13.1052Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export default ArrowIcon;