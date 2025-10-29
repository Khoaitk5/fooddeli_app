import { useState } from "react";
import BackArrow from "@/components/shared/BackArrow.jsx";
import TagVoucherIcon from "@/components/shared/TagVoucherIcon.jsx";
import NoteIcon from "@/components/shared/NoteIcon.jsx";
import RightArrowIcon from "@/components/shared/RightArrowIcon.jsx";
import ScanIcon from "@/components/shared/ScanIcon.jsx";
import WalletIcon from "@/components/shared/WalletIcon.jsx";
import SubmitButton from "@/components/shared/SubmitButton.jsx";

// Style constants for consistent styling across components
const titleStyle = {
  position: "absolute",
  color: "black",
  fontSize: "1.7rem",
  fontWeight: "400",
};

// Style for subtitles in sections
const subtitleStyle = {
  position: "absolute",
  color: "black",
  fontSize: "1.3rem",
  fontWeight: "400",
};

// Style for labels in forms and sections
const labelStyle = {
  position: "absolute",
  color: "#3D3D3D",
  fontSize: "1.1rem",
  fontWeight: "400",
};

// Style for values displayed in sections
const valueStyle = {
  position: "absolute",
  color: "#3D3D3D",
  fontSize: "1rem",
  fontWeight: "400",
};

// Style for item names in order summaries
const itemNameStyle = {
  position: "absolute",
  color: "black",
  fontSize: "1.3rem",
  fontWeight: "400",
};

// Style for prices in order summaries
const priceStyle = {
  position: "absolute",
  color: "#3D3D3D",
  fontSize: "1.3rem",
  fontWeight: "400",
};

