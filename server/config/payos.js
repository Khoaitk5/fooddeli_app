// server/config/payos.js
import dotenv from "dotenv";
import PayOS from "@payos/node"; // ✅ 1.0.5 hỗ trợ default import

dotenv.config();

// ✅ Tạo instance với 3 tham số
const payos = new PayOS(
  process.env.PAYOS_CLIENT_ID,
  process.env.PAYOS_API_KEY,
  process.env.PAYOS_CHECKSUM_KEY
);

export default payos;
