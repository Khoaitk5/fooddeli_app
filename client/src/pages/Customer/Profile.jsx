import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemText,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const CustomerProfile = () => {
  const [user, setUser] = useState({
    id: 1,
    username: "john_doe",
    email: "john@example.com",
    phone: "0909123456",
    full_name: "John Doe",
    avatar_url: "https://i.pravatar.cc/150?u=john",
    rating: 4.5,
    password: "123456",
    addresses: ["123 Đường ABC, Quận 1, TP.HCM", "456 Đường DEF, Quận 3"],
  });

  const [newAddress, setNewAddress] = useState("");
  const [editingField, setEditingField] = useState(null);
  const [passwordDialog, setPasswordDialog] = useState(false);

  // mật khẩu
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setEditingField(null);
    alert("✅ Cập nhật thông tin thành công!");
    console.log("📤 Gửi dữ liệu lên server:", user);
  };

  const handleAddAddress = () => {
    if (newAddress.trim() === "") {
      alert("⚠️ Địa chỉ không được để trống");
      return;
    }
    setUser({ ...user, addresses: [...user.addresses, newAddress] });
    setNewAddress("");
  };

  const handleDeleteAddress = (index) => {
    const updatedAddresses = user.addresses.filter((_, i) => i !== index);
    setUser({ ...user, addresses: updatedAddresses });
  };

  const handlePasswordChange = () => {
    if (oldPassword !== user.password) {
      alert("❌ Mật khẩu cũ không chính xác!");
      return;
    }
    if (newPassword.trim() === "" || confirmPassword.trim() === "") {
      alert("⚠️ Vui lòng nhập đầy đủ mật khẩu mới!");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("❌ Mật khẩu xác nhận không trùng khớp!");
      return;
    }

    setUser({ ...user, password: newPassword });
    setPasswordDialog(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    alert("✅ Đổi mật khẩu thành công!");
  };

  // 🧠 Hàm render ô nhập có nút Edit ở cuối
  const renderEditableField = (label, name, type = "text") => (
    <TextField
      label={label}
      name={name}
      type={type}
      value={user[name]}
      onChange={handleChange}
      fullWidth
      disabled={editingField !== name}
      sx={{ mb: 2 }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={() => setEditingField(name)} edge="end">
              <EditIcon color={editingField === name ? "primary" : "action"} />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );

  return (
    <Box
      sx={{
        width: "100vw",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: 4,
      }}
    >
      <Box
        sx={{
          width: 400,
          background: "white",
          padding: 4,
          borderRadius: 4,
          boxShadow: "0 0 20px rgba(0,0,0,0.1)",
        }}
      >
        {/* 📸 Avatar */}
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
          <Avatar
            src={user.avatar_url}
            alt={user.full_name}
            sx={{ width: 100, height: 100, mb: 2 }}
          />
          <Typography variant="h5" sx={{ color: "#EF5126", fontWeight: 600 }}>
            {user.full_name}
          </Typography>
          <Typography variant="body2" sx={{ color: "gray" }}>
            ⭐ Đánh giá: {user.rating}
          </Typography>
        </Box>

        {/* 📄 Các ô thông tin có nút Edit */}
        {renderEditableField("Username", "username")}
        {renderEditableField("Họ và tên", "full_name")}
        {renderEditableField("Email", "email")}
        {renderEditableField("Số điện thoại", "phone")}

        {/* 🔐 Mật khẩu */}
        <Box sx={{ mb: 2 }}>
          <TextField label="Mật khẩu" value="********" fullWidth disabled sx={{ mb: 1 }} />
          <Button size="small" onClick={() => setPasswordDialog(true)}>
            🔐 Đổi mật khẩu
          </Button>
        </Box>

        {/* 📍 Danh sách địa chỉ */}
        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
          📍 Danh sách địa chỉ
        </Typography>

        <List>
          {user.addresses.map((addr, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton edge="end" onClick={() => handleDeleteAddress(index)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText primary={addr} />
            </ListItem>
          ))}
        </List>

        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
          <TextField
            label="Thêm địa chỉ mới"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            sx={{
              background: "#F9704B",
              "&:hover": { background: "#EF5126" },
              textTransform: "none",
            }}
            onClick={handleAddAddress}
          >
            ➕
          </Button>
        </Box>

        {/* 💾 Nút lưu */}
        <Button
          fullWidth
          variant="contained"
          sx={{
            background: "#4CAF50",
            "&:hover": { background: "#45A049" },
            textTransform: "none",
            fontWeight: 600,
            mt: 4,
          }}
          onClick={handleSave}
        >
          💾 Lưu
        </Button>
      </Box>

      {/* 🔐 Dialog đổi mật khẩu */}
      <Dialog open={passwordDialog} onClose={() => setPasswordDialog(false)}>
        <DialogTitle>🔐 Đổi mật khẩu</DialogTitle>
        <DialogContent>
          <TextField
            label="Mật khẩu cũ"
            type="password"
            fullWidth
            sx={{ mt: 2 }}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <TextField
            label="Mật khẩu mới"
            type="password"
            fullWidth
            sx={{ mt: 2 }}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            label="Nhập lại mật khẩu mới"
            type="password"
            fullWidth
            sx={{ mt: 2 }}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialog(false)}>Hủy</Button>
          <Button onClick={handlePasswordChange} variant="contained">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomerProfile;
