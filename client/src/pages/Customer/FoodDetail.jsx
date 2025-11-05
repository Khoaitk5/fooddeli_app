import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NoteIcon from "../../components/shared/NoteIcon";
import SubmitButton from "../../components/shared/SubmitButton";
import { ChevronLeft } from "lucide-react";
// Giả sử bạn có import CloseIcon ở đâu đó, nhưng code này không dùng
// import CloseIcon from "../../components/shared/CloseIcon";

const FoodDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Nhận dữ liệu từ navigation state
  const {
    foodId,
    foodName = "Trà sữa",
    foodPrice = "30.000",
    foodDescription = "Mô tả",
    foodImage = "https://www.cukcuk.vn/wp-content/uploads/2023/03/gvrtrbvm08upwlo3i81y.jpeg",
    shopId,
  } = location.state || {};

  const [note, setNote] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Hàm thêm vào giỏ hàng
  const handleAddToCart = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/cart/items", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shop_id: shopId,
          product_id: foodId,
          quantity: quantity,
          unit_price: foodPrice,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert(`✅ Đã thêm "${foodName}" vào giỏ hàng!`);
        navigate(-1); // Quay lại trang trước
      } else {
        alert("❌ Không thể thêm vào giỏ hàng: " + data.message);
      }
    } catch (err) {
      console.error("❌ Lỗi khi thêm vào giỏ hàng:", err);
      alert("Đã xảy ra lỗi khi thêm vào giỏ hàng!");
    }
  };

  return (
    <div style={{ position: "relative", height: "100vh", backgroundColor: "#fff" }}>
      {/* Nút quay lại */}
      <button
        onClick={() => navigate(-1)}
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 10,
          backgroundColor: "rgba(255,255,255,0.9)",
          borderRadius: "50%",
          border: "none",
          width: 40,
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          cursor: "pointer",
        }}
      >
        <ChevronLeft size={24} />
      </button>

      {/* Hình ảnh */}
      <img
        src={foodImage || "/default-food.jpg"}
        alt={foodName}
        style={{
          width: "100%",
          height: "26.625vh",
          objectFit: "cover",
        }}
      />

      {/* Tên và Giá */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "1.5vh",
        }}
      >
        <div
          style={{
            marginLeft: "5.55vw",
            color: "black",
            fontSize: "1.9rem",
            fontWeight: "600",
          }}
        >
          {foodName}
        </div>
        <div
          style={{
            marginRight: "5.55vw",
            color: "#ff6b35",
            fontSize: "1.6rem",
            fontWeight: "700",
          }}
        >
          {Number(foodPrice).toLocaleString("vi-VN")}đ
        </div>
      </div>

      {/* Mô tả */}
      <div
        style={{
          marginLeft: "5.55vw",
          marginRight: "5.55vw",
          marginTop: "1.25vh",
          color: "#555555",
          fontSize: "1.3rem",
          fontWeight: "500",
          wordWrap: "break-word",
        }}
      >
        {foodDescription}
      </div>

      {/* Box "Thêm lưu ý" */}
      <div
        style={{
          marginTop: "1.875vh",
          marginLeft: "50%",
          transform: "translateX(-50%)",
          width: "91.67vw",
          height: "12.375vh",
          borderRadius: "1.4rem",
          border: "1px #D9D9D9 solid",
          position: "relative",
        }}
      >
        {/* Hàng "Thêm lưu ý" và "Không bắt buộc" */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "1.5vh",
          }}
        >
          <div
            style={{
              marginLeft: "5.55vw",
              color: "black",
              fontSize: "1.4rem",
              fontWeight: "500",
              wordWrap: "break-word",
            }}
          >
            Thêm lưu ý cho quán
          </div>
          <div
            style={{
              position: "relative",
              marginRight: "5.55vw",
              width: "25.55vw",
              height: "2.5vh",
              background: "#F2F2F2",
              borderRadius: 999,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                color: "black",
                fontSize: "1rem",
                fontWeight: "500",
                whiteSpace: "nowrap",
              }}
            >
              Không bắt buộc
            </div>
          </div>
        </div>

        {/* InputBox màu xám */}
        <div
          style={{
            position: "absolute",
            top: "5.375vh",
            left: "50%",
            transform: "translateX(-50%)",
            width: "83.33vw",
            height: "5.5vh",
            background: "#F2F2F2",
            borderRadius: 999,
            display: "flex",
            alignItems: "center",
            paddingLeft: "5.5vw",
            paddingRight: "5.5vw",
            boxSizing: "border-box",
          }}
        >
          <NoteIcon />

          {/* Thẻ Input đã sửa */}
          <input
            type="text"
            placeholder="Quán sẽ cố gắng đáp ứng yêu cầu."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              background: "transparent",
              marginLeft: "3.5vw",
              color: "black",
              fontSize: "1.3rem",
              fontWeight: "500",
              fontFamily: "Be Vietnam Pro",
            }}
          />
        </div>
      </div>
      {/* Số lượng và nút thêm vào giỏ */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "16px",
          backgroundColor: "#fff",
          borderTop: "1px solid #eee",
          boxShadow: "0 -2px 8px rgba(0,0,0,0.05)",
        }}
      >
        {/* Chọn số lượng */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
            marginBottom: "12px",
          }}
        >
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "1.5px solid #ff6b35",
              backgroundColor: "#fff",
              color: "#ff6b35",
              fontSize: "20px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            -
          </button>
          <span style={{ fontSize: "1.4rem", fontWeight: "600", minWidth: "30px", textAlign: "center" }}>
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "1.5px solid #ff6b35",
              backgroundColor: "#fff",
              color: "#ff6b35",
              fontSize: "20px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            +
          </button>
        </div>

        {/* Nút thêm vào giỏ */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <SubmitButton onClick={handleAddToCart}>
            Thêm vào giỏ hàng - {(Number(foodPrice) * quantity).toLocaleString("vi-VN")}đ
          </SubmitButton>
        </div>
      </div>
    </div>
  );
};

export default FoodDetail;
