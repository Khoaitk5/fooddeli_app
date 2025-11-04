// File: src/pages/Customer/PaymentMethod.jsx

import React from "react"; // Bỏ useState
import { useNavigate } from "react-router-dom"; // Bỏ useLocation
import { useOrder } from "../../contexts/OrderContext"; // <-- 1. IMPORT CONTEXT
import CloseIcon from "../../components/shared/CloseIcon";
import PaymentIcon from "../../components/shared/PaymentIcon";
import CardIcon from "../../components/shared/CardIcon";
import SubmitButton from "../../components/shared/SubmitButton";

const PaymentOption = ({
  icon,
  title,
  description,
  isSelected,
  onClick,
  marginTop = "3.5vh",
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginTop: marginTop,
        marginLeft: "4.17vw",
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      <div
        style={{
          width: "3.6rem",
          height: "3.6rem",
          background: "#F3F3F3",
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div
        style={{
          marginLeft: "4.17vw",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            color: "black",
            fontSize: "1.3rem",
            fontWeight: "700",
            wordWrap: "break-word",
          }}
        >
          {title}
        </div>
        <div
          style={{
            color: "rgba(0, 0, 0, 0.50)",
            fontSize: "1.1rem",
            fontWeight: "500",
            wordWrap: "break-word",
            marginTop: "0.75vh",
          }}
        >
          {description}
        </div>
      </div>
      <div
        style={{
          width: "27px",
          height: "27px",
          border: isSelected ? "8px #2BCDD2 solid" : "3px #949494 solid",
          borderRadius: "50%",
          boxSizing: "border-box",
          marginRight: "4.44vw",
          marginLeft: "auto",
          flexShrink: 0,
        }}
      />
    </div>
  );
};

const PaymentMethod = () => {
  const navigate = useNavigate();
  // 2. Lấy state và setter từ context
  const { paymentMethodName, setPaymentMethodName } = useOrder();

  // 3. Map tên (state) về key (để check)
  const nameToKeyMap = {
    "Tiền mặt": "cash",
    "Chuyển khoản": "card",
  };
  
  const selectedPaymentKey = nameToKeyMap[paymentMethodName] || "cash";

  // 4. Khi bấm, gọi thẳng setter từ context
  const handleSelect = (name) => {
    setPaymentMethodName(name);
  };

  // 5. Cả hai nút "X" và "Xác nhận" đều chỉ cần quay về
  const handleGoBack = () => {
    navigate("/customer/confirm-order");
  };

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      <div>
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
              cursor: "pointer",
            }}
            onClick={handleGoBack} // Dùng chung hàm
          />
          <div
            style={{
              color: "black",
              fontSize: "1.6rem",
              fontWeight: "600",
              wordWrap: "break-word",
            }}
          >
            Thanh toán
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
        <div
          style={{
            marginTop: "2vh",
            marginLeft: "4.17vw",
            color: "black",
            fontSize: "1.3rem",
            fontWeight: "600",
            wordWrap: "break-word",
          }}
        >
          Phương thức thanh toán khả dụng
        </div>
        <PaymentOption
          icon={<PaymentIcon />}
          title="Tiền mặt"
          description="Thanh toán bằng tiền mặt"
          isSelected={selectedPaymentKey === "cash"}
          onClick={() => handleSelect("Tiền mặt")} // Gọi setter
          marginTop="3.5vh"
        />
        <PaymentOption
          icon={<CardIcon />}
          title="Chuyển khoản"
          description="Thanh toán bằng cách quét mã QR"
          isSelected={selectedPaymentKey === "card"}
          onClick={() => handleSelect("Chuyển khoản")} // Gọi setter
          marginTop="2.875vh"
        />
      </div>
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
          onClick={handleGoBack} // Dùng chung hàm
        >
          Xác nhận
        </SubmitButton>
      </div>
    </div>
  );
};

export default PaymentMethod;