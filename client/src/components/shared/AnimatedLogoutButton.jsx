import React, { useRef, useEffect } from 'react';
// KHÔNG CẦN import './AnimatedLogoutButton.css';

// Đối tượng state được port trực tiếp từ script.js
const logoutButtonStates = {
  'default': { '--figure-duration': '100', '--transform-figure': 'none', '--walking-duration': '100', '--transform-arm1': 'none', '--transform-wrist1': 'none', '--transform-arm2': 'none', '--transform-wrist2': 'none', '--transform-leg1': 'none', '--transform-calf1': 'none', '--transform-leg2': 'none', '--transform-calf2': 'none' },
  'hover': { '--figure-duration': '100', '--transform-figure': 'translateX(1.5px)', '--walking-duration': '100', '--transform-arm1': 'rotate(-5deg)', '--transform-wrist1': 'rotate(-15deg)', '--transform-arm2': 'rotate(5deg)', '--transform-wrist2': 'rotate(6deg)', '--transform-leg1': 'rotate(-10deg)', '--transform-calf1': 'rotate(5deg)', '--transform-leg2': 'rotate(20deg)', '--transform-calf2': 'rotate(-20deg)' },
  'walking1': { '--figure-duration': '300', '--transform-figure': 'translateX(13px)', '--walking-duration': '300', '--transform-arm1': 'translateX(-5px) translateY(-2px) rotate(120deg)', '--transform-wrist1': 'rotate(-5deg)', '--transform-arm2': 'translateX(5px) rotate(-110deg)', '--transform-wrist2': 'rotate(-5deg)', '--transform-leg1': 'translateX(-4px) rotate(80deg)', '--transform-calf1': 'rotate(-30deg)', '--transform-leg2': 'translateX(5px) rotate(-60deg)', '--transform-calf2': 'rotate(20deg)' },
  'walking2': { '--figure-duration': '400', '--transform-figure': 'translateX(20px)', '--walking-duration': '300', '--transform-arm1': 'rotate(60deg)', '--transform-wrist1': 'rotate(-15deg)', '--transform-arm2': 'rotate(-45deg)', '--transform-wrist2': 'rotate(6deg)', '--transform-leg1': 'rotate(-5deg)', '--transform-calf1': 'rotate(10deg)', '--transform-leg2': 'rotate(10deg)', '--transform-calf2': 'rotate(-20deg)' },
  'falling1': { '--figure-duration': '1600', '--walking-duration': '400', '--transform-arm1': 'rotate(-60deg)', '--transform-wrist1': 'none', '--transform-arm2': 'rotate(30deg)', '--transform-wrist2': 'rotate(120deg)', '--transform-leg1': 'rotate(-30deg)', '--transform-calf1': 'rotate(-20deg)', '--transform-leg2': 'rotate(20deg)' },
  'falling2': { '--walking-duration': '300', '--transform-arm1': 'rotate(-100deg)', '--transform-arm2': 'rotate(-60deg)', '--transform-wrist2': 'rotate(60deg)', '--transform-leg1': 'rotate(80deg)', '--transform-calf1': 'rotate(20deg)', '--transform-leg2': 'rotate(-60deg)' },
  'falling3': { '--walking-duration': '500', '--transform-arm1': 'rotate(-30deg)', '--transform-wrist1': 'rotate(40deg)', '--transform-arm2': 'rotate(50deg)', '--transform-wrist2': 'none', '--transform-leg1': 'rotate(-30deg)', '--transform-leg2': 'rotate(20deg)', '--transform-calf2': 'none' }
};

