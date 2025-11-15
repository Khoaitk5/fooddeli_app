// controllers/shipperController.js
const ShipperProfileService = require("../services/shipper_profileService");
const shipperContractService = require("../services/shipperContractService");
const userShipperContractService = require("../services/userShipperContractService");
const shipperScoreService = require("../services/shipper_scoreService");

// ➕ Đăng ký shipper (phiên bản dùng bảng shipper_contracts)
exports.createShipper = async (req, res) => {
  try {
    const body = req.body || {};

    const {
      user_id,
      // personal
      full_name,
      phone,
      email,
      // relative
      relative_name,
      relative_phone,
      relative_relationship,
      // bank
      bank_owner_name,
      bank_name,
      bank_account_number,
      bank_account_name,
      // vehicle
      vehicle_plate_number,
      // IDs
      id_card_number,
      id_document_expiry_date,
      driver_license_number,
      // uploads
      portrait_photo_url,
      id_card_front_url,
      id_card_back_url,
      vehicle_registration_url,
      driving_license_front_url,
      driving_license_back_url,
      motorcycle_license_front_url,
      motorcycle_license_back_url,
      health_certificate_url,
      criminal_record_url,
      lltp_01_url,
      lltp_appointment_url,
      proof_image_url,
      // optional legacy profile fields
      vehicle_type,
      create_profile,
    } = body;

    if (!user_id) {
      return res.status(400).json({ success: false, message: "user_id là bắt buộc" });
    }
    if (!full_name || !phone) {
      return res.status(400).json({ success: false, message: "Thiếu thông tin bắt buộc: full_name, phone" });
    }

    // Logic ràng buộc theo DB mới (soft-validate; DB vẫn check lần nữa)
    if (!health_certificate_url) {
      return res.status(400).json({ success: false, message: "Thiếu giấy khám sức khỏe (health_certificate_url)" });
    }
    const hasLLTP2 = Boolean(criminal_record_url);
    const hasLLTP1WithAppt = Boolean(lltp_01_url) && Boolean(lltp_appointment_url);
    if (!hasLLTP2 && !hasLLTP1WithAppt) {
      return res.status(400).json({
        success: false,
        message: "Cần LLTP số 02 hoặc (LLTP số 01 + giấy hẹn LLTP02)",
      });
    }

    // Chuẩn hóa payload cho shipper_contracts
    const contractData = {
      full_name,
      phone,
      email: email ?? null,
      relative_name: relative_name ?? null,
      relative_phone: relative_phone ?? null,
      relative_relationship: relative_relationship ?? null,
      bank_owner_name: bank_owner_name ?? null,
      bank_name: bank_name ?? null,
      bank_account_number: bank_account_number ?? null,
      bank_account_name: bank_account_name ?? null,
      vehicle_plate_number: vehicle_plate_number ?? null,
      id_card_number: id_card_number ?? null,
      id_document_expiry_date: id_document_expiry_date ?? null,
      driver_license_number: driver_license_number ?? null,
      portrait_photo_url: portrait_photo_url ?? null,
      id_card_front_url: id_card_front_url ?? null,
      id_card_back_url: id_card_back_url ?? null,
      vehicle_registration_url: vehicle_registration_url ?? null,
      driving_license_front_url: driving_license_front_url ?? null,
      driving_license_back_url: driving_license_back_url ?? null,
      motorcycle_license_front_url: motorcycle_license_front_url ?? null,
      motorcycle_license_back_url: motorcycle_license_back_url ?? null,
      health_certificate_url,
      criminal_record_url: criminal_record_url ?? null,
      lltp_01_url: lltp_01_url ?? null,
      lltp_appointment_url: lltp_appointment_url ?? null,
      status: "pending",
    };

    const createdContract = await shipperContractService.create(contractData);

    // Tạo liên kết user <-> contract
    const link = await userShipperContractService.link({
      user_id,
      contract_id: createdContract.id,
      status: "pending",
      is_active: true,
    });

    // Giữ lại logic cũ: tạo shipper_profile nếu có thông tin phù hợp
    // (tùy chọn - không làm hỏng flow hợp đồng)
    let createdProfile = null;
    const shouldCreateProfile = Boolean(create_profile) || Boolean(vehicle_type) || Boolean(vehicle_plate_number) || Boolean(id_card_number);
    if (shouldCreateProfile) {
      try {
        createdProfile = await ShipperProfileService.createShipperProfile({
          user_id,
          vehicle_type: vehicle_type || "motorcycle",
          vehicle_number: vehicle_plate_number || null,
          identity_card: id_card_number || null,
        });
      } catch (e) {
        // Không chặn quy trình chính
        console.warn("⚠️ Tạo shipper_profile thất bại (bỏ qua):", e.message);
      }
    }

    return res.status(201).json({
      success: true,
      data: {
        contract: createdContract,
        link,
        profile: createdProfile,
      },
    });
  } catch (err) {
    console.error("❌ [shipperController.createShipper]", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 📄 Lấy danh sách shipper
exports.getAllShippers = async (req, res) => {
  try {
    const result = await ShipperProfileService.getAllShippers();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔍 Lấy shipper theo ID
exports.getShipperById = async (req, res) => {
  try {
    const result = await ShipperProfileService.getShipperById(req.params.id);
    if (!result) return res.status(404).json({ message: "Shipper not found" });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✏️ Cập nhật shipper
exports.updateShipper = async (req, res) => {
  try {
    const result = await ShipperProfileService.updateShipper(req.params.id, req.body);
    if (!result) return res.status(404).json({ message: "Shipper not found" });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ❌ Xóa shipper
exports.deleteShipper = async (req, res) => {
  try {
    const result = await ShipperProfileService.deleteShipper(req.params.id);
    if (!result) return res.status(404).json({ message: "Shipper not found" });
    res.status(200).json({ message: "Shipper deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📊 Lấy thống kê hiệu suất của shipper
exports.getShipperStats = async (req, res) => {
  try {
    const { shipperId } = req.params;
    if (!shipperId) {
      return res.status(400).json({ error: "shipperId is required" });
    }
    const stats = await ShipperProfileService.getShipperStatistics(shipperId);
    res.status(200).json(stats);
  } catch (err) {
    console.error("❌ Error fetching shipper stats:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// 💰 Lấy doanh thu theo khoảng thời gian
exports.getShipperEarnings = async (req, res) => {
  try {
    const { shipperId } = req.params;
    const { period = "month" } = req.query;

    if (!shipperId) {
      return res.status(400).json({ error: "shipperId is required" });
    }

    const allowed = ["today", "week", "month", "all"];
    if (!allowed.includes(period)) {
      return res.status(400).json({ error: "Invalid period. Allowed: today, week, month, all" });
    }

    const earnings = await ShipperProfileService.getEarningsByPeriod(shipperId, period);
    res.status(200).json(earnings);
  } catch (err) {
    console.error("❌ Error fetching shipper earnings:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// 👤 Lấy thông tin shipper profile của user hiện tại
exports.getMyShipperProfile = async (req, res) => {
  try {
    const sessionUser = req.session?.user;

    if (!sessionUser) {
      return res.status(401).json({
        success: false,
        message: "❌ Chưa đăng nhập hoặc session đã hết hạn.",
      });
    }

    const shipperProfile = await ShipperProfileService.getShipperByUserId(sessionUser.id);

    if (!shipperProfile) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy hồ sơ shipper.",
        data: null
      });
    }

    return res.status(200).json({
      success: true,
      data: shipperProfile,
    });
  } catch (err) {

    console.error("❌ Error fetching my shipper profile:", err.message);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

exports.getMyShipperScore = async (req, res) => {
  try {
    const sessionUser = req.session?.user;
    if (!sessionUser) {
      return res.status(401).json({
        success: false,
        message: "❌ Chưa đăng nhập hoặc session đã hết hạn.",
      });
    }

    const shipperProfile = await ShipperProfileService.getShipperByUserId(sessionUser.id);
    if (!shipperProfile) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy hồ sơ shipper.",
      });
    }

    const shipperId = shipperProfile.id;

    const [score, leaderboard] = await Promise.all([
      shipperScoreService.getScoreByShipperId(shipperId),
      shipperScoreService.getLeaderboard({ limit: 1000, offset: 0 }),
    ]);

    let rank = null;
    if (Array.isArray(leaderboard) && leaderboard.length > 0) {
      const index = leaderboard.findIndex((item) => Number(item.shipper_id) === Number(shipperId));
      if (index !== -1) {
        rank = index + 1;
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        shipper_id: shipperId,
        total_points: score?.total_points || 0,
        completed_orders: score?.completed_orders || 0,
        rank,
        total_shippers: Array.isArray(leaderboard) ? leaderboard.length : 0,
      },
    });
  } catch (err) {
    console.error("❌ Error fetching my shipper score:", err.message);
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

exports.listNearbyCookingFull = async (req, res) => {
  try {
    const { lat, lon, radius_km, shipper_id, limit, offset } = req.body || {};
    const latN = Number(lat), lonN = Number(lon);
    if (!Number.isFinite(latN) || !Number.isFinite(lonN)) {
      return res.status(400).json({ success: false, message: "lat & lon required (number)" });
    }
    const r = await ShipperProfileService.listNearbyCookingFull({
      lat: latN,
      lon: lonN,
      radiusKm: Number(radius_km) || 3,
      shipperId: shipper_id ?? null,
      limit: Number(limit) || 200,
      offset: Number(offset) || 0,
    });
    return res.json({ success: true, data: r.items, meta: r.meta });
  } catch (err) {
    console.error("[ShipperCtrl:listNearbyCookingFull]", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};


exports.acceptOrder = async (req, res) => {
  try {
    const sessionUser = req.session?.user;
    if (!sessionUser) {
      return res.status(401).json({ success: false, message: "Chưa đăng nhập" });
    }

    const { order_id } = req.body || {};
    if (!order_id) {
      return res.status(400).json({ success: false, message: "order_id required" });
    }

    // Lấy shipper_id từ user hiện tại (giống /api/users/me)
    // Nếu session đã có shipper_profile.id thì dùng luôn, nếu không thì đọc DB một lần
    let shipperId = sessionUser?.shipper_profile?.id;
    if (!shipperId) {
      // fallback DB rất nhẹ — không bắt buộc nếu session đã chứa shipper_profile
      const sp = await ShipperProfileService.getShipperByUserId(sessionUser.id);
      if (!sp) return res.status(400).json({ success:false, message:"Không tìm thấy hồ sơ shipper" });
      shipperId = sp.id;
    }

    const result = await ShipperProfileService.acceptOrder({
      orderId: Number(order_id),
      shipperId: Number(shipperId),
    });

    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    if (err.code === 409) {
      return res.status(409).json({ success: false, message: err.message });
    }
    console.error("[acceptOrder]", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.pickupOrder = async (req, res) => {
  try {
    const sessionUser = req.session?.user;
    if (!sessionUser) {
      return res.status(401).json({ success:false, message:'Chưa đăng nhập' });
    }
    const { order_id } = req.body || {};
    if (!order_id) {
      return res.status(400).json({ success:false, message:'order_id required' });
    }
    // lấy shipperId từ session (giống accept)
    let shipperId = sessionUser?.shipper_profile?.id;
    if (!shipperId) {
      const sp = await ShipperProfileService.getShipperByUserId(sessionUser.id);
      if (!sp) return res.status(400).json({ success:false, message:'Không tìm thấy hồ sơ shipper' });
      shipperId = sp.id;
    }

    const data = await ShipperProfileService.pickupOrder({
      orderId: Number(order_id),
      shipperId: Number(shipperId),
    });

    return res.status(200).json({ success:true, data });
  } catch (err) {
    if (err.code === 409) {
      return res.status(409).json({ success:false, message: err.message });
    }
    console.error('[pickupOrder]', err);
    return res.status(500).json({ success:false, message:'Lỗi hệ thống' });
  }
};

exports.completeOrder = async (req, res) => {
  try {
    const sessionUser = req.session?.user;
    if (!sessionUser) {
      return res.status(401).json({ success: false, message: "Chưa đăng nhập" });
    }

    const { order_id } = req.body || {};
    if (!order_id) {
      return res.status(400).json({ success: false, message: "order_id required" });
    }

    // lấy shipper_id từ session (giống accept)
    let shipperId = sessionUser?.shipper_profile?.id;
    if (!shipperId) {
      const sp = await ShipperProfileService.getShipperByUserId(sessionUser.id);
      if (!sp) return res.status(400).json({ success:false, message:"Không tìm thấy hồ sơ shipper" });
      shipperId = sp.id;
    }

    const result = await ShipperProfileService.completeOrder({
      orderId: Number(order_id),
      shipperId: Number(shipperId),
    });

    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    if (err.code === 409) {
      return res.status(409).json({ success: false, message: err.message });
    }
    console.error("[completeOrder]", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.listOrdersByShipperFull = async (req, res) => {
  try {
    // shipper_id can be provided in body or inferred from session
    let { shipper_id, status, limit, offset } = req.body || {};

    if (!shipper_id) {
      const sessionUser = req.session?.user;
      if (sessionUser) {
        shipper_id = sessionUser?.shipper_profile?.id || null;
      }
    }

    if (!shipper_id) {
      return res.status(400).json({ success: false, message: "shipper_id required" });
    }

    const r = await ShipperProfileService.listOrdersOfShipperFull({
      shipperId: Number(shipper_id),
      status: status ?? null,
      limit: Number(limit) || 50,
      offset: Number(offset) || 0,
    });

    return res.json({ success: true, data: r.items, meta: r.meta });
  } catch (err) {
    console.error('[ShipperCtrl:listOrdersByShipperFull]', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * 🗺️ Lấy thông tin quãng đường và thời gian giữa 2 điểm
 * POST /api/shipper/route-info
 * Body: { originLat, originLon, destLat, destLon }
 */
exports.getRouteInfo = async (req, res) => {
  try {
    const { originLat, originLon, destLat, destLon } = req.body;

    // Chuyển đổi sang số và kiểm tra
    const oLat = Number(originLat);
    const oLon = Number(originLon);
    const dLat = Number(destLat);
    const dLon = Number(destLon);

    if (
      !Number.isFinite(oLat) || !Number.isFinite(oLon) ||
      !Number.isFinite(dLat) || !Number.isFinite(dLon)
    ) {
      return res.status(400).json({
        success: false,
        message: "Tọa độ không hợp lệ. Cần có originLat, originLon, destLat, destLon ở dạng số.",
      });
    }

    const routeInfo = await ShipperProfileService.getRouteInfo({ originLat: oLat, originLon: oLon, destLat: dLat, destLon: dLon });

    return res.status(200).json({ success: true, data: routeInfo });
  } catch (err) {
    console.error("❌ [shipperController.getRouteInfo]", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};