import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import HomeIcon from "./HomeIcon";
import DiscoverIcon from "./DiscoverIcon";
import OrderIcon from "./OrderIcon";
import NotificationIcon from "./NotificationIcon";
import ProfileIcon from "./ProfileIcon";
import NavbarItem from "./NavbarItem";
import { pxW, pxH } from "../../utils/scale.js";

const Navbar = ({ isProfilePage = false }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("Navbar location:", location.pathname);
  }, [location.pathname]);

  const handleNavigation = (path) => {
    if (!path || typeof path !== "string" || path.trim() === "") {
      console.error("❌ [Navbar] Invalid path:", path);
      return;
    }
    console.log("✅ [Navbar] Navigating to:", path);
    try {
      navigate(path);
    } catch (error) {
      console.error("❌ [Navbar] Navigation error:", error);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        width: "100%",
        minHeight: pxH(60),
        height: "auto",
        background: "white",
        boxShadow: "0px -4px 24px rgba(63, 76, 95, 0.12)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        padding: "8px 20px",
        zIndex: 10,
      }}
    >
      <NavbarItem
        icon={HomeIcon}
        label="Trang chủ"
        isActive={location.pathname === "/customer/home"}
        onClick={() => handleNavigation("/customer/home")}
      />
      <NavbarItem
        icon={DiscoverIcon}
        label="Khám phá"
        isActive={location.pathname === "/customer/discover"}
        onClick={() => handleNavigation("/customer/discover")}
      />
      <NavbarItem
        icon={OrderIcon}
        label="Đơn hàng"
        isActive={location.pathname === "/customer/orders"}
        onClick={() => handleNavigation("/customer/orders")}
      />
      <NavbarItem
        icon={NotificationIcon}
        label="Thông báo"
        isActive={location.pathname === "/customer/notifications"}
        onClick={() => handleNavigation("/customer/notifications")}
      />
      <NavbarItem
        icon={ProfileIcon}
        label="Hồ sơ"
        isActive={isProfilePage || location.pathname.endsWith("/profile")}
        onClick={() => handleNavigation("/customer/profile")}
      />
    </div>
  );
};

export default Navbar;
