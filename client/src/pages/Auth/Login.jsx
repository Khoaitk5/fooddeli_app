import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/firebase/firebaseConfig";
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

  const handleGoogleLogin = async () => {
    try {
      // 🔹 Mở popup đăng nhập Google
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("✅ Đăng nhập thành công:", user);

      // 🔹 Lấy ID token từ Firebase
      const idToken = await user.getIdToken();

      // 🔹 Gửi token đó lên backend
      const res = await fetch("http://localhost:5000/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: idToken }),
      });

      // 🔹 Xử lý lỗi theo status code
      if (res.status === 404) {
        // Gmail chưa tồn tại trong DB
        console.warn("⚠️ Tài khoản Google chưa tồn tại trong hệ thống");
        alert("Tài khoản Google này chưa tồn tại. Vui lòng đăng ký trước!");
        return; // dừng lại, không tiếp tục navigate
      }

      if (!res.ok) {
        // Các lỗi khác (500, 401, v.v.)
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "❌ Lỗi server khi xác minh token");
      }

      // 🔹 Nếu ok → lấy dữ liệu trả về
      const data = await res.json();
      console.log("✅ Server trả về:", data);

      // 🔹 Lưu user và token
      localStorage.setItem("user", JSON.stringify(data.user));
      if (data.token) localStorage.setItem("token", data.token);

      // 🔹 Điều hướng tới trang chính
      navigate("/customer/home");
    } catch (error) {
      console.error("❌ Lỗi đăng nhập Google:", error);
      alert(error.message || "Đăng nhập Google thất bại. Vui lòng thử lại!");
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
          fontFamily: "Be Vietnam Pro",
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
        <GoogleButton onClick={handleGoogleLogin} />
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
