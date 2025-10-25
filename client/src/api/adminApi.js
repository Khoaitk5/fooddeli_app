// src/api/adminApi.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/admin";

// =============================
// 🏪 SHOPS
// =============================
export async function getShops() {
  const res = await axios.get(`${API_URL}/shops`);
  return res.data;
}

export async function approveShop(id) {
  const res = await axios.post(`${API_URL}/shops/${id}/approve`);
  return res.data;
}

export async function suspendShop(id) {
  const res = await axios.post(`${API_URL}/shops/${id}/suspend`);
  return res.data;
}

// =============================
// 🚚 SHIPPERS
// =============================
export async function getShippers() {
  const res = await axios.get(`${API_URL}/shippers`);
  return res.data;
}

export async function verifyShipper(id) {
  const res = await axios.post(`${API_URL}/shippers/${id}/verify`);
  return res.data;
}

// =============================
// 👤 CUSTOMERS
// =============================
export async function getCustomers() {
  const res = await axios.get(`${API_URL}/customers`);
  return res.data;
}

export async function banCustomer(id) {
  const res = await axios.post(`${API_URL}/customers/${id}/ban`);
  return res.data;
}

// 🟢 Mở khóa (unban)
export async function unbanCustomer(id) {
  const res = await axios.post(`${API_URL}/customers/${id}/unban`);
  return res.data;
}

// =============================
// 📊 DASHBOARD STATS
// =============================
export async function getOverviewStats() {
  const res = await axios.get(`${API_URL}/stats/overview`);
  return res.data;
}

export async function getMonthlyRevenue() {
  const res = await axios.get(`${API_URL}/stats/dashboard/monthly`);
  return res.data.items;
}

export async function getWeeklyOrders() {
  const res = await axios.get(`${API_URL}/stats/dashboard/weekly`);
  return res.data.items;
}

export async function getUserDistribution() {
  const res = await axios.get(`${API_URL}/stats/dashboard/users`);
  return res.data.summary;
}

// =============================
// 💹 REVENUE PAGE
// =============================
export async function getRevenueComparison() {
  const res = await axios.get(`${API_URL}/stats/revenue/comparison`);
  return res.data.items;
}

export async function getTopRevenueShops() {
  const res = await axios.get(`${API_URL}/stats/revenue/topshops`);
  return res.data.items;
}

export async function getTopRevenueShippers() {
  const res = await axios.get(`${API_URL}/stats/revenue/topshippers`);
  return res.data.items;
}

// =============================
// 💰 SETTLEMENT
// =============================
export async function doSettlement() {
  const res = await axios.get(`${API_URL}/settlements/do`);
  return res.data;
}
