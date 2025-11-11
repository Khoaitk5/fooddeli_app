import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

const FloatingAd = () => {
  const navigate = useNavigate();

  const [showFloatingAd, setShowFloatingAd] = useState(false);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  const floatingAds = [
    {
      id: 1,
      image:
        "https://genk.mediacdn.vn/139269124445442048/2022/1/26/photo-1-16431672889691634364385-1643177636421-16431776366211216729886.jpg",
      link: "/customer/deals",
      title: "Giảm 50% cho đơn đầu tiên",
    },
    {
      id: 2,
      image:
        "https://channel.mediacdn.vn/2021/10/2/photo-1-16331505054751565521879.jpg",
      link: "/customer/deals",
      title: "Giảm 50% cho đơn đầu tiên",
    },
    {
      id: 3,
      image:
        "https://genk.mediacdn.vn/139269124445442048/2022/1/13/photo-1-1642059004666976098463-1642064561179-1642064561325723883849.jpg",
      link: "/customer/deals",
      title: "Miễn phí giao hàng",
    },
  ];

  // Show floating ad after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFloatingAd(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Rotate floating ads every 10 seconds
  useEffect(() => {
    if (showFloatingAd) {
      const interval = setInterval(() => {
        setCurrentAdIndex((prev) => (prev + 1) % floatingAds.length);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [showFloatingAd, floatingAds.length]);

  if (!showFloatingAd) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "50%",
        right: "1rem",
        transform: "translateY(50%)",
        zIndex: 9999,
        animation: "slideInRight 0.5s ease-out",
        width: "8.5rem",
        borderRadius: "0.75rem",
        overflow: "hidden",
        backgroundColor: "#fff",
        boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
      }}
    >
      {/* Close Button */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          setShowFloatingAd(false);
        }}
        style={{
          position: "absolute",
          top: "0.3rem",
          right: "0.3rem",
          width: "1.4rem",
          height: "1.4rem",
          borderRadius: "50%",
          backgroundColor: "rgba(254, 86, 33, 0.95)",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 10,
          transition: "all 0.2s ease",
          border: "1.5px solid white",
          boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = "scale(0.9)";
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
        onTouchStart={(e) => {
          e.currentTarget.style.transform = "scale(0.9)";
        }}
        onTouchEnd={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        <X size={11} strokeWidth={3} />
      </div>

      <div
        onClick={() => navigate(floatingAds[currentAdIndex].link)}
        style={{
          cursor: "pointer",
          position: "relative",
        }}
      >
        <img
          src={floatingAds[currentAdIndex].image}
          alt={floatingAds[currentAdIndex].title}
          style={{
            width: "100%",
            height: "auto",
            display: "block",
          }}
        />
      </div>
    </div>
  );
};

export default FloatingAd;