import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import CartIcon from "./CartIcon";
import SearchBarWithSuggestions from "./SearchBarWithSuggestions";
import AddressSelector from "../role-specific/Customer/AddressSelector";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const HeaderSection = ({ isScrolled, cartCount }) => {
  const navigate = useNavigate();
  const [showAddressSelector, setShowAddressSelector] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(null);

  useEffect(() => {
    fetchCurrentAddress();
  }, []);

  const fetchCurrentAddress = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/addresses/user-addresses`, {
        withCredentials: true,
      });
      if (res.data?.success && res.data.data?.length > 0) {
        // Lấy địa chỉ mặc định hoặc địa chỉ đầu tiên
        const defaultAddr = res.data.data.find(addr => addr.is_primary) || res.data.data[0];
        setCurrentAddress(defaultAddr);
      }
    } catch (err) {
      console.error("Error fetching address:", err);
    }
  };

  const handleSelectAddress = (address) => {
    setCurrentAddress(address);
  };

  const handleAddressClick = () => {
    console.log("🔵 Address clicked, opening modal");
    setShowAddressSelector(true);
  };

  const formatAddress = (address) => {
    if (!address || !address.address_line) return "Trường Đại Học FPT Đà Nẵng";
    const addr = address.address_line;
    return `${addr.detail || ''}, ${addr.ward || ''}, ${addr.province || ''}`.trim();
  };

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
          onClick={handleAddressClick}
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
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            maxWidth: "70vw",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.textDecoration = "underline";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.textDecoration = "none";
          }}
        >
          <span style={{ 
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>
            {formatAddress(currentAddress)}
          </span>
          <span style={{ fontSize: "1.2rem", flexShrink: 0 }}>▼</span>
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

      {/* Address Selector Modal */}
      {showAddressSelector && (
        <AddressSelector
          isOpen={showAddressSelector}
          onClose={() => {
            console.log("🔴 Closing address selector");
            setShowAddressSelector(false);
          }}
          onSelectAddress={(address) => {
            console.log("🟢 Address selected:", address);
            handleSelectAddress(address);
            setShowAddressSelector(false);
          }}
          currentAddress={currentAddress}
        />
      )}
    </>
  );
};

export default HeaderSection;