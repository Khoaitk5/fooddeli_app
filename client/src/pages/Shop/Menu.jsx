import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";

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

  // Tải sản phẩm của shop hiện tại
  useEffect(() => {
    const loadProductsByShop = async () => {
      try {
        const userRes = await fetch("http://localhost:5000/api/users/me", {
          credentials: "include",
        });
        const me = await userRes.json();

        // Lấy đúng shopId (không dùng shop_profile.id)
        const shopId =
          me?.user?.shop_profile?.shop_profile_id ??
          me?.shop_profile?.shop_profile_id ??
          me?.user?.shop_profile?.shop_id ??
          me?.shop_profile?.shop_id ??
          null;

        if (!shopId) {
          console.warn("[Menu] Không tìm thấy shopId hợp lệ từ /api/users/me");
          return;
        }

        const productRes = await fetch(
          "http://localhost:5000/api/products/by-shop",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ shopId: Number(shopId) }),
          }
        );
        const resp = await productRes.json();
        const products = Array.isArray(resp?.data) ? resp.data : [];

        const active = products.filter((p) => p?.is_available === true);
        const formatted = active.map((p) => ({
          id: p.product_id,
          name: p.name || "",
          description: p.description || "",
          price: Number(p.price) || 0,
          image: p.image_url || "",
          category: p.category || "Khác",
          preparationTime: Number(p.prep_minutes) || 0,
          status: p.is_available ? "active" : "inactive",
          hasVideo: false,
        }));

        setMenuItems(formatted);
      } catch (e) {
        console.error("❌ Lỗi loadProductsByShop:", e);
      }
    };

    loadProductsByShop();
  }, []);

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
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
    setImagePreview("");
    setSelectedImageFile(null);
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
    setImagePreview(item.image);
    setSelectedImageFile(null);
    setUploadError("");
    setIsDialogOpen(true);
  };

  // Chọn ảnh (preview cục bộ)
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setUploadError("");
  };

  // Lưu món ăn (upload ảnh khi submit)
  const handleSave = async () => {
    if (!selectedImageFile && !formData.image) {
      setUploadError("⚠️ Vui lòng chọn ảnh sản phẩm trước khi lưu!");
      return;
    }
    if (!formData.name.trim() || !formData.price.trim()) {
      alert("Vui lòng nhập đầy đủ tên món và giá!");
      return;
    }

    let imageUrl = formData.image;
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
          return;
        }

        imageUrl = data.imageUrl;
      } catch (err) {
        console.error("❌ Lỗi upload:", err);
        setUploadError("Không thể upload ảnh lên server!");
        setUploading(false);
        return;
      } finally {
        setUploading(false);
      }
    }

    const newItem = {
      id: editingItem ? editingItem.id : Date.now(),
      ...formData,
      image: imageUrl,
      price: parseInt(formData.price, 10) || 0,
      preparationTime: parseInt(formData.preparationTime, 10) || 0,
      status: "active",
      hasVideo: false,
    };

    // TODO: gọi API tạo/cập nhật sản phẩm ở đây nếu cần
    if (editingItem) {
      setMenuItems((items) =>
        items.map((i) => (i.id === editingItem.id ? newItem : i))
      );
    } else {
      setMenuItems((items) => [newItem, ...items]);
    }

    setSuccessMessage(
      editingItem
        ? "✅ Ảnh đã được upload và món ăn đã được cập nhật thành công!"
        : "✅ Ảnh đã được upload và món ăn đã được thêm thành công!"
    );

    setIsDialogOpen(false);
    setSelectedImageFile(null);
  };

  const handleDelete = (id) =>
    setMenuItems((items) => items.filter((i) => i.id !== id));

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
        // ✅ CSS GRID (không phụ thuộc Grid2), responsive + đồng đều
        <Box
          sx={{
            display: "grid",
            gap: 2, // nhỏ hơn
            gridTemplateColumns: {
              xs: "1fr",               // mobile: 1 cột
              sm: "repeat(2, 1fr)",    // tablet: 2 cột
              md: "repeat(3, 1fr)",    // laptop: 3 cột
              lg: "repeat(4, 1fr)",    // desktop: 4 cột ✅
              xl: "repeat(4, 1fr)",
            },
            alignItems: "stretch",
            px: { xs: 1.5, sm: 2, md: 3 },
          }}
        >
          {menuItems.map((item) => (
            <Card
              key={item.id}
              sx={{
                height: { xs: 420, sm: 460, md: 500 },
                width: "100%",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                borderRadius: 2,
              }}
            >
              {/* Ảnh: tỉ lệ cố định */}
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "4 / 3",
                  bgcolor: "rgba(0,0,0,0.04)",
                  flexShrink: 0,
                }}
              >
                <CardMedia
                  component="img"
                  image={item.image || ""}
                  alt={item.name}
                  sx={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  onError={(e) => (e.currentTarget.style.visibility = "hidden")}
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

              {/* Nội dung */}
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.25,
                  flexGrow: 1,
                  pb: 1.5,
                }}
              >
                {/* Tiêu đề: 1 dòng */}
                <Typography
                  fontWeight={700}
                  sx={{
                    lineHeight: 1.4,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    minHeight: 24,
                  }}
                >
                  {item.name}
                </Typography>

                {/* Mô tả: 2 dòng */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    minHeight: 40,
                  }}
                >
                  {item.description}
                </Typography>

                {/* Chips */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    minHeight: 32,
                  }}
                >
                  <Chip label={item.category || "Khác"} variant="outlined" size="small" />
                  <Chip
                    label={item.status === "active" ? "Đang bán" : "Tạm ngưng"}
                    size="small"
                    color={item.status === "active" ? "success" : "default"}
                  />
                </Box>

                {/* Giá + Thời gian */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, minHeight: 24 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <AttachMoneyIcon sx={{ fontSize: 18 }} />
                    <Typography fontWeight={600}>{formatPrice(item.price)}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <AccessTimeIcon sx={{ fontSize: 18 }} />
                    <Typography>{item.preparationTime} phút</Typography>
                  </Box>
                </Box>

                {/* Hành động: bám đáy */}
                <Box sx={{ display: "flex", gap: 1, mt: "auto" }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleEdit(item)}
                    fullWidth
                    sx={{ minHeight: 36 }}
                  >
                    SỬA
                  </Button>
                  <IconButton size="small" onClick={() => handleDelete(item.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
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
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              size="small"
            />
            <TextField
              label="Mô tả"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              fullWidth
              size="small"
              multiline
              minRows={3}
            />

            {/* Giá và Thời gian làm */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  Giá (VND)
                </Typography>
                <TextField
                  type="number"
                  value={formData.price}
                  onChange={(e) => {
                    const val = Math.max(0, Math.floor((+e.target.value || 0) / 1000) * 1000);
                    setFormData({ ...formData, price: val.toString() });
                  }}
                  size="small"
                  fullWidth
                  inputProps={{ step: 1000, min: 0 }}
                />
              </Box>

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
                  inputProps={{ step: 1, min: 0 }}
                />
              </Box>
            </Box>

            <TextField
              label="Danh mục"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              fullWidth
              size="small"
            />

            {/* Upload ảnh */}
            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Hình ảnh sản phẩm
              </Typography>
              <input type="file" accept="image/*" onChange={handleImageSelect} disabled={uploading} />
              {uploading && (
                <Box sx={{ display: "flex", alignItems: "center", mt: 1, gap: 1 }}>
                  <CircularProgress size={20} />
                  <Typography color="text.secondary">Đang tải ảnh lên...</Typography>
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
          <Button onClick={() => setIsDialogOpen(false)} variant="outlined" color="inherit">
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
        <Alert onClose={() => setSuccessMessage("")} severity="success" sx={{ width: "100%" }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MenuManagement;
