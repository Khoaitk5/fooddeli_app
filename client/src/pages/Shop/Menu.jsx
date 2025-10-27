import React, { useState, useEffect, useContext } from "react";
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
import { MenuItem } from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import { ShopContext } from "../../contexts/ShopContext";

const API_URL = "http://localhost:5000/api/images/upload";
const VALID_CATEGORIES = ["Thức ăn", "Đồ uống", "Tráng miệng", "Khác", "Combo"];

const MenuManagement = () => {
  const shopId = useContext(ShopContext);

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

  // 🔹 Load sản phẩm theo shopId từ context
  useEffect(() => {
    if (!shopId) return; // đợi context load xong

    const loadProductsByShop = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products/by-shop", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ shopId: Number(shopId) }),
        });
        const data = await res.json();

        const products = Array.isArray(data?.data) ? data.data : [];
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
      } catch (err) {
        console.error("❌ Lỗi loadProductsByShop:", err);
      }
    };

    loadProductsByShop();
  }, [shopId]);

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

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setUploadError("");
  };

  const handleSave = async () => {
    if (!selectedImageFile && !formData.image) {
      setUploadError("⚠️ Vui lòng chọn ảnh sản phẩm trước khi lưu!");
      return;
    }
    if (!formData.name.trim() || !formData.price.trim()) {
      alert("Vui lòng nhập đầy đủ tên món và giá!");
      return;
    }
    if (!shopId) {
      alert("Không tìm thấy shopId trong context!");
      return;
    }

    let imageUrl = formData.image;
    if (selectedImageFile) {
      setUploading(true);
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

    const newProductData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: parseInt(formData.price, 10) || 0,
      category: formData.category.trim() || "Khác",
      image_url: imageUrl,
      prep_minutes: parseInt(formData.preparationTime, 10) || 0,
      is_available: true,
      shop_id: Number(shopId),
    };

    try {
      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newProductData),
      });
      const result = await response.json();
      if (!response.ok) {
        alert(result?.error || "Không thể thêm món!");
        return;
      }

      const addedItem = {
        id: result.product_id || result.id || Date.now(),
        name: result.name || newProductData.name,
        description: result.description || newProductData.description,
        price: Number(result.price) || newProductData.price,
        image: result.image_url || imageUrl,
        category: result.category || newProductData.category,
        preparationTime:
          Number(result.prep_minutes) || newProductData.prep_minutes,
        status: result.is_available ? "active" : "inactive",
        hasVideo: false,
      };
      setMenuItems((items) => [addedItem, ...items]);
      setSuccessMessage("✅ Món ăn đã được thêm thành công!");
    } catch (err) {
      console.error("❌ Lỗi khi tạo sản phẩm:", err);
      alert("Đã xảy ra lỗi khi kết nối đến server!");
      return;
    }

    setIsDialogOpen(false);
    setSelectedImageFile(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      image: "",
      preparationTime: "",
    });
    setImagePreview("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Không thể xóa sản phẩm!");
        return;
      }

      setMenuItems((items) => items.filter((i) => i.id !== id));
      setSuccessMessage("🗑️ Sản phẩm đã được xóa thành công!");
    } catch (err) {
      console.error("❌ Lỗi khi xóa sản phẩm:", err);
      alert("Đã xảy ra lỗi khi kết nối đến server!");
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
          <Typography variant="body2">Hãy nhấn “Thêm món mới” để bắt đầu.</Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            },
          }}
        >
          {menuItems.map((item) => (
            <Card key={item.id} sx={{ display: "flex", flexDirection: "column" }}>
              <CardMedia
                component="img"
                height="160"
                image={item.image}
                alt={item.name}
                sx={{ objectFit: "cover" }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography fontWeight="bold">{item.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                  <Chip label={item.category} size="small" />
                  <Chip
                    label={item.status === "active" ? "Đang bán" : "Tạm ngưng"}
                    size="small"
                    color={item.status === "active" ? "success" : "default"}
                  />
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mt: 1, gap: 1 }}>
                  <AttachMoneyIcon sx={{ fontSize: 18 }} />
                  <Typography>{formatPrice(item.price)}</Typography>
                  <AccessTimeIcon sx={{ fontSize: 18, ml: 1 }} />
                  <Typography>{item.preparationTime} phút</Typography>
                </Box>
              </CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", p: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={() => handleEdit(item)}
                >
                  Sửa
                </Button>
                <IconButton color="error" onClick={() => handleDelete(item.id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Card>
          ))}
        </Box>
      )}

      {/* Dialog thêm / sửa */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} fullWidth>
        <DialogTitle>{editingItem ? "Chỉnh sửa món ăn" : "Thêm món ăn mới"}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
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
              multiline
              minRows={3}
              size="small"
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Giá (VND)"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                fullWidth
                size="small"
                inputProps={{ step: 1000, min: 0 }}
              />

              <TextField
                label="Thời gian làm (phút)"
                type="number"
                value={formData.preparationTime}
                onChange={(e) =>
                  setFormData({ ...formData, preparationTime: e.target.value })
                }
                fullWidth
                size="small"
                inputProps={{ step: 5, min: 0 }}
              />
            </Box>
            <TextField
              select
              label="Danh mục"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              fullWidth
              size="small"
              SelectProps={{ native: false }}
            >
              {VALID_CATEGORIES.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Hình ảnh sản phẩm
              </Typography>
              <input type="file" accept="image/*" onChange={handleImageSelect} />
              {uploading && (
                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  <Typography>Đang tải ảnh lên...</Typography>
                </Box>
              )}
              {uploadError && (
                <Typography color="error" sx={{ mt: 1 }}>
                  {uploadError}
                </Typography>
              )}
              {imagePreview && (
                <Box sx={{ mt: 1 }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ width: "100%", borderRadius: "8px" }}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSave} variant="contained">
            {editingItem ? "Cập nhật" : "Thêm"}
          </Button>
          <Button onClick={() => setIsDialogOpen(false)}>Hủy</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setSuccessMessage("")}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MenuManagement;