// Toàn bộ nội dung file CSS được đưa vào đây
const cssString = `
  .logoutButton {
    --figure-duration: 100ms;
    --transform-figure: none;
    --walking-duration: 100ms;
    --transform-arm1: none;
    --transform-wrist1: none;
    --transform-arm2: none;
    --transform-wrist2: none;
    --transform-leg1: none;
    --transform-calf1: none;
    --transform-leg2: none;
    --transform-calf2: none;

    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: 2px solid transparent;
    border-radius: 25px;
    color: #f4f7ff;
    cursor: pointer;
    display: block;
    font-family: 'Quicksand', sans-serif;
    font-size: 16px;
    font-weight: 700;
    height: 50px;
    outline: none;
    padding: 0 0 0 25px;
    perspective: 100px;
    position: relative;
    text-align: left;
    width: 160px;
    -webkit-tap-highlight-color: transparent;
    box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(10px);
  }

  .logoutButton::before {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%);
    border-radius: 23px;
    content: '';
    display: block;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    transform: none;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    width: 100%;
    z-index: 2;
    backdrop-filter: blur(5px);
  }

  .logoutButton:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(102, 126, 234, 0.4);
  }

  .logoutButton:hover .door {
    transform: rotateY(20deg);
  }

  .logoutButton:active::before {
    transform: scale(0.98);
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.2) 100%);
  }

  .logoutButton:active .door {
    transform: rotateY(28deg);
  }

  .logoutButton:active {
    transform: translateY(0);
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
  }

  .logoutButton.clicked::before {
    transform: none;
  }

  .logoutButton.clicked .door {
    transform: rotateY(35deg);
  }

  .logoutButton.door-slammed .door {
    transform: none;
    transition: transform 100ms ease-in 250ms;
  }

  .logoutButton.falling {
    animation: shake 200ms linear;
  }

  .logoutButton.falling .bang {
    animation: flash 300ms linear;
  }

  .logoutButton.falling .figure {
    animation: spin 1000ms infinite linear;
    bottom: -1200px;
    opacity: 0;
    right: 1px;
    transition: transform calc(var(--figure-duration) * 1ms) linear,
      bottom calc(var(--figure-duration) * 1ms) cubic-bezier(0.7, 0.1, 1, 1) 100ms,
      opacity calc(var(--figure-duration) * 0.25ms) linear calc(var(--figure-duration) * 0.75ms);
    z-index: 1;
  }

  /* Các style cho theme sáng, phù hợp với UserProfile.jsx */
  .logoutButton--light {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
    box-shadow: 0 8px 32px rgba(255, 107, 107, 0.3);
  }

  .logoutButton--light::before {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%);
  }

  .logoutButton--light:hover {
    box-shadow: 0 12px 40px rgba(255, 107, 107, 0.4);
  }

  .logoutButton--light:active {
    box-shadow: 0 4px 20px rgba(255, 107, 107, 0.3);
  }

  .button-text {
    color: #f4f7ff;
    font-weight: 700;
    position: relative;
    z-index: 10;
  }

  .logoutButton svg { /* Sửa lại để đảm bảo selector không bị lỗi */
    display: block;
    position: absolute;
  }

  .figure {
    bottom: 6px;
    fill: #2bcdd2;
    right: 22px;
    transform: var(--transform-figure);
    transition: transform calc(var(--figure-duration) * 1ms) cubic-bezier(0.2, 0.1, 0.80, 0.9);
    width: 36px;
    z-index: 4;
  }

  .door, .doorway {
    bottom: 5px;
    fill: #f4f7ff;
    right: 15px;
    width: 38px;
  }

  .door {
    transform: rotateY(20deg);
    transform-origin: 100% 50%;
    transform-style: preserve-3d;
    transition: transform 200ms ease;
    z-index: 5;
  }

  .door path {
    fill: #2bcdd2;
    stroke: #2bcdd2;
    stroke-width: 4;
  }

  .doorway {
    z-index: 3;
  }

  .bang {
    opacity: 0;
  }

  .arm1, .wrist1, .arm2, .wrist2, .leg1, .calf1, .leg2, .calf2 {
    transition: transform calc(var(--walking-duration) * 1ms) ease-in-out;
  }

  .arm1 {
    transform: var(--transform-arm1);
    transform-origin: 52% 45%;
  }

  .wrist1 {
    transform: var(--transform-wrist1);
    transform-origin: 59% 55%;
  }

  .arm2 {
    transform: var(--transform-arm2);
    transform-origin: 47% 43%;
  }

  .wrist2 {
    transform: var(--transform-wrist2);
    transform-origin: 35% 47%;
  }

  .leg1 {
    transform: var(--transform-leg1);
    transform-origin: 47% 64.5%;
  }

  .calf1 {
    transform: var(--transform-calf1);
    transform-origin: 55.5% 71.5%;
  }

  .leg2 {
    transform: var(--transform-leg2);
    transform-origin: 43% 63%;
  }

  .calf2 {
    transform: var(--transform-calf2);
    transform-origin: 41.5% 73%;
  }

  @keyframes spin {
    from { transform: rotate(0deg) scale(0.94); }
    to { transform: rotate(359deg) scale(0.94); }
  }

  @keyframes shake {
    0% { transform: rotate(-1deg); }
    50% { transform: rotate(2deg); }
    100% { transform: rotate(-1deg); }
  }

  @keyframes flash {
    0% { opacity: 0.4; }
    100% { opacity: 0; }
  }
`;

