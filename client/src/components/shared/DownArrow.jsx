const DownArrow = ({ width = "1.1rem", height = "0.7rem", onClick }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 11 7"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      cursor: onClick ? 'pointer' : 'default'
    }}
    onClick={onClick}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.19631 1.12536C1.42758 0.934004 1.77176 0.965356 1.9643 1.19455C2.71539 2.08375 4.56174 4.14863 5.49991 4.8562C6.4539 4.13674 8.27352 2.09942 9.03552 1.19455C9.22806 0.965356 9.57224 0.934004 9.80351 1.12536C10.0353 1.31617 10.0664 1.65725 9.87333 1.88699C9.0377 2.88105 7.1499 5.02161 6.07482 5.77892C5.90463 5.8973 5.71264 6 5.49991 6C5.28719 6 5.09519 5.8973 4.92555 5.77892C3.87174 5.03675 1.94631 2.86051 1.12704 1.88699L1.1265 1.88645C0.933406 1.65725 0.965042 1.31617 1.19631 1.12536Z"
      fill="black"
      stroke="black"
      strokeWidth="0.4"
    />
  </svg>
);

export default DownArrow;