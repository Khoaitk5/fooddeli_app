const dotenv = require("dotenv");
dotenv.config();

const MAP4D_CONFIG = {
  API_KEY: process.env.MAP4D_API_KEY,
  BASE_URL: "https://api.map4d.vn/sdk"
};

module.exports = MAP4D_CONFIG;
