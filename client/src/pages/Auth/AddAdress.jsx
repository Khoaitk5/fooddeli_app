import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { getCurrentUser } from "../../api/userApi"; // 🧩 API backend /api/users/me
import { pxW } from "../../utils/scale.js";

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
  const [ongoingRole, setOngoingRole] = useState("user");
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
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

  // 🔹 Tự động chọn tỉnh/huyện/xã theo địa chỉ có sẵn
  const autoSelectLocation = async (addr) => {
    try {
      console.log("🟢 [autoSelectLocation] Nhận được addr:", addr);
      console.log("🟢 [autoSelectLocation] provinces hiện có:", provinces);

      if (!addr || !addr.city) {
        console.warn("⚠️ Không có thông tin city trong address_line:", addr);
        return;
      }

      // Hàm chuẩn hóa tên để so sánh
      const normalize = (s) =>
        s
          ?.toLowerCase()
          .replace(/^(tỉnh|thành phố|quận|huyện|thị xã|phường|xã)\s*/g, "")
          .trim();

      console.log("🟢 [autoSelectLocation] city sau normalize:", normalize(addr.city));

      // 🔹 Tìm tỉnh / thành phố
      const selectedProvince = provinces.find(
        (p) => normalize(addr.city) === normalize(p.name)
      );

      console.log("✅ [autoSelectLocation] selectedProvince:", selectedProvince);

      if (!selectedProvince) {
        console.warn(
          "⚠️ Không tìm thấy tỉnh/thành phố khớp với city:",
          addr.city
        );
        return;
      }

      // 🔹 Lấy danh sách huyện thuộc tỉnh
      const provinceRes = await fetch(
        `https://provinces.open-api.vn/api/v2/p/${selectedProvince.code}?depth=2`
      );
      const provinceData = await provinceRes.json();
      console.log("📦 [autoSelectLocation] provinceData:", provinceData);
      setDistricts(provinceData.districts);

      // 🔹 Tìm quận/huyện
      const selectedDistrict = provinceData.districts.find(
        (d) => normalize(addr.district) === normalize(d.name)
      );

      console.log("✅ [autoSelectLocation] selectedDistrict:", selectedDistrict);

      if (!selectedDistrict) {
        console.warn("⚠️ Không tìm thấy quận/huyện:", addr.district);
        return;
      }

      // 🔹 Lấy danh sách phường/xã
      const districtRes = await fetch(
        `https://provinces.open-api.vn/api/v2/d/${selectedDistrict.code}?depth=2`
      );
      const districtData = await districtRes.json();
      console.log("📦 [autoSelectLocation] districtData:", districtData);
      setWards(districtData.wards);

      // 🔹 Tìm phường/xã
      const selectedWard = districtData.wards.find(
        (w) => normalize(addr.ward) === normalize(w.name)
      );
      console.log("✅ [autoSelectLocation] selectedWard:", selectedWard);

      // 🔹 Cập nhật form nếu tìm thấy dữ liệu
      setForm((prev) => ({
        ...prev,
        city: selectedProvince?.name || prev.city,
        district: selectedDistrict?.name || prev.district,
        ward: selectedWard?.name || prev.ward,
      }));

      console.log("🟩 [autoSelectLocation] Cập nhật form:", {
        city: selectedProvince?.name,
        district: selectedDistrict?.name,
        ward: selectedWard?.name,
      });
    } catch (e) {
      console.error("❌ [autoSelectLocation] Lỗi:", e);
    }
  };


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
        setOngoingRole(ongoing_role);
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
  }, []);

  // 🔹 Khi có addressData & provinces → tự fill form + auto load dropdown
  useEffect(() => {
    if (
      !addressData ||
      !addressData.address_line ||
      provinces.length === 0
    )
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
  }, [addressData, provinces.length]);

  // 🔹 Khi chọn tỉnh
  const handleProvinceChange = (e) => {
    const provinceCode = e.target.value;
    const province = provinces.find((p) => p.code === provinceCode);
    setForm((prev) => ({
      ...prev,
      city: province.name,
      district: "",
      ward: "",
    }));
    setDistricts([]);
    setWards([]);

    fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`)
      .then((res) => res.json())
      .then((data) => setDistricts(data.districts))
      .catch((err) => console.error("Lỗi tải quận/huyện:", err));
  };

  // 🔹 Khi chọn quận/huyện
  const handleDistrictChange = (e) => {
    const districtCode = e.target.value;
    const district = districts.find((d) => d.code === districtCode);
    setForm((prev) => ({ ...prev, district: district.name, ward: "" }));

    fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`)
      .then((res) => res.json())
      .then((data) => setWards(data.wards))
      .catch((err) => console.error("Lỗi tải xã/phường:", err));
  };

  // 🔹 Khi chọn xã/phường
  const handleWardChange = (e) => {
    const wardCode = e.target.value;
    const ward = wards.find((w) => w.code === wardCode);
    setForm((prev) => ({ ...prev, ward: ward.name }));
  };

  // 🔹 Gửi dữ liệu
  const handleSubmit = () => {
    const { address_id, address_type, detail, ward, district, city } = form;

    if (!detail || !ward || !district || !city) {
      alert("⚠️ Vui lòng nhập đầy đủ thông tin địa chỉ!");
      return;
    }

    const payload = {
      address_id: address_id || null,
      address_type: address_type || "Nhà",
      note: form.note || "",
      is_primary: isDefault,
      address_line: { detail, ward, district, city },
    };

    console.log("📤 Gửi payload:", payload);

    if (onSubmit)
      onSubmit(payload);
    else
      navigate("/profileRegister", { state: { ...prevState, address: payload } });
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
          width: isDesktop ? "700px" : pxW(360),
          background: "white",
          p: isDesktop ? 4 : 3,
          borderRadius: 4,
          boxShadow: isDesktop
            ? "0 0 20px rgba(0,0,0,0.15)"
            : "0 0 10px rgba(0,0,0,0.1)",
        }}
      >
        <Typography
          variant="h6"
          sx={{ mb: 2, textAlign: "center", fontWeight: 700 }}
        >
          Cập nhật địa chỉ
        </Typography>

        <Box
          sx={{
            background: "#F9FAF8",
            borderRadius: 2,
            px: 2,
            py: 1,
            mb: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography sx={{ fontSize: 17 }}>Đặt làm địa chỉ mặc định</Typography>
          <Switch
            checked={isDefault}
            onChange={(e) => setIsDefault(e.target.checked)}
            color="default"
          />
        </Box>

        <Divider sx={{ mb: 2 }} />

        <TextField
          name="address_type"
          value={form.address_type}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, address_type: e.target.value }))
          }
          placeholder="Loại địa chỉ (Nhà riêng, Cơ quan, ...)"
          fullWidth
          sx={{ mb: 2 }}
          InputProps={{ sx: { borderRadius: 2 } }}
        />

        <TextField
          name="note"
          value={form.note}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, note: e.target.value }))
          }
          placeholder="Ghi chú giao hàng (tuỳ chọn)"
          fullWidth
          sx={{ mb: 2 }}
          InputProps={{ sx: { borderRadius: 2 } }}
        />

        <TextField
          name="detail"
          value={form.detail}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, detail: e.target.value }))
          }
          placeholder="Số nhà, tên đường, thôn/xóm..."
          fullWidth
          sx={{ mb: 2 }}
          InputProps={{ sx: { borderRadius: 2 } }}
        />

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12}>
            <FormControl fullWidth sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}>
              <Select
                value={provinces.find((p) => p.name === form.city)?.code || ""}
                onChange={handleProvinceChange}
                displayEmpty
                renderValue={(selected) =>
                  selected
                    ? provinces.find((p) => p.code === selected)?.name
                    : "Tỉnh/Thành phố"
                }
              >
                {provinces.map((p) => (
                  <MenuItem key={p.code} value={p.code}>
                    {p.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}>
              <Select
                value={districts.find((d) => d.name === form.district)?.code || ""}
                onChange={handleDistrictChange}
                displayEmpty
                renderValue={(selected) =>
                  selected
                    ? districts.find((d) => d.code === selected)?.name
                    : "Quận/Huyện"
                }
              >
                {districts.map((d) => (
                  <MenuItem key={d.code} value={d.code}>
                    {d.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}>
              <Select
                value={wards.find((w) => w.name === form.ward)?.code || ""}
                onChange={handleWardChange}
                displayEmpty
                renderValue={(selected) =>
                  selected
                    ? wards.find((w) => w.code === selected)?.name
                    : "Xã/Phường"
                }
              >
                {wards.map((w) => (
                  <MenuItem key={w.code} value={w.code}>
                    {w.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          sx={{
            background: "#F9704B",
            "&:hover": { background: "#EF5126" },
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 9999,
            py: 1.2,
          }}
        >
          Lưu địa chỉ
        </Button>
      </Box>
    </Box>
  );
};

export default AddAddress;
