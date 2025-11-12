const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getGeminiModel = (overrideModel) => {
  const defaultModel = "gemini-2.5-flash-lite";
  const preferred = overrideModel || process.env.GEMINI_MODEL || defaultModel;
  const aliasMap = {
    "gemini-2.5-flash": defaultModel,
    "gemini-2.5-flash-latest": defaultModel,
    "gemini-2.5-flash-preview": defaultModel,
    "gemini-2.5-flash-preview-09-2025": defaultModel,
    "gemini-2.5-flash-lite": defaultModel,
    "gemini-2.5-flash-lite-latest": defaultModel,
  };
  const normalized = aliasMap[preferred] || defaultModel;
  try { console.log(`[GEMINI] Using model: ${normalized} (preferred: ${preferred})`); } catch (_) {}
  return genAI.getGenerativeModel({ model: normalized });
};

module.exports = { getGeminiModel };
