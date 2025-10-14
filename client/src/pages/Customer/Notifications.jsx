import React, { useState } from "react";
import Navbar from "../../components/shared/Navbar";
import NotificationContent from "../../components/shared/NotificationContent";

// Add styles to hide scrollbar
const hideScrollbarStyles = `
  .hide-scrollbar {
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
  }
  .hide-scrollbar::-webkit-scrollbar {
    display: none; /* Chrome, Safari and Opera */
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
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <style>{hideScrollbarStyles}</style>
      {/* Fixed Header */}
      <div style={{ flexShrink: 0 }}>
        <div
          style={{
            position: "relative",
            height: "15vh",
            background: "white",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "1.875vh",
              left: "6.11vw",
              textAlign: "center",
              justifyContent: "center",
              display: "flex",
              flexDirection: "column",
              color: "black",
              fontSize: "2.2rem",
              fontWeight: "500",
              wordWrap: "break-word",
            }}
          >
            Thông báo
          </div>

          <div
            style={{
              position: "absolute",
              top: "7.875vh",
              left: "6.11vw",
              width: "42.78vw",
              height: "4.125vh",
              background: isNotificationActive ? "rgba(249, 112, 75, 0.10)" : "#F9704B",
              borderRadius: 16.5,
              justifyContent: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={handleChatClick}
          >
            <div
              style={{
                color: isNotificationActive ? "#F9704B" : "white",
                fontSize: "1.3rem",
                fontWeight: "500",
                wordWrap: "break-word",
              }}
            >
              Trò chuyện
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              top: "7.875vh",
              right: "6.11vw",
              width: "42.78vw",
              height: "4.125vh",
              background: isNotificationActive ? "#F9704B" : "rgba(249, 112, 75, 0.10)",
              borderRadius: 16.5,
              justifyContent: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={handleNotificationClick}
          >
            <div
              style={{
                justifyContent: "center",
                display: "flex",
                flexDirection: "column",
                color: isNotificationActive ? "white" : "#F9704B",
                fontSize: "1.3rem",
                fontWeight: "500",
                wordWrap: "break-word",
              }}
            >
              Thông báo
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="hide-scrollbar" style={{ flex: 1, overflowY: "auto", paddingBottom: "80px" }}>
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
