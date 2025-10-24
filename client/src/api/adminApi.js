import axios from "axios";

const API_URL = "http://localhost:5000/api/admin";

export async function getShops() {
  const res = await axios.get(`${API_URL}/shops`);
  return res.data;
}
