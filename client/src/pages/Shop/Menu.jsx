import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AddCircleOutline,
  RemoveCircleOutline,
} from "@mui/icons-material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import { Snackbar, Alert } from "@mui/material";

const API_URL = "http://localhost:5000/api/images/upload";

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    preparationTime: "",
  });
  const [imagePreview, setImagePreview] = useState("");
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      image: "",
      preparationTime: "",
    });
    setImagePreview(""); // reset preview khi tạo mới
    setSelectedImageFile(null); // xóa file ảnh tạm đã chọn
    setUploadError("");
    setIsDialogOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: String(item.price),
      category: item.category,
      image: item.image,
      preparationTime: String(item.preparationTime),
    });
    setImagePreview(item.image); // ✅ giữ preview cũ khi sửa
    setSelectedImageFile(null); // xóa file ảnh tạm đã chọn
    setUploadError("");
    setIsDialogOpen(true);
  };

  // 🖼️ Chọn ảnh (chỉ lưu tạm & hiển thị preview)
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setUploadError("");
  };

  // 💾 Lưu món ăn
  const handleSave = async () => {
    // 1) VALIDATE cơ bản
    if (!selectedImageFile && !formData.image) {
      setUploadError("⚠️ Vui lòng chọn ảnh sản phẩm trước khi lưu!");
      return;
    }
    if (!formData.name.trim() || !formData.price.trim()) {
      alert("Vui lòng nhập đầy đủ tên món và giá!");
      return;
    }

    // 2) (NẾU CÓ) UPLOAD ẢNH LÊN SERVER → FIREBASE
    let imageUrl = formData.image; // nếu đang sửa và chưa đổi ảnh, dùng ảnh cũ
    if (selectedImageFile) {
      setUploading(true);
      setUploadError("");

      const formDataUpload = new FormData();
      formDataUpload.append("image", selectedImageFile);

      try {
        const res = await fetch(API_URL, {
          method: "POST",
          body: formDataUpload,
        });
        const data = await res.json();

        if (!res.ok || !data.imageUrl) {
          setUploadError(data?.error || "Upload thất bại!");
          setUploading(false);
          return; // ❌ DỪNG TẠI ĐÂY nếu upload lỗi — KHÔNG hiện success
        }

        // ✅ Upload thành công → đã có URL public
        console.log("📸 Ảnh đã upload lên Firebase:", data.imageUrl);
        imageUrl = data.imageUrl;
      } catch (err) {
        console.error("❌ Lỗi upload:", err);
        setUploadError("Không thể upload ảnh lên server!");
        setUploading(false);
        return; // ❌ DỪNG TẠI ĐÂY nếu upload lỗi — KHÔNG hiện success
      } finally {
        setUploading(false);
      }
    }

    // 3) TẠO ĐỐI TƯỢNG MÓN ĂN
    const newItem = {
      id: editingItem ? editingItem.id : Date.now(),
      ...formData,
      image: imageUrl, // 🔗 dùng URL đã upload (hoặc ảnh cũ nếu không đổi)
      price: parseInt(formData.price, 10) || 0,
      preparationTime: parseInt(formData.preparationTime, 10) || 0,
      status: "active",
      hasVideo: false,
    };

    // 4) (TODO) GỬI newItem LÊN API THẬT TẠI ĐÂY NẾU CẦN
    console.log("📦 [TODO] Gửi thông tin sản phẩm:", newItem);

    // 5) CẬP NHẬT DANH SÁCH Ở UI
    if (editingItem) {
      setMenuItems((items) => items.map((i) => (i.id === editingItem.id ? newItem : i)));
    } else {
      setMenuItems((items) => [newItem, ...items]);
    }

    // 6) ✅ HIỂN THỊ THÔNG BÁO THÀNH CÔNG
    setSuccessMessage(
      editingItem
        ? "✅ Ảnh đã được upload và món ăn đã được cập nhật thành công!"
        : "✅ Ảnh đã được upload và món ăn đã được thêm thành công!"
    );

    // 7) ĐÓNG DIALOG & RESET CÁC TRẠNG THÁI TẠM
    setIsDialogOpen(false);
    setSelectedImageFile(null); // bỏ file tạm
    // KHÔNG xóa imagePreview: để user thấy kết quả ngoài danh sách
  };

  const handleDelete = (id) =>
    setMenuItems((items) => items.filter((i) => i.id !== id));

  // 🎛️ Điều chỉnh giá / thời gian
  const adjustValue = (field, delta, step = 1) => {
    setFormData((prev) => {
      const current = parseInt(prev[field] || "0", 10);
      let next = current + delta * step;
      if (field === "price") next = Math.max(0, next);
      if (field === "preparationTime") next = Math.max(0, next);
      return { ...prev, [field]: String(next) };
    });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h6">Quản lý món ăn</Typography>
          <Typography variant="body2" color="text.secondary">
            Quản lý menu và món ăn của shop
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          sx={{ bgcolor: "#ff6900", "&:hover": { bgcolor: "#e55a3a" } }}
        >
          Thêm món mới
        </Button>
      </Box>

      {/* Danh sách món ăn */}
      {menuItems.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 5,
            color: "text.secondary",
            border: "1px dashed rgba(0,0,0,0.2)",
            borderRadius: 2,
          }}
        >
          <Typography variant="body1">📭 Chưa có sản phẩm nào</Typography>
          <Typography variant="body2">
            Hãy nhấn “Thêm món mới” để bắt đầu.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {menuItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card sx={{ overflow: "hidden" }}>
                <Box sx={{ position: "relative" }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={item.image}
                    alt={item.name}
                  />
                  {item.hasVideo && (
                    <Chip
                      size="small"
                      color="error"
                      icon={<VideoLibraryIcon sx={{ fontSize: 16 }} />}
                      label="Video"
                      sx={{ position: "absolute", top: 8, right: 8 }}
                    />
                  )}
                </Box>
                <CardContent>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    <Typography fontWeight={600} noWrap>
                      {item.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {item.description}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Chip
                        label={item.category}
                        variant="outlined"
                        size="small"
                      />
                      <Chip
                        label={item.status === "active" ? "Đang bán" : "Tạm ngưng"}
                        size="small"
                        color={item.status === "active" ? "success" : "default"}
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        color: "text.secondary",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <AttachMoneyIcon sx={{ fontSize: 18 }} />
                        <Typography color="text.primary" fontWeight={500}>
                          {formatPrice(item.price)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <AccessTimeIcon sx={{ fontSize: 18 }} />
                        <Typography>{item.preparationTime} phút</Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", gap: 1, pt: 1 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleEdit(item)}
                        sx={{ flex: 1 }}
                      >
                        Sửa
                      </Button>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(item.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog thêm/sửa món */}
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingItem ? "Chỉnh sửa món ăn" : "Thêm món ăn mới"}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Tên món"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              fullWidth
              size="small"
            />
            <TextField
              label="Mô tả"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              fullWidth
              size="small"
              multiline
              minRows={3}
            />

            {/* Giá và Thời gian làm */}
            <Box sx={{ display: "flex", gap: 2 }}>
              {/* Giá */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  Giá (VND)
                </Typography>
                <TextField
                  type="number"
                  value={formData.price}
                  onChange={(e) => {
                    const val = Math.max(0, Math.floor(e.target.value / 1000) * 1000);
                    setFormData({ ...formData, price: val.toString() });
                  }}
                  size="small"
                  fullWidth
                  inputProps={{
                    step: 1000, // mỗi lần tăng/giảm 1000
                    min: 0,
                  }}
                />
              </Box>

              {/* Thời gian làm */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  Thời gian làm (phút)
                </Typography>
                <TextField
                  type="number"
                  value={formData.preparationTime}
                  onChange={(e) => {
                    const val = Math.max(0, parseInt(e.target.value || "0", 10));
                    setFormData({ ...formData, preparationTime: val.toString() });
                  }}
                  size="small"
                  fullWidth
                  inputProps={{
                    step: 1,
                    min: 0,
                  }}
                />
              </Box>
            </Box>

            <TextField
              label="Danh mục"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              fullWidth
              size="small"
            />

            {/* Upload ảnh */}
            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Hình ảnh sản phẩm
              </Typography>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                disabled={uploading}
              />
              {uploading && (
                <Box
                  sx={{ display: "flex", alignItems: "center", mt: 1, gap: 1 }}
                >
                  <CircularProgress size={20} />
                  <Typography color="text.secondary">
                    Đang tải ảnh lên...
                  </Typography>
                </Box>
              )}
              {uploadError && (
                <Typography color="error" sx={{ mt: 1 }}>
                  {uploadError}
                </Typography>
              )}
              {imagePreview && (
                <Box
                  sx={{
                    mt: 1,
                    border: "1px solid rgba(0,0,0,0.1)",
                    borderRadius: 1,
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ width: "100%", height: 160, objectFit: "cover" }}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSave} variant="contained">
            {editingItem ? "Cập nhật" : "Thêm món"}
          </Button>
          <Button
            onClick={() => setIsDialogOpen(false)}
            variant="outlined"
            color="inherit"
          >
            Hủy
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar hiển thị khi upload + lưu thành công */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSuccessMessage("")}
          severity="success"
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

    </Box>
  );
};

export default MenuManagement;
