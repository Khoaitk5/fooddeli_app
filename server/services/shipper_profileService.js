// services/shipperProfileService.js
const shipperProfileDao = require("../dao/shipper_profileDao");
const orderService = require("./orderService");
const orderDetailService = require("./order_detailService");
const addressService = require("./addressService");
const shopService = require("./shop_profileService");
const map4dService = require("../services/map4dService");
const shipperProfileService = {
  /**
   * ➕ Tạo hồ sơ shipper mới
   * @param {object} shipperData - { user_id, vehicle_type, vehicle_number, identity_card }
   * @returns {Promise<object>}
   */
  async createShipperProfile(shipperData) {
    if (!shipperData.user_id || !shipperData.vehicle_type) {
      throw new Error("Thiếu thông tin bắt buộc: user_id, vehicle_type");
    }
    return await shipperProfileDao.create(shipperData);
  },

  /**
   * 📦 Lấy thông tin shipper theo ID hồ sơ
   * @param {number} shipperId
   * @returns {Promise<object|null>}
   */
  async getShipperById(shipperId) {
    return await shipperProfileDao.findById(shipperId);
  },

  /**
   * 📍 Lấy thông tin shipper theo user_id
   * @param {number} userId
   * @returns {Promise<object|null>}
   */
  async getShipperByUserId(userId) {
    return await shipperProfileDao.getByUserId(userId);
  },

  /**
   * 📜 Lấy toàn bộ hồ sơ shipper
   * @returns {Promise<object[]>}
   */
  async getAllShippers() {
    return await shipperProfileDao.findAll();
  },

  /**
   * ✏️ Cập nhật thông tin hồ sơ shipper
   * @param {number} shipperId
   * @param {object} updateData
   * @returns {Promise<object>}
   */
  async updateShipper(shipperId, updateData) {
    const existing = await shipperProfileDao.findById(shipperId);
    if (!existing) {
      throw new Error("Hồ sơ shipper không tồn tại");
    }
    return await shipperProfileDao.update(shipperId, updateData);
  },

  /**
   * 🗑️ Xóa hồ sơ shipper
   * @param {number} shipperId
   * @returns {Promise<boolean>}
   */
  async deleteShipper(shipperId) {
    const existing = await shipperProfileDao.findById(shipperId);
    if (!existing) {
      throw new Error("Hồ sơ shipper không tồn tại");
    }
    return await shipperProfileDao.delete(shipperId);
  },

  /**
   * 🔄 Cập nhật trạng thái online/offline/busy
   * @param {number} shipperId
   * @param {"online"|"offline"|"busy"} status
   * @returns {Promise<object>}
   */
  async updateOnlineStatus(shipperId, status) {
    const existing = await shipperProfileDao.findById(shipperId);
    if (!existing) {
      throw new Error("Hồ sơ shipper không tồn tại");
    }
    return await shipperProfileDao.updateOnlineStatus(shipperId, status);
  },

  /**
   * 📍 Cập nhật vị trí hiện tại của shipper
   * @param {number} shipperId
   * @param {number} latitude
   * @param {number} longitude
   * @returns {Promise<object>}
   */
  async updateLocation(shipperId, latitude, longitude) {
    const existing = await shipperProfileDao.findById(shipperId);
    if (!existing) {
      throw new Error("Hồ sơ shipper không tồn tại");
    }
    return await shipperProfileDao.updateLocation(shipperId, latitude, longitude);
  },

  /**
   * 📶 Lấy danh sách shipper theo trạng thái online_status
   * @param {"online"|"offline"|"busy"} status
   * @returns {Promise<object[]>}
   */
  async getShippersByOnlineStatus(status) {
    return await shipperProfileDao.getByOnlineStatus(status);
  },

  /**
   * 🚚 Lấy danh sách shipper sẵn sàng nhận đơn (online + approved)
   * @returns {Promise<object[]>}
   */
  async getAvailableShippers() {
    return await shipperProfileDao.getAvailableShippers();
  },

  /**
   * @async
   * @function deleteShipperProfile
   * @description Xóa hồ sơ shipper (khi user bị xóa hoặc không còn hoạt động)
   * @param {number} shipperId - ID shipper
   * @returns {Promise<object>} - Hồ sơ shipper đã xóa
   */
  async deleteShipperProfile(shipperId) {
    try {
      return await shipperProfileDao.delete("id", shipperId);
    } catch (err) {
      console.error("❌ Error deleting shipper profile:", err.message);
      throw new Error("Không thể xóa hồ sơ shipper.");
    }
  },

  /**
   * @async
   * @function getShipperStatistics
   * @description Lấy thống kê hiệu suất của shipper (tổng đơn, hoàn thành, thu nhập, rating)
   * @param {number} shipperId - ID shipper profile
   * @returns {Promise<object>} - Thống kê hiệu suất
   */
  async getShipperStatistics(shipperId) {
    try {
      return await shipperProfileDao.getStatistics(shipperId);
    } catch (err) {
      console.error("❌ Error fetching shipper statistics:", err.message);
      throw new Error("Không thể lấy thống kê shipper.");
    }
  },

  /**
   * @async
   * @function getEarningsByPeriod
   * @description Lấy doanh thu của shipper theo khoảng thời gian
   * @param {number} shipperId - ID shipper profile
   * @param {string} period - "today", "week", "month", "all"
   * @returns {Promise<object>} - Doanh thu và danh sách chi tiết
   */
  async getEarningsByPeriod(shipperId, period = "month") {
    try {
      return await shipperProfileDao.getEarningsByPeriod(shipperId, period);
    } catch (err) {
      console.error("❌ Error fetching shipper earnings:", err.message);
      throw new Error("Không thể lấy doanh thu shipper.");
    }
  },

  /**
   * Lấy danh sách đơn (theo shipper_id) kèm đầy đủ thông tin:
   * - order
   * - order_details (withProduct)
   * - user_addresses
   * - shop_info (có address)
   */
  // services/shipper_profileService.js
async listFullOrders(shipperId, { status, limit = 10, offset = 0 } = {}) {
  if (!shipperId) throw new Error("shipper_id is required");

  // helper: gộp address_line.{detail, ward, district, city} => address
  const composeAddress = (addrLine = {}) => {
    if (addrLine.address && addrLine.address.trim()) return addrLine.address;
    const { detail, ward, district, city } = addrLine;
    return [detail, ward, district, city].filter(Boolean).join(", ");
  };

  // helper: chọn 1 địa chỉ hợp lệ, ưu tiên is_primary
  const pickOneAndNormalize = (addresses = []) => {
    if (!Array.isArray(addresses) || addresses.length === 0) return [];
    const chosen = addresses.find(a => a.is_primary) || addresses[0];
    const normalized = {
      ...chosen,
      address_line: {
        ...(chosen.address_line || {}),
        address: composeAddress(chosen.address_line || {}),
      },
    };
    return [normalized];
  };

  // 1️⃣ lấy danh sách order
  const orders = await orderService.listByShipper(shipperId, { status, limit, offset });

  // 2️⃣ enrich từng order
  const items = await Promise.all(
    orders.map(async (order) => {
      const [details, userAddressesRaw, shopInfoRaw] = await Promise.all([
        orderDetailService.list(order.order_id, { withProduct: true }),
        addressService.getUserAddresses(order.user_id),
        shopService.getShopProfilesAndAddressesByShopId(order.shop_id),
      ]);

      const user_addresses = pickOneAndNormalize(userAddressesRaw);
      const shop_info = shopInfoRaw
        ? {
            ...shopInfoRaw,
            address: shopInfoRaw.address
              ? {
                  ...shopInfoRaw.address,
                  address_line: {
                    ...(shopInfoRaw.address.address_line || {}),
                    address: composeAddress(shopInfoRaw.address.address_line || {}),
                  },
                }
              : null,
          }
        : null;

      // 🧭 Tính khoảng cách (distance) & thời gian (duration)
      let distance = null;
      let duration = null;
      try {
        const shopLatLon = shop_info?.address?.lat_lon;
        const userLatLon = user_addresses[0]?.lat_lon;
        if (shopLatLon && userLatLon) {
          const origin = `${shopLatLon.lat},${shopLatLon.lon}`;
          const destination = `${userLatLon.lat},${userLatLon.lon}`;
          const route = await map4dService.getRoute(origin, destination);
          const routeInfo = route?.result?.routes?.[0];
          if (routeInfo) {
            distance = routeInfo.distance?.text || null;
            duration = routeInfo.duration?.text || null;
          }
        }
      } catch (err) {
        console.warn("⚠️ Không tính được khoảng cách cho order:", order.order_id, err.message);
      }

      return { order, details, user_addresses, shop_info, distance, duration };
    })
  );

  return items;
}

};




module.exports = shipperProfileService;
