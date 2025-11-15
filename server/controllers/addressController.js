const addressService = require("../services/addressService");

/**
 * Lấy danh sách địa chỉ của user
 */
exports.getUserAddresses = async (req, res) => {
  try {
    const userId = req.session?.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Chưa đăng nhập" });
    }

    const addresses = await addressService.getNormalizedUserAddresses(userId);
    res.status(200).json({ success: true, data: addresses });
  } catch (err) {
    console.error("[AddressController:getUserAddresses]", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Thêm địa chỉ mới cho user
 */
exports.addUserAddress = async (req, res) => {
  try {
    const userId = req.session?.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Chưa đăng nhập" });
    }

    const { address_line, lat_lon, note, address_type, is_primary } = req.body;
    
    if (!address_line || !address_line.detail || !address_line.ward || !address_line.province) {
      return res.status(400).json({ 
        success: false, 
        message: "Thiếu thông tin địa chỉ (detail, ward, province)" 
      });
    }

    const address = await addressService.createAddressForUser(
      userId,
      { address_line, lat_lon, note, address_type },
      is_primary || false
    );

    res.status(201).json({ success: true, data: address });
  } catch (err) {
    console.error("[AddressController:addUserAddress]", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Cập nhật địa chỉ
 */
exports.updateUserAddress = async (req, res) => {
  try {
    const userId = req.session?.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Chưa đăng nhập" });
    }

    const { address_id } = req.params;
    const { address_line, lat_lon, note, address_type, is_primary } = req.body;

    console.log(`[UpdateAddress] User ${userId} updating address ${address_id}`);

    // Kiểm tra quyền sở hữu
    const userAddresses = await addressService.getUserAddresses(userId);
    const ownsAddress = userAddresses.some(addr => addr.address_id === parseInt(address_id));
    
    if (!ownsAddress) {
      console.warn(`[UpdateAddress] User ${userId} không có quyền sửa address ${address_id}`);
      return res.status(403).json({ success: false, message: "Không có quyền sửa địa chỉ này" });
    }

    const updated = await addressService.updateAddress(address_id, {
      address_line,
      lat_lon,
      note,
      address_type,
      is_primary
    });

    console.log(`[UpdateAddress] Successfully updated address ${address_id}`);
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    console.error("[AddressController:updateUserAddress]", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Đặt địa chỉ làm mặc định
 */
exports.setDefaultAddress = async (req, res) => {
  try {
    const userId = req.session?.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Chưa đăng nhập" });
    }

    const { address_id } = req.params;
    
    // Reset tất cả địa chỉ khác về is_primary = false
    const addresses = await addressService.getUserAddresses(userId);
    for (const addr of addresses) {
      if (addr.address_id !== parseInt(address_id)) {
        await addressService.updateAddress(addr.address_id, { is_primary: false });
      }
    }
    
    // Set địa chỉ này làm mặc định
    const updated = await addressService.updateAddress(address_id, { is_primary: true });
    
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    console.error("[AddressController:setDefaultAddress]", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Xóa địa chỉ
 */
exports.deleteUserAddress = async (req, res) => {
  try {
    const userId = req.session?.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Chưa đăng nhập" });
    }

    const { address_id } = req.params;
    
    // Kiểm tra quyền sở hữu
    const userAddresses = await addressService.getUserAddresses(userId);
    const addressToDelete = userAddresses.find(addr => addr.address_id === parseInt(address_id));
    
    if (!addressToDelete) {
      return res.status(403).json({ success: false, message: "Không có quyền xóa địa chỉ này" });
    }
    
    // Không cho xóa địa chỉ mặc định nếu còn địa chỉ khác
    if (addressToDelete.is_primary && userAddresses.length > 1) {
      return res.status(400).json({ 
        success: false, 
        message: "Không thể xóa địa chỉ mặc định. Vui lòng đặt địa chỉ khác làm mặc định trước." 
      });
    }
    
    console.log(`[DeleteAddress] Deleting address ${address_id} for user ${userId}`);
    
    // Xóa trong bảng user_addresses trước
    const userAddressDao = require("../dao/user_addressDao");
    await userAddressDao.delete("address_id", address_id);
    
    // Sau đó xóa address
    const addressDao = require("../dao/addressDao");
    await addressDao.delete("address_id", address_id);
    
    console.log(`[DeleteAddress] Successfully deleted address ${address_id}`);
    
    res.status(200).json({ success: true, message: "Đã xóa địa chỉ" });
  } catch (err) {
    console.error("[AddressController:deleteUserAddress]", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
