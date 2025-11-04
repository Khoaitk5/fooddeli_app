import VerifyIcon from "./VerifyIcon";
import StarIcon from "@/components/shared/StarIcon";
import FoodIcon from "../../shared/FoodIcon";
import DeliveryTimeIcon from "../../shared/DeliveryTimeIcon";
const RestaurantCard = ({ style, name, imageUrl, rating = 5, reviewCount = 13, salesCount = "200+", distance = "10.1 km" }) => {
  return (
    <div style={style}>
      <img
        src={imageUrl || "https://upload.urbox.vn/strapi/phuc_long_5_c188a69da5.jpg"}
        style={{
          width: "13.7rem",
          height: "13.7rem",
          borderRadius: "1rem",
          objectFit: "cover",
        }}
      />
      <div
        style={{ display: "flex", alignItems: "flex-start", marginTop: "1vh" }}
      >
        <VerifyIcon />
        <div
          style={{
            marginLeft: "0.83vw",
            width: "13.7rem",
            color: "black",
            fontSize: "1.2rem",
            fontWeight: "500",
            wordWrap: "break-word",
          }}
        >
          {name}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "3px",
          marginTop: "0.5vh",
        }}
      >
        <StarIcon width="0.9rem" height="0.9rem" />
        <div
          style={{
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
            color: "#555555",
            fontSize: "1.2rem",
            fontWeight: "600",
            wordWrap: "break-word",
          }}
        >
          {rating}
        </div>
        <div
          style={{
            color: "#555555",
            fontSize: "1rem",
            fontWeight: "400",
            wordWrap: "break-word",
            display: "flex",
            alignItems: "center",
          }}
        >
          ({reviewCount})
        </div>
        <div style={{ marginLeft: "2.5vw" }}>
          <FoodIcon />
        </div>
        <div
          style={{
            color: "#555555",
            fontSize: "1.1rem",
            fontWeight: "400",
            wordWrap: "break-word",
            marginLeft: "0.5vw",
            display: "flex",
            alignItems: "center",
          }}
        >
          {salesCount}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: "0.5vh",
        }}
      >
        <DeliveryTimeIcon />
        <div
          style={{
            color: "#555555",
            fontSize: "1.1rem",
            fontWeight: "400",
            wordWrap: "break-word",
            marginLeft: "0.5vw",
            display: "flex",
            alignItems: "center",
          }}
        >
          {distance}
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
