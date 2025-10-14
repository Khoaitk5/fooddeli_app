import HistoryIcon from "./HistoryIcon";

const RecentSearchItem = ({ text = "phúc long", onClick }) => {
  return (
    <div
      style={{
        height: "4.125vh",
        background: "#F5F5F5",
        borderRadius: "1.6rem",
        display: "flex",
        alignItems: "center",
        paddingLeft: "2.78vw",
        paddingRight: "2.78vw",
        gap: "2.78vw",
        cursor: onClick ? "pointer" : "default",
        width: "fit-content",
        maxWidth: "90vw",
      }}
      onClick={onClick}
    >
      <HistoryIcon />
      <div
        style={{
          color: "#3B3B3B",
          fontSize: "1.3rem",
          fontFamily: 'Be Vietnam Pro',
          fontWeight: "400",
          wordWrap: "break-word",
        }}
      >
        {text}
      </div>
    </div>
  );
};

export default RecentSearchItem;
