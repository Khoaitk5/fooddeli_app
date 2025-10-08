import { useNavigate } from "react-router-dom";
import FooterBar from "@/components/shared/FooterBar";
import GoogleButton from "@/components/shared/GoogleButton";
import MessageButton from "@/components/shared/MessageButton";
import PhoneButton from "@/components/shared/PhoneButton";
import SubmitButton from "@/components/shared/SubmitButton";
import MiniLogo from "@/components/shared/MiniLogo";
import BurgerBG from "@/components/shared/BurgerBG";
import { pxW, pxH } from "../../utils/scale.js";
import "../../App.css";

const Login = () => {
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
          top: "8.875vh",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
        }}
      >
        <MiniLogo></MiniLogo>
      </div>

      {/* Burger Background */}
      <div
        style={{
          position: "absolute",
          top: "21.37vh",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 5,
        }}
      >
        <BurgerBG></BurgerBG>
      </div>

      {/* Submit Button */}
      <div
        style={{
          position: "absolute",
          top: "72.125vh",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
        }}
      >
        <SubmitButton
          style={{
            width: "89.4vw",
            height: "6.375vh",
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
          top: "79.75vh",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          color: "#70756B",
          fontSize: "1.5rem",
          fontFamily: "TikTok Sans",
          fontWeight: 600,
          lineHeight: "2.55rem",
          wordWrap: "break-word",
        }}
      >
        hoặc
      </div>

      {/* Google Login Button */}
      <div
        style={{
          position: "absolute",
          top: "84.375vh",
          left: "5.27vw",
          zIndex: 10,
        }}
      >
        <GoogleButton />
      </div>

      {/* Message Button */}
      <div
        style={{
          position: "absolute",
          top: "84.375vh",
          right: "5.27vw",
          zIndex: 10,
        }}
      >
        <MessageButton onClick={() => navigate("/login/email")} />
      </div>

      {/* Phone Button */}
      <div
        style={{
          position: "absolute",
          top: "84.375vh",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
        }}
      >
        <PhoneButton onClick={() => navigate("/login/phone")} />
      </div>

      {/* Footer */}
      <FooterBar onClick={() => navigate("/register")} />
    </div>
  );
};

export default Login;
