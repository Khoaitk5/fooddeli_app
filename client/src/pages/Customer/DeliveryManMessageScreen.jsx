import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackArrow from '../../components/shared/BackArrow';

const COLORS = {
  primary: '#666666',
  primaryLight: '#999999',
  white: 'white',
  gray: '#f5f5f5',
  lightGray: '#e0e0e0',
  darkGray: '#cccccc',
  text: '#333333',
  border: '#d0d0d0',
  shadow: 'rgba(0,0,0,0.1)',
  shadowDark: 'rgba(0,0,0,0.05)'
};

const GRADIENTS = {
  primary: COLORS.primary,
  background: COLORS.white,
  inputArea: COLORS.white
};

const FONT = {
  family: 'Be Vietnam Pro',
  size: {
    small: '1rem',
    medium: '1.4rem',
    large: '1.5rem',
    xl: '2rem'
  },
  weight: {
    normal: '400',
    bold: '700'
  }
};

const STYLES = {
  container: {
    height: '100vh',
    overflow: 'hidden',
    background: COLORS.white,
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    height: '10vh',
    background: COLORS.white,
    display: 'flex',
    alignItems: 'center',
    padding: '0 5vw',
    boxShadow: `0 1px 3px ${COLORS.shadow}`,
    borderBottom: `1px solid ${COLORS.border}`
  },
  avatar: {
    width: '8vw',
    height: '8vw',
    borderRadius: '50%',
    background: COLORS.lightGray,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: FONT.size.xl,
    color: COLORS.text,
    fontWeight: FONT.weight.bold,
    marginRight: '3vw'
  },
  name: {
    fontSize: FONT.size.large,
    fontFamily: FONT.family,
    fontWeight: FONT.weight.bold,
    color: COLORS.text,
    textShadow: 'none'
  },
  messagesArea: {
    flex: 1,
    padding: '2vh 5vw',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '2vh',
    background: COLORS.gray
  },
  messageBubble: {
    padding: '2vh 3vw',
    borderRadius: '20px',
    maxWidth: '70%',
    fontSize: FONT.size.medium,
    fontFamily: FONT.family,
    border: `1px solid ${COLORS.border}`
  },
  time: {
    fontSize: FONT.size.small,
    color: '#999',
    marginTop: '0.5vh'
  },
  inputArea: {
    height: '10vh',
    background: COLORS.white,
    display: 'flex',
    alignItems: 'center',
    padding: '0 4vw',
    borderTop: `1px solid ${COLORS.border}`,
    boxShadow: `0 -1px 3px ${COLORS.shadow}`
  },
  input: {
    width: '100%',
    height: '6vh',
    border: `2px solid ${COLORS.border}`,
    borderRadius: '30px',
    padding: '0 4vw',
    fontSize: FONT.size.medium,
    fontFamily: FONT.family,
    outline: 'none',
    background: COLORS.white,
    boxShadow: `0 4px 12px ${COLORS.shadowDark}`,
    transition: 'all 0.3s ease'
  },
  button: {
    width: '14vw',
    height: '6vh',
    background: COLORS.primary,
    border: 'none',
    borderRadius: '30px',
    color: COLORS.white,
    fontSize: FONT.size.medium,
    fontFamily: FONT.family,
    fontWeight: FONT.weight.bold,
    cursor: 'pointer',
    boxShadow: `0 2px 6px ${COLORS.shadow}`,
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden'
  }
};

export default function DeliveryManMessageScreen() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { id: 1, text: 'Xin chào! Tôi đang trên đường giao hàng cho bạn.', sender: 'other', time: '10:30' },
    { id: 2, text: 'Cảm ơn bạn! Tôi đang đợi.', sender: 'me', time: '10:32' },
    { id: 3, text: 'Tôi sẽ đến trong 5 phút nữa.', sender: 'other', time: '10:35' },
    { 
      id: 4, 
      text: 'Đơn hàng của bạn đã sẵn sàng! Bao gồm: Burger gà, Khoai tây chiên, Nước ngọt.', 
      sender: 'other', 
      time: '10:36',
      image: 'https://via.placeholder.com/200x150/cccccc/666666?text=Order+Items'
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const sendMessage = () => {
    if (inputValue.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: inputValue,
        sender: 'me',
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
      setInputValue('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const handleInputFocus = (e) => {
    e.target.style.borderColor = COLORS.primary;
    e.target.style.boxShadow = `0 2px 6px ${COLORS.shadow}`;
    e.target.style.transform = 'scale(1.01)';
  };

  const handleInputBlur = (e) => {
    e.target.style.borderColor = COLORS.border;
    e.target.style.boxShadow = `0 1px 3px ${COLORS.shadowDark}`;
    e.target.style.transform = 'scale(1)';
  };

  const handleButtonHover = (e, isHover) => {
    e.target.style.transform = isHover ? 'translateY(-1px)' : 'translateY(0)';
    e.target.style.boxShadow = isHover ? `0 3px 8px ${COLORS.shadow}` : `0 2px 6px ${COLORS.shadow}`;
  };

  const handleButtonMouseDown = (e) => {
    e.target.style.transform = 'translateY(0) scale(0.98)';
  };

  const handleButtonMouseUp = (e) => {
    e.target.style.transform = 'translateY(-1px)';
  };

  return (
    <div style={STYLES.container}>
      {/* Header */}
      <div style={STYLES.header}>
        <div onClick={() => navigate(-1)} style={{ marginRight: '3vw' }}>
          <BackArrow />
        </div>
        <div style={STYLES.avatar}>
          N
        </div>
        <div style={STYLES.name}>
          Nguyễn Văn A
        </div>
      </div>

      {/* Messages Area */}
      <div style={STYLES.messagesArea}>
        {messages.map((message) => (
          <div key={message.id} style={{ display: 'flex', flexDirection: 'column', alignItems: message.sender === 'me' ? 'flex-end' : 'flex-start' }}>
            <div
              style={{
                ...STYLES.messageBubble,
                background: message.sender === 'me' ? COLORS.primary : COLORS.white,
                color: message.sender === 'me' ? COLORS.white : COLORS.text,
                borderRadius: message.sender === 'me' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                boxShadow: `0 1px 3px ${COLORS.shadow}`,
                border: message.sender === 'me' ? 'none' : STYLES.messageBubble.border,
                maxWidth: message.image ? '80%' : '70%'
              }}
            >
              {message.text}
              {message.image && (
                <img 
                  src={message.image} 
                  alt="Order items" 
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '10px',
                    marginTop: '1vh',
                    maxWidth: '100%'
                  }}
                />
              )}
            </div>
            <div style={{ ...STYLES.time, marginLeft: message.sender === 'me' ? '1vw' : '1vw', marginRight: message.sender === 'me' ? '1vw' : 0 }}>
              {message.time}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div style={STYLES.inputArea}>
        <div style={{ position: 'relative', flex: 1, marginRight: '3vw' }}>
          <input
            type="text"
            placeholder="Nhập tin nhắn..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            style={STYLES.input}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
        </div>
        <button
          onClick={sendMessage}
          style={STYLES.button}
          onMouseEnter={(e) => handleButtonHover(e, true)}
          onMouseLeave={(e) => handleButtonHover(e, false)}
          onMouseDown={handleButtonMouseDown}
          onMouseUp={handleButtonMouseUp}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" fill="white"/>
          </svg>
        </button>
      </div>
    </div>
  );
}