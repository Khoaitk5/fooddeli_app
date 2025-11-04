const BackArrow = ({
  width = "0.9rem",
  height = "1.5rem",
  onClick,
  style = {},
}) => (
  <svg
    viewBox="0 0 9 15"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      width,
      height,
      cursor: onClick ? "pointer" : "default",
      ...style,
    }}
    onClick={onClick}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.29943 14.1946C8.60559 13.8349 8.55543 13.2995 8.18872 13C6.76601 11.8316 3.46219 8.95952 2.33007 7.50014C3.48122 6.01615 6.74093 3.18563 8.18872 2.00031C8.55543 1.70079 8.60559 1.16541 8.29943 0.805651C7.99413 0.445048 7.44839 0.396685 7.08082 0.697046C5.49032 1.99691 2.06542 4.93349 0.853734 6.60584C0.664326 6.87057 0.5 7.16923 0.5 7.50014C0.5 7.83105 0.664326 8.12971 0.853734 8.39359C2.0412 10.0328 5.52318 13.028 7.08082 14.3024L7.08169 14.3032C7.44839 14.6036 7.99413 14.5544 8.29943 14.1946Z"
      fill="currentColor"
      stroke="currentColor"
    />
  </svg>
);

export default BackArrow;
