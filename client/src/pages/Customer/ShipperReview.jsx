import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CloseIcon from "../../components/shared/CloseIcon";
import StarIcon from "../../components/shared/StarIcon";

// ==========================================================
// SHIPPER REVIEW PAGE - TRANG ĐÁNH GIÁ SHIPPER
// Chức năng: Cho phép khách hàng đánh giá shipper sau khi nhận hàng
// Bao gồm: Rating sao, comment, submit review
// ==========================================================

const ShipperReview = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy thông tin đơn hàng từ navigation state
  const orderData = location.state || {};

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Styles object
  const s = {
    pageContainer: {
      backgroundColor: "#FAFAFA",
      minHeight: "100vh",
      paddingTop: "2vh",
      paddingBottom: "13vh",
      position: "relative",
    },
    closeIcon: {
      position: "absolute",
      top: "2vh",
      left: "4.17vw",
      cursor: "pointer",
      zIndex: 10,
    },
    avatarContainer: {
      display: "flex",
      justifyContent: "center",
      marginTop: "8vh",
      marginBottom: "3vh",
    },
    avatar: {
      width: "10rem",
      height: "10rem",
      borderRadius: "2rem",
      objectFit: "cover",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    },
    shipperName: {
      color: "#1A1A1A",
      fontSize: "1.6rem",
      fontWeight: "600",
      textAlign: "center",
      marginBottom: "4vh",
      padding: "0 4.17vw",
    },
    reviewContainer: {
      width: "91.67vw",
      background: "white",
      borderRadius: "1.6rem",
      marginLeft: "50%",
      transform: "translateX(-50%)",
      padding: "3vh 4.17vw",
      boxShadow: "0 2px 16px rgba(0, 0, 0, 0.06)",
    },
    reviewTitle: {
      color: "#1A1A1A",
      fontSize: "1.6rem",
      fontWeight: "600",
      marginBottom: "3vh",
      textAlign: "center",
      lineHeight: "1.5",
    },
    ratingContainer: {
      display: "flex",
      justifyContent: "center",
      gap: "2.5vw",
      marginBottom: "4vh",
      padding: "2vh 0",
    },
    starButton: {
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: "0.5vh",
      transition: "transform 0.2s ease",
    },
    commentSection: {
      marginTop: "3vh",
    },
    commentLabel: {
      color: "#666",
      fontSize: "1.3rem",
      fontWeight: "500",
      marginBottom: "1.5vh",
      display: "block",
    },
    commentInput: {
      width: "100%",
      height: "14vh",
      border: "1px solid #E8E8E8",
      borderRadius: "1.2rem",
      padding: "1.5vh 3.5vw",
      fontSize: "1.3rem",
      color: "#1A1A1A",
      resize: "none",
      outline: "none",
      fontFamily: "inherit",
      backgroundColor: "#F8F8F8",
      transition: "all 0.3s ease",
    },
    buttonContainer: {
      display: "flex",
      gap: "2.5vw",
      position: "fixed",
      bottom: "3vh",
      left: "4.17vw",
      right: "4.17vw",
      zIndex: 10,
    },
    skipButton: {
      flex: 1,
      height: "6.5vh",
      background: "white",
      borderRadius: "999px",
      border: "1.5px solid #E0E0E0",
      color: "#666",
      fontSize: "1.4rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
    submitButton: {
      flex: 1,
      height: "6.5vh",
      background: rating > 0 ? "#FE5621" : "#E0E0E0",
      borderRadius: "999px",
      border: "none",
      color: "white",
      fontSize: "1.4rem",
      fontWeight: "700",
      cursor: rating > 0 ? "pointer" : "not-allowed",
      transition: "all 0.3s ease",
      boxShadow: rating > 0 ? "0 4px 12px rgba(254, 86, 33, 0.25)" : "none",
    },
  };

  const handleRatingClick = (starValue) => {
    setRating(starValue);
  };

  const handleRatingHover = (starValue) => {
    setHoverRating(starValue);
  };

  const handleRatingLeave = () => {
    setHoverRating(0);
  };

  const handleSubmit = async () => {
    if (rating === 0 || isSubmitting || isSubmitted) return;

    setIsSubmitting(true);

    try {
      const API_BASE_URL =
        import.meta.env?.VITE_API_URL || "http://localhost:5000/api";

      const response = await fetch(`${API_BASE_URL}/reviews/shipper`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: orderData.orderId || "ORDER_001",
          rating,
          comment: comment.trim() || null,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Có lỗi xảy ra");
      }

      // ✅ Thành công - đánh dấu đã submit và chuyển đến đánh giá shop nếu chưa review
      setIsSubmitted(true);
      
      // Check nếu đã review shop
      const checkShopReview = async () => {
        try {
          const API_BASE_URL = import.meta.env?.VITE_API_URL || "http://localhost:5000/api";
          console.log('Checking shop review after submit for shopId:', orderData.shopId, 'userId:', orderData.userId);
          const response = await fetch(`${API_BASE_URL}/reviews/shop/${orderData.shopId}/stats`, {
            credentials: 'include'
          });
          const result = await response.json();
          console.log('Shop review stats after submit:', result);
          const userShopReviews = result.data?.reviews?.filter(r => r.reviewer_id === parseInt(orderData.userId)) || [];
          console.log('User shop reviews after submit:', userShopReviews);
          
          if (userShopReviews.length === 0 && orderData.shopName) {
            // Chưa review shop, chuyển đến
            console.log('Chưa review shop after submit, chuyển đến order-review');
            navigate('/customer/order-review', {
              state: {
                orderId: orderData.orderId,
                shopName: orderData.shopName,
                shopAvatar: orderData.shopAvatar,
              },
              replace: true
            });
          } else {
            // Đã review hoặc không có shop, về orders
            console.log('Đã review shop after submit, về orders');
            navigate('/customer/orders', { replace: true });
          }
        } catch (error) {
          console.error('Error checking shop review after submit:', error);
          navigate('/customer/orders', { replace: true });
        }
      };

      // Delay ngắn để đảm bảo state được cập nhật
      setTimeout(checkShopReview, 100);
    } catch (error) {
      console.error("Error submitting shipper review:", error);
      alert(error.message || "Không thể gửi đánh giá. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={s.pageContainer}>
      {/* Close Icon */}
      <CloseIcon style={s.closeIcon} onClick={() => navigate(-1)} />

      {/* Shipper Avatar */}
      <div style={s.avatarContainer}>
        <img
          style={s.avatar}
          src={orderData.shipperAvatar || "https://placehold.co/96x96"}
          alt="Shipper avatar"
        />
      </div>

      {/* Shipper Name */}
      <div style={s.shipperName}>
        {orderData.shipperName || "Tên shipper"}
      </div>

      {/* Review Form */}
      <div style={s.reviewContainer}>
        <div style={s.reviewTitle}>
          Bạn đánh giá thế nào về shipper?
        </div>

        {/* Star Rating */}
        <div style={s.ratingContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              style={{
                ...s.starButton,
                transform: (hoverRating || rating) >= star ? 'scale(1.1)' : 'scale(1)',
              }}
              onClick={() => handleRatingClick(star)}
              onMouseEnter={() => handleRatingHover(star)}
              onMouseLeave={handleRatingLeave}
            >
              <StarIcon
                width="3rem"
                height="3rem"
                fill={(hoverRating || rating) >= star ? "#FFD90C" : "#E0E0E0"}
              />
            </button>
          ))}
        </div>

        {/* Comment Section */}
        <div style={s.commentSection}>
          <label style={s.commentLabel}>
            Chia sẻ thêm về trải nghiệm giao hàng (Không bắt buộc)
          </label>
          <textarea
            style={{
              ...s.commentInput,
              borderColor: comment ? '#FE5621' : '#E8E8E8',
              backgroundColor: comment ? 'white' : '#F8F8F8',
            }}
            placeholder="Shipper thân thiện, giao hàng nhanh..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={500}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div style={s.buttonContainer}>
        <button
          style={s.skipButton}
          onClick={async () => {
            if (orderData.shopName) {
              // Check nếu đã review shop
              try {
                const API_BASE_URL = import.meta.env?.VITE_API_URL || "http://localhost:5000/api";
                console.log('Checking shop review for shopId:', orderData.shopId, 'userId:', orderData.userId);
                const response = await fetch(`${API_BASE_URL}/reviews/shop/${orderData.shopId}/stats`, {
                  credentials: 'include'
                });
                const result = await response.json();
                console.log('Shop review stats:', result);
                const userShopReviews = result.data?.reviews?.filter(r => r.reviewer_id === parseInt(orderData.userId)) || [];
                console.log('User shop reviews:', userShopReviews);
                
                if (userShopReviews.length === 0) {
                  // Chưa review shop, chuyển đến
                  console.log('Chưa review shop, chuyển đến order-review');
                  navigate('/customer/order-review', {
                    state: {
                      orderId: orderData.orderId,
                      shopName: orderData.shopName,
                      shopAvatar: orderData.shopAvatar,
                    }
                  });
                } else {
                  // Đã review shop, về orders
                  console.log('Đã review shop, về orders');
                  navigate('/customer/orders');
                }
              } catch (error) {
                console.error('Error checking shop review:', error);
                navigate('/customer/orders');
              }
            } else {
              navigate('/customer/orders');
            }
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#F5F5F5'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
        >
          Bỏ qua
        </button>
        <button
          style={s.submitButton}
          onClick={handleSubmit}
          disabled={rating === 0 || isSubmitting || isSubmitted}
        >
          {isSubmitted ? "Đã gửi ✓" : isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
        </button>
      </div>
    </div>
  );
};

export default ShipperReview;