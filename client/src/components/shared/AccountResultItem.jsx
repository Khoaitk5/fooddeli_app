import React, { useState } from "react";

const AccountResultItem = () => {
  const accounts = [
    { accountName: "Lotteria Vietnam", username: "lotteriavietnam", followers: "46.0K follower" },
    { accountName: "McDonald's VN", username: "mcdonalds_vn", followers: "120.5K follower" },
    { accountName: "KFC Vietnam", username: "kfc_vietnam", followers: "89.2K follower" },
    { accountName: "Pizza Hut VN", username: "pizzahut_vn", followers: "34.7K follower" },
    { accountName: "Burger King VN", username: "burgerking_vn", followers: "67.8K follower" },
    { accountName: "Starbucks VN", username: "starbucks_vn", followers: "150.3K follower" },
    { accountName: "Jollibee VN", username: "jollibee_vn", followers: "98.1K follower" },
    { accountName: "Domino's Pizza VN", username: "dominos_vn", followers: "45.6K follower" },
  ];

  const [followedStates, setFollowedStates] = useState(accounts.map(() => false));

  const handleFollow = (index) => {
    setFollowedStates(prev => prev.map((followed, i) => i === index ? !followed : followed));
  };

  return (
    <div
      style={{
        scrollbarWidth: 'none', // Firefox
        msOverflowStyle: 'none', // IE and Edge
      }}
      className="scrollbar-hide" // Custom class for webkit scrollbar
    >
      {accounts.map((account, index) => (
        <div key={index}>
          <div
            style={{
              position: "absolute",
              top: `${1.25 + index * 10}vh`,
              left: "3.61vw",
              width: "16.67vw",
              height: "16.67vw",
              background: "#D9D9D9",
              borderRadius: 9999,
            }}
          />

          <div
            style={{
              position: "absolute",
              top: `${1.75 + index * 10}vh`,
              left: "22.5vw",
              justifyContent: "center",
              display: "flex",
              flexDirection: "column",
              color: "black",
              fontSize: "1.3rem",
              fontWeight: "600",
              wordWrap: "break-word",
            }}
          >
            {account.accountName}
          </div>

          <div
            style={{
              position: "absolute",
              top: `${4.25 + index * 10}vh`,
              left: "22.5vw",
              justifyContent: "center",
              display: "flex",
              flexDirection: "column",
              color: "#8A8B8F",
              fontSize: "1.2rem",
              fontWeight: "400",
              wordWrap: "break-word",
            }}
          >
            {account.username}
          </div>

          <div
            style={{
              position: "absolute",
              top: `${6.625 + index * 10}vh`,
              left: "22.5vw",
              justifyContent: "center",
              display: "flex",
              flexDirection: "column",
              color: "#8A8B8F",
              fontSize: "1.1rem",
              fontWeight: "400",
              wordWrap: "break-word",
            }}
          >
            {account.followers}
          </div>

          <div
            style={{
              position: "absolute",
              top: `${3.125 + index * 10}vh`,
              right: "3.61vw",
              width: "22.2vw",
              height: "3.625vh",
              background: followedStates[index] ? "#F5F5F5" : "#F9704B",
              borderRadius: 9999,
              cursor: "pointer",
            }}
            onClick={() => handleFollow(index)}
          />

          <div
            style={{
              position: "absolute",
              top: `${3.125 + index * 10}vh`,
              right: "3.61vw",
              width: "22.2vw",
              height: "3.625vh",
              justifyContent: "center",
              display: "flex",
              flexDirection: "column",
              textAlign: "center",
              color: followedStates[index] ? "black" : "white",
              fontSize: "1.3rem",
              fontWeight: "600",
              wordWrap: "break-word",
              cursor: "pointer",
            }}
            onClick={() => handleFollow(index)}
          >
            {followedStates[index] ? "Đã follow" : "Follow"}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AccountResultItem;
