// File: src/pages/Customer/ConfirmOrder.jsx

import React from "react"; 
import { useNavigate } from "react-router-dom"; 
import { useOrder } from "../../contexts/OrderContext"; 
import BackArrow from "../../components/shared/BackArrow";
import LocationIcon from "../../components/shared/LocationIcon";
import ClockIcon2 from "../../components/shared/ClockIcon2";
import NoteIcon from "../../components/shared/NoteIcon";
import PlusIcon from "../../components/shared/PlusIcon";
import MinusIcon from "../../components/shared/MinusIcon";
import PaymentIcon from "../../components/shared/PaymentIcon";
import TagIcon from "../../components/shared/TagIcon";
import CardIcon from "../../components/shared/CardIcon"; 
import { coupons } from "./AddCoupon"; 

// --- STYLES ---
const s = {
  // Page
  pageContainer: {
    backgroundColor: "#F2F2F2",
    height: "100vh",
    overflowY: "auto",
    overflowX: "hidden",
    paddingTop: "8.5vh",
    paddingBottom: "13.875vh",
  },
  // Header
  headerContainer: {
    width: "100%",
    height: "8.5vh",
    background: "white",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  backArrow: {
    position: "absolute",
    top: "50%",
    left: "5vw",
    transform: "translateY(-50%)",
    color: "black",
  },
  headerTitleGroup: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.25vh",
  },
  headerTitle: {
    color: "black",
    fontSize: "1.6rem",
    fontWeight: "600",
    lineHeight: 1,
  },
  headerSubtitle: {
    color: "black",
    fontSize: "1.1rem",
    fontWeight: "500",
    whiteSpace: "nowrap",
  },
  // Delivery Info
  deliveryInfoContainer: {
    width: "91.67vw",
    /* height: "13.5vh", // Bỏ height cứng */
    background: "white",
    borderRadius: "1.4rem",
    marginLeft: "50%",
    transform: "translateX(-50%)",
    marginTop: "1.875vh",
    paddingTop: "2.125vh",
    paddingLeft: "5vw",
    paddingBottom: "2.125vh", // Thêm padding
  },
  deliveryRow: {
    display: "flex",
    alignItems: "center",
    gap: "5vw",
  },
  deliveryInfoTextGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "1.25vh",
  },
  baseInfoText: {
    justifyContent: "center",
    display: "flex",
    flexDirection: "column",
    wordWrap: "break-word",
    lineHeight: "1",
  },
  deliveryAddress: {
    color: "black",
    fontSize: "1.3rem",
    fontWeight: "600",
  },
  deliveryContact: {
    color: "rgba(0, 0, 0, 0.50)",
    fontSize: "1.1rem",
    fontWeight: "500",
  },
  editButton: {
    width: "10vw",
    height: "3.125vh",
    borderRadius: 999,
    border: "0.25rem #2BCDD2 solid",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#2BCDD2",
    fontSize: "1.2rem",
    fontWeight: "600",
    wordWrap: "break-word",
    marginLeft: "auto",
    marginRight: "5vw",
    lineHeight: "1",
  },
  deliveryTimeRow: {
    display: "flex",
    alignItems: "center",
    gap: "5vw",
    marginTop: "2.125vh",
  },
  deliveryTimeLabel: {
    color: "black",
    fontSize: "1.35rem",
    fontWeight: "500",
    wordWrap: "break-word",
    lineHeight: "1",
  },
  deliveryTimeValue: {
    color: "black",
    fontSize: "1.3rem",
    fontWeight: "500",
    wordWrap: "break-word",
    marginLeft: "auto",
    marginRight: "5vw",
    lineHeight: "1",
  },
  // Order Summary
  orderSummaryContainer: {
    width: "91.67vw",
    background: "white",
    borderRadius: "1.4rem",
    marginLeft: "50%",
    transform: "translateX(-50%)",
    marginTop: "1.875vh",
    paddingBottom: "1.875vh",
  },
  summaryHeader: {
    display: "flex",
    alignItems: "center",
    gap: "44.72vw",
    paddingTop: "1.375vh",
    paddingLeft: "3.89vw",
  },
  summaryTitle: {
    color: "black",
    fontSize: "1.3rem",
    fontWeight: "600",
    wordWrap: "break-word",
    lineHeight: "1",
  },
  summaryAddButton: {
    color: "#2BCDD2",
    fontSize: "1.2rem",
    fontWeight: "600",
    wordWrap: "break-word",
    lineHeight: "1",
  },
  noteInputContainer: {
    marginTop: "2.75vh",
    marginLeft: "auto",
    marginRight: "auto",
    width: "83.33vw",
    height: "5.375vh",
    background: "#F2F2F2",
    borderRadius: 999,
    display: "flex",
    alignItems: "center",
    paddingLeft: "5.5vw",
    paddingRight: "5.5vw",
    boxSizing: "border-box",
  },
  noteInput: {
    width: "100%",
    border: "none",
    outline: "none",
    background: "transparent",
    marginLeft: "3.5vw",
    color: "black",
    fontSize: "1.3rem",
    fontWeight: "500",
    fontFamily: "Be Vietnam Pro",
  },
  // Payment Details
  paymentDetailsContainer: {
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "1.875vh",
    width: "91.67vw",
    /* height: "23.375vh", // Bỏ height cứng */
    background: "white",
    borderRadius: "1.4rem",
    paddingTop: "2.75vh",
    paddingBottom: "2.125vh", // Thêm padding
  },
  paymentTitle: {
    marginLeft: "3.89vw",
    color: "black",
    fontSize: "1.3rem",
    fontWeight: "600",
    wordWrap: "break-word",
    lineHeight: "1",
  },
  paymentRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: "3.89vw",
    paddingRight: "3.89vw",
  },
  paymentLabel: {
    color: "rgba(0, 0, 0, 0.50)",
    fontSize: "1.3rem",
    fontWeight: "500",
    wordWrap: "break-word",
    lineHeight: "1",
  },
  paymentValue: {
    color: "black",
    fontSize: "1.3rem",
    fontWeight: "500",
    wordWrap: "break-word",
    lineHeight: "1",
  },
  paymentTotalLabel: {
    color: "black",
    fontSize: "1.3rem",
    fontWeight: "500",
    wordWrap: "break-word",
    lineHeight: "1",
  },
  paymentTotalValue: {
    color: "#2BCDD2",
    fontSize: "1.4rem",
    fontWeight: "500",
    wordWrap: "break-word",
    lineHeight: "1",
  },
  // Footer
  footerContainer: {
    width: "100%",
    height: "13.875vh",
    background: "white",
    boxShadow: "0px 1px 10px rgba(0, 0, 0, 0.25)",
    borderTopLeftRadius: "1.6rem",
    borderTopRightRadius: "1.6rem",
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  footerPaymentGroup: {
    position: "absolute",
    top: "2.125vh",
    left: "5.55vw",
    display: "flex",
    alignItems: "center",
    height: "1.5rem",
  },
  footerPaymentText: {
    marginLeft: "3.7vw",
    color: "black",
    fontSize: "1.1rem",
    fontWeight: "500",
    wordWrap: "break-word",
    display: "flex",
    alignItems: "center",
    height: "1.5rem",
  },
  footerVerticalLine: {
    marginLeft: "3.7vw",
    display: "flex",
    alignItems: "center",
    height: "1.5rem",
  },
  footerLineInner: {
    width: "1px",
    height: "1.2rem",
    background: "#F2F2F2",
  },
  footerTagGroup: {
    marginLeft: "3.7vw",
    display: "flex",
    alignItems: "center",
    height: "1.5rem",
  },
  submitButton: {
    position: "absolute",
    width: "87.78vw",
    height: "6.375vh",
    background: "#2BCDD2",
    borderRadius: 999,
    marginLeft: "50%",
    transform: "translateX(-50%)",
    bottom: "1.875vh",
  },
  submitButtonText: {
    position: "absolute",
    color: "white",
    fontSize: "1.4rem",
    fontWeight: "700",
    wordWrap: "break-word",
    top: "50%",
    transform: "translateY(-50%)",
    left: "4.44vw",
  },
  submitButtonPrice: {
    position: "absolute",
    color: "white",
    fontSize: "1.4rem",
    fontWeight: "700",
    wordWrap: "break-word",
    top: "50%",
    transform: "translateY(-50%)",
    right: "4.44vw",
  },
};
// --- END STYLES ---

