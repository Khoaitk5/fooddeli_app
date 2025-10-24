import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
// ❌ Sửa lỗi import alias sang đường dẫn tương đối (Relative Paths)
import { auth, googleProvider } from "../firebase/firebaseConfig"; 
import FooterBar from "../components/shared/FooterBar";
import GoogleButton from "../components/shared/GoogleButton";
import MessageButton from "../components/shared/MessageButton";
import PhoneButton from "../components/shared/PhoneButton";
import SubmitButton from "../components/shared/SubmitButton";
import MiniLogo from "../components/shared/MiniLogo";
import BurgerBG from "../components/shared/BurgerBG";
import { pxW, pxH } from "../utils/scale.js";
import "../App.css"; // ❌ Sửa lỗi import CSS

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

  // ⚡️ GIỮ NGUYÊN GIAO DIỆN VÀ VỊ TRÍ CỦA BẠN (với các giá trị pxW, pxH và vh/vw)
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%", // Đã sửa để responsive hơn
        height: "100%", // Đã sửa để responsive hơn
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        overflow: "hidden",
      }}
    >
      {/* Logo */}
      <div
        style={{
          position: "absolute",
          top: "2.82vh", // Giữ nguyên vị trí theo vh/vw
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
          top: "17.12vh", // Giữ nguyên vị trí theo vh/vw
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
          top: "65.75vh", // Giữ nguyên vị trí theo vh/vw
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
        }}
      >
        {/* GIỮ NGUYÊN LOGIC navigate */}
        <SubmitButton onClick={() => navigate("/customer/home")}>
          Tiếp tục với tư cách là khách
        </SubmitButton>
      </div>

      {/* Or Text */}
      <div
        style={{
          position: "absolute",
          top: "75vh", // Giữ nguyên vị trí theo vh/vw
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
          top: "80.125vh", // Giữ nguyên vị trí theo vh/vw
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
        {/* Google Login Button (GIỮ NGUYÊN LOGIC) */}
        <div>
          <GoogleButton onClick={handleGoogleLogin} />
        </div>

        {/* Phone Button (GIỮ NGUYÊN LOGIC navigate) */}
        <div>
          <PhoneButton onClick={() => navigate("/login/phone")} />
        </div>

        {/* Message Button (GIỮ NGUYÊN LOGIC navigate) */}
        <div>
          <MessageButton onClick={() => navigate("/login/email")} />
        </div>
      </div>

      {/* Footer (GIỮ NGUYÊN LOGIC navigate) */}
      <FooterBar onClick={() => navigate("/register")} />
    </div>
  );
};

export default Login;
