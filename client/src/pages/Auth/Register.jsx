import { useNavigate } from "react-router-dom";
import FooterBar from "@/components/shared/FooterBar";
import GoogleButton from "@/components/shared/GoogleButton";
import MessageButton from "@/components/shared/MessageButton";
import PhoneButton from "@/components/shared/PhoneButton";
import SubmitButton from "@/components/shared/SubmitButton";
import MiniLogo from "@/components/shared/MiniLogo";
import BurgerBG from "@/components/shared/BurgerBG";
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
    <div>
      {/* 🔹 Logo */}
      <div
        style={{
          position: "absolute",
          top: "6.75vh",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
        }}
      >
        <MiniLogo></MiniLogo>
      </div>

      {/* 🔹 Hình nền burger */}
      <div
        style={{
          position: "absolute",
          top: "21.3675vh",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 5,
        }}
      >
        <BurgerBG></BurgerBG>
      </div>

      {/* 🔹 Nút "Tiếp tục với tư cách khách" */}
      <div
        style={{
          position: "absolute",
          top: "70.375vh",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
        }}
      >
        <SubmitButton
          style={{
            width: "89.3vw",
            height: "6.4vh",
          }}
          onClick={() => navigate("/customer/home")}
        >
          Tiếp tục với tư cách là khách
        </SubmitButton>
      </div>

      {/* 🔹 Chữ "hoặc" */}
      <div
        style={{
          position: "absolute",
          top: "79.375vh",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          color: "#70756B",
          fontSize: "1.5rem",
          fontWeight: "600",
          wordWrap: "break-word",
        }}
      >
        hoặc
      </div>

      {/* Button Group */}
      <div
        style={{
          position: "absolute",
          top: "84.25vh",
          left: 0,
          right: 0,
          zIndex: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingLeft: "5.27vw",
          paddingRight: "5.27vw",
        }}
      >
        {/* Google Login Button */}
        <div>
          <GoogleButton onClick={handleGoogleRegister} />
        </div>

        {/* Phone Button */}
        <div>
          <PhoneButton onClick={() => navigate("/register/phone")} />
        </div>

        {/* Message Button */}
        <div>
          <MessageButton onClick={() => navigate("/register/email")} />
        </div>
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