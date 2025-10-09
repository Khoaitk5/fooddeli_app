import React, { useState } from "react";
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

  // ✅ Nhận dữ liệu từ ProfileRegister nếu có
  const prevState = location.state || {};

  // ✅ State form
  const [form, setForm] = useState({
    address_type: "", // 🏷️ loại địa chỉ: nhà, cơ quan, khác...
    note: "", // 📝 ghi chú giao hàng
    detail: "",
    ward: "",
    city: "",
  });

  const [isDefault, setIsDefault] = useState(false);

  // Demo dữ liệu (sẽ thay bằng API sau)
  const provinceOptions = ["Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Hải Phòng"];
  const wardOptions = ["Phường 1", "Phường 2", "Phường 3", "Xã A"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const { address_type, detail, ward, city } = form;

    if (!address_type || !detail || !ward || !city) {
      alert("⚠️ Vui lòng nhập đầy đủ thông tin bắt buộc!");
      return;
    }

    // ✅ Dữ liệu đầy đủ để gửi về FE hoặc backend
    const payload = {
      addressType: address_type,
      note: form.note,
      detail,
      ward,
      city,
      isDefault,
    };

    console.log("✅ Địa chỉ mới:", payload);

    // ✅ Quay lại trang ProfileRegister, giữ nguyên state cũ + thêm địa chỉ mới
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

        {/* 🔹 Đặt làm địa chỉ mặc định */}
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

        {/* 🔹 Loại địa chỉ */}
        <TextField
          name="address_type"
          value={form.address_type}
          onChange={handleChange}
          placeholder="Loại địa chỉ (nhà, cơ quan, khác,...)"
          fullWidth
          sx={{ mb: 2 }}
          InputProps={{ sx: { borderRadius: 2 } }}
        />

        {/* 🔹 Ghi chú */}
        <TextField
          name="note"
          value={form.note}
          onChange={handleChange}
          placeholder="Ghi chú giao hàng (tuỳ chọn)"
          fullWidth
          sx={{ mb: 2 }}
          InputProps={{ sx: { borderRadius: 2 } }}
        />

        <Divider sx={{ mb: 2 }} />

        {/* 🔹 Địa chỉ chi tiết */}
        <TextField
          name="detail"
          value={form.detail}
          onChange={handleChange}
          placeholder="Địa chỉ chi tiết"
          fullWidth
          sx={{ mb: 2 }}
          InputProps={{ sx: { borderRadius: 2 } }}
        />

        {/* 🔹 Phường + Thành phố */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6}>
            <FormControl
              fullWidth
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            >
              <Select
                name="ward"
                value={form.ward}
                onChange={handleChange}
                displayEmpty
                renderValue={(selected) => selected || "Xã/Phường"}
              >
                {wardOptions.map((w) => (
                  <MenuItem key={w} value={w}>
                    {w}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl
              fullWidth
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            >
              <Select
                name="city"
                value={form.city}
                onChange={handleChange}
                displayEmpty
                renderValue={(selected) => selected || "Tỉnh/Thành Phố"}
              >
                {provinceOptions.map((p) => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* 🔹 Nút tiếp tục */}
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
