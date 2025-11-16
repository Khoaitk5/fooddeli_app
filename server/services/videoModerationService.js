const { getGeminiModel } = require("../config/gemini");
const { bucket } = require("../config/firebase");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffprobePath = require("@ffprobe-installer/ffprobe").path;
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

const unlinkAsync = promisify(fs.unlink);
const mkdirAsync = promisify(fs.mkdir);

const TEMP_DIR = path.join(__dirname, "../temp");
const FRAMES_DIR = path.join(TEMP_DIR, "frames");

const ensureTempDirs = async () => {
  try {
    await mkdirAsync(TEMP_DIR, { recursive: true });
    await mkdirAsync(FRAMES_DIR, { recursive: true });
  } catch (err) {
    console.error("⚠️ Lỗi tạo thư mục temp:", err);
  }
};

const downloadVideoFromFirebase = async (videoUrl) => {
  try {
    const urlMatch = videoUrl.match(/\/o\/(.+?)\?/);
    if (!urlMatch) throw new Error("Invalid Firebase URL");

    const filePath = decodeURIComponent(urlMatch[1]);
    const file = bucket.file(filePath);
    const tempVideoPath = path.join(TEMP_DIR, `video_${Date.now()}.mp4`);

    await file.download({ destination: tempVideoPath });
    console.log(`✅ Downloaded video to: ${tempVideoPath}`);
    return tempVideoPath;
  } catch (err) {
    console.error("❌ Lỗi download video:", err);
    throw err;
  }
};

const extractFrames = async (videoPath, frameRate = 0.5) => {
  return new Promise((resolve, reject) => {
    const sessionId = Date.now();
    const outputPattern = path.join(FRAMES_DIR, `frame_${sessionId}_%03d.jpg`);
    const extractedFrames = [];

    ffmpeg(videoPath)
      .on("end", () => {
        const files = fs.readdirSync(FRAMES_DIR);
        const sessionFrames = files
          .filter((f) => f.startsWith(`frame_${sessionId}_`))
          .map((f) => path.join(FRAMES_DIR, f));
        
        console.log(`✅ Đã cắt ${sessionFrames.length} frames`);
        resolve(sessionFrames);
      })
      .on("error", (err) => {
        console.error("❌ Lỗi cắt frames:", err);
        reject(err);
      })
      .screenshots({
        count: 20,
        folder: FRAMES_DIR,
        filename: `frame_${sessionId}_%03d.jpg`,
        size: "480x?",
      });
  });
};

const imageToBase64 = (filePath) => {
  const imageBuffer = fs.readFileSync(filePath);
  return imageBuffer.toString("base64");
};

const analyzeFramesWithGemini = async (framePaths) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.warn("⚠️ GEMINI_API_KEY không được cấu hình");
      return {
        status: "pending",
        reason: "API key chưa được cấu hình. Video cần kiểm duyệt thủ công.",
        analyzedFrames: 0,
        flaggedFrames: [],
      };
    }

    let model;
    try {
      model = getGeminiModel("gemini-2.5-flash-lite");
    } catch (err) {
      console.error("❌ Không thể khởi tạo Gemini 2.5 Flash Lite:", err);
      throw err;
    }
    const batchSize = 10;
    const results = [];

    for (let i = 0; i < Math.min(framePaths.length, 20); i += batchSize) {
      const batch = framePaths.slice(i, i + batchSize);
      
      const imageParts = batch.map((framePath, idx) => ({
        inlineData: {
          data: imageToBase64(framePath),
          mimeType: "image/jpeg",
        },
      }));

      const prompt = `You are a strict content reviewer for a FOOD DELIVERY platform.
Your task: APPROVE ONLY IF the frames clearly depict FOOD-RELATED content such as:
- Cooked dishes, beverages, desserts, ingredients, food packaging, menus, restaurant/kitchen scenes
- Food preparation/cooking, plating, serving, eating, delivery context (rider, delivery bag, packaging)

ALSO check for policy violations and REJECT if any frame shows:
- Violence, gore, disturbing imagery
- Nudity or explicit sexual content
- Hate speech or offensive symbols
- Dangerous or illegal activities
- Content violating food safety standards
- Spam or misleading content

Output rules:
- If ALL frames in this batch are food-related AND appropriate → respond exactly: "APPROVED"
- If ANY frame is inappropriate → respond: "REJECTED: [brief reason]"
- If frames are NOT clearly food-related → respond: "REJECTED: Not food-related"`;

      let result;
      try {
        result = await model.generateContent([{ text: prompt }, ...imageParts]);
      } catch (err) {
        throw err;
      }
      const response = await result.response;
      const text = response.text().trim();

      console.log(`📊 Batch ${Math.floor(i / batchSize) + 1} result: ${text}`);
      results.push({ batchIndex: Math.floor(i / batchSize), result: text });

      if (text.startsWith("REJECTED")) {
        const reason = text.replace("REJECTED:", "").trim();
        return {
          status: "rejected",
          reason: reason || "Nội dung không phù hợp được phát hiện",
          analyzedFrames: framePaths.length,
          flaggedFrames: [i],
        };
      }
    }

    const allApproved =
      results.length > 0 && results.every((r) => typeof r.result === "string" && r.result.startsWith("APPROVED"));

    if (allApproved) {
      return {
        status: "approved",
        reason: "Video đã được AI kiểm duyệt và phê duyệt (nội dung liên quan đến đồ ăn)",
        analyzedFrames: Math.min(framePaths.length, 20),
        flaggedFrames: [],
      };
    }

    return {
      status: "rejected",
      reason: "Nội dung không liên quan đến đồ ăn hoặc không đủ bằng chứng rõ ràng",
      analyzedFrames: Math.min(framePaths.length, 20),
      flaggedFrames: [],
    };
  } catch (err) {
    console.error("❌ Lỗi Gemini API:", err);
    return {
      status: "pending",
      reason: `Lỗi khi kiểm duyệt: ${err.message}. Cần kiểm tra thủ công.`,
      analyzedFrames: 0,
      flaggedFrames: [],
    };
  }
};

const cleanupFiles = async (filePaths) => {
  for (const filePath of filePaths) {
    try {
      if (fs.existsSync(filePath)) {
        await unlinkAsync(filePath);
      }
    } catch (err) {
      console.error(`⚠️ Không thể xóa file ${filePath}:`, err);
    }
  }
};

const moderateLocalVideo = async (videoPath) => {
  let framePaths = [];

  try {
    await ensureTempDirs();

    const overallStart = Date.now();

    console.log("🎬 Bắt đầu kiểm duyệt video local:", videoPath);

    const extractStart = Date.now();
    framePaths = await extractFrames(videoPath);
    const extractEnd = Date.now();
    console.log(`⏱️ [MODERATION] Extract frames time (local): ${extractEnd - extractStart}ms`);

    const aiStart = Date.now();
    const moderationResult = await analyzeFramesWithGemini(framePaths);
    const aiEnd = Date.now();
    console.log(`⏱️ [MODERATION] Gemini analyze time (local): ${aiEnd - aiStart}ms`);

    const cleanupStart = Date.now();
    await cleanupFiles([videoPath, ...framePaths]);
    const cleanupEnd = Date.now();
    console.log(`⏱️ [MODERATION] Cleanup frames time (local): ${cleanupEnd - cleanupStart}ms`);

    const overallEnd = Date.now();
    console.log(`⏱️ [MODERATION] Total moderation time (local): ${overallEnd - overallStart}ms`);

    console.log("✅ Hoàn tất kiểm duyệt local:", moderationResult);
    return moderationResult;
  } catch (err) {
    console.error("❌ Lỗi trong quá trình kiểm duyệt local:", err);

    const pathsToCleanup = [videoPath, ...framePaths];
    if (pathsToCleanup.length > 0) await cleanupFiles(pathsToCleanup);

    return {
      status: "pending",
      reason: `Lỗi hệ thống (local): ${err.message}. Cần kiểm tra thủ công.`,
      analyzedFrames: 0,
      flaggedFrames: [],
    };
  }
};

const moderateVideo = async (videoUrl) => {
  let videoPath = null;
  let framePaths = [];

  try {
    await ensureTempDirs();
    
    const overallStart = Date.now();

    console.log("🎬 Bắt đầu kiểm duyệt video:", videoUrl);
    
    const downloadStart = Date.now();
    videoPath = await downloadVideoFromFirebase(videoUrl);
    const downloadEnd = Date.now();
    console.log(`⏱️ [MODERATION] Download time: ${downloadEnd - downloadStart}ms`);

    const extractStart = Date.now();
    framePaths = await extractFrames(videoPath);
    const extractEnd = Date.now();
    console.log(`⏱️ [MODERATION] Extract frames time: ${extractEnd - extractStart}ms`);

    const aiStart = Date.now();
    const moderationResult = await analyzeFramesWithGemini(framePaths);
    const aiEnd = Date.now();
    console.log(`⏱️ [MODERATION] Gemini analyze time: ${aiEnd - aiStart}ms`);

    const cleanupStart = Date.now();
    await cleanupFiles([videoPath, ...framePaths]);
    const cleanupEnd = Date.now();
    console.log(`⏱️ [MODERATION] Cleanup time: ${cleanupEnd - cleanupStart}ms`);

    const overallEnd = Date.now();
    console.log(`⏱️ [MODERATION] Total moderation time: ${overallEnd - overallStart}ms`);

    console.log("✅ Hoàn tất kiểm duyệt:", moderationResult);
    return moderationResult;
  } catch (err) {
    console.error("❌ Lỗi trong quá trình kiểm duyệt:", err);
    
    if (videoPath) await cleanupFiles([videoPath]);
    if (framePaths.length > 0) await cleanupFiles(framePaths);
    
    return {
      status: "pending",
      reason: `Lỗi hệ thống: ${err.message}. Cần kiểm tra thủ công.`,
      analyzedFrames: 0,
      flaggedFrames: [],
    };
  }
};

module.exports = { moderateVideo, moderateLocalVideo };
