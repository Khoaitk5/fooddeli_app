import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Switch,
  Divider,
  Grid,
  MenuItem,
  Select,
  FormControl,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import BackArrow from "@/components/shared/BackArrow";
import { getCurrentUser } from "../../api/userApi"; // 🧩 API backend /api/users/me

const AddAddress = ({ onSubmit }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const prevState = location.state || {};
  const isDesktop = useMediaQuery("(min-width: 769px)");

  const [form, setForm] = useState({
    address_id: null,
    address_type: "",
    note: "",
    detail: "",
    ward: "",
    district: "",
    city: "",
  });

  const [isDefault, setIsDefault] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addressData, setAddressData] = useState(null);

  // 🔹 Load danh sách tỉnh/thành
  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/v2/p/")
      .then((res) => res.json())
      .then((data) => setProvinces(data))
      .catch((err) => console.error("⚠️ Lỗi tải tỉnh:", err));
  }, []);

  // 🔹 Tự động chọn tỉnh/xã theo địa chỉ có sẵn
  const autoSelectLocation = useCallback(
    async (addr) => {
      try {
        if (!addr || !addr.city) return;

        const normalize = (s) =>
          s
            ?.toLowerCase()
            .replace(/^(tỉnh|thành phố|phường|xã)\s*/g, "")
            .trim();

        const selectedProvince = provinces.find(
          (p) => normalize(addr.city) === normalize(p.name)
        );

        if (!selectedProvince) return;

        const provinceRes = await fetch(
          `https://provinces.open-api.vn/api/v2/p/${selectedProvince.code}?depth=2`
        );
        const provinceData = await provinceRes.json();
        const wardsData =
          provinceData.wards ||
          provinceData.districts ||
          provinceData.communes ||
          [];
        setWards(wardsData);

        const selectedWard = wardsData.find(
          (w) => normalize(addr.ward) === normalize(w.name)
        );

        setForm((prev) => ({
          ...prev,
          city: selectedProvince?.name || prev.city,
          ward: selectedWard?.name || prev.ward,
        }));
      } catch (e) {
        console.error("Error loading address:", e);
      }
    },
    [provinces]
  );

  // 🔹 Lấy thông tin user hiện tại
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        setLoading(true);
        const data = await getCurrentUser();
        if (!data?.success) {
          setLoading(false);
          return;
        }

        const { user, ongoing_role } = data;
        let addrData = null;

        if (ongoing_role === "shop" && user.shop_profile?.address) {
          addrData = user.shop_profile.address;
        } else if (ongoing_role === "user" && user.addresses?.length > 0) {
          addrData =
            user.addresses.find((a) => a.is_primary) || user.addresses[0];
        }

        if (addrData) {
          // 🧩 Parse nếu address_line là JSON string
          if (typeof addrData.address_line === "string") {
            try {
              addrData.address_line = JSON.parse(addrData.address_line);
            } catch (err) {
              console.error("❌ Parse JSON address_line lỗi:", err);
            }
          }

          console.log("📦 addressData sau khi parse:", addrData);
        }

        setAddressData(addrData || null);
      } catch (err) {
        console.error("⚠️ Lỗi khi tải địa chỉ:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAddress();
  }, [provinces.length]);

  // 🔹 Khi có addressData & provinces → tự fill form + auto load dropdown
  useEffect(() => {
    if (!addressData || !addressData.address_line || provinces.length === 0)
      return;

    const addr = addressData.address_line;

    // Kiểm tra dữ liệu hợp lệ
    if (!addr.city || !addr.district || !addr.ward) {
      console.warn("❗ address_line thiếu thông tin:", addr);
    }

    setForm({
      address_id: addressData.address_id ?? null,
      address_type: addressData.address_type || "Nhà",
      note: addressData.note || "",
      detail: addr.detail || "",
      ward: addr.ward || "",
      district: addr.district || "",
      city: addr.city || "",
    });
    setIsDefault(addressData.is_primary ?? false);

    // ✅ Gọi autoSelectLocation khi có đủ dữ liệu
    autoSelectLocation(addr);
  }, [addressData, provinces.length, autoSelectLocation]);

  // 🔹 Khi chọn tỉnh → lấy xã/phường
  const handleProvinceChange = (e) => {
    const provinceCode = e.target.value;
    const province = provinces.find((p) => p.code === provinceCode);
    setForm((prev) => ({
      ...prev,
      city: province.name,
      ward: "",
    }));
    setWards([]);

    fetch(`https://provinces.open-api.vn/api/v2/p/${provinceCode}?depth=2`)
      .then((res) => res.json())
      .then((data) => {
        const wardsData = data.wards || data.districts || data.communes || [];
        setWards(wardsData);
      })
      .catch((err) => console.error("Lỗi tải xã/phường:", err));
  };

  // 🔹 Khi chọn xã/phường
  const handleWardChange = (e) => {
    const wardCode = e.target.value;
    const ward = wards.find((w) => w.code === wardCode);
    if (ward) {
      setForm((prev) => ({ ...prev, ward: ward.name }));
    }
  };

  // 🔹 Gửi dữ liệu
  const handleSubmit = () => {
    const { address_id, address_type, detail, ward, city } = form;

    if (!detail || !ward || !city) {
      alert("⚠️ Vui lòng nhập đầy đủ thông tin địa chỉ!");
      return;
    }

    const payload = {
      address_id: address_id || null,
      address_type: address_type || "Nhà",
      note: form.note || "",
      is_primary: isDefault,
      address_line: { detail, ward, city },
    };

    if (onSubmit) onSubmit(payload);
    else
      navigate("/profileRegister", {
        state: { ...prevState, address: payload },
      });
  };

  // 🔹 Loading UI
  if (loading)
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="body1">⏳ Đang tải địa chỉ...</Typography>
      </Box>
    );

  // 🔹 Giao diện form
  return (
    <Box
      sx={{
        width: isDesktop ? "100%" : "100vw",
        height: isDesktop ? "auto" : "100vh",
        backgroundColor: isDesktop ? "#fff" : "#f5f5f5",
        display: "flex",
        justifyContent: "center",
        alignItems: isDesktop ? "flex-start" : "center",
        p: isDesktop ? 4 : 0,
      }}
    >
      <Box
        sx={{
          width: isDesktop ? "600px" : "100%",
          maxWidth: 600,
          background: "white",
          p: isDesktop ? 4 : 3,
          borderRadius: 3,
          boxShadow: isDesktop
            ? "0 2px 12px rgba(0,0,0,0.08)"
            : "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        <Box
          sx={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 3,
          }}
        >
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              position: "absolute",
              left: 0,
              width: 44,
              height: 44,
              borderRadius: 2,
              border: "1px solid rgba(22, 24, 35, 0.12)",
              boxShadow: "0 10px 20px rgba(22, 24, 35, 0.08)",
              backgroundColor: "#fff",
              color: "#161823",
              "&:hover": {
                backgroundColor: "#f9f9f9",
              },
            }}
          >
            <BackArrow width="12px" height="18px" />
          </IconButton>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              fontSize: isDesktop ? 24 : 20,
              color: "#1A1A1A",
            }}
          >
            {addressData?.address_id ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
          </Typography>
        </Box>

        {/* Địa chỉ chi tiết */}
        <Box sx={{ mb: 2.5 }}>
          <Typography
            sx={{ mb: 1, fontSize: 14, fontWeight: 600, color: "#333" }}
          >
            Địa chỉ chi tiết <span style={{ color: "#F9704B" }}>*</span>
          </Typography>
          <TextField
            name="detail"
            value={form.detail}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, detail: e.target.value }))
            }
            placeholder="Số nhà, tên đường..."
            fullWidth
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "#FAFAFA",
              },
            }}
          />
        </Box>

        {/* Tỉnh/Thành phố */}
        <Box sx={{ mb: 2.5 }}>
          <Typography
            sx={{ mb: 1, fontSize: 14, fontWeight: 600, color: "#333" }}
          >
            Tỉnh/Thành phố <span style={{ color: "#F9704B" }}>*</span>
          </Typography>
          <FormControl fullWidth required>
            <Select
              value={provinces.find((p) => p.name === form.city)?.code || ""}
              onChange={handleProvinceChange}
              displayEmpty
              sx={{
                borderRadius: 2,
                backgroundColor: "#FAFAFA",
              }}
              renderValue={(selected) =>
                selected
                  ? provinces.find((p) => p.code === selected)?.name
                  : "Chọn tỉnh/thành phố"
              }
            >
              {provinces.map((p) => (
                <MenuItem key={p.code} value={p.code}>
                  {p.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Xã/Phường */}
        <Box sx={{ mb: 2.5 }}>
          <Typography
            sx={{ mb: 1, fontSize: 14, fontWeight: 600, color: "#333" }}
          >
            Xã/Phường <span style={{ color: "#F9704B" }}>*</span>
          </Typography>
          <FormControl
            fullWidth
            required
            disabled={!form.city || wards.length === 0}
          >
            <Select
              value={wards.find((w) => w.name === form.ward)?.code || ""}
              onChange={handleWardChange}
              displayEmpty
              sx={{
                borderRadius: 2,
                backgroundColor: "#FAFAFA",
              }}
              renderValue={(selected) =>
                selected
                  ? wards.find((w) => w.code === selected)?.name
                  : form.city
                  ? wards.length === 0
                    ? "Đang tải..."
                    : "Chọn xã/phường"
                  : "Vui lòng chọn tỉnh/thành trước"
              }
            >
              {wards.map((w) => (
                <MenuItem key={w.code} value={w.code}>
                  {w.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Loại địa chỉ */}
        <Box sx={{ mb: 2.5 }}>
          <Typography
            sx={{ mb: 1, fontSize: 14, fontWeight: 600, color: "#333" }}
          >
            Loại địa chỉ
          </Typography>
          <TextField
            name="address_type"
            value={form.address_type}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, address_type: e.target.value }))
            }
            placeholder="Nhà riêng, Cơ quan, ..."
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "#FAFAFA",
              },
            }}
          />
        </Box>

        {/* Ghi chú */}
        <Box sx={{ mb: 3 }}>
          <Typography
            sx={{ mb: 1, fontSize: 14, fontWeight: 600, color: "#333" }}
          >
            Ghi chú giao hàng
          </Typography>
          <TextField
            name="note"
            value={form.note}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, note: e.target.value }))
            }
            placeholder="VD: Giao giờ hành chính, gọi trước khi giao..."
            fullWidth
            multiline
            rows={2}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "#FAFAFA",
              },
            }}
          />
        </Box>

        {/* Đặt làm mặc định */}
        <Box
          sx={{
            background: "#F9FAF8",
            borderRadius: 2,
            px: 2,
            py: 1.5,
            mb: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            border: "1px solid #E8E8E8",
          }}
        >
          <Typography sx={{ fontSize: 15, fontWeight: 500, color: "#333" }}>
            Đặt làm địa chỉ mặc định
          </Typography>
          <Switch
            checked={isDefault}
            onChange={(e) => setIsDefault(e.target.checked)}
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": {
                color: "#F9704B",
              },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                backgroundColor: "#F9704B",
              },
            }}
          />
        </Box>

        {/* Button Lưu */}
        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          disabled={!form.detail || !form.city || !form.ward}
          sx={{
            background:
              !form.detail || !form.city || !form.ward ? "#CCCCCC" : "#F9704B",
            color: "#fff",
            "&:hover": {
              background:
                !form.detail || !form.city || !form.ward
                  ? "#CCCCCC"
                  : "#E64A19",
            },
            textTransform: "none",
            fontWeight: 700,
            fontSize: 16,
            borderRadius: 2,
            py: 1.5,
            boxShadow: "none",
            "&:disabled": {
              color: "#fff",
              cursor: "not-allowed",
            },
          }}
        >
          {addressData?.address_id ? "Cập nhật địa chỉ" : "Lưu địa chỉ"}
        </Button>
      </Box>
    </Box>
  );
};

export default AddAddress;
