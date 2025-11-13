const PlusIcon = (props) => {
  return (
    <svg
      width="1.2rem"
      height="1.2rem"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M0.75 5.75H10.75"
        stroke="#FE5621"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M5.75 0.75V10.75"
        stroke="#FE5621"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default PlusIcon;
