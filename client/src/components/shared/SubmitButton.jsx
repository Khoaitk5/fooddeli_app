import React from 'react';

const buttonStyle = {
  width: "89.3vw",
  height: "6.5vh",
  background: "linear-gradient(180deg, #5ead1d, #54a312)",
  boxShadow: "0px -1px 0px #46890d inset, 0px 1px 0px rgba(255, 255, 255, 0.12) inset",
  color: "white",
  fontSize: "1.5rem",
  fontFamily: "Be Vietnam Pro",
  fontWeight: "700",
  wordWrap: "break-word",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "1.2rem",
  border: "none",
  cursor: "pointer",
  overflow: "hidden",
};

const SubmitButton = ({ children, onClick, style, isValid = true, ...props }) => {
  const finalStyle = {
    ...buttonStyle,
    ...(isValid ? {} : {
      background: "#e8ebe6",
      color: "#b6b8b6",
      boxShadow: "none",
    }),
    ...style,
  };

  return (
    <button
      type="submit"
      onClick={onClick}
      style={finalStyle}
      {...props}
    >
      {children}
    </button>
  );
};

export default SubmitButton;

