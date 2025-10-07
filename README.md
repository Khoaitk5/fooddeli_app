# 🍔 FoodDeli App  
## FA25.SWP391.SE19B06_03

FoodDeli là ứng dụng giao đồ ăn (Food Delivery App) được phát triển với kiến trúc **Fullstack JavaScript** gồm:
- 🖥️ **Frontend:** React + Vite + Tailwind CSS
- ⚙️ **Backend:** Node.js + Express + Firebase Admin SDK
- 📦 **App Root:** Quản lý đồng thời client và server

---

## 🚀 Tính năng (dự kiến)

- 👤 Quản lý người dùng (đăng ký, đăng nhập, xác thực)
- 🍔 Quản lý đơn hàng, sản phẩm
- 📊 Giao diện người dùng trực quan, hiện đại
- 🔥 Tích hợp Firebase cho backend

---

## 📁 Cấu trúc thư mục
fooddeli_app/
├─ package.json # app root - quản lý script tổng & concurrently
├─ .gitignore
│
├─ client/ # Frontend (React + Vite)
│ ├─ package.json
│ ├─ src/
│ └─ public/
│
└─ server/ # Backend (Node.js + Express)
├─ package.json
├─ server.js
└─ routes/

---

### Cài đặt toàn bộ modules từ package.json app/client/server
npm run install

### Chạy frontend (React) trong thư mục client
npm run client

### Chạy backend (Node.js) trong thư mục server
### ⚠️ Lưu ý: hiện CHƯA CHẠY được vì thư mục server chưa có code.
npm run server

### Chạy đồng thời cả frontend và backend
### (cần devDependency: concurrently)
npm run app
