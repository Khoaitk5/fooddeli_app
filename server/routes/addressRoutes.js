const express = require('express');
const addressController = require('../controllers/addressController.js');

const router = express.Router();

// Lấy danh sách địa chỉ
router.get('/user-addresses', addressController.getUserAddresses);

// Thêm địa chỉ mới
router.post('/user-addresses', addressController.addUserAddress);

// Cập nhật địa chỉ
router.put('/user-addresses/:address_id', addressController.updateUserAddress);

// Đặt địa chỉ mặc định
router.put('/user-addresses/:address_id/set-default', addressController.setDefaultAddress);

// Xóa địa chỉ
router.delete('/user-addresses/:address_id', addressController.deleteUserAddress);

module.exports = router;