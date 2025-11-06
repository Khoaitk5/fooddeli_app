const SubmitButton = ({
  children,
  onClick,
  style,
  isValid = true,
  ...props
}) => {
  return (
    <div
      onClick={isValid ? onClick : undefined}
      style={{
        position: "relative",
        display: "inline-block",
        ...style,
      }}
      {...props}
    >
      <div
        style={{
          width: "89.33vw",
          height: "6.4vh",
          background: isValid ? "linear-gradient(90deg, #5EAD1D 0%, #54A312 100%)" : "#E8EBE6",
          boxShadow: isValid ? "0px -1px 0px #46890D inset" : "none",
          borderRadius: "1.2rem",
        }}
      />
      <div
        style={{
          color: isValid ? "white" : "#B6B8B6",
          fontSize: "1.5rem",
          fontWeight: "700",
          whiteSpace: "nowrap",
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default SubmitButton;
