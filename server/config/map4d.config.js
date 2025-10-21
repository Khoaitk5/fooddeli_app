import dotenv from "dotenv";
dotenv.config();

export const MAP4D_CONFIG = {
  API_KEY: process.env.MAP4D_API_KEY,
  BASE_URL: "https://api.map4d.vn/sdk"
};
