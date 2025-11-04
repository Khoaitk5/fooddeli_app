// File: CardIcon.jsx

import React from "react";

const CardIcon = ({ 
  width = "2rem", 
  height = "2rem", 
  ...restProps 
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...restProps} // Truyền các props khác (như style) vào
  >
    <path
      d="M14.75 9.75V13.75C14.75 14.0152 14.6446 14.2696 14.4571 14.4571C14.2696 14.6446 14.0152 14.75 13.75 14.75H9.75"
      stroke="black"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14.75 0.75H16.75C17.2804 0.75 17.7891 0.960714 18.1642 1.33579C18.5393 1.71086 18.75 2.21957 18.75 2.75V4.75"
      stroke="black"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14.75 5.75V4.75"
      stroke="black"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.75 14.75V16.75C18.75 17.2804 18.5393 17.7891 18.1642 18.1642C17.7891 18.5393 17.2804 18.75 16.75 18.75H14.75"
      stroke="black"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M0.75 4.75V2.75C0.75 2.21957 0.960714 1.71086 1.33579 1.33579C1.71086 0.960714 2.21957 0.75 2.75 0.75H4.75"
      stroke="black"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.75 14.75H4.76"
      stroke="black"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.75 18.75H2.75C2.21957 18.75 1.71086 18.5393 1.33579 18.1642C0.960714 17.7891 0.75 17.2804 0.75 16.75V14.75"
      stroke="black"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.75 4.75H5.75C5.19772 4.75 4.75 5.19772 4.75 5.75V8.75C4.75 9.30228 5.19772 9.75 5.75 9.75H8.75C9.30228 9.75 9.75 9.30228 9.75 8.75V5.75C9.75 5.19772 9.30228 4.75 8.75 4.75Z"
      stroke="black"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default CardIcon;