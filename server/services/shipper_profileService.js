// services/shipperProfileService.js
const shipperProfileDao = require("../dao/shipper_profileDao");
const orderService = require("./orderService");
const orderDetailService = require("./order_detailService");
const addressService = require("./addressService");
const shopService = require("./shop_profileService");
const orderDao = require("../dao/orderDao");
const map4dService = require("../services/map4dService");

// 📍 Tính khoảng cách giữa 2 tọa độ theo công thức Haversine (km)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Bán kính Trái đất (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function composeAddress(addrLine = {}) {
  const text = addrLine?.address;
  if (typeof text === "string" && text.trim()) return text.trim();
  const { detail, ward, district, city } = addrLine || {};
  return [detail, ward, district, city].filter(Boolean).join(", ");
}

function pickOneAndNormalize(addresses = []) {
  if (!Array.isArray(addresses) || addresses.length === 0) return [];
  const chosen = addresses.find((a) => a.is_primary) || addresses[0];
  return [
    {
      ...chosen,
      address_line: {
        ...(chosen.address_line || {}),
        address: composeAddress(chosen.address_line || {}),
      },
    },
  ];
}
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
    return await shipperProfileDao.updateLocation(
      shipperId,
      latitude,
      longitude
    );
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

  // Quét đơn cooking gần shipper trong bán kính radiusKm
  async listNearbyCookingFull({
    lat,
    lon,
    radiusKm = 3,
    shipperId = null,
    limit = 200,
    offset = 0,
  }) {
    // Nếu đang giao thì không trả đơn mới
    if (shipperId) {
      const busy = await orderDao.hasShippingOfShipper(shipperId);
      if (busy) {
        return {
          items: [],
          meta: { busy: true, reason: "Shipper is delivering (shipping)" },
        };
      }
    }

    // 1) Lấy danh sách đơn + tọa độ shop
    const rows = await orderDao.listCookingWithShopAddress({ limit, offset });

    // 2) Lọc trong bán kính & gom điểm đích để gọi Matrix 1 lần
    const shortlisted = [];
    const destinations = [];
    rows.forEach((row) => {
      const shopLat = Number(row.shop_lat);
      const shopLon = Number(row.shop_lon);
      if (!Number.isFinite(shopLat) || !Number.isFinite(shopLon)) return;

      const distKm = calculateDistance(lat, lon, shopLat, shopLon);
      if (distKm > radiusKm) return;

      shortlisted.push({ row, distKm, shopLat, shopLon });
      destinations.push(`${shopLat},${shopLon}`);
    });

    // 3) Gọi Map4D Matrix để lấy ETA (và distance theo đường đi nếu cần)
    let elements = [];
    if (destinations.length > 0) {
      try {
        const origin = `${lat},${lon}`;
        const matrix = await map4dService.getMatrix(
          origin,
          destinations.join("|")
        );
        // Thường: matrix.rows[0].elements[i].duration.value (giây) / distance.value (m)
        elements = matrix?.rows?.[0]?.elements || []; // fallback an toàn
      } catch (e) {
        console.error("[Map4D matrix] error:", e.message);
        elements = [];
      }
    }

    // helper đọc giá trị an toàn (vì schema API có thể hơi khác)
    const readDurationSeconds = (el) => {
      if (!el) return null;
      // Google-like
      if (el?.duration?.value != null)
        return Math.round(Number(el.duration.value));
      // Một số API trả duration theo giây ở root
      if (el?.duration != null && Number.isFinite(Number(el.duration)))
        return Math.round(Number(el.duration));
      return null;
    };
    const readDistanceKm = (el, fallbackKm) => {
      if (!el) return fallbackKm;
      if (el?.distance?.value != null) return Number(el.distance.value) / 1000; // m -> km
      if (el?.distance != null && Number.isFinite(Number(el.distance)))
        return Number(el.distance) / 1000;
      return fallbackKm;
    };

    // 4) Enrich + ghép thêm details, addresses
    const items = [];
    for (let i = 0; i < shortlisted.length; i++) {
      const { row, distKm } = shortlisted[i];
      const el = elements[i] || null;

      const duration_sec = readDurationSeconds(el);
      const distance_km = Number(readDistanceKm(el, distKm).toFixed(2)); // dùng distance đường đi nếu có, fallback Haversine

      const [details, userAddresses, shopInfoRaw] = await Promise.all([
        orderDetailService.list(row.order_id, { withProduct: true }),
        addressService.getUserAddresses(row.user_id),
        shopService.getShopProfilesAndAddressesByShopId(row.shop_id),
      ]);

      const user_addresses = pickOneAndNormalize(userAddresses);
      const shop_info = shopInfoRaw
        ? {
            ...shopInfoRaw,
            address: shopInfoRaw.address
              ? {
                  ...shopInfoRaw.address,
                  address_line: {
                    ...(shopInfoRaw.address.address_line || {}),
                    address: composeAddress(
                      shopInfoRaw.address.address_line || {}
                    ),
                  },
                }
              : null,
          }
        : null;

      items.push({
        order: row,
        details,
        user_addresses,
        shop_info,
        distance_km,
        duration_sec, // ✅ FE đang cần key này
      });
    }

    return { items, meta: { busy: false, total: items.length, limit, offset } };
  },
};

module.exports = shipperProfileService;
