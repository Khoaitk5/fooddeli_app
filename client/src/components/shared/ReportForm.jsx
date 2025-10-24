import React, { useState } from "react";

const ReportForm = ({ isVisible, onClose }) => {
  const [reportText, setReportText] = useState("");
  const [selectedReason, setSelectedReason] = useState(null);

  if (!isVisible) return null;

  const handleSubmit = () => {
    // Handle report submission
    console.log("Report submitted:", reportText);
    setReportText("");
    onClose();
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0, 0, 0, 0.5)",
          zIndex: 15,
        }}
        onClick={onClose}
      />
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "56vh",
          background: "white",
          borderTopLeftRadius: 22,
          borderTopRightRadius: 22,
          zIndex: 20,
          padding: "20px",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            position: "absolute",
            left: "6.11vw",
            top: "3.25vh",
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
            color: "black",
            fontSize: "1.8rem",
            fontWeight: "500",
            wordWrap: "break-word",
          }}
        >
          Báo cáo bài nhận xét
        </div>

        <div
          style={{
            position: "absolute",
            left: "6.11vw",
            top: "7.25vh",
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
            color: "#8A8B8F",
            fontSize: "1.4rem",
            fontWeight: "400",
            wordWrap: "break-word",
          }}
        >
          Bài nhận xét được báo cáo sẽ được xem xét
          <br />
          bởi đội ngũ Admin của BoBo Food trước khi
          <br />
          đưa ra bất kỳ quyết định nào. Báo cáo của
          <br />
          bạn cũng sẽ được ẩn danh.
        </div>

        <div
          style={{
            position: "absolute",
            left: "5.28vw",
            right: "6.11vw",
            top: "20.75vh",
            display: "flex",
            flexDirection: "column",
            gap: "2vh",
          }}
        >
          {[
            "Nội dung xúc phạm, hận thù hoặc khiêu dâm",
            "Liên quan đến thông tin cá nhân hoặc bị hạn chế",
            "Thông tin không liên quan hoặc sai lệch",
            "Thư rác hoặc quảng cáo",
            "Khác",
          ].map((reason, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
              }}
              onClick={() => setSelectedReason(index)}
            >
              <div
                style={{
                  color: "black",
                  fontSize: "1.3rem",
                  fontWeight: "400",
                  wordWrap: "break-word",
                }}
              >
                {reason}
              </div>
              <div
                style={{
                  width: "1.8rem",
                  height: "1.8rem",
                  background: "white",
                  borderRadius: 9999,
                  border:
                    selectedReason === index
                      ? "7px #F9704B solid"
                      : "2px #A3A3A3 solid",
                  flexShrink: 0,
                }}
              />
            </div>
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            bottom: "1.75vh",
            width: "87.78vw",
            height: "6.375vh",
            background: selectedReason !== null ? "#D32E10" : "#F5F5F5",
            borderRadius: 999,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => {
            if (selectedReason !== null) {
              handleSubmit();
            }
          }}
        >
          <div
            style={{
              color: selectedReason !== null ? "white" : "#8A8B8F",
              fontSize: "1.4rem",
              fontWeight: "500",
              wordWrap: "break-word",
            }}
          >
            Báo cáo
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportForm;
