const { bucket } = require("../config/firebase");
const { v4: uuidv4 } = require("uuid");

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Không có file được gửi lên" });
    }

    const file = req.file;
    const fileName = `images/product/${uuidv4()}-${file.originalname}`;
    const blob = bucket.file(fileName);

    const blobStream = blob.createWriteStream({
      metadata: { contentType: file.mimetype },
    });

    blobStream.on("error", (err) => {
      console.error("❌ Firebase upload error:", err);
      res.status(500).json({ error: "Upload thất bại", details: err.message });
    });

    blobStream.on("finish", async () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      console.log(`✅ Uploaded to Firebase: ${publicUrl}`);
      res.status(200).json({ imageUrl: publicUrl });
    });

    blobStream.end(file.buffer);
  } catch (err) {
    console.error("🔥 Upload error:", err);
    res.status(500).json({ error: "Lỗi server khi upload ảnh", details: err.message });
  }
};