// --- CHILD COMPONENTS ---

const OrderHeader = ({ shopName, onBackClick }) => (
  <div style={s.headerContainer}>
    <BackArrow style={s.backArrow} onClick={onBackClick} />
    <div style={s.headerTitleGroup}>
      <div style={s.headerTitle}>Thanh toán</div>
      <div style={s.headerSubtitle}>{shopName}</div>
    </div>
  </div>
);

const DeliveryInfo = ({ address, contactInfo, distance }) => (
  <div style={s.deliveryInfoContainer}>
    {/* Location Row */}
    <div style={s.deliveryRow}>
      <LocationIcon />
      <div style={s.deliveryInfoTextGroup}>
        <div style={{ ...s.baseInfoText, ...s.deliveryAddress }}>{address}</div>
        <div style={{ ...s.baseInfoText, ...s.deliveryContact }}>
          {contactInfo}
        </div>
      </div>
      <div style={s.editButton}>Sửa</div>
    </div>
    {/* Delivery Time Row */}
    <div style={s.deliveryTimeRow}>
      <ClockIcon2 />
      <div style={s.deliveryTimeLabel}>Giao nhanh</div>
      <div style={s.deliveryTimeValue}>{distance}</div>
    </div>
  </div>
);

const OrderSummary = ({
  items,
  quantities,
  onQuantityChange,
  onRemoveItem,
  note,
  onNoteChange,
  onAddMoreClick, // Thêm handler cho "Thêm món"
}) => {
  const { showConfirmation } = useOrder();

  return (
    <div style={s.orderSummaryContainer}>
      {/* Summary Header */}
      <div style={s.summaryHeader}>
        <div style={s.summaryTitle}>Tóm tắt đơn</div>
        <div 
          style={{ ...s.summaryAddButton, cursor: "pointer" }}
          onClick={onAddMoreClick}
        >
          Thêm món
        </div>
      </div>
      {/* Item Rows */}
      {items.map((item, index) => (
        <OrderItem
          key={item.id || index} 
          item={item}
          quantity={quantities[index]}
          onIncrease={() => onQuantityChange(index, 1)}
          onDecrease={() => onQuantityChange(index, -1)}
          onRemove={() => onRemoveItem(index)}
          showConfirmation={showConfirmation} 
          isFirstItem={index === 0}
        />
      ))}
      {/* InputBox màu xám */}
      <div style={s.noteInputContainer}>
        <NoteIcon />
        <input
          type="text"
          placeholder="Quán sẽ cố gắng đáp ứng yêu cầu."
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          style={s.noteInput}
        />
      </div>
    </div>
  );
};

