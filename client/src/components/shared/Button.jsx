// Button.jsx
const Button = ({ children, onClick, style, ...props }) => (
  <button
    onClick={onClick}
    style={{
      width: 267,
      height: 43,
      padding: 0,
      boxSizing: 'border-box',
      background: 'white',
      borderRadius: 12,
      outline: '0.80px #D0D1D3 solid',
      border: 'none',
      cursor: 'pointer',
      ...style
    }}
    {...props}
  >
    {children}
  </button>
);

export default Button;
