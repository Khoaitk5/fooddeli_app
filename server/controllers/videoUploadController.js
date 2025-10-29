const { bucket } = require("../config/firebase");
const { v4: uuidv4 } = require("uuid");

/**
 * Upload video lên Firebase Storage và trả về URL có token bảo mật
 * (giống dạng https://firebasestorage.googleapis.com/v0/b/.../token=xxxx)
 */
const uploadVideoOnly = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Không có file video nào được gửi lên" });
    }

    const file = req.file;
    const folderPath = "videos/shop_video";
    const fileName = `${folderPath}/${uuidv4()}_${file.originalname}`;
    const fileUpload = bucket.file(fileName);

    const token = uuidv4(); // ✅ tạo token truy cập riêng

    console.log(`🎬 [UPLOAD] Uploading file ${fileName}`);

    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
        metadata: { firebaseStorageDownloadTokens: token }, // ✅ gán token cho file
      },
    });

    stream.on("error", (err) => {
      console.error("❌ Firebase upload error:", err);
      res.status(500).json({ success: false, message: "Lỗi upload video", details: err.message });
    });

    stream.on("finish", async () => {
      try {
        // ❌ Không dùng makePublic() để giữ URL có token
        const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(
          fileName
        )}?alt=media&token=${token}`;

        console.log(`✅ [UPLOAD] Done: ${publicUrl}`);

        res.status(200).json({
          success: true,
          message: "Upload video thành công!",
          videoUrl: publicUrl,
          storagePath: `gs://${bucket.name}/${fileName}`,
          token: token,
        });
      } catch (err) {
        console.error("⚠️ Lỗi khi xử lý URL:", err);
        res.status(500).json({ success: false, message: "Lỗi khi tạo URL video", details: err.message });
      }
    });

    stream.end(file.buffer);
  } catch (err) {
    console.error("🔥 Lỗi server upload video:", err);
    res.status(500).json({
      success: false,
      message: "Upload thất bại",
      details: err.message,
    });
  }
};

module.exports = { uploadVideoOnly };
