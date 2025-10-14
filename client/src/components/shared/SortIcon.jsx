const SortIcon = ({ width = "1.3rem", height = "1.2rem", onClick }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 13 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      cursor: onClick ? 'pointer' : 'default'
    }}
    onClick={onClick}
  >
    <path
      d="M12.0002 8.33337L9.55577 10.7778L7.11133 8.33337"
      stroke="black"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.55566 10.7778V1"
      stroke="black"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M1 3.44444L3.44444 1L5.88889 3.44444"
      stroke="black"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.44434 1V10.7778"
      stroke="black"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SortIcon;