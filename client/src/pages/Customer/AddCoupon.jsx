// File: src/pages/Customer/AddCoupon.jsx

import React from "react"; // Bỏ useState
import { useNavigate } from "react-router-dom"; // Bỏ useLocation
import { useOrder } from "../../contexts/OrderContext"; // <-- 1. IMPORT CONTEXT
import CloseIcon from "../../components/shared/CloseIcon";
import SubmitButton from "../../components/shared/SubmitButton";
import AddIcon from "../../components/shared/AddIcon";
import CheckIcon from "../../components/shared/CheckIcon";

// ==========================================================
// ĐỊNH NGHĨA VÀ EXPORT LOGIC COUPON
// ==========================================================
const shippingImage = "https://amthanhhay.com.vn/wp-content/uploads/2024/03/free-shipping-icon.png";
const foodImage = "https://cdn3d.iconscout.com/3d/premium/thumb/food-discount-3d-icon-png-download-10615902.png";

// EXPORT mảng này để Context có thể import và sử dụng
export const coupons = [
  {
    id: 0, // Dùng index làm ID
    description: "Giảm 15K phí giao hàng cho đơn từ 50.000Đ",
    status: "shipping",
    image: shippingImage,
    type: 'fixed',
    value: 15000,
    minOrder: 50000 
  },
  {
    id: 1,
    description: "Giảm 20% cho món ăn từ 100.000Đ, áp dụng cho tất cả",
    status: "food",
    image: foodImage,
    type: 'percentage',
    value: 20, // (as percent)
    minOrder: 100000
  },
  {
    id: 2,
    description: "Miễn phí giao hàng cho đơn từ 30.000Đ",
    status: "shipping",
    image: shippingImage,
    type: 'free',
    value: 0,
    minOrder: 30000
  },
  {
    id: 3,
    description: "Giảm 30% cho món ăn từ 200.000Đ",
    status: "food",
    image: foodImage,
    type: 'percentage',
    value: 30, // (as percent)
    minOrder: 200000
  }
];
// ==========================================================

const AddCoupon = () => {
  const navigate = useNavigate();

  // 2. Lấy state và setter từ context
  const { selectedCoupons, setSelectedCoupons } = useOrder();

  // 3. Cả hai nút "X" và "Xác nhận" đều chỉ cần quay về
  const handleGoBack = () => {
    navigate("/customer/confirm-order");
  };

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      <div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CloseIcon
          style={{
            position: "absolute",
            left: "5vw",
            top: "50%",
            transform: "translateY(-50%)",
            cursor: "pointer", // Thêm cursor
          }}
          onClick={handleGoBack} // Gắn sự kiện Hủy
        />
        <div
          style={{
            color: "black",
            fontSize: "1.6rem",
            fontWeight: "600",
            wordWrap: "break-word",
          }}
        >
          Ưu đãi
        </div>
      </div>
      <div
        style={{
          width: "100%",
          height: "0.30px",
          backgroundColor: "#E7E7E7",
          marginTop: "1.25vh",
        }}
      />
      {coupons.map((coupon, index) => (
        <div
          key={index}
          onClick={() => {
            // 4. Logic cập nhật state trực tiếp từ context
            const type = coupon.status;
            // index ở đây chính là coupon.id
            if (selectedCoupons[type] === index) {
              setSelectedCoupons({ ...selectedCoupons, [type]: null });
            } else {
              setSelectedCoupons({ ...selectedCoupons, [type]: index });
            }
          }}
          style={{
            marginTop: index > 0 ? "1.875vh" : "1.875vh",
            marginLeft: "50%",
            transform: "translateX(-50%)",
            width: "91.67vw",
            height: "9.25vh",
            borderRadius: 14,
            border: selectedCoupons[coupon.status] === index ? "2px solid #5EAD1D" : "1px #D9D9D9 solid",
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <img
            src={coupon.image}
            style={{
              width: "4.9rem",
              height: "4.9rem",
              marginLeft: "3.33vw",
            }}
          />
          <div
            style={{
              marginLeft: "3.33vw",
              flex: 1,
              marginRight: "3.33vw",
              justifyContent: "center",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              color: "black",
              fontSize: "1.3rem",
              fontWeight: "500",
              wordWrap: "break-word",
              overflowWrap: "break-word",
            }}
          >
            {coupon.description}
          </div>
          {selectedCoupons[coupon.status] === index ? (
            <CheckIcon style={{
              marginLeft: "auto",
              marginRight: "3.33vw",
            }}/>
          ) : (
            <AddIcon style={{
              marginLeft: "auto",
              marginRight: "3.33vw",
            }}/>
          )}
        </div>
      ))}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <SubmitButton 
          onClick={handleGoBack} // Gắn sự kiện Xác nhận
          isValid={selectedCoupons.shipping !== null || selectedCoupons.food !== null}
        >
          {selectedCoupons.shipping !== null || selectedCoupons.food !== null ? "Dùng ngay" : "Bỏ qua"}
        </SubmitButton>
      </div>
    </div>
  );
};

export default AddCoupon;