import React from 'react';
import { useNavigate } from 'react-router-dom';
import BackArrow from '../../components/shared/BackArrow';

export default function DeliveryManCallScreen() {
  const navigate = useNavigate();

  return (
    <div className="h-screen overflow-hidden relative mx-auto" style={{ backgroundImage: 'url(/Map.svg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      {/* Header */}
      <div
        style={{
          position: 'absolute',
          top: '7.125vh',
          left: '5.28vw'
        }}
        onClick={() => navigate(-1)}
      >
        <BackArrow />
      </div>

      {/* Bottom Panel */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: '46.375vh',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,1) 100%)',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          backdropFilter: 'blur(10px)',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.1)'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '3vh',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '28vw',
            height: '12.6vh',
            background: 'linear-gradient(135deg, #98A8B8 0%, #B8C8D8 100%)',
            borderRadius: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '4rem',
            color: 'white',
            fontWeight: 'bold',
            boxShadow: '0 4px 16px rgba(152,168,184,0.4)',
            border: '3px solid white'
          }}
        >
          N
        </div>

        <div
          style={{
            position: 'absolute',
            top: '17.225vh',
            left: '50%',
            transform: 'translateX(-50%)',
            justifyContent: 'center',
            display: 'flex',
            flexDirection: 'column',
            color: '#181C2E',
            fontSize: '2rem',
            fontFamily: 'TikTok Sans',
            fontWeight: '700',
            textTransform: 'capitalize',
            wordWrap: 'break-word',
            textAlign: 'center',
            textShadow: '0 1px 2px rgba(0,0,0,0.1)'
          }}
        >
          Nguyễn Văn A
        </div>

        <div
          style={{
            position: 'absolute',
            top: '20.6vh',
            left: '50%',
            transform: 'translateX(-50%)',
            justifyContent: 'center',
            display: 'flex',
            flexDirection: 'column',
            color: '#979797',
            fontSize: '1.6rem',
            fontFamily: 'TikTok Sans',
            fontWeight: '400',
            wordWrap: 'break-word',
            textAlign: 'center',
            animation: 'pulse 2s infinite'
          }}
        >
          Đang kết nối.......
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: '9.27vh',
            left: '10.83vw',
            width: '12.86vw',
            height: '5.79vh',
            background: 'white',
            borderRadius: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            border: '2px solid #E0E0E0',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
          }}
        >
          <svg width="2.2rem" height="2.2rem" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1.00293L20.5168 20.6714" stroke="#181C2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13.4194 8.45885V3.68477C13.4201 3.01964 13.1755 2.37799 12.7331 1.88439C12.2908 1.39078 11.6822 1.08043 11.0255 1.01358C10.3689 0.94674 9.711 1.12817 9.17961 1.52265C8.64823 1.91714 8.28124 2.49653 8.14991 3.14836M8.09668 8.15488V10.837C8.09714 11.3671 8.25348 11.8852 8.54595 12.3258C8.83842 12.7664 9.2539 13.1098 9.73991 13.3126C10.2259 13.5154 10.7607 13.5685 11.2766 13.4653C11.7926 13.362 12.2666 13.1069 12.6388 12.7323L8.09668 8.15488Z" stroke="#181C2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16.9678 9.04883V10.8369C16.9675 11.2056 16.9348 11.5736 16.8702 11.9365M15.1935 15.2623C14.3275 16.1531 13.2171 16.7629 12.0049 17.0133C10.7926 17.2638 9.5337 17.1435 8.38972 16.6679C7.24574 16.1924 6.26883 15.3832 5.58433 14.3443C4.89984 13.3053 4.53896 12.0839 4.54802 10.8369V9.04883L15.1935 15.2623Z" stroke="#181C2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10.7583 17.0952V20.6713" stroke="#181C2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7.20996 20.6714H14.307" stroke="#181C2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: '9.27vh',
            right: '10.83vw',
            width: '12.86vw',
            height: '5.79vh',
            background: 'white',
            borderRadius: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            border: '2px solid #E0E0E0',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
          }}
        >
          <svg width="2.6rem" height="2.6rem" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.5766 5.26221L6.31458 9.47181H2.10498V15.7862H6.31458L11.5766 19.9958V5.26221Z" stroke="#32343E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16.3545 8.90332C17.341 9.89009 17.8951 11.2283 17.8951 12.6236C17.8951 14.0188 17.341 15.357 16.3545 16.3438" stroke="#32343E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: '5.125vh',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '30.56vw',
            height: '14vh',
            opacity: 0.05,
            background: 'radial-gradient(circle, #FF7622 0%, transparent 70%)',
            borderRadius: 9999,
            zIndex: 10,
            animation: 'pulse 3s infinite'
          }}
        />

        <div
          style={{
            position: 'absolute',
            bottom: '6.95vh',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '22.67vw',
            height: '10.35vh',
            opacity: 0.10,
            background: 'radial-gradient(circle, #FF7622 0%, transparent 70%)',
            borderRadius: 9999,
            zIndex: 20,
            animation: 'pulse 3s infinite 0.5s'
          }}
        />

        <div
          style={{
            position: 'absolute',
            bottom: '8.5vh',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '16.11vw',
            height: '7.25vh',
            background: 'radial-gradient(circle, #FF3434 0%, #FF5A5A 100%)',
            borderRadius: 9999,
            zIndex: 30,
            boxShadow: '0 0 20px rgba(255,52,52,0.5)',
            animation: 'pulse 3s infinite 1s'
          }}
        />

        <div
          style={{
            position: 'absolute',
            bottom: '10vh',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 40,
            animation: 'bounce 2s infinite'
          }}
        >
          <svg width="2.6rem" height="2.7rem" viewBox="0 0 26 27" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24.9033 19.0421V22.6478C24.9046 22.9825 24.8361 23.3138 24.702 23.6205C24.5679 23.9272 24.3712 24.2025 24.1245 24.4288C23.8779 24.6551 23.5867 24.8274 23.2696 24.9346C22.9525 25.0419 22.6165 25.0817 22.2831 25.0516C18.5847 24.6497 15.0322 23.3859 11.9109 21.3618C9.0069 19.5165 6.54485 17.0544 4.69955 14.1504C2.66833 11.015 1.40427 7.44512 1.00976 3.73009C0.979721 3.39773 1.01922 3.06276 1.12574 2.7465C1.23226 2.43024 1.40346 2.13962 1.62845 1.89315C1.85343 1.64669 2.12728 1.44976 2.43254 1.31493C2.7378 1.18009 3.06779 1.11029 3.40151 1.10998H7.00717C7.59045 1.10424 8.15592 1.31079 8.59818 1.69113C9.04044 2.07147 9.32931 2.59965 9.41094 3.17722C9.56313 4.33112 9.84536 5.46409 10.2523 6.55453C10.414 6.98471 10.449 7.45223 10.3531 7.9017C10.2573 8.35116 10.0346 8.76373 9.71141 9.09051L8.18502 10.6169C9.89597 13.6259 12.3874 16.1173 15.3963 17.8282L16.9227 16.3018C17.2495 15.9787 17.6621 15.756 18.1115 15.6601C18.561 15.5643 19.0285 15.5993 19.4587 15.761C20.5492 16.1679 21.6821 16.4501 22.836 16.6023C23.4199 16.6847 23.953 16.9787 24.3342 17.4286C24.7154 17.8784 24.9179 18.4527 24.9033 19.0421Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
