// Button.jsx
const Button = ({ children, onClick, style, ...props }) => (
  <button
    onClick={onClick}
    style={{
      width: "28.36vw",
      height: "6.4vh",
      padding: 0,
      boxSizing: "border-box",
      background: "#ECF1E8",
      borderRadius: 12,
      border: "none",
      cursor: "pointer",
      ...style,
    }}
    {...props}
  >
    {children}
  </button>
);

export default Button;
