import { useState, useEffect, useRef } from "react";

// CarouselBanner Component
const CarouselBanner = ({ autoScrollInterval = 3000 }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef(null);

  const images = [
    "https://down-zl-vn.img.susercontent.com/vn-11134512-7ras8-md5ue0sn052l3f",
    "https://i.pinimg.com/originals/1a/e3/2a/1ae32a19d958002c7fb2a99c9a53f012.jpg",
    "https://channel.mediacdn.vn/428462621602512896/2023/9/19/photo-1-1695121265877136843326.jpg",
    "https://marketingai.mediacdn.vn/603488451643117568/2024/6/3/image2-1717378852-503-width1920height1080-17174106165981891934676.png",
  ];

  // Auto-scroll carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, autoScrollInterval);
    return () => clearInterval(interval);
  }, [autoScrollInterval]);

  // Scroll carousel when currentSlide changes
  useEffect(() => {
    if (carouselRef.current) {
      const container = carouselRef.current;
      const slideWidth = container.clientWidth;
      container.scrollTo({
        left: currentSlide * slideWidth,
        behavior: "smooth",
      });
    }
  }, [currentSlide]);

  return (
    <div
      style={{
        width: "100%",
        padding: "0 4.17vw",
        marginTop: "1.5rem",
        marginBottom: "1.5rem",
        position: "relative",
      }}
    >
      <div
        ref={carouselRef}
        className="hide-scrollbar"
        style={{
          display: "flex",
          overflowX: "hidden",
          scrollSnapType: "x mandatory",
          borderRadius: "1rem",
          position: "relative",
        }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            style={{
              minWidth: "100%",
              scrollSnapAlign: "start",
              position: "relative",
            }}
          >
            <img
              src={image}
              alt={`Banner ${index + 1}`}
              style={{
                width: "100%",
                height: "180px",
                objectFit: "cover",
                borderRadius: "1rem",
              }}
            />
          </div>
        ))}
      </div>

      {/* Dots Indicator */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "0.5rem",
          marginTop: "0.75rem",
        }}
      >
        {images.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentSlide(index)}
            style={{
              width: currentSlide === index ? "1.5rem" : "0.5rem",
              height: "0.5rem",
              borderRadius: "0.25rem",
              backgroundColor: currentSlide === index ? "#FE5621" : "#ddd",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default CarouselBanner;