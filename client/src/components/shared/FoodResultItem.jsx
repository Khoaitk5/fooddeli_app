import React from "react";
import BadgeIcon from "./BadgeIcon";
import StarIcon from "./StarIcon";

const SearchResultItem = ({
  storeName,
  storeImage,
  rating,
  reviewCount,
  dishCategory,
  deliveryTime,
  promotions = [],
  dishes = [],
  onDishClick,
}) => {
  const truncateText = (text, maxLength = 20) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + "...";
  };
  const styles = {
    container: {
      position: "relative",
      paddingBottom: "37vh",
    },
    storeImage: {
      position: "absolute",
      left: "4.17vw",
      top: "0vh",
      width: "28.06vw",
      height: "28.06vw",
      borderRadius: 14,
      objectFit: "cover",
    },
    badgeIcon: {
      position: "absolute",
      top: "0.26vh",
      left: "36.4vw",
      zIndex: 10,
    },
    shopName: {
      position: "absolute",
      left: "40.84vw",
      top: "0vh",
      justifyContent: "center",
      display: "flex",
      flexDirection: "column",
      color: "black",
      fontSize: "1.3rem",
      fontWeight: "500",
      wordWrap: "break-word",
    },
    starIcon: {
      position: "absolute",
      top: "3.875vh",
      left: "36.39vw",
      zIndex: 10,
    },
    ratingInfo: {
      position: "absolute",
      top: "3.75vh",
      left: "41.39vw",
      justifyContent: "center",
      display: "flex",
      flexDirection: "column",
      color: "black",
      fontSize: "1.1rem",
      fontWeight: "400",
      wordWrap: "break-word",
    },
    deliveryTime: {
      position: "absolute",
      justifyContent: "center",
      top: "7.125vh",
      left: "36.39vw",
      display: "flex",
      flexDirection: "column",
      color: "#A3A3A3",
      fontSize: "1.1rem",
      fontWeight: "400",
      wordWrap: "break-word",
    },
    dishGrid: {
      position: "absolute",
      top: "14.5vh",
      left: "4.17vw",
      width: "91.67vw",
      height: "auto",
      overflowX: "scroll",
      scrollbarWidth: "none",
      msOverflowStyle: "none",
      display: "flex",
      gap: "2.78vw",
    },
    dishItem: {
      width: "25vw",
      minHeight: "calc(25.83vw + 10vh)",
      position: "relative",
      flexShrink: 0,
      cursor: "pointer",
    },
    dishImage: {
      width: "25.83vw",
      height: "25.83vw",
      borderRadius: 14,
      objectFit: "cover",
    },
    dishPrice: {
      position: "absolute",
      left: 0,
      top: "calc(25.83vw + 1.375vh)",
      color: "black",
      fontSize: "1.4rem",
      fontWeight: "500",
      wordWrap: "break-word",
      width: "100%",
      textAlign: "center",
    },
    dishName: {
      position: "absolute",
      left: 0,
      top: "calc(25.83vw + 4.25vh)",
      color: "black",
      fontSize: "1.4rem",
      fontWeight: "400",
      wordBreak: "break-word",
    },
    addButton: {
      width: "8.33vw",
      height: "8.33vw",
      position: "absolute",
      right: "1.94vw",
      bottom: "0.875vh",
      background: "#54A312",
      borderRadius: "50%",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    plusIcon: {
      width: "2.5vw",
      height: "0",
      background: "white",
      border: "1px white solid",
      transform: "rotate(90deg)",
      transformOrigin: "center",
    },
    plusIconVertical: {
      width: "2.5vw",
      height: "0",
      background: "white",
      border: "1px white solid",
      position: "absolute",
    },
    promotionContainer: {
      height: "2.125vh",
      borderRadius: 2,
      border: "1px #54A312 solid",
      padding: "0 1.5vw",
      display: "inline-block",
      whiteSpace: "nowrap",
    },
    promotionText: {
      justifyContent: "center",
      display: "flex",
      alignItems: "center",
      color: "#54A312",
      fontSize: "0.9rem",
      fontWeight: "500",
      whiteSpace: "nowrap",
      height: "100%",
    },
    promotionsWrapper: {
      position: "absolute",
      top: "10.5vh",
      left: "36.39vw",
      display: "flex",
      gap: "1.39vw",
    },
    separator: {
      position: 'absolute',
      top: '36.75vh',
      left: '4.17vw',
      width: '91.67vw',
      height: '1px',
      background: '#E7E7E7',
    },
  };
  return (
    <div style={styles.container}>
      <style dangerouslySetInnerHTML={{__html: `.dish-grid::-webkit-scrollbar { display: none; }`}} />
      {/* Store Header */}
      <img style={styles.storeImage} src={storeImage || "https://placehold.co/101x101"} />

      {/* Badge Icon */}
      <div style={styles.badgeIcon}>
        <BadgeIcon />
      </div>

      {/* Shop Name */}
      <div style={styles.shopName}>
        {storeName}
      </div>

      {/* Star Icon */}
      <div style={styles.starIcon}>
        <StarIcon />
      </div>

      <div style={styles.ratingInfo}>
        {rating} ({reviewCount}) • {dishCategory}
      </div>

      <div style={styles.deliveryTime}>
        {deliveryTime}
      </div>

      {/* Promotion Badges */}
      <div style={styles.promotionsWrapper}>
        {promotions.map((promotion, index) => (
          <div
            key={index}
            style={styles.promotionContainer}
          >
            <div style={styles.promotionText}>
              {promotion}
            </div>
          </div>
        ))}
      </div>

      {/* Dish Grid */}
      <div style={styles.dishGrid} className="dish-grid">
        {dishes.map((dish, index) => (
          <div key={dish.id || index} style={styles.dishItem} onClick={() => onDishClick && onDishClick(dish)}>
            <div style={{ position: "relative", width: "25.83vw", height: "25.83vw" }}>
              <img style={styles.dishImage} src={dish.image || "https://placehold.co/93x93"} alt={dish.name} />
              <div
                style={styles.addButton}
                onClick={(e) => {
                  e.stopPropagation();
                  onDishClick && onDishClick(dish);
                }}
              >
                <div style={styles.plusIcon}></div>
                <div style={styles.plusIconVertical}></div>
              </div>
            </div>
            <div style={styles.dishPrice}>{dish.price}</div>
            <div style={styles.dishName}>{truncateText(dish.name)}</div>
          </div>
        ))}
      </div>
      <div style={styles.separator}></div>
    </div>
  );
};

const FoodResults = () => {
  return (
    <>
      {/* Sample Search Results */}
      <div style={{ marginBottom: '1.875vh' }}>
        <SearchResultItem
          storeName="Gà Ủ Muối Bác 2 Voi"
          storeImage="https://gaumuoibac2voi.com/thumbs/124x124x1/upload/photo/filemoi1-9687.png.webp"
          rating="4.3"
          reviewCount="101"
          dishCategory="Thịt gà"
          deliveryTime="30 phút trở lên"
          promotions={['Flash Sale', 'Mã giảm 10%']}
          dishes={[
            { id: 1, name: 'Gà ủ muối nguyên con', price: '290.000đ', image: 'https://gaumuoibac2voi.com/watermark/product/1100x1090x1/upload/product/ga-u-muoi-nguyen-con1-1545.jpg.webp' },
            { id: 2, name: 'Gà ủ muối nửa con', price: '160.000đ', image: 'https://gaumuoibac2voi.com/watermark/product/1100x1090x1/upload/product/2-4985.png.webp' },
            { id: 3, name: 'Chân gà rút xương ủ muối', price: '140.000đ', image: 'https://gaumuoibac2voi.com/watermark/product/1100x1090x1/upload/product/1-2663.png.webp' },
            { id: 4, name: 'Chân gà rút xương sốt thái', price: '130.000đ', image: 'https://gaumuoibac2voi.com/watermark/product/1100x1090x1/upload/product/chan-ga-rut-xuong-sot-thai1-7244.jpg.webp' }
          ]}
          onDishClick={(dish) => console.log('Dish clicked:', dish)}
        />
      </div>
      <div style={{ marginBottom: '1.875vh' }}>
        <SearchResultItem
          storeName="KFC"
          storeImage="https://upload.wikimedia.org/wikipedia/sco/thumb/b/bf/KFC_logo.svg/2048px-KFC_logo.svg.png"
          rating="4.2"
          reviewCount="222"
          dishCategory="Thức ăn nhanh"
          deliveryTime="35 phút trở lên"
          promotions={['Miễn phí giao hàng']}
          dishes={[
            { id: 5, name: '6 miếng gà rán', price: '205.000đ', image: 'https://static.kfcvietnam.com.vn/images/items/lg/6-GA-XOT.jpg?v=L7Bb23' },
            { id: 6, name: '10 miếng gà Tender', price: '129.000đ', image: 'https://static.kfcvietnam.com.vn/images/items/lg/TENDERS-10.jpg?v=L7Bb23' },
            { id: 7, name: '3 miếng gà rán', price: '104.000đ', image: 'https://static.kfcvietnam.com.vn/images/items/lg/3-GA-XOT.jpg?v=L7Bb23' },
            { id: 8, name: '10 gà miếng Nuggets', price: '75.000đ', image: 'https://static.kfcvietnam.com.vn/images/items/lg/10_Nuggests.jpg?v=L7Bb23' }
          ]}
          onDishClick={(dish) => console.log('Dish clicked:', dish)}
        />
      </div>
      <div style={{ marginBottom: '1.875vh' }}>
        <SearchResultItem
          storeName="Jollibee"
          storeImage="https://bit.ly/4q9DPI0"
          rating="4.2"
          reviewCount="222"
          dishCategory="Thức ăn nhanh"
          deliveryTime="35 phút trở lên"
          promotions={['Miễn phí giao hàng']}
          dishes={[
            { id: 9, name: '2 Gà Sốt Cay + 1 Khoai tây chiên vừa + 1 Nước ngọt', price: '95.000đ', image: 'https://bit.ly/46OmbSv' },
            { id: 10, name: '2 miếng Gà Sốt Cay', price: '70.000đ', image: 'https://jollibee.com.vn/media/catalog/product/cache/9011257231b13517d19d9bae81fd87cc/g/_/g_s_t_cay_-_6-compressed_1.jpg' },
            { id: 11, name: '6 miếng Gà Giòn Vui Vẻ', price: '188.000đ', image: 'https://bit.ly/4q47QZP' },
            { id: 12, name: '4 miếng Gà Giòn Vui Vẻ', price: '126.000đ', image: 'https://bit.ly/48oDaMr' }
          ]}
          onDishClick={(dish) => console.log('Dish clicked:', dish)}
        />
      </div>
    </>
  );
};

export default FoodResults;
