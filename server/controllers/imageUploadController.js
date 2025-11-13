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
      const encodedPath = encodeURIComponent(blob.name);
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodedPath}?alt=media`;

      console.log(`✅ Uploaded to Firebase: ${publicUrl}`);
      res.status(200).json({ imageUrl: publicUrl });
    });

    blobStream.end(file.buffer);
  } catch (err) {
    console.error("🔥 Upload error:", err);
    res.status(500).json({ error: "Lỗi server khi upload ảnh", details: err.message });
  }
};

// Upload ảnh hợp đồng shop vào thư mục theo userId từ session
exports.uploadShopContractImage = async (req, res) => {
  try {
    const sessionUser = req.session?.user;
    if (!sessionUser || !sessionUser.id) {
      return res.status(401).json({ success: false, message: "Chưa đăng nhập" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Không có file được gửi lên" });
    }

    const userId = sessionUser.id;
    const file = req.file;
    const folderPath = `images/contracts/shop/${userId}`;
    const fileName = `${folderPath}/${uuidv4()}_${file.originalname}`;
    const fileUpload = bucket.file(fileName);

    const token = uuidv4();

    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
        metadata: { firebaseStorageDownloadTokens: token },
      },
    });

    stream.on("error", (err) => {
      console.error("❌ Firebase upload error:", err);
      res.status(500).json({ success: false, message: "Upload thất bại", details: err.message });
    });

    stream.on("finish", async () => {
      try {
        const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media&token=${token}`;
        const storagePath = `gs://${bucket.name}/${fileName}`;
        console.log(`✅ [ShopContract Upload] ${storagePath}`);
        res.status(200).json({ success: true, imageUrl: publicUrl, storagePath, token });
      } catch (err) {
        console.error("⚠️ Lỗi khi tạo URL:", err);
        res.status(500).json({ success: false, message: "Lỗi khi tạo URL ảnh", details: err.message });
      }
    });

    stream.end(file.buffer);
  } catch (err) {
    console.error("🔥 Lỗi server upload ảnh hợp đồng shop:", err);
    res.status(500).json({ success: false, message: "Upload thất bại", details: err.message });
  }
};

// Upload ảnh hợp đồng shipper vào thư mục theo userId từ session
exports.uploadShipperContractImage = async (req, res) => {
  try {
    const sessionUser = req.session?.user;
    if (!sessionUser || !sessionUser.id) {
      return res.status(401).json({ success: false, message: "Chưa đăng nhập" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Không có file được gửi lên" });
    }

    const userId = sessionUser.id;
    const file = req.file;
    const folderPath = `images/contracts/shipper/${userId}`;
    const fileName = `${folderPath}/${uuidv4()}_${file.originalname}`;
    const fileUpload = bucket.file(fileName);

    const token = uuidv4();

    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
        metadata: { firebaseStorageDownloadTokens: token },
      },
    });

    stream.on("error", (err) => {
      console.error("❌ Firebase upload error:", err);
      res.status(500).json({ success: false, message: "Upload thất bại", details: err.message });
    });

    stream.on("finish", async () => {
      try {
        const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media&token=${token}`;
        const storagePath = `gs://${bucket.name}/${fileName}`;
        console.log(`✅ [ShipperContract Upload] ${storagePath}`);
        res.status(200).json({ success: true, imageUrl: publicUrl, storagePath, token });
      } catch (err) {
        console.error("⚠️ Lỗi khi tạo URL:", err);
        res.status(500).json({ success: false, message: "Lỗi khi tạo URL ảnh", details: err.message });
      }
    });

    stream.end(file.buffer);
  } catch (err) {
    console.error("🔥 Lỗi server upload ảnh hợp đồng shipper:", err);
    res.status(500).json({ success: false, message: "Upload thất bại", details: err.message });
  }
};