const PaymentDetails = ({
  totalQuantity,
  totalItemPrice,
  shippingFee,
  foodDiscount,
  shippingDiscount,
  totalPrice,
}) => {
  return (
    <div style={s.paymentDetailsContainer}>
      <div style={s.paymentTitle}>Chi tiết thanh toán</div>

      {/* Row 1: Tổng giá món */}
      <div style={{ ...s.paymentRow, marginTop: "1.875vh" }}>
        <div style={s.paymentLabel}>
          Tổng giá món ({totalQuantity} món)
        </div>
        <div style={s.paymentValue}>
          {totalItemPrice.toLocaleString("vi-VN")}₫
        </div>
      </div>

      {/* Row 2: Phí giao hàng */}
      <div style={{ ...s.paymentRow, marginTop: "1.875vh" }}>
        <div style={s.paymentLabel}>Phí giao hàng</div>
        <div style={s.paymentValue}>
          {shippingFee.toLocaleString("vi-VN")}₫
        </div>
      </div>

      {/* Row 3: Giảm giá món ăn (MỚI) */}
      {foodDiscount > 0 && (
        <div style={{ ...s.paymentRow, marginTop: "1.875vh" }}>
          <div style={s.paymentLabel}>Giảm giá món ăn</div>
          <div style={{ ...s.paymentValue, color: "#007E51" }}>
            -{foodDiscount.toLocaleString("vi-VN")}₫
          </div>
        </div>
      )}

      {/* Row 4: Giảm giá vận chuyển (MỚI) */}
      {shippingDiscount > 0 && (
        <div style={{ ...s.paymentRow, marginTop: "1.875vh" }}>
          <div style={s.paymentLabel}>Giảm giá vận chuyển</div>
          <div style={{ ...s.paymentValue, color: "#007E51" }}>
            -{shippingDiscount.toLocaleString("vi-VN")}₫
          </div>
        </div>
      )}

      {/* Row 5: Tổng thanh toán */}
      <div style={{ ...s.paymentRow, marginTop: "2.125vh" }}>
        <div style={s.paymentTotalLabel}>Tổng thanh toán</div>
        <div style={s.paymentTotalValue}>
          {totalPrice.toLocaleString("vi-VN")}₫
        </div>
      </div>
    </div>
  );
};

