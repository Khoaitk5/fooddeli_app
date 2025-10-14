const TagIcon = ({ width = "1.4rem", height = "1.4rem", onClick }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      cursor: onClick ? 'pointer' : 'default'
    }}
    onClick={onClick}
  >
    <path
      d="M12.6483 7.35315C12.8734 7.1281 12.9999 6.82285 13 6.50454V2.20029C13 1.88195 12.8735 1.57666 12.6484 1.35156C12.4233 1.12646 12.118 1 11.7997 1H7.49546C7.17715 1.00007 6.8719 1.12657 6.64685 1.35169L1.42318 6.57536C1.15213 6.84813 1 7.21706 1 7.60161C1 7.98615 1.15213 8.35508 1.42318 8.62785L5.37215 12.5768C5.64492 12.8479 6.01385 13 6.39839 13C6.78294 13 7.15187 12.8479 7.42464 12.5768L12.6483 7.35315Z"
      stroke="black"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.39888 4.30081C9.39888 4.46653 9.53322 4.60088 9.69895 4.60088C9.86468 4.60088 9.99902 4.46653 9.99902 4.30081C9.99902 4.13508 9.86468 4.00073 9.69895 4.00073C9.53322 4.00073 9.39888 4.13508 9.39888 4.30081Z"
      fill="black"
      stroke="black"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default TagIcon;