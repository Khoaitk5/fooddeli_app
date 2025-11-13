import { useNavigate } from "react-router-dom";
import CartIcon from "./CartIcon";
import SearchBarWithSuggestions from "./SearchBarWithSuggestions";

const HeaderSection = ({ isScrolled, cartCount }) => {
  const navigate = useNavigate();

  return (
    <>
      {/* Background gradient */}
      <div
        style={{
          width: "100%",
          height: isScrolled ? "calc(5.125vh + 1.5rem)" : "calc(12vh + 90px)",
          position: "fixed",
          background: isScrolled
            ? "#FE5621"
            : "linear-gradient(180deg, #FE5621 0%, #FF7A50 50%, rgba(255, 255, 255, 0) 100%)",
          top: 0,
          left: 0,
          zIndex: 999,
          pointerEvents: "none",
          transition: "all 0.3s ease",
        }}
      />

      {/* Header content */}
      <div
        style={{
          width: "100%",
          height: isScrolled ? "calc(5.125vh + 1.5rem)" : "12vh",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 4000,
          transition: "all 0.3s ease",
        }}
      >
        {/* Location info */}
        <div
          style={{
            top: "0.625vh",
            left: "5vw",
            position: "absolute",
            fontSize: "1rem",
            fontWeight: 600,
            color: "#fff",
            opacity: isScrolled ? 0 : 1,
            transition: "opacity 0.3s ease",
            pointerEvents: isScrolled ? "none" : "auto",
          }}
        >
          Giao đến
        </div>
        <div
          style={{
            position: "absolute",
            fontSize: "1.4rem",
            color: "#fff",
            marginTop: "2.375vh",
            left: "5vw",
            fontWeight: 700,
            opacity: isScrolled ? 0 : 1,
            transition: "opacity 0.3s ease",
            pointerEvents: isScrolled ? "none" : "auto",
          }}
        >
          Trường Đại Học FPT Đà Nẵng
        </div>

        {/* Cart icon */}
        <div style={{ position: "relative" }}>
          <CartIcon
            style={{
              position: "absolute",
              top: isScrolled ? "calc((5.125vh + 1.5rem - 24px) / 2)" : "1.5vh",
              right: "5vw",
              transition: "all 0.3s ease",
            }}
            onClick={() => navigate("/customer/cart")}
          />
          {cartCount > 0 && (
            <div
              style={{
                position: "absolute",
                top: isScrolled
                  ? "calc((5.125vh + 1.5rem - 24px) / 2 - 0.5rem)"
                  : "0.5vh",
                right: "3vw",
                backgroundColor: "#FF0000",
                color: "white",
                borderRadius: "50%",
                width: "1.5rem",
                height: "1.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.8rem",
                fontWeight: "bold",
                zIndex: 1,
                transition: "all 0.3s ease",
              }}
            >
              {cartCount}
            </div>
          )}
        </div>

        {/* Search Bar */}
        <SearchBarWithSuggestions isScrolled={isScrolled} />
      </div>
    </>
  );
};

export default HeaderSection;