// ==========================================================
// SỬA COMPONENT SubmitFooter
// ==========================================================
const SubmitFooter = ({
  totalPrice,
  onPaymentClick,
  paymentMethodName,
  onCouponClick,
  couponCount,
  onSubmit,
}) => (
  <div style={s.footerContainer}>
    <div style={s.footerPaymentGroup}>
      
      {/* Sửa kích thước icon Payment/Card */}
      {paymentMethodName === "Tiền mặt" ? (
        <PaymentIcon height="1.2rem" width="1.267rem" />
      ) : (
        <CardIcon height="1.2rem" width="1.267rem" />
      )}

      <div
        style={{ ...s.footerPaymentText, cursor: "pointer" }}
        onClick={onPaymentClick}
      >
        {paymentMethodName}
      </div>
      
      <div style={s.footerVerticalLine}>
        <div style={s.footerLineInner}></div>
      </div>
      
      <div
        style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        onClick={onCouponClick} 
      >
        <div style={s.footerTagGroup}>
          {/* Sửa kích thước icon Tag */}
          <TagIcon height="1.2rem" width="1.267rem" />
        </div>
        
        <div style={s.footerPaymentText}>
          {couponCount > 0 ? `Đã áp dụng ${couponCount} mã` : "Ưu đãi"}
        </div>
      </div>
    </div>
    
    <div style={{ ...s.submitButton, cursor: "pointer" }} onClick={onSubmit}>
      <div style={s.submitButtonText}>Đặt đơn</div>
      <div style={s.submitButtonPrice}>
        {totalPrice.toLocaleString("vi-VN")}₫
      </div>
    </div>
  </div>
);
// ==========================================================
// KẾT THÚC SỬA
// ==========================================================


const OrderItem = ({
  item,
  quantity,
  onIncrease,
  onDecrease,
  onRemove,
  showConfirmation,
  isFirstItem,
}) => {
  // Hàm xử lý click giảm
  const handleDecreaseClick = () => {
    if (quantity === 1) {
      // Nếu số lượng là 1, hiển thị confirm
      showConfirmation(
        "Bạn có muốn xóa sản phẩm khỏi đơn hàng?", // Message
        onRemove // Hàm onConfirm
      );
    } else {
      // Nếu số lượng > 1, chỉ giảm
      onDecrease();
    }
  };

  const itemStyle = {
    container: {
      display: "flex",
      alignItems: "center",
      gap: "2.78vw",
      marginTop: isFirstItem ? "2.75vh" : "2.5vh",
      marginLeft: "3.89vw",
    },
    image: {
      width: "4.5rem",
      height: "4.5rem",
      borderRadius: "0.8rem",
    },
    info: {
      display: "flex",
      flexDirection: "column",
      gap: "1.5vh",
    },
    name: {
      color: "black",
      fontSize: "1.3rem",
      fontWeight: "600",
      wordWrap: "break-word",
      lineHeight: "1",
    },
    price: {
      color: "black",
      fontSize: "1.2rem",
      fontWeight: "600",
      wordWrap: "break-word",
      lineHeight: "1",
    },
    quantityControl: {
      width: "18.33vw",
      height: "3.625vh",
      borderRadius: "1.4rem",
      border: "1px #2BCDD2 solid",
      marginLeft: "auto",
      marginRight: "3.89vw",
      marginTop: "auto",
      marginBottom: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      paddingLeft: "2.5vw",
      paddingRight: "2.5vw",
    },
    quantityText: {
      color: "#2BCDD2",
      fontSize: "1.1rem",
      fontWeight: "600",
      wordWrap: "break-word",
    },
  };

  return (
    <div style={itemStyle.container}>
      <img src={item.img} style={itemStyle.image} />
      <div style={itemStyle.info}>
        <div style={itemStyle.name}>{item.name}</div>
        <div style={itemStyle.price}>{item.price.toLocaleString("vi-VN")}₫</div>
      </div>
      <div style={itemStyle.quantityControl}>
        <MinusIcon onClick={handleDecreaseClick} />
        <div style={itemStyle.quantityText}>{quantity}</div>
        <PlusIcon onClick={onIncrease} />
      </div>
    </div>
  );
};