const AnimatedLogoutButton = ({ onLogout }) => {
  const buttonRef = useRef(null);
  const buttonState = useRef('default');
  const timeouts = useRef([]);

  // Hàm helper để cập nhật CSS variables
  const updateButtonState = (state) => {
    if (logoutButtonStates[state] && buttonRef.current) {
      buttonState.current = state;
      for (let key in logoutButtonStates[state]) {
        buttonRef.current.style.setProperty(key, logoutButtonStates[state][key]);
      }
    }
  };

  // Hàm helper để xóa tất cả timeouts
  const clearTimeouts = () => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
  };

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseEnter = () => {
      if (buttonState.current === 'default') {
        updateButtonState('hover');
      }
    };

    const handleMouseLeave = () => {
      if (buttonState.current === 'hover') {
        updateButtonState('default');
      }
    };

    // ----- BẮT ĐẦU THAY ĐỔI -----
    const handleClick = () => {
      // Ngăn chặn click khi đang chạy animation
      if (buttonState.current !== 'default' && buttonState.current !== 'hover') return;
      
      clearTimeouts();
      
      button.classList.add('clicked');
      updateButtonState('walking1');
      
      timeouts.current.push(setTimeout(() => {
        button.classList.add('door-slammed');
        updateButtonState('walking2');
        
        timeouts.current.push(setTimeout(() => {
          button.classList.add('falling');
          updateButtonState('falling1');
          
          // ***** LỆNH LOGOUT ĐÃ BỊ XÓA KHỎI ĐÂY *****
          // if (onLogout) { onLogout(); } // <--- ĐÃ XÓA
          
          timeouts.current.push(setTimeout(() => {
            updateButtonState('falling2');
            
            timeouts.current.push(setTimeout(() => {
              updateButtonState('falling3');
              
              timeouts.current.push(setTimeout(() => {
                
                // ***** LỆNH LOGOUT ĐƯỢC CHUYỂN VÀO ĐÂY *****
                // Nó sẽ chạy sau khi toàn bộ animation kết thúc
                if (onLogout) {
                  onLogout();
                }

                // Chỉ reset class nếu component còn tồn tại
                if (buttonRef.current) {
                  button.classList.remove('clicked');
                  button.classList.remove('door-slammed');
                  button.classList.remove('falling');
                  updateButtonState('default');
                }
              }, 1000)); // <--- Timeout cuối cùng
              
            }, parseInt(logoutButtonStates['falling2']['--walking-duration'], 10)));
            
          }, parseInt(logoutButtonStates['falling1']['--walking-duration'], 10)));
          
        }, parseInt(logoutButtonStates['walking2']['--figure-duration'], 10)));
        
      }, parseInt(logoutButtonStates['walking1']['--figure-duration'], 10)));
    };
    // ----- KẾT THÚC THAY ĐỔI -----


    // Gán listeners
    button.addEventListener('mouseenter', handleMouseEnter);
    button.addEventListener('mouseleave', handleMouseLeave);
    button.addEventListener('click', handleClick);

    // Hàm cleanup để gỡ bỏ listeners và timeouts khi component unmount
    return () => {
      button.removeEventListener('mouseenter', handleMouseEnter);
      button.removeEventListener('mouseleave', handleMouseLeave);
      button.removeEventListener('click', handleClick);
      clearTimeouts();
    };
  }, [onLogout]); // Phụ thuộc vào onLogout

  return (
    // Thẻ <style> sẽ chèn CSS vào <head>
    <React.Fragment>
      <style>{cssString}</style>
      
      {/* Sử dụng 'logoutButton--light' để phù hợp với nền sáng của UserProfile */}
      <button
        ref={buttonRef}
        className="logoutButton logoutButton--light"
      >
        <svg className="doorway" viewBox="0 0 100 100">
          <path d="M93.4 86.3H58.6c-1.9 0-3.4-1.5-3.4-3.4V17.1c0-1.9 1.5-3.4 3.4-3.4h34.8c1.9 0 3.4 1.5 3.4 3.4v65.8c0 1.9-1.5 3.4-3.4 3.4z" />
          <path className="bang" d="M40.5 43.7L26.6 31.4l-2.5 6.7zM41.9 50.4l-19.5-4-1.4 6.3zM40 57.4l-17.7 3.9 3.9 5.7z" />
        </svg>
        <svg className="figure" viewBox="0 0 100 100">
          <circle cx="52.1" cy="32.4" r="6.4" />
          <path d="M50.7 62.8c-1.2 2.5-3.6 5-7.2 4-3.2-.9-4.9-3.5-4-7.8.7-3.4 3.1-13.8 4.1-15.8 1.7-3.4 1.6-4.6 7-3.7 4.3.7 4.6 2.5 4.3 5.4-.4 3.7-2.8 15.1-4.2 17.9z" />
          <g className="arm1">
            <path d="M55.5 56.5l-6-9.5c-1-1.5-.6-3.5.9-4.4 1.5-1 3.7-1.1 4.6.4l6.1 10c1 1.5.3 3.5-1.1 4.4-1.5.9-3.5.5-4.5-.9z" />
            <path className="wrist1" d="M69.4 59.9L58.1 58c-1.7-.3-2.9-1.9-2.6-3.7.3-1.7 1.9-2.9 3.7-2.6l11.4 1.9c1.7.3 2.9 1.9 2.6 3.7-.4 1.7-2 2.9-3.8 2.6z" />
          </g>
          <g className="arm2">
            <path d="M34.2 43.6L45 40.3c1.7-.6 3.5.3 4 2 .6 1.7-.3 4-2 4.5l-10.8 2.8c-1.7.6-3.5-.3-4-2-.6-1.6.3-3.4 2-4z" />
            <path className="wrist2" d="M27.1 56.2L32 45.7c.7-1.6 2.6-2.3 4.2-1.6 1.6.7 2.3 2.6 1.6 4.2L33 58.8c-.7 1.6-2.6 2.3-4.2 1.6-1.7-.7-2.4-2.6-1.7-4.2z" />
          </g>
          <g className="leg1">
            <path d="M52.1 73.2s-7-5.7-7.9-6.5c-.9-.9-1.2-3.5-.1-4.9 1.1-1.4 3.8-1.9 5.2-.9l7.9 7c1.4 1.1 1.7 3.5.7 4.9-1.1 1.4-4.4 1.5-5.8.4z" />
            <path className="calf1" d="M52.6 84.4l-1-12.8c-.1-1.9 1.5-3.6 3.5-3.7 2-.1 3.7 1.4 3.8 3.4l1 12.8c.1 1.9-1.5 3.6-3.5 3.7-2 0-3.7-1.5-3.8-3.4z" />
          </g>
          <g className="leg2">
            <path d="M37.8 72.7s1.3-10.2 1.6-11.4 2.4-2.8 4.1-2.6c1.7.2 3.6 2.3 3.4 4l-1.8 11.1c-.2 1.7-1.7 3.3-3.4 3.1-1.8-.2-4.1-2.4-3.9-4.2z" />
            <path className="calf2" d="M29.5 82.3l9.6-10.9c1.3-1.4 3.6-1.5 5.1-.1 1.5 1.4.4 4.9-.9 6.3l-8.5 9.6c-1.3 1.4-3.6 1.5-5.1.1-1.4-1.3-1.5-3.5-.2-5z" />
          </g>
        </svg>
        <svg className="door" viewBox="0 0 100 100">
          <path d="M93.4 86.3H58.6c-1.9 0-3.4-1.5-3.4-3.4V17.1c0-1.9 1.5-3.4 3.4-3.4h34.8c1.9 0 3.4 1.5 3.4 3.4v65.8c0 1.9-1.5 3.4-3.4 3.4z" />
          <circle cx="66" cy="50" r="3.7" />
        </svg>
        <span className="button-text">Đăng xuất</span>
      </button>
    </React.Fragment>
  );
};

export default AnimatedLogoutButton;