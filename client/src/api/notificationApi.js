import axios from "axios";

const API_BASE_URL = import.meta.env?.VITE_API_URL || "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const getMyNotifications = async () => {
  const res = await axiosInstance.get("/notifications");
  return res.data;
};

export const getMyUnreadNotifications = async () => {
  const res = await axiosInstance.get("/notifications/unread");
  return res.data;
};

export const markAllNotificationsAsRead = async () => {
  const res = await axiosInstance.post("/notifications/mark-all-read");
  return res.data;
};