// --- Component Chính ---

// Mảng coupons được import từ AddCoupon.jsx
export { coupons }; 

export default function ConfirmOrder({
  shopName = "Ăn Vặt Vi Khương - Trần Đại Nghĩa",
  address = "Trường Đại Học FPT Đà Nẵng",
  contactInfo = "Nguyễn Chí Vương | +84778579293",
}) {
  const navigate = useNavigate();
  
  // Lấy MỌI THỨ từ context (đã được đồng bộ với backend)
  const {
    items,
    note,
    setNote,
    quantities,
    handleQuantityChange,
    handleRemoveItem, 
    paymentMethodName,
    selectedCoupons, 
    totalQuantity,
    totalItemPrice,
    shippingFee,
    foodDiscount,
    shippingDiscount,
    totalPrice,
    couponCount,
    shopId, // Lấy shopId để navigate
    cartLoading,
  } = useOrder();

  // Handler cho nút "Thêm món"
  const handleAddMoreItems = () => {
    if (shopId) {
      navigate("/customer/restaurant-details", {
        state: { 
          shopId,
          defaultTab: "menu" // Mặc định hiển thị tab Thực đơn
        }
      });
    } else {
      console.warn("⚠️ Không tìm thấy shopId");
      navigate("/customer/discover"); // Fallback về trang discover
    }
  };

  // Hiển thị loading khi đang fetch cart
  if (cartLoading) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.25rem",
        color: "#555",
      }}>
        Đang tải đơn hàng...
      </div>
    );
  }

  // Hiển thị thông báo nếu giỏ hàng trống
  if (!items || items.length === 0) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
      }}>
        <div style={{ fontSize: "1.5rem", color: "#555" }}>
          Giỏ hàng trống
        </div>
        <button
          onClick={() => navigate("/customer/discover")}
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#2BCDD2",
            color: "white",
            border: "none",
            borderRadius: "999px",
            fontSize: "1.2rem",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Khám phá món ăn
        </button>
      </div>
    );
  }
  
  return (
    <div style={s.pageContainer}>
      <OrderHeader shopName={shopName} onBackClick={() => navigate("/customer/discover")} />

      <DeliveryInfo
        address={address}
        contactInfo={contactInfo}
        distance={"1.36km"}
      />

      <OrderSummary
        items={items}
        quantities={quantities}
        onQuantityChange={handleQuantityChange}
        onRemoveItem={handleRemoveItem} 
        note={note}
        onNoteChange={setNote}
        onAddMoreClick={handleAddMoreItems}
      />

      <PaymentDetails
        totalQuantity={totalQuantity}
        totalItemPrice={totalItemPrice}
        shippingFee={shippingFee}
        foodDiscount={foodDiscount}
        shippingDiscount={shippingDiscount}
        totalPrice={totalPrice}
      />

      <SubmitFooter
        totalPrice={totalPrice} 
        paymentMethodName={paymentMethodName}
        onPaymentClick={() => navigate("/customer/payment-method")}
        couponCount={couponCount}
        onCouponClick={() =>
          navigate("/customer/add-coupon")
        }
        onSubmit={() => {
          if (paymentMethodName === "Chuyển khoản") {
            navigate("/customer/qr-payment");
          } else {
            navigate("/customer/order-success");
          }
        }}
      />
    </div>
  );
}