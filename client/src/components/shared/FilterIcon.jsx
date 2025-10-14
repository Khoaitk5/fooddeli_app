const FilterIcon = ({ width = "1.4rem", height = "1.2rem", onClick }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 14 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      cursor: onClick ? 'pointer' : 'default'
    }}
    onClick={onClick}
  >
    <path
      d="M1 9.29419H3.94118"
      stroke="black"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.7649 2.82361H9.82373"
      stroke="black"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.4707 9.29419H12.7648"
      stroke="black"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.29412 2.82361H1"
      stroke="black"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.70611 11C4.73149 11 3.94141 10.2099 3.94141 9.23529C3.94141 8.26064 4.73149 7.47058 5.70611 7.47058C6.68076 7.47058 7.47082 8.26064 7.47082 9.23529C7.47082 10.2099 6.68076 11 5.70611 11Z"
      stroke="black"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.05865 4.52941C9.0333 4.52941 9.82336 3.73933 9.82336 2.76471C9.82336 1.79009 9.0333 1 8.05865 1C7.084 1 6.29395 1.79009 6.29395 2.76471C6.29395 3.73933 7.084 4.52941 8.05865 4.52941Z"
      stroke="black"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default FilterIcon;