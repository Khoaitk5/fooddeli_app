import { useNavigate } from "react-router-dom";
import FooterBar from "@/components/shared/FooterBar";
import GoogleButton from "@/components/shared/GoogleButton";
import MessageButton from "@/components/shared/MessageButton";
import PhoneButton from "@/components/shared/PhoneButton";
import SubmitButton from "@/components/shared/SubmitButton";
import logoMini from "/logo_mini.svg";
import burgerBG from "/BurgerBG.svg";
import { pxW, pxH } from "../../utils/scale.js";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/firebase/firebaseConfig";

const Register = () => {
  const navigate = useNavigate();

  // 🟢 Xử lý đăng ký bằng Google
  const handleGoogleRegister = async () => {
    try {
      // 🔹 Mở popup Google
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // 🔹 Lấy ID Token Firebase
      const idToken = await user.getIdToken();

      // 🔹 Gửi token lên backend để đăng ký hoặc tạo session
      const res = await fetch("http://localhost:5000/api/auth/google-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: idToken }),
        credentials: "include", // ⚠️ quan trọng để cookie session hoạt động
      });

      const data = await res.json();
      console.log("📩 Kết quả đăng ký Google:", data);

      if (!data.success) {
        alert(data.message || "❌ Đăng ký Google thất bại.");
        return;
      }

      // 🔹 Lưu user tạm vào localStorage
      localStorage.setItem("user", JSON.stringify(data.user));

      // 🔹 Nếu cần bổ sung thông tin → chuyển sang ProfileRegister
      if (data.needAdditionalInfo) {
        navigate("/profileRegister");
      } else {
        navigate("/customer/home");
      }
    } catch (error) {
      console.error("❌ Lỗi đăng ký Google:", error);
      alert("Đã xảy ra lỗi khi đăng ký bằng Google. Vui lòng thử lại!");
    }
  };

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
      {/* 🔹 Logo */}
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

      {/* 🔹 Hình nền burger */}
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

      {/* 🔹 Nút “Tiếp tục với tư cách khách” */}
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

      {/* 🔹 Chữ “hoặc” */}
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
          lineHeight: "25.5px",
          wordWrap: "break-word",
        }}
      >
        hoặc
      </div>

      {/* 🔹 Nút Google */}
      <div
        style={{
          position: "absolute",
          top: "675px",
          left: "19px",
          zIndex: 10,
        }}
      >
        <GoogleButton onClick={handleGoogleRegister} />
      </div>

      {/* 🔹 Nút đăng ký bằng email */}
      <div
        style={{
          position: "absolute",
          top: "675px",
          right: "19px",
          zIndex: 10,
        }}
      >
        <MessageButton onClick={() => navigate("/register/email")} />
      </div>

      {/* 🔹 Nút đăng ký bằng số điện thoại */}
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

      {/* 🔹 Footer */}
      <FooterBar
        text1="Bạn đã có tài khoản?"
        text2="Đăng nhập"
        onClick={() => navigate("/login")}
      />
    </div>
  );
};

export default Register;
