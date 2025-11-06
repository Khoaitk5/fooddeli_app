import { useNavigate } from "react-router-dom";
import { useOrder } from "../../contexts/OrderContext";
import CloseIcon from "../../components/shared/CloseIcon";
import PaymentIcon from "../../components/shared/PaymentIcon";
import CardIcon from "../../components/shared/CardIcon";
import SubmitButton from "../../components/shared/SubmitButton";

const PaymentOption = ({ icon, title, description, isSelected, onClick, marginTop = "3.5vh" }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginTop,
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
      <div style={{ marginLeft: "4.17vw" }}>
        <div style={{ color: "black", fontSize: "1.3rem", fontWeight: "700" }}>{title}</div>
        <div style={{ color: "rgba(0,0,0,0.5)", fontSize: "1.1rem", marginTop: "0.75vh" }}>
          {description}
        </div>
      </div>
      <div
        style={{
          width: "27px",
          height: "27px",
          border: isSelected ? "8px #2BCDD2 solid" : "3px #949494 solid",
          borderRadius: "50%",
          marginRight: "4.44vw",
          marginLeft: "auto",
        }}
      />
    </div>
  );
};

const PaymentMethod = () => {
  const navigate = useNavigate();
  const { paymentMethodName, setPaymentMethodName } = useOrder();

  const nameToKeyMap = {
    "Tiền mặt": "cash",
    "Chuyển khoản": "card",
  };
  const selectedPaymentKey = nameToKeyMap[paymentMethodName] || "cash";

  // ✅ Khi chọn phương thức thanh toán
  const handleSelect = (name) => {
    setPaymentMethodName(name);
    localStorage.setItem("selectedPaymentMethod", name);
  };

  // ✅ Chỉ lưu lựa chọn và quay lại trang ConfirmOrder
  const handleConfirm = () => {
    navigate("/customer/confirm-order");
  };

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
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
            onClick={() => navigate("/customer/confirm-order")}
          />
          <div style={{ color: "black", fontSize: "1.6rem", fontWeight: "600" }}>
            Thanh toán
          </div>
        </div>

        <div
          style={{
            width: "100%",
            height: "0.3px",
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
          }}
        >
          Phương thức thanh toán khả dụng
        </div>

        {/* Tiền mặt */}
        <PaymentOption
          icon={<PaymentIcon />}
          title="Tiền mặt"
          description="Thanh toán bằng tiền mặt khi nhận hàng"
          isSelected={selectedPaymentKey === "cash"}
          onClick={() => handleSelect("Tiền mặt")}
        />

        {/* Chuyển khoản */}
        <PaymentOption
          icon={<CardIcon />}
          title="Chuyển khoản"
          description="Thanh toán bằng cách quét mã QR"
          isSelected={selectedPaymentKey === "card"}
          onClick={() => handleSelect("Chuyển khoản")}
          marginTop="2.875vh"
        />
      </div>

      {/* Nút xác nhận */}
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
        <SubmitButton onClick={handleConfirm}>Xác nhận</SubmitButton>
      </div>
    </div>
  );
};

export default PaymentMethod;