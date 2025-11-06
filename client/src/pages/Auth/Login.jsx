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
import "@/App.css";

const Login = () => {
  const navigate = useNavigate();

  // ⚡️ GIỮ NGUYÊN LOGIC ĐĂNG NHẬP GOOGLE
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
        credentials: "include", // ⚡ để gửi cookie session
      });

      // 🔹 Xử lý lỗi theo status code
      if (res.status === 404) {
        // Gmail chưa tồn tại trong DB
        console.warn("⚠️ Tài khoản Google chưa tồn tại trong hệ thống");
        // SỬ DỤNG CUSTOM MODAL THAY CHO alert()
        console.error("Tài khoản Google này chưa tồn tại. Vui lòng đăng ký trước!");
        // Bạn cần tự implement logic hiển thị thông báo thay cho alert
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
      // LƯU Ý: Trong môi trường thực tế, nên dùng state management và HTTP-only cookies
      localStorage.setItem("user", JSON.stringify(data.user));
      if (data.token) localStorage.setItem("token", data.token);

      // 🔹 Điều hướng tới trang chính
      navigate("/customer/home");
    } catch (error) {
      console.error("❌ Lỗi đăng nhập Google:", error);
      // SỬ DỤNG CUSTOM MODAL THAY CHO alert()
      console.error(error.message || "Đăng nhập Google thất bại. Vui lòng thử lại!");
      // Bạn cần tự implement logic hiển thị thông báo thay cho alert
    }
  };

  return (
    <div>
      {/* Logo */}
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

      {/* Burger Background */}
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

      {/* Submit Button */}
      <div
        style={{
          position: "absolute",
          top: "70.375vh",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
        }}
      >
        <SubmitButton onClick={() => navigate("/customer/home")}>
          Tiếp tục với tư cách là khách
        </SubmitButton>
      </div>

      {/* Or Text */}
      <div
        style={{
          position: "absolute",
          top: "79.375vh",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          justifyContent: "center",
          color: "#70756B",
          fontSize: "1.5rem",
          fontWeight: "600",
          wordWrap: "break-word",
          display: "flex",
          flexDirection: "column",
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
        <div>
          <GoogleButton onClick={handleGoogleLogin} />
        </div>
        <div>
          <PhoneButton onClick={() => navigate("/login/phone")} />
        </div>
        <div>
          <MessageButton onClick={() => navigate("/login/email")} />
        </div>
      </div>
      <FooterBar onClick={() => navigate("/register")} />
    </div>
  );
};

export default Login;
