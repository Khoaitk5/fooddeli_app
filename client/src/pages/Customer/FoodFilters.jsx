import React, { useState, useEffect } from "react";
import CloseIcon from "../../components/shared/CloseIcon";
import LikeIcon from "../../components/shared/LikeIcon";
import StarIcon2 from "../../components/shared/StarIcon2";
import MotorIcon from "../../components/shared/MotorIcon";
import ClockIcon from "../../components/shared/ClockIcon";
import TagIcon from "../../components/shared/TagIcon";
import BadgeIcon2 from "../../components/shared/BadgeIcon2";
import LocationIcon from "../../components/shared/LocationIcon";

const FoodFilters = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedMultiple, setSelectedMultiple] = useState([]);
  const [selectedRadio2, setSelectedRadio2] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const filters = [
    {
      icon: <LikeIcon />,
      text: "Được đề xuất",
    },
    {
      icon: <StarIcon2 />,
      text: "Đánh giá",
    },
    {
      icon: <MotorIcon />,
      text: "Phí giao hàng",
    },
    {
      icon: <ClockIcon />,
      text: "Thời gian giao hàng",
    },
  ];

  const multipleChoiceFilters = [
    {
      icon: <TagIcon />,
      text: "Khuyến mãi",
    },
    {
      icon: <BadgeIcon2 />,
      text: "Bán chạy",
    },
    {
      icon: <LocationIcon />,
      text: "Gần đây",
    },
  ];

  const radio2Filters = [
    {
      text: "Tất",
    },
    {
      text: "Thấp hơn 15.000₫",
    },
    {
      text: "Thấp hơn 20.000₫",
    },
    {
      text: "Thấp hơn 25.000₫",
    },
  ];

  const toggleMultiple = (index) => {
    setSelectedMultiple((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div style={{ overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: "2.75vh",
          left: "7.5vw",
        }}
        onClick={() => window.location.href = '/customer/search-results'}
      >
        <CloseIcon />
      </div>
      <div
        style={{
          position: "absolute",
          top: "9.75vh",
          left: "4.17vw",
          justifyContent: "center",
          display: "flex",
          flexDirection: "column",
          color: "black",
          fontSize: "1.7rem",
          fontWeight: "500",
          wordWrap: "break-word",
        }}
      >
        Lọc theo
      </div>

      {filters.map((filter, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            top: `${15 + index * 4.625}vh`,
          }}
        >
          <div
            style={{
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "0.25vh",
                left: "6.94vw",
              }}
            >
              {filter.icon}
            </div>

            <div
              style={{
                position: "absolute",
                top: "0.125vh",
                left: "16.94vw",
                justifyContent: "center",
                display: "flex",
                flexDirection: "column",
                color: "black",
                fontSize: "1.5rem",
                fontWeight: "400",
                whiteSpace: "nowrap",
              }}
            >
              {filter.text}
            </div>
            <div
              style={{
                position: "absolute",
                top: "0",
                left: "88.33vw",
                width: "5.28vw",
                height: "5.28vw",
                background: "white",
                borderRadius: 9999,
                border:
                  selectedIndex === index
                    ? "6px #F9704B solid"
                    : "2px #A3A3A3 solid",
                cursor: "pointer",
              }}
              onClick={() => setSelectedIndex(index)}
            />
          </div>
        </div>
      ))}
      <div
        style={{
          position: "absolute",
          top: "35.125vh",
          width: "100%",
          height: "100%",
          outline: "1px #E7E7E7 solid",
          outlineOffset: "-0.50px",
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          top: "38vh",
          left: "4.17vw",
          justifyContent: "center",
          display: "flex",
          flexDirection: "column",
          color: "black",
          fontSize: "1.7rem",
          fontWeight: "500",
          wordWrap: "break-word",
        }}
      >
        Tùy chọn quán
      </div>

      {multipleChoiceFilters.map((filter, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            top: `${44 + index * 4.625}vh`,
          }}
        >
          <div
            style={{
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "0.25vh",
                left: "6.94vw",
              }}
            >
              {filter.icon}
            </div>

            <div
              style={{
                position: "absolute",
                top: "0.125vh",
                left: "16.94vw",
                justifyContent: "center",
                display: "flex",
                flexDirection: "column",
                color: "black",
                fontSize: "1.5rem",
                fontWeight: "400",
                whiteSpace: "nowrap",
              }}
            >
              {filter.text}
            </div>
            <div
              style={{
                position: "absolute",
                top: "0",
                left: "88.33vw",
                width: "5vw",
                height: "5vw",
                background: selectedMultiple.includes(index)
                  ? "#F9704B"
                  : "white",
                borderRadius: 5,
                border: selectedMultiple.includes(index)
                  ? "2px #F9704B solid"
                  : "2px #A3A3A3 solid",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "2rem",
                fontWeight: "bold",
              }}
              onClick={() => toggleMultiple(index)}
            >
              {selectedMultiple.includes(index) ? "✓" : ""}
            </div>
          </div>
        </div>
      ))}
      <div
        style={{
          position: "absolute",
          top: "59.5vh",
          width: "100%",
          height: "100%",
          outline: "1px #E7E7E7 solid",
          outlineOffset: "-0.50px",
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          top: "62vh",
          left: "4.17vw",
          justifyContent: "center",
          display: "flex",
          flexDirection: "column",
          color: "black",
          fontSize: "1.7rem",
          fontWeight: "500",
          wordWrap: "break-word",
        }}
      >
        Phí giao hàng
      </div>

      {radio2Filters.map((filter, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            top: `${68 + index * 4.625}vh`,
          }}
        >
          <div
            style={{
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "0.125vh",
                left: "4.17vw",
                justifyContent: "center",
                display: "flex",
                flexDirection: "column",
                color: "black",
                fontSize: "1.5rem",
                fontWeight: "400",
                whiteSpace: "nowrap",
              }}
            >
              {filter.text}
            </div>
            <div
              style={{
                position: "absolute",
                top: "0",
                left: "88.33vw",
                width: "5.28vw",
                height: "5.28vw",
                background: "white",
                borderRadius: 9999,
                border:
                  selectedRadio2 === index
                    ? "6px #F9704B solid"
                    : "2px #A3A3A3 solid",
                cursor: "pointer",
              }}
              onClick={() => setSelectedRadio2(index)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default FoodFilters;
