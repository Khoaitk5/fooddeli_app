import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackArrow from "../../components/shared/BackArrow";
import BinIcon from "../../components/shared/BinIcon";

export default function Cart() {
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const unitPrice = 69000;
  const total = unitPrice * quantity;

  const inc = () => setQuantity((q) => q + 1);
  const dec = () => setQuantity((q) => (q > 1 ? q - 1 : 1));
  const remove = () => setQuantity(0);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="h-screen overflow-hidden relative mx-auto bg-white">
      <div className="absolute top-[7.125vh] left-[5.28vw]">
        <button 
          onClick={handleBack}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer'
          }}
        >
          <BackArrow />
        </button>
      </div>
      <div>
        {/* Header */}
        <div
          style={{
            position: "absolute",
            top: "6.625vh",
            left: "50%",
            transform: "translateX(-50%)",
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
            color: "var(--Colors-Typography-500, #363A33)",
            fontSize: "1.7rem",
            fontFamily: "TikTok Sans",
            fontWeight: "700",
            wordWrap: "break-word",
          }}
        >
          Giỏ hàng
        </div>

        {/* Cart item card */}
        {quantity > 0 ? (
          <div
            style={{
              width: "89.44vw",
              height: "11.125vh",
              background: "white",
              borderRadius: 16,
              border: "1px #F4F7F2 solid",
              marginTop: "12.375vh",
              position: "relative",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <img
              style={{
                width: "26.67vw",
                height: "10.125vh",
                borderTopLeftRadius: 12,
                borderTopRightRadius: 4,
                borderBottomRightRadius: 4,
                borderBottomLeftRadius: 12,
                border: "1px rgba(145, 149, 142, 0.06) solid",
                position: "absolute",
                left: "1.11vw",
                objectFit: "cover",
              }}
              src="/burger_b_c_m_kim_chi.png"
              alt="product"
              loading="lazy"
            />
            <div
              style={{
                justifyContent: "center",
                display: "flex",
                flexDirection: "column",
                color: "var(--Colors-Typography-400, #60655C)",
                fontSize: "1.5rem",
                fontFamily: "TikTok Sans",
                fontWeight: "400",
                wordWrap: "break-word",
                position: "absolute",
                top: "1.5vh",
                left: "32vw",
              }}
            >
              Burger Bò Cơm kim chi
            </div>
            <div
              style={{
                justifyContent: "center",
                display: "flex",
                flexDirection: "column",
                color: "var(--Colors-Typography-500, #363A33)",
                fontSize: "1.5rem",
                fontFamily: "TikTok Sans",
                fontWeight: "600",
                wordWrap: "break-word",
                position: "absolute",
                top: "6.625vh",
                left: "32vw",
              }}
            >
              {unitPrice.toLocaleString("vi-VN")} ₫
            </div>
            <div
              style={{
                position: "absolute",
                bottom: "1.5vh",
                right: "3.33vw",
                display: "flex",
                alignItems: "center",
                gap: "2.22rem",
                color: "#60655c",
              }}
            >
              <button
                aria-label={quantity > 1 ? "Giảm" : "Xóa"}
                onClick={quantity > 1 ? dec : remove}
                style={{
                  width: "8.89vw",
                  height: "4vh",
                  background: "#F4F7F2",
                  borderRadius: 9999,
                  display: "grid",
                  placeItems: "center",
                  border: "none",
                  color: "#60655c",
                }}
              >
                {quantity > 1 ? (
                  <svg
                    width="1rem"
                    height="0.2rem"
                    viewBox="0 0 10 2"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.66852 0.285835C9.0432 0.312598 9.3335 0.624367 9.3335 1C9.3335 1.37563 9.0432 1.6874 8.66852 1.71416L4.99931 1.97625C4.77794 1.99206 4.55572 1.99206 4.33434 1.97625L0.665132 1.71416C0.290454 1.6874 0.000159919 1.37563 0.000159935 0.999999C0.000159952 0.624366 0.290454 0.312597 0.665132 0.285835L4.33434 0.0237487C4.55572 0.00793624 4.77794 0.00793626 4.99931 0.0237488L8.66852 0.285835Z"
                      fill="#60635E"
                    />
                  </svg>
                ) : (
                  <BinIcon />
                )}
              </button>
              <div
                style={{
                  width: "100%",
                  textBoxTrim: "trim-both",
                  textBoxEdge: "cap alphabetic",
                  justifyContent: "center",
                  display: "flex",
                  flexDirection: "column",
                  color: "#60655C",
                  fontSize: "1.5rem",
                  fontFamily: "TikTok Sans",
                  fontWeight: "500",
                  wordWrap: "break-word",
                }}
              >
                {quantity}
              </div>
              <button
                aria-label="Tăng"
                onClick={inc}
                style={{
                  width: "8.89vw",
                  height: "4vh",
                  background: "#F4F7F2",
                  borderRadius: 9999,
                  display: "grid",
                  placeItems: "center",
                  border: "none",
                  color: "#60655c",
                }}
              >
                <svg
                  width="1rem"
                  height="1rem"
                  viewBox="0 0 10 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.66699 0C5.04248 0.000164651 5.3541 0.290467 5.38086 0.665039L5.59961 3.73242L8.66797 3.95215C9.04265 3.97891 9.33301 4.29136 9.33301 4.66699C9.33284 5.04248 9.04254 5.3541 8.66797 5.38086L5.59961 5.59961L5.38086 8.66797C5.3541 9.04254 5.04248 9.33284 4.66699 9.33301C4.29136 9.33301 3.97891 9.04265 3.95215 8.66797L3.73242 5.59961L0.665039 5.38086C0.290469 5.3541 0.000167321 5.04248 0 4.66699C1.64194e-08 4.29136 0.290361 3.97891 0.665039 3.95215L3.73242 3.73242L3.95215 0.665039C3.97891 0.290361 4.29136 0 4.66699 0Z"
                    fill="#60635E"
                  />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-[12px] border border-dashed border-[#e8ebe6] p-6 text-center text-[#91958e]">
            Giỏ hàng trống
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div>
        <div className="flex items-center justify-between">
          <div
            style={{
              justifyContent: "center",
              display: "flex",
              flexDirection: "column",
              color: "#363A33",
              fontSize: "2.3rem",
              fontFamily: "TikTok Sans",
              fontWeight: "600",
              wordWrap: "break-word",
              position: "absolute",
              left: "5.28vw",
              top: "94.45vh",
              transform: "translateY(-50%)",
            }}
          >
            {total.toLocaleString("vi-VN")} ₫
          </div>
          <a
            href="/customer/checkout"
            style={{
              width: "59.72vw",
              height: "6.4vh",
              background: "linear-gradient(0deg, #F9704B 0%, #F9704B 100%)",
              boxShadow: "0px 1px 0px white inset",
              borderRadius: 12,
              position: "absolute",
              top: "91.25vh",
              right: "5.28vw",
              display: "grid",
              placeItems: "center",
              color: "white",
              fontSize: "1.5rem",
              textDecoration: "none",
              fontFamily: "TikTok Sans",
              fontWeight: "700",
            }}
          >
            Tiến hành thanh toán
          </a>
        </div>
      </div>
    </div>
  );
}
