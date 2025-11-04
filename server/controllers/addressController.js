const addressService = require("../services/addressService");

exports.getUserAddresses = async (req, res) => {
  try {
    const userId = req.body.user_id;
    if (!userId) {
      return res.status(400).json({ success: false, message: "Thiếu user_id" });
    }

    const addresses = await addressService.getUserAddresses(userId);
    res.status(200).json({ success: true, data: addresses });
  } catch (err) {
    console.error("[AddressController:getUserAddresses]", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
