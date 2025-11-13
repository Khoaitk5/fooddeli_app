const express = require("express");
const multer = require("multer");
const { uploadImage, uploadShipperContractImage, uploadShopContractImage } = require("../controllers/imageUploadController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("image"), uploadImage);

// Upload ảnh hợp đồng shipper vào thư mục theo userId từ session
router.post("/upload/shipper-contract", upload.single("image"), uploadShipperContractImage);

// Upload ảnh hợp đồng shop vào thư mục theo userId từ session
router.post("/upload/shop-contract", upload.single("image"), uploadShopContractImage);

module.exports = router;
