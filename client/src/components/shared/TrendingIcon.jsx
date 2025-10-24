const TrendingIcon = ({
  width = "1.8rem",
  height = "1rem",
  color = "#54A312",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 18 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.1992 1H16.9992V5.8"
        stroke={color}
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 1L10.2 7.8L6.2 3.8L1 9"
        stroke={color}
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default TrendingIcon;
