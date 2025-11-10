import React, { useState } from "react";
import Navbar from "../../components/shared/Navbar";
import NotificationContent from "../../components/shared/NotificationContent";
import { MessageCircle, Bell } from "lucide-react";

const hideScrollbarStyles = `
  .hide-scrollbar {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  
  .tab-button {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .tab-button:active {
    transform: scale(0.97);
  }
`;

const Notifications = () => {
  const [isNotificationActive, setIsNotificationActive] = useState(false);

  // Sample data - in real app this would come from API
  const notifications = [
    {
      id: 1,
      title: "Đơn hàng của bạn đã được giao thành công!",
      body: "Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi. Đơn hàng #12345 đã được giao đến địa chỉ của bạn.",
      time: "2 giờ trước"
    },
    {
      id: 2,
      title: "Khuyến mãi đặc biệt!",
      body: "Giảm 30% cho đơn hàng tiếp theo. Sử dụng mã FOOD30 khi đặt hàng.",
      time: "1 ngày trước"
    },
    {
      id: 3,
      title: "Cập nhật trạng thái đơn hàng",
      body: "Đơn hàng #12344 đang được chuẩn bị bởi nhà bếp. Dự kiến giao trong 25 phút.",
      time: "3 giờ trước"
    },
    {
      id: 4,
      title: "Phản hồi từ nhà hàng",
      body: "Cảm ơn bạn đã đánh giá 5 sao! Chúng tôi rất vui khi phục vụ bạn.",
      time: "2 ngày trước"
    },
    {
      id: 5,
      title: "Món mới trong tuần",
      body: "Khám phá các món ăn mới với giá ưu đãi. Burger gà sốt mật ong chỉ 45k!",
      time: "3 ngày trước"
    },
    {
      id: 6,
      title: "Chương trình tích điểm",
      body: "Bạn đã tích được 150 điểm. Đổi 100 điểm để được giảm 10k cho đơn hàng tiếp theo!",
      time: "5 ngày trước"
    }
  ];

  const chats = [
    {
      id: 1,
      sender: "Hỗ trợ khách hàng",
      message: "Xin chào! Tôi có thể giúp gì cho bạn hôm nay? Nếu bạn có câu hỏi về đơn hàng hoặc cần hỗ trợ, hãy cho tôi biết nhé!",
      time: "Online • 2 phút trước"
    },
    {
      id: 2,
      sender: "Nhà hàng ABC",
      message: "Đơn hàng của bạn đang được chuẩn bị. Bếp trưởng đang làm món gà rán đặc biệt theo yêu cầu của bạn.",
      time: "5 phút trước"
    },
    {
      id: 3,
      sender: "Tài xế giao hàng",
      message: "Xin chào! Tôi là tài xế giao hàng. Tôi đang trên đường đến nhà bạn, dự kiến 10 phút nữa sẽ đến.",
      time: "15 phút trước"
    },
    {
      id: 4,
      sender: "Nhà hàng Pizza Hot",
      message: "Cảm ơn bạn đã đặt hàng! Pizza hải sản của bạn sẽ được nướng trong 15 phút. Bạn có muốn thêm nước uống không?",
      time: "1 giờ trước"
    },
    {
      id: 5,
      sender: "Hỗ trợ kỹ thuật",
      message: "Vấn đề đăng nhập của bạn đã được khắc phục. Bạn có thể thử đăng nhập lại bây giờ.",
      time: "2 giờ trước"
    },
    {
      id: 6,
      sender: "Nhà hàng Sushi Fresh",
      message: "Combo sushi đặc biệt hôm nay giảm 20%! Bao gồm 12 miếng sushi tươi ngon với giá chỉ 120k.",
      time: "3 giờ trước"
    }
  ];

  const handleChatClick = () => {
    setIsNotificationActive(false);
  };

  const handleNotificationClick = () => {
    setIsNotificationActive(true);
  };
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#FAFAFA" }}>
      <style>{hideScrollbarStyles}</style>
      
      {/* Fixed Header */}
      <div style={{ flexShrink: 0, backgroundColor: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
        <div
          style={{
            position: "relative",
            height: "15vh",
            background: "linear-gradient(135deg, #FE5621 0%, #FF7A50 100%)",
          }}
        >
          {/* Title with icon */}
          <div
            style={{
              position: "absolute",
              top: "2.5vh",
              left: "6.11vw",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <div style={{
              width: "2.8rem",
              height: "2.8rem",
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <Bell size={18} color="white" strokeWidth={2.5} />
            </div>
            <div
              style={{
                color: "white",
                fontSize: "2.2rem",
                fontWeight: "600",
                letterSpacing: "-0.5px",
                textShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              Thông báo
            </div>
          </div>

          {/* Tab Buttons */}
          <div
            style={{
              position: "absolute",
              top: "8.5vh",
              left: "6.11vw",
              right: "6.11vw",
              display: "flex",
              gap: "1rem",
              padding: "0.4rem",
              backgroundColor: "rgba(255,255,255,0.15)",
              borderRadius: "1.2rem",
              backdropFilter: "blur(10px)",
            }}
          >
            {/* Chat Tab */}
            <div
              className="tab-button"
              style={{
                flex: 1,
                height: "4.5vh",
                background: !isNotificationActive 
                  ? "white" 
                  : "transparent",
                borderRadius: "0.9rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                cursor: "pointer",
                boxShadow: !isNotificationActive 
                  ? "0 4px 12px rgba(0,0,0,0.15)" 
                  : "none",
              }}
              onClick={handleChatClick}
            >
              <MessageCircle 
                size={16} 
                color={!isNotificationActive ? "#FE5621" : "white"} 
                strokeWidth={2.5}
              />
              <div
                style={{
                  color: !isNotificationActive ? "#FE5621" : "white",
                  fontSize: "1.35rem",
                  fontWeight: "600",
                  letterSpacing: "-0.3px",
                }}
              >
                Trò chuyện
              </div>
            </div>

            {/* Notification Tab */}
            <div
              className="tab-button"
              style={{
                flex: 1,
                height: "4.5vh",
                background: isNotificationActive 
                  ? "white" 
                  : "transparent",
                borderRadius: "0.9rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                cursor: "pointer",
                boxShadow: isNotificationActive 
                  ? "0 4px 12px rgba(0,0,0,0.15)" 
                  : "none",
              }}
              onClick={handleNotificationClick}
            >
              <Bell 
                size={16} 
                color={isNotificationActive ? "#FE5621" : "white"} 
                strokeWidth={2.5}
              />
              <div
                style={{
                  color: isNotificationActive ? "#FE5621" : "white",
                  fontSize: "1.35rem",
                  fontWeight: "600",
                  letterSpacing: "-0.3px",
                }}
              >
                Thông báo
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div 
        className="hide-scrollbar" 
        style={{ 
          flex: 1, 
          overflowY: "auto", 
          paddingBottom: "80px",
          paddingTop: "1rem",
        }}
      >
        <NotificationContent
          isNotificationActive={isNotificationActive}
          notifications={notifications}
          chats={chats}
        />
      </div>

      <Navbar />
    </div>
  );
};

export default Notifications;
