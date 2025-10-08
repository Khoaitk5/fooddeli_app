import { useNavigate } from "react-router-dom";
import FooterBar from "@/components/shared/FooterBar";
import GoogleButton from "@/components/shared/GoogleButton";
import MessageButton from "@/components/shared/MessageButton";
import PhoneButton from "@/components/shared/PhoneButton";
import SubmitButton from "@/components/shared/SubmitButton";
import logoMini from "/logo_mini.svg";
import burgerBG from "/BurgerBG.svg";
import { pxW, pxH } from "../../utils/scale.js";

const Register = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: pxW(360),
        height: pxH(800),
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "20px 0",
        overflow: "hidden",
      }}
    >
      {/* Logo */}
      <div
        style={{
          position: "absolute",
          top: "71px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
        }}
      >
        <img src={logoMini} alt="Logo Mini" />
      </div>

      {/* Burger Background */}
      <div
        style={{
          position: "absolute",
          top: "193px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 5,
        }}
      >
        <img src={burgerBG} alt="Burger Background" />
      </div>

      {/* Submit Button */}
      <div
        style={{
          position: "absolute",
          top: "577px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
        }}
      >
        <SubmitButton
          style={{
            width: "322px",
            height: "51px",
          }}
          onClick={() => navigate("/customer/home")}
        >
          Tiếp tục với tư cách là khách
        </SubmitButton>
      </div>

      {/* Or Text */}
      <div
        style={{
          position: "absolute",
          top: "638px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          justifyContent: "center",
          display: "flex",
          flexDirection: "column",
          color: "#70756B",
          fontSize: 15,
          fontFamily: "TikTok Sans",
          fontWeight: "600",
          lineHeight: "25.50px",
          wordWrap: "break-word",
        }}
      >
        hoặc
      </div>

      {/* Google Login Button */}
      <div
        style={{
          position: "absolute",
          top: "675px",
          left: "19px",
          zIndex: 10,
        }}
      >
        <GoogleButton />
      </div>

      {/* Message Button */}
      <div
        style={{
          position: "absolute",
          top: "675px",
          right: "19px",
          zIndex: 10,
        }}
      >
        <MessageButton onClick={() => navigate("/register/email")}/>
      </div>

      {/* Phone Button */}
      <div
        style={{
          position: "absolute",
          top: "675px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
        }}
      >
        <PhoneButton onClick={() => navigate("/register/phone")} />
      </div>

      {/* Footer */}
      <FooterBar
        text1="Bạn đã có tài khoản?"
        text2="Đăng nhập"
        onClick={() => navigate("/login")}
      />
    </div>
  );
};

export default Register;