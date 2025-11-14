// services/shipperProfileService.js
const shipperProfileDao = require("../dao/shipper_profileDao");
const orderService = require("./orderService");
const orderDetailService = require("./order_detailService");
const addressService = require("./addressService");
const shopService = require("./shop_profileService");
const orderDao = require("../dao/orderDao");
const map4dService = require("../services/map4dService");
const userDao = require("../dao/userDao");

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
    console.log("[busy-check]", { shipperId, busy });
    if (busy) {
      return {
        items: [],
        meta: { busy: true, reason: "Shipper is delivering (shipping)" },
      };
    }
  }

  // 1) Lấy danh sách đơn + tọa độ shop
  const rows = await orderDao.listCookingWithShopAddress({ limit, offset });

  // 2) Lọc theo bán kính & gom đích để gọi matrix 1 lần (shipper -> shop)
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

  // 3) Gọi Matrix cho chặng shipper -> shop
  let elements = [];
  if (destinations.length > 0) {
    try {
      const origin = `${lat},${lon}`;
      const matrix = await map4dService.getMatrix(origin, destinations.join("|"));
      elements = matrix?.rows?.[0]?.elements || matrix?.elements || [];
    } catch (e) {
      console.error("[Map4D matrix shipper->shop] error:", e.message);
      elements = [];
    }
  }

  // helpers đọc an toàn
  const readDurationSeconds = (el) => {
    if (!el) return null;
    if (el?.duration?.value != null) return Math.round(Number(el.duration.value));
    if (el?.duration != null && Number.isFinite(Number(el.duration)))
      return Math.round(Number(el.duration));
    if (el?.time != null && Number.isFinite(Number(el.time)))
      return Math.round(Number(el.time));
    if (el?.travelTime != null && Number.isFinite(Number(el.travelTime)))
      return Math.round(Number(el.travelTime));
    if (el?.duration_in_traffic?.value != null)
      return Math.round(Number(el.duration_in_traffic.value));
    return null;
  };

  const readDistanceKm = (el, fallbackKm) => {
    if (!el) return fallbackKm;
    if (el?.distance?.value != null) return Number(el.distance.value) / 1000;
    if (el?.distance != null && Number.isFinite(Number(el.distance))) {
      const m = Number(el.distance);
      return m > 1000 ? m / 1000 : fallbackKm;
    }
    if (el?.length != null && Number.isFinite(Number(el.length))) {
      return Number(el.length) / 1000;
    }
    return fallbackKm;
  };

  // 4) Enrich + thêm chặng shop -> customer
  const items = [];
  for (let i = 0; i < shortlisted.length; i++) {
    const { row, distKm, shopLat, shopLon } = shortlisted[i];
    const el = elements[i] || null;

    // shipper -> shop
    let distance_km = readDistanceKm(el, distKm);
    distance_km = Number(distance_km.toFixed(2));

    let duration_sec = readDurationSeconds(el);
    if (duration_sec == null) {
      const AVG_SPEED_KMH = 22;
      duration_sec = Math.round((distance_km / AVG_SPEED_KMH) * 3600);
    }

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
                  address: composeAddress(shopInfoRaw.address.address_line || {}),
                },
              }
            : null,
        }
      : null;

    // === FIX QUAN TRỌNG: lấy đúng lat/lon của KH từ lat_lon ===
    const dropRaw = Array.isArray(user_addresses) ? user_addresses[0] : user_addresses;
    const dropLat = Number(dropRaw?.lat_lon?.lat);
    const dropLon = Number(dropRaw?.lat_lon?.lon);

    let pickup_to_drop_distance_km = null;
    let pickup_to_drop_duration_sec = null;

    if (
      Number.isFinite(shopLat) && Number.isFinite(shopLon) &&
      Number.isFinite(dropLat) && Number.isFinite(dropLon)
    ) {
      try {
        const m2 = await map4dService.getMatrix(
          `${shopLat},${shopLon}`,
          `${dropLat},${dropLon}`
        );
        const el2 = m2?.rows?.[0]?.elements?.[0] ?? m2?.elements?.[0] ?? null;

        const fallbackKm = calculateDistance(shopLat, shopLon, dropLat, dropLon);
        pickup_to_drop_distance_km = Number(readDistanceKm(el2, fallbackKm).toFixed(2));

        pickup_to_drop_duration_sec = readDurationSeconds(el2);
        if (pickup_to_drop_duration_sec == null) {
          const AVG_SPEED_KMH = 22;
          pickup_to_drop_duration_sec = Math.round(
            (pickup_to_drop_distance_km / AVG_SPEED_KMH) * 3600
          );
        }
      } catch (e) {
        console.error("[Map4D matrix shop->drop] error:", e.message);
        const fallbackKm = calculateDistance(shopLat, shopLon, dropLat, dropLon);
        pickup_to_drop_distance_km = Number(fallbackKm.toFixed(2));
        const AVG_SPEED_KMH = 22;
        pickup_to_drop_duration_sec = Math.round(
          (pickup_to_drop_distance_km / AVG_SPEED_KMH) * 3600
        );
      }
    }

    // Thông tin liên hệ
    const [customerUser, shopOwnerUser] = await Promise.all([
      userDao.findById(row.user_id),
      shopInfoRaw?.user_id ? userDao.findById(shopInfoRaw.user_id) : null,
    ]);

    const customer_name =
      customerUser?.full_name || customerUser?.username || "Khách hàng";
    const customer_phone = customerUser?.phone || null;

    const shop_contact_name =
      shopOwnerUser?.full_name ||
      shopOwnerUser?.username ||
      (shopInfoRaw?.shop_name ?? null);
    const shop_phone = shopOwnerUser?.phone || null;

    items.push({
      order: row,
      details,
      user_addresses,
      shop_info,
      // shipper -> shop
      distance_km,
      duration_sec,
      // shop -> customer
      pickup_to_drop_distance_km,
      pickup_to_drop_duration_sec,
      // contact
      customer_name,
      customer_phone,
      shop_contact_name,
      shop_phone,
    });
  }

  return { items, meta: { busy: false, total: items.length, limit, offset } };
},

  /**
   * 📦 Lấy danh sách orders của 1 shipper và enrich giống listNearbyCookingFull
   * @param {object} options { shipperId, status, limit, offset }
   */
  async listOrdersOfShipperFull({ shipperId, status = null, limit = 50, offset = 0 } = {}) {
    if (!shipperId) throw new Error("shipperId is required");

    // 1) Lấy orders theo shipper
    const rows = await orderDao.getOrdersByShipperId(shipperId, { status, limit, offset });

    // 2) Lấy vị trí hiện tại của shipper (nếu có) để tính khoảng cách shipper->shop
    let shipperProfile = null;
    try {
      shipperProfile = await shipperProfileDao.findById(shipperId);
    } catch (e) {
      shipperProfile = null;
    }

    const originLat = Number(shipperProfile?.current_location?.lat);
    const originLon = Number(shipperProfile?.current_location?.lon);
    const hasOrigin = Number.isFinite(originLat) && Number.isFinite(originLon);

    // 3) Chuẩn bị destinations (shop lat,lon) để gọi matrix 1 lần
    const shortlisted = [];
    const destinations = [];
    for (const row of rows) {
      // shop lat/lon chưa có trong rows => lấy shop info sau nhưng cần push shop id first
      shortlisted.push({ row });
    }

    // 4) Lấy tất cả shop địa chỉ song song để build destinations
    for (let i = 0; i < shortlisted.length; i++) {
      const item = shortlisted[i];
      const shopInfoRaw = await shopService.getShopProfilesAndAddressesByShopId(item.row.shop_id);
      const shopLat = Number(shopInfoRaw?.address?.lat_lon?.lat);
      const shopLon = Number(shopInfoRaw?.address?.lat_lon?.lon);
      item.shopInfoRaw = shopInfoRaw || null;
      item.shopLat = Number.isFinite(shopLat) ? shopLat : null;
      item.shopLon = Number.isFinite(shopLon) ? shopLon : null;
      if (hasOrigin && item.shopLat != null && item.shopLon != null) {
        destinations.push(`${item.shopLat},${item.shopLon}`);
      }
    }

    // 5) Gọi Matrix cho chặng shipper -> shop (nếu có origin)
    let elements = [];
    if (hasOrigin && destinations.length > 0) {
      try {
        const origin = `${originLat},${originLon}`;
        const matrix = await map4dService.getMatrix(origin, destinations.join("|"));
        elements = matrix?.rows?.[0]?.elements || matrix?.elements || [];
      } catch (e) {
        console.error("[Map4D matrix shipper->shop (by-shipper)] error:", e.message);
        elements = [];
      }
    }

    // helpers (reuse from above)
    const readDurationSeconds = (el) => {
      if (!el) return null;
      if (el?.duration?.value != null) return Math.round(Number(el.duration.value));
      if (el?.duration != null && Number.isFinite(Number(el.duration)))
        return Math.round(Number(el.duration));
      if (el?.time != null && Number.isFinite(Number(el.time)))
        return Math.round(Number(el.time));
      if (el?.travelTime != null && Number.isFinite(Number(el.travelTime)))
        return Math.round(Number(el.travelTime));
      if (el?.duration_in_traffic?.value != null)
        return Math.round(Number(el.duration_in_traffic.value));
      return null;
    };

    const readDistanceKm = (el, fallbackKm) => {
      if (!el) return fallbackKm;
      if (el?.distance?.value != null) return Number(el.distance.value) / 1000;
      if (el?.distance != null && Number.isFinite(Number(el.distance))) {
        const m = Number(el.distance);
        return m > 1000 ? m / 1000 : fallbackKm;
      }
      if (el?.length != null && Number.isFinite(Number(el.length))) {
        return Number(el.length) / 1000;
      }
      return fallbackKm;
    };

    // 6) Enrich mỗi order giống listNearbyCookingFull
    const items = [];
    for (let i = 0; i < shortlisted.length; i++) {
      const { row, shopInfoRaw, shopLat, shopLon } = shortlisted[i];
      const el = elements[i] || null;

      let distance_km = null;
      let duration_sec = null;
      if (hasOrigin && shopLat != null && shopLon != null) {
        const fallbackKm = calculateDistance(originLat, originLon, shopLat, shopLon);
        distance_km = readDistanceKm(el, fallbackKm);
        distance_km = Number(distance_km.toFixed(2));
        duration_sec = readDurationSeconds(el);
        if (duration_sec == null) {
          const AVG_SPEED_KMH = 22;
          duration_sec = Math.round((distance_km / AVG_SPEED_KMH) * 3600);
        }
      }

      const [details, userAddresses] = await Promise.all([
        orderDetailService.list(row.order_id, { withProduct: true }),
        addressService.getUserAddresses(row.user_id),
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
                    address: composeAddress(shopInfoRaw.address.address_line || {}),
                  },
                }
              : null,
          }
        : null;

      // pickup -> drop (shop -> customer)
      const dropRaw = Array.isArray(user_addresses) ? user_addresses[0] : user_addresses;
      const dropLat = Number(dropRaw?.lat_lon?.lat);
      const dropLon = Number(dropRaw?.lat_lon?.lon);

      let pickup_to_drop_distance_km = null;
      let pickup_to_drop_duration_sec = null;

      if (
        Number.isFinite(shopLat) && Number.isFinite(shopLon) &&
        Number.isFinite(dropLat) && Number.isFinite(dropLon)
      ) {
        try {
          const m2 = await map4dService.getMatrix(`${shopLat},${shopLon}`, `${dropLat},${dropLon}`);
          const el2 = m2?.rows?.[0]?.elements?.[0] ?? m2?.elements?.[0] ?? null;

          const fallbackKm = calculateDistance(shopLat, shopLon, dropLat, dropLon);
          pickup_to_drop_distance_km = Number(readDistanceKm(el2, fallbackKm).toFixed(2));

          pickup_to_drop_duration_sec = readDurationSeconds(el2);
          if (pickup_to_drop_duration_sec == null) {
            const AVG_SPEED_KMH = 22;
            pickup_to_drop_duration_sec = Math.round((pickup_to_drop_distance_km / AVG_SPEED_KMH) * 3600);
          }
        } catch (e) {
          console.error("[Map4D matrix shop->drop (by-shipper)] error:", e.message);
          const fallbackKm = calculateDistance(shopLat, shopLon, dropLat, dropLon);
          pickup_to_drop_distance_km = Number(fallbackKm.toFixed(2));
          const AVG_SPEED_KMH = 22;
          pickup_to_drop_duration_sec = Math.round((pickup_to_drop_distance_km / AVG_SPEED_KMH) * 3600);
        }
      }

      // contact
      const [customerUser, shopOwnerUser] = await Promise.all([
        userDao.findById(row.user_id),
        shopInfoRaw?.user_id ? userDao.findById(shopInfoRaw.user_id) : null,
      ]);

      const customer_name = customerUser?.full_name || customerUser?.username || "Khách hàng";
      const customer_phone = customerUser?.phone || null;

      const shop_contact_name =
        shopOwnerUser?.full_name || shopOwnerUser?.username || (shopInfoRaw?.shop_name ?? null);
      const shop_phone = shopOwnerUser?.phone || null;

      items.push({
        order: row,
        details,
        user_addresses,
        shop_info,
        distance_km,
        duration_sec,
        pickup_to_drop_distance_km,
        pickup_to_drop_duration_sec,
        customer_name,
        customer_phone,
        shop_contact_name,
        shop_phone,
      });
    }

    return { items, meta: { busy: false, total: items.length, limit, offset } };
  },

  async acceptOrder({ orderId, shipperId }) {
    if (!orderId || !shipperId) {
      const e = new Error("orderId & shipperId required");
      e.code = 400;
      throw e;
    }

    // 1) kiểm tra shipper đang bận không
    const busy = await orderDao.hasShippingOfShipper(shipperId);
    console.log("[busy-check]", { shipperId, busy });
    if (busy) {
      const e = new Error("Bạn đang giao một đơn khác");
      e.code = 409;
      throw e;
    }

    // 2) gán shipper nếu đơn vẫn còn 'cooking'
    const ok = await orderDao.assignShipperIfCooking({ orderId, shipperId });
    if (!ok) {
      const e = new Error("Đơn đã được nhận bởi shipper khác");
      e.code = 409;
      throw e;
    }

    // 3) trả về order đã gán (optional)
    const order = await orderDao.findById(orderId);
    return { order };
  },

  async pickupOrder({ orderId, shipperId }) {
    if (!orderId || !shipperId) {
      const e = new Error("orderId & shipperId required");
      e.code = 400;
      throw e;
    }
    // chỉ cho phép đổi trạng thái khi chính shipper được gán nhận hàng
    const ok = await orderDao.updateStatusToShipping({ orderId, shipperId });
    if (!ok) {
      const e = new Error(
        "Không thể chuyển sang shipping (đơn không ở trạng thái cooking hoặc không thuộc shipper này)"
      );
      e.code = 409;
      throw e;
    }
    const order = await orderDao.findById(orderId);
    return { order };
  },

  async completeOrder({ orderId, shipperId }) {
    if (!orderId || !shipperId) {
      const e = new Error("orderId & shipperId required");
      e.code = 400;
      throw e;
    }

    const updated = await orderDao.completeIfOwnedByShipper({ orderId, shipperId });
    if (!updated) {
      const e = new Error("Không thể hoàn thành: đơn không ở trạng thái shipping hoặc không thuộc bạn");
      e.code = 409;
      throw e;
    }
    return { order: updated };
  },
};

module.exports = shipperProfileService;
