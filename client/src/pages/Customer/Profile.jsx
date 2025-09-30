import React, { useState, useEffect } from "react";
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
  CircularProgress,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [editingField, setEditingField] = useState(null);
  const [passwordDialog, setPasswordDialog] = useState(false);

  // 🔐 Đổi mật khẩu
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");

  // 📡 Gọi API lấy thông tin user id=4 khi trang load
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users/4")
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        setError("❌ Không thể tải thông tin người dùng: " + err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // 📌 Xử lý thay đổi input
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // 📤 Gửi thông tin cập nhật lên server
  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await axios.put("http://localhost:5000/api/users/4", user);
      alert(res.data.message || "✅ Cập nhật thông tin thành công!");
      setUser(res.data.user);
      setEditingField(null);
    } catch (err) {
      alert("❌ Cập nhật thất bại: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // ➕ Thêm địa chỉ
  const handleAddAddress = () => {
    if (newAddress.trim() === "") {
      alert("⚠️ Địa chỉ không được để trống");
      return;
    }
    const updated = [...(user.addresses || []), newAddress];
    setUser({ ...user, addresses: updated });
    setNewAddress("");
  };

  // 🗑️ Xóa địa chỉ
  const handleDeleteAddress = (index) => {
    const updated = user.addresses.filter((_, i) => i !== index);
    setUser({ ...user, addresses: updated });
  };

  // 🔐 Đổi mật khẩu
  const handlePasswordChange = async () => {
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

    try {
      const updatedUser = { ...user, password: newPassword };
      const res = await axios.put("http://localhost:5000/api/users/4", updatedUser);
      alert("✅ Đổi mật khẩu thành công!");
      setUser(res.data.user);
      setPasswordDialog(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      alert("❌ Lỗi đổi mật khẩu: " + err.message);
    }
  };

  // 🧠 Hàm render ô nhập có nút Edit ở cuối
  const renderEditableField = (label, name, type = "text") => (
    <TextField
      label={label}
      name={name}
      type={type}
      value={user?.[name] || ""}
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

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Avatar
            src={user.avatar_url}
            alt={user.full_name}
            sx={{ width: 100, height: 100, mb: 2 }}
          />
          <Typography
            variant="h5"
            sx={{ color: "#EF5126", fontWeight: 600 }}
          >
            {user.full_name}
          </Typography>
          <Typography variant="body2" sx={{ color: "gray" }}>
            ⭐ Đánh giá: {user.rating || "4.5"}
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
          {(user.addresses || []).map((addr, index) => (
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
          disabled={saving}
        >
          {saving ? "💾 Đang lưu..." : "💾 Lưu thay đổi"}
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

export default Profile;
