import dotenv from "dotenv";
dotenv.config();

const MAP4D_CONFIG = {
  API_KEY: process.env.MAP4D_API_KEY,
  BASE_URL: "https://api.map4d.vn/v2",
};

export default MAP4D_CONFIG;
