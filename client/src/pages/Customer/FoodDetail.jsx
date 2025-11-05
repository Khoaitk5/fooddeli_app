import React, { useState } from "react";
import NoteIcon from "../../components/shared/NoteIcon";
import SubmitButton from "../../components/shared/SubmitButton";
// Giả sử bạn có import CloseIcon ở đâu đó, nhưng code này không dùng
// import CloseIcon from "../../components/shared/CloseIcon";

const FoodDetail = () => {
  const [foodName, setFoodName] = useState("Trà sữa");
  const [foodPrice, setFoodPrice] = useState("30.000₫");
  const [foodDescription, setFoodDescription] = useState("Mô tả");
  const [foodImage, setFoodImage] = useState("https://www.cukcuk.vn/wp-content/uploads/2023/03/gvrtrbvm08upwlo3i81y.jpeg");
  const [note, setNote] = useState("");

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      {/* Hình ảnh */}
      <img
        src={foodImage}
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
            color: "#2BCDD2",
            fontSize: "1.6rem",
            fontWeight: "700",
          }}
        >
          {foodPrice}
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
        <SubmitButton onClick={() => console.log("Add to cart")}>
          Thêm vào giỏ hàng
        </SubmitButton>
      </div>
    </div>
  );
};

export default FoodDetail;