export default function Payment() {
  // Delivery distance between shop and user in kilometers
  const deliveryDistance = 2.3;
  // Number of food items ordered
  const [itemQuantity, setItemQuantity] = useState(1);
  // Delivery address
  const deliveryAddress = "6-C16 Lê Đức Thọ";
  // Customer name
  const customerName = "Nguyễn Chí Vương";
  // Customer phone number
  const customerPhone = "0778579293";
  // Food item name
  const foodItemName = "Cơm Má Đùi Góc Tư";
  // Food item price
  const foodItemPrice = 60000;
  // Discount amount
  const discountAmount = 15000;

  // Calculate total item price based on quantity
  const totalItemPrice = foodItemPrice * itemQuantity;
  // Calculate final total payment (item total - discount)
  const totalPayment = totalItemPrice - discountAmount;

  // Function to increase item quantity
  const increaseQuantity = () => {
    setItemQuantity(prevQuantity => prevQuantity + 1);
  };

  // Function to decrease item quantity (minimum 1)
  const decreaseQuantity = () => {
    setItemQuantity(prevQuantity => prevQuantity > 1 ? prevQuantity - 1 : 1);
  };

  return (
    <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh", paddingTop: "8.5vh" }}>
      {/* Header Section */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          width: "100%",
          height: "8vh",
          borderRadius: "0px 0px 8px 8px",
          backgroundColor: "#fff",
          zIndex: 1000,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <BackArrow
          style={{
            position: "absolute",
            width: "2.34vw",
            height: "1.875vh",
            top: "3.5vh",
            left: "6.67vw",
          }}
          onClick={() => window.history.back()}
        />
        <div
          style={{
            ...titleStyle,
            fontSize: "1.8rem",
            top: "3vh",
            left: "14.44vw",
          }}
        >
          Xác nhận đơn hàng
        </div>
      </div>
      {/* End Header Section */}

      {/* Address Section */}
      <div>
        <div
          style={{
            width: "100%",
            height: "10.75vh",
            marginTop: "0.25vh",
            background: "white",
            borderRadius: "1rem",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "3rem",
              height: "3rem",
              background: "#FBF1F2",
              borderRadius: 9999,
              top: "3.625vh",
              left: "3.89vw",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "3vh",
              left: "15.28vw",
              color: "black",
              fontSize: "1.25rem",
              fontWeight: "500",
            }}
          >
            {deliveryAddress}
          </div>
          <div
            style={{
              position: "absolute",
              top: "5.75vh",
              left: "15.28vw",
              color: "#3D3D3D",
              fontSize: "1.25rem",
              fontWeight: "400",
            }}
          >
            {customerName} | {customerPhone}
          </div>
          <RightArrowIcon
            style={{
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              right: "8.33vw",
            }}
          />
        </div>
      </div>
      {/* End Address Section */}

      {/* Order Summary Section */}
      <div>
        <div
          style={{
            width: "100%",
            height: "17vh",
            marginTop: "0.875vh",
            background: "white",
            borderRadius: "1rem",
            position: "relative",
          }}
        >
          <div
            style={{
              ...titleStyle,
              top: "2.5vh",
              left: "4.17vw",
            }}
          >
            Tóm tắt đơn hàng
          </div>
          <div
            style={{
              position: "absolute",
              top: "2.75vh",
              right: "4.17vw",
              color: "#105EB3",
              fontSize: "1.5rem",
              fontWeight: "500",
            }}
          >
            Thêm món
          </div>
          <div
            style={{
              position: "absolute",
              width: "5.1rem",
              height: "5.1rem",
              background: "#D9D9D9",
              borderRadius: "1.4rem",
              top: "8.125vh",
              left: "4.17vw",
            }}
          />
          <div
            style={{
              ...itemNameStyle,
              top: "8.125vh",
              left: "21.39vw",
            }}
          >
            {foodItemName}
          </div>
          <div
            style={{
              ...priceStyle,
              top: "12.5vh",
              left: "21.39vw",
            }}
          >
            {foodItemPrice.toLocaleString()}₫
          </div>
          <div
            style={{
              position: "absolute",
              width: "18.33vw",
              height: "3.625vh",
              borderRadius: 14,
              border: "1px #247950 solid",
              top: "10.875vh",
              right: "4.17vw",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "1vw",
                top: "50%",
                transform: "translateY(-50%)",
                color: "black",
                fontSize: "1.5rem",
                fontWeight: "600",
                cursor: "pointer",
              }}
              onClick={decreaseQuantity}
            >
              -
            </div>
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                color: "black",
                fontSize: "1.1rem",
                fontWeight: "600",
              }}
            >
              {itemQuantity}
            </div>
            <div
              style={{
                position: "absolute",
                right: "1vw",
                top: "50%",
                transform: "translateY(-50%)",
                color: "black",
                fontSize: "1.5rem",
                fontWeight: "600",
                cursor: "pointer",
              }}
              onClick={increaseQuantity}
            >
              +
            </div>
          </div>
        </div>
      </div>
      {/* End Order Summary Section */}

      {/* Note Section */}
      <div
        style={{
          width: "100%",
          height: "5.75vh",
          background: "white",
          borderRadius: "1rem",
          position: "relative",
          marginTop: "0.875vh",
        }}
      >
        <NoteIcon
          style={{
            position: "absolute",
            top: "50%",
            left: "6.11vw",
            transform: "translateY(-50%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            left: "16.94vw",
            color: "#3D3D3D",
            fontSize: "1.3rem",
            fontWeight: "400",
          }}
        >
          Ghi chú
        </div>
        <RightArrowIcon
          style={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            right: "8.33vw",
          }}
        />
      </div>
      {/* End Note Section */}

      {/* Voucher Section */}
      <div
        style={{
          width: "100%",
          height: "13.875vh",
          marginTop: "0.875vh",
          background: "white",
          borderRadius: "1rem",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "2.5vh",
            left: "4.17vw",
            color: "black",
            fontSize: "1.7rem",
            fontWeight: "400",
          }}
        >
          Áp dụng ưu đãi và giảm giá
        </div>
        <TagVoucherIcon
          style={{
            position: "absolute",
            top: "9.25vh",
            left: "6.67vw",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "9.125vh",
            left: "16.94vw",
            color: "#3D3D3D",
            fontSize: "1.4rem",
            fontWeight: "400",
          }}
        >
          Ưu đãi
        </div>
        <RightArrowIcon
          style={{
            position: "absolute",
            top: "9.125vh",
            right: "8.33vw",
          }}
        />
      </div>
      {/* End Voucher Section */}

      {/* Payment Info Section */}
      <div
        style={{
          width: "100%",
          height: "13.75vh",
          marginTop: "0.875vh",
          background: "white",
          borderRadius: "1rem",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "2.5vh",
            left: "4.17vw",
            color: "black",
            fontSize: "1.7rem",
            fontWeight: "400",
          }}
        >
          Thông tin thanh toán
        </div>
        <ScanIcon
          style={{
            position: "absolute",
            top: "6.875vh",
            left: "22.5vw",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "10.375vh",
            left: "15.28vw",
            color: "#3D3D3D",
            fontSize: "1rem",
            fontWeight: "400",
          }}
        >
          Chuyển khoản
        </div>
        <WalletIcon
          style={{
            position: "absolute",
            top: "6.875vh",
            right: "22.36vw",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "10.375vh",
            right: "19.17vw",
            color: "#3D3D3D",
            fontSize: "1rem",
            fontWeight: "400",
          }}
        >
          Tiền mặt
        </div>
      </div>
      {/* End Payment Info Section */}

      <div
        style={{
          width: "100%",
          height: "25.625vh",
          background: "white",
          borderRadius: "1rem",
          position: "relative",
          marginTop: "0.875vh",
        }}
      >
        <div
          style={{
            ...subtitleStyle,
            top: "1.75vh",
            left: "4.17vw",
          }}
        >
          Chi tiết thanh toán
        </div>
        <div
          style={{
            ...labelStyle,
            top: "5.125vh",
            left: "4.17vw",
          }}
        >
          Tổng giá món ({itemQuantity} món)
        </div>
        <div
          style={{
            position: "absolute",
            top: "5.125vh",
            right: "4.17vw",
            color: "#3D3D3D",
            fontSize: "1.1rem",
            fontWeight: "400",
          }}
        >
          {totalItemPrice.toLocaleString()}₫
        </div>

        <div
          style={{
            position: "absolute",
            top: "8.25vh",
            left: "4.17vw",
            color: "#3D3D3D",
            fontSize: "1.1rem",
            fontWeight: "400",
          }}
        >
          Ưu đãi
        </div>
        <div
          style={{
            position: "absolute",
            top: "8.25vh",
            right: "4.17vw",
            color: "#3D3D3D",
            fontSize: "1.1rem",
            fontWeight: "400",
          }}
        >
          -{discountAmount.toLocaleString()}₫
        </div>

        <div
          style={{
            position: "absolute",
            top: "11.375vh",
            left: "4.17vw",
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
            color: "#3D3D3D",
            fontSize: "1.1rem",
            fontWeight: "400",
            wordWrap: "break-word",
          }}
        >
          Phí giao hàng ({deliveryDistance} km)
        </div>
        <div
          style={{
            position: "absolute",
            top: "11.375vh",
            right: "4.17vw",
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
            color: "#3D3D3D",
            fontSize: "1.1rem",
            fontWeight: "400",
            wordWrap: "break-word",
            textDecoration: "line-through",
          }}
        >
          15.000₫
        </div>

        <div
          style={{
            position: "absolute",
            top: "14.375vh",
            left: "50%",
            transform: "translateX(-50%)",
            width: "91.67vw",
            outline: "1px #D9D9D9 solid",
            outlineOffset: "-0.50px",
          }}
        ></div>

        <div
          style={{
            position: "absolute",
            top: "16.375vh",
            left: "4.17vw",
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
            color: "black",
            fontSize: "1.3rem",
            fontWeight: "400",
            wordWrap: "break-word",
          }}
        >
          Tổng thanh toán
        </div>

        <div
          style={{
            position: "absolute",
            top: "16.375vh",
            right: "4.17vw",
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
            color: "#5EAD1D",
            fontSize: "1.4rem",
            fontWeight: "600",
            wordWrap: "break-word",
          }}
        >
          {totalPayment.toLocaleString()}₫
        </div>

        <div
          style={{
            position: "absolute",
            top: "20.25vh",
            right: "4.17vw",
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
            color: "#3D3D3D",
            fontSize: "1.2rem",
            fontWeight: "400",
            wordWrap: "break-word",
          }}
        >
          Đã bao gồm thuế
        </div>
      </div>

      {/* Submit Button */}
      <div
        style={{
          width: "100%",
          padding: "1rem",
          paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
          display: "flex",
          justifyContent: "center",
          marginTop: "0.875vh",
          marginBottom: "1rem",
        }}
      >
        <SubmitButton
          isValid={true}
          onClick={() => alert("Đặt hàng thành công!")}
          style={{
            marginTop: "0",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              textAlign: "center",
              justifyContent: "center",
              display: "flex",
              flexDirection: "column",
              fontSize: "1.5rem",
              fontWeight: "600",
              wordWrap: "break-word",
            }}
          >
            Đặt hàng • {totalPayment.toLocaleString()}₫
          </div>
        </SubmitButton>
      </div>
    </div>
  );
}
