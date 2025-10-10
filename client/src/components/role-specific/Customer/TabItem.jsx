import React from "react";

const TabItem = ({ label, isActive, onClick, statusStyle }) => {
  return (
    <div
      style={{
        ...statusStyle,
        position: "relative",
        opacity: isActive ? 1 : 0.7,
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      {label}
      {isActive && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            width: "8.06vw",
            height: "0.5vh",
            background: "white",
          }}
        />
      )}
    </div>
  );
};

export default TabItem;
