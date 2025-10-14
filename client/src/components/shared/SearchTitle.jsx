const SearchTitle = ({ children, style }) => {
  return (
    <div
      style={{
        marginBottom: '1.5vh',
        ...style
      }}
    >
      <div
        style={{
          color: 'black',
          fontSize: '1.8rem',
          fontFamily: 'Be Vietnam Pro',
          fontWeight: '500',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default SearchTitle;