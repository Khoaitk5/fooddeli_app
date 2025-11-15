// src/config/api.js

// Nếu đang chạy trên localhost → dùng local API
// Nếu chạy trên web/app đã deploy → dùng Cloud Functions API
const isLocal = window.location.hostname === "localhost";

export const API_BASE_URL = isLocal
  ? "http://localhost:5000/api"   // dev
  : "https://asia-southeast1-fooddeli-6d394.cloudfunctions.net/api"; // production

export const apiUrl = (path) => {
  if (!path.startsWith("/")) path = "/" + path;
  return `${API_BASE_URL}${path}`;
};
