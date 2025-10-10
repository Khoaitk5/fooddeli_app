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
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { pxW, pxH } from "../../utils/scale.js";

const AddAddress = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prevState = location.state || {};

  const [form, setForm] = useState({
    address_type: "",
    note: "",
    detail: "",
    ward: "",
    city: "",
  });

  const [isDefault, setIsDefault] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  // ✅ 1. Lấy danh sách TỈNH/THÀNH khi load
  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/p/")
      .then((res) => res.json())
      .then((data) => setProvinces(data))
      .catch((err) => console.error("Lỗi tải tỉnh:", err));
  }, []);

  // ✅ 2. Khi chọn TỈNH → Lấy danh sách HUYỆN
  const handleProvinceChange = (e) => {
    const provinceCode = e.target.value;
    const province = provinces.find((p) => p.code === provinceCode);
    setForm((prev) => ({ ...prev, city: province.name, ward: "" }));
    setWards([]);
    setDistricts([]);

    fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`)
      .then((res) => res.json())
      .then((data) => {
        setDistricts(data.districts);
      })
      .catch((err) => console.error("Lỗi tải quận:", err));
  };

  // ✅ 3. Khi chọn HUYỆN → Lấy danh sách XÃ
  const handleDistrictChange = (e) => {
    const districtCode = e.target.value;
    
    fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`)
      .then((res) => res.json())
      .then((data) => {
        setWards(data.wards);
      })
      .catch((err) => console.error("Lỗi tải xã:", err));
  };

  const handleWardChange = (e) => {
    const wardCode = e.target.value;
    const ward = wards.find((w) => w.code === wardCode);
    setForm((prev) => ({ ...prev, ward: ward.name }));
  };

  const handleSubmit = () => {
    const { address_type, detail, ward, city } = form;
    if (!address_type || !detail || !ward || !city) {
      alert("⚠️ Vui lòng nhập đầy đủ thông tin bắt buộc!");
      return;
    }

    const payload = {
      addressType: address_type,
      note: form.note,
      detail,
      ward,
      city,
      isDefault,
    };

    console.log("✅ Địa chỉ mới:", payload);

    navigate("/profileRegister", {
      state: {
        ...prevState,
        address: payload,
      },
    });
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#f5f5f5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: pxW(360),
          minHeight: pxH(800),
          background: "white",
          p: 3,
          borderRadius: 4,
          boxShadow: "0 0 20px rgba(0,0,0,0.1)",
          position: "relative",
        }}
      >
        <Typography
          variant="h6"
          sx={{ mb: 2, color: "#000", textAlign: "center", fontWeight: 700 }}
        >
          Thêm địa chỉ
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
          <Typography sx={{ fontSize: 17, color: "#000" }}>
            Đặt làm địa chỉ mặc định
          </Typography>
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
          placeholder="Loại địa chỉ (nhà, cơ quan, khác,...)"
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

        <Divider sx={{ mb: 2 }} />

        <TextField
          name="detail"
          value={form.detail}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, detail: e.target.value }))
          }
          placeholder="Địa chỉ chi tiết"
          fullWidth
          sx={{ mb: 2 }}
          InputProps={{ sx: { borderRadius: 2 } }}
        />

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {/* 🔹 Tỉnh/Thành */}
          <Grid item xs={6}>
            <FormControl
              fullWidth
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            >
              <Select
                value={
                  provinces.find((p) => p.name === form.city)?.code || ""
                }
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

          {/* 🔹 Huyện */}
          <Grid item xs={6}>
            <FormControl
              fullWidth
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            >
              <Select
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

          {/* 🔹 Xã/Phường */}
          <Grid item xs={12}>
            <FormControl
              fullWidth
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            >
              <Select
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
          Tiếp tục
        </Button>
      </Box>
    </Box>
  );
};

export default AddAddress;
