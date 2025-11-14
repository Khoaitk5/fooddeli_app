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
          background: isValid ? "linear-gradient(90deg, #FE5621 0%, #FD4E1E 100%)" : "#E8EBE6",
          boxShadow: isValid ? "0px -1px 0px #D43B0A inset" : "none",
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
