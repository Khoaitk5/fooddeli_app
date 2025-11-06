import React from 'react';

const InputFrame = ({ children, isFocused = false, placeholder }) => {
  const inputStyle = {
    width: "100%",
    border: "none",
    outline: "none",
    fontSize: "1.5rem",
    fontFamily: 'Be Vietnam Pro',
    fontWeight: '400',
    color: "#000000",
    backgroundColor: "transparent",
  };

  const styledChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && child.type === 'input') {
      return React.cloneElement(child, {
        style: { ...inputStyle, ...child.props.style },
      });
    }
    return child;
  });

  return (
    <div style={{
      width: '89.33vw',
      height: '6vh',
      paddingLeft: "1.6rem",
      backgroundColor: '#fff',
      overflow: 'hidden',
      borderRadius: "1.2rem",
      border: isFocused ? '2px solid #54a312' : '1px solid #e8ebe6',
      boxSizing: 'border-box',
      justifyContent: 'flex-start',
      alignItems: 'center',
      display: 'inline-flex'
    }}>
      {placeholder && (
        <div style={{color: '#91958E', fontSize: "1.5rem", fontFamily: 'Be Vietnam Pro', fontWeight: '400', wordWrap: 'break-word'}}>
          {placeholder}
        </div>
      )}
      {styledChildren}
    </div>
  );
};

export default InputFrame;