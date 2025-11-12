// src/pages/Video.jsx
import React, { useMemo, useRef, useState, useContext, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  LinearProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CloudUpload,
  Favorite as FavoriteIcon,
  Comment as CommentIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { ShopContext } from "../../contexts/ShopContext";

const VideoManagement = () => {
  const [videos, setVideos] = useState([]);
  const [openUpload, setOpenUpload] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const [videoFile, setVideoFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [moderating, setModerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  const shopId = useContext(ShopContext);
  const videoInputRef = useRef(null);
  const videoPreviewUrl = useMemo(() => (videoFile ? URL.createObjectURL(videoFile) : ""), [videoFile]);

  // ===== Load videos by shop =====
  useEffect(() => {
    if (!shopId) {
      console.warn("⚠️ Chưa có shopId từ context");
      return;
    }
    const fetchVideosByShop = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/videos/shop/${shopId}`);
        const data = await res.json();
        if (data.success) setVideos(data.data || []);
      } catch (err) {
        console.error("⚠️ Lỗi khi gọi API:", err);
      }
    };
    fetchVideosByShop();
  }, [shopId]);

  // ===== Upload handlers =====
  const onPickVideo = (e) => {
    const file = e.target.files?.[0];
    if (file) setVideoFile(file);
  };

  const isValid = useMemo(() => Boolean(videoFile && title.trim()), [videoFile, title]);

  const resetForm = () => {
    setVideoFile(null);
    setTitle("");
    setDescription("");
    setProgress(0);
  };

  const handleUpload = async () => {
    if (!isValid) {
      setToast({ open: true, message: "Vui lòng chọn video và nhập tiêu đề", severity: "warning" });
      return;
    }

    try {
      setUploading(true);
      setProgress(10);
      console.log("[CLIENT] Bắt đầu upload", { hasFile: Boolean(videoFile), title: title.trim() });

      const isTestMode = !shopId;

      if (isTestMode) {
        console.warn("⚠️ [UPLOAD] Không có shopId — chạy ở chế độ test, bỏ qua bước lưu video vào DB.");
      } else {
        console.log("📤 [UPLOAD] shopId:", shopId, "type:", typeof shopId);
      }

      const formData = new FormData();
      formData.append("video", videoFile);
      formData.append("title", title);
      if (!isTestMode) {
        formData.append("shop_id", shopId);
      }

      setProgress(30);
      const uploadRes = await fetch("http://localhost:5000/api/videos/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      setProgress(50);
      console.log("[CLIENT] Upload xong", { status: uploadRes.status, ok: uploadRes.ok, uploadData });

      if (!uploadRes.ok || !uploadData.videoUrl) {
        throw new Error(uploadData.message || "Upload thất bại");
      }

      setModerating(true);
      setProgress(70);

      const moderationResult = uploadData.moderationResult;
      console.log("[CLIENT] Kết quả moderation", moderationResult);

      if (moderationResult.status === "rejected") {
        console.error("[CLIENT] REJECTED", moderationResult);
        setToast({
          open: true,
          message: `❌ Video bị từ chối: ${moderationResult.reason}`,
          severity: "error",
        });
        setModerating(false);
        setUploading(false);
        return;
      }

      if (moderationResult.status === "pending") {
        console.warn("[CLIENT] PENDING", moderationResult);
        setToast({
          open: true,
          message: `⏳ Video đang chờ kiểm duyệt thủ công: ${moderationResult.reason}`,
          severity: "warning",
        });
      }

      if (!isTestMode) {
        const savedVideo = uploadData.savedVideo;
        setProgress(90);

        if (moderationResult.status === "approved" && savedVideo) {
          setVideos((prev) => [savedVideo, ...prev]);
          setToast({
            open: true,
            message: "✅ Video đã được AI phê duyệt và đăng thành công!",
            severity: "success",
          });
        } else {
          const newVideoData = {
            title: title.trim(),
            description: description.trim() || "—",
            video_url: uploadData.videoUrl,
            shop_id: Number(shopId),
            status: moderationResult.status,
            moderation_result: moderationResult,
          };

          const saveRes = await fetch("http://localhost:5000/api/videos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newVideoData),
          });

          const saveData = await saveRes.json();
          if (!saveRes.ok) throw new Error(saveData.message || "Không thể lưu video");

          if (moderationResult.status === "approved") {
            setVideos((prev) => [saveData.data, ...prev]);
            setToast({
              open: true,
              message: "✅ Video đã được AI phê duyệt và đăng thành công!",
              severity: "success",
            });
          }
        }
      } else {
        console.log("[CLIENT] TEST MODE: Upload & moderation hoàn tất", uploadData);
        setToast({
          open: true,
          message: "✅ Upload & kiểm duyệt AI ở chế độ test thành công!",
          severity: "success",
        });
      }

      setProgress(100);
      resetForm();
      setOpenUpload(false);
    } catch (err) {
      console.error("❌ Upload lỗi:", err);
      setToast({ open: true, message: err.message, severity: "error" });
    } finally {
      setUploading(false);
      setModerating(false);
    }
  };

  // ===== Delete handler =====
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá video này?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/videos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Không thể xoá video");
      setVideos((prev) => prev.filter((v) => v.id !== id && v.video_id !== id));
      setToast({ open: true, message: "🗑️ Video đã được xoá", severity: "success" });
    } catch (err) {
      console.error("❌ Delete lỗi:", err);
      setToast({ open: true, message: "Không thể xoá video", severity: "error" });
    }
  };

  // ===== Edit handler =====
  const handleOpenEdit = (video) => {
    setSelectedVideo(video);
    setTitle(video.title);
    setDescription(video.description);
    setOpenEdit(true);
  };

  const handleEditSave = async () => {
    try {
      const safeTitle = (title || "").trim();
      const safeDesc = (description || "").trim();

      const updated = { title: safeTitle, description: safeDesc };

      const res = await fetch(`http://localhost:5000/api/videos/${selectedVideo.id || selectedVideo.video_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Không thể cập nhật video");

      setVideos((prev) =>
        prev.map((v) => (v.id === selectedVideo.id ? { ...v, ...updated } : v))
      );

      setToast({ open: true, message: "✏️ Cập nhật thành công", severity: "success" });
      setOpenEdit(false);
    } catch (err) {
      console.error("❌ Edit lỗi:", err);
      setToast({ open: true, message: err.message, severity: "error" });
    }
  };

  // ===== UI =====
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, p: { xs: 2, sm: 3, md: 4 } }}>
      {/* Kiểm tra shopId */}

      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6">Quản lý video</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenUpload(true)}
          sx={{ bgcolor: "#ad46ff", "&:hover": { bgcolor: "#9a3ee8" } }}
        >
          Upload video mới
        </Button>
      </Box>

      {/* Danh sách video */}
      <Grid
        container
        spacing={2}
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
        {videos.map((video) => (
          <Card
            key={video.id || video.video_id}
            sx={{
              display: "flex",
              flexDirection: "column",
              borderRadius: 1,
              overflow: "hidden",
              boxShadow: "0px 3px 8px rgba(0,0,0,0.1)",
              height: "750px",
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: "100%",
                aspectRatio: "9 / 16",
                backgroundColor: "#000",
                overflow: "hidden",
              }}
            >
              <video
                ref={(el) => {
                  if (!el) return;
                  // Khi fullscreen bật/tắt
                  el.onfullscreenchange = () => {
                    if (document.fullscreenElement === el) {
                      // ✅ Khi vào fullscreen → giữ nguyên tỉ lệ gốc
                      el.style.objectFit = "contain";
                      el.style.backgroundColor = "#000";
                    } else {
                      // ✅ Khi thoát fullscreen → quay lại cover trong card
                      el.style.objectFit = "cover";
                      el.style.backgroundColor = "#000";
                    }
                  };
                }}
                src={video.video_url}
                controls
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover", // ✅ fill khi ở ngoài
                  transition: "object-fit 0.3s ease",
                }}
              />
            </Box>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography fontWeight="bold" variant="subtitle1" noWrap>
                {video.title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 0.5,
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  minHeight: "40px", // 🔹 Chiều cao tối thiểu (2 dòng)
                  lineHeight: "20px", // 🔹 Đảm bảo đều dòng
                }}
              >
                {video.description || "Không có mô tả"}
              </Typography>
              {/* Stats */}
              <Box sx={{ display: "flex", gap: 2, mt: 1.5, color: "text.secondary" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <VisibilityIcon fontSize="small" />
                  <Typography variant="body2">{video.views_count || 0}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <FavoriteIcon fontSize="small" color="error" />
                  <Typography variant="body2">{video.likes_count || 0}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <CommentIcon fontSize="small" />
                  <Typography variant="body2">{video.comments_count || 0}</Typography>
                </Box>
              </Box>
            </CardContent>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 1,
                borderTop: "1px solid #eee",
                mt: "auto", // 🔹 đẩy xuống cuối card
              }}
            >
              <Button
                variant="outlined"
                size="small"
                startIcon={<EditIcon />}
                onClick={() => handleOpenEdit(video)}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  borderColor: "#ad46ff",
                  color: "#ad46ff",
                  whiteSpace: "nowrap",
                  px: 1.5, // giảm padding ngang
                  minWidth: "60px", // không co nút
                }}
              >
                SỬA
              </Button>
              <IconButton
                color="error"
                onClick={() => handleDelete(video.id || video.video_id)}
                sx={{ flexShrink: 0 }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Card>
        ))}
      </Grid>

      {/* Dialog Edit */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth>
        <DialogTitle>Cập nhật thông tin video</DialogTitle>
        <DialogContent>
          <TextField
            label="Tiêu đề video"
            fullWidth
            sx={{ mt: 2 }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            label="Mô tả"
            fullWidth
            multiline
            minRows={3}
            sx={{ mt: 2 }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleEditSave}>
            Lưu thay đổi
          </Button>
        </DialogActions>
      </Dialog>

      {/* Upload Dialog & Toast giữ nguyên */}
      <Dialog open={openUpload} onClose={() => (!uploading ? setOpenUpload(false) : null)} fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Upload video mới</DialogTitle>
        <DialogContent dividers sx={{ pt: 2 }}>
          <Typography variant="body2" sx={{ color: "#717182", mb: 2 }}>
            Thêm video review của bạn
          </Typography>
          <Box
            sx={{
              border: "1px dashed #cbd5e1",
              borderRadius: "12px",
              p: 3,
              textAlign: "center",
              mb: 3,
              backgroundColor: "#fafafa",
            }}
          >
            {videoFile ? (
              <video src={videoPreviewUrl} controls style={{ width: "100%", borderRadius: 8 }} />
            ) : (
              <>
                <CloudUpload sx={{ color: "#ad46ff", fontSize: 48 }} />
                <Typography sx={{ fontWeight: 600 }}>Kéo thả hoặc chọn file video</Typography>
                <Button onClick={() => videoInputRef.current?.click()} variant="outlined" sx={{ mt: 1 }}>
                  Chọn video
                </Button>
                <input ref={videoInputRef} onChange={onPickVideo} type="file" accept="video/*" hidden />
              </>
            )}
          </Box>

          <TextField label="Tiêu đề video" fullWidth sx={{ mb: 2 }} value={title} onChange={(e) => setTitle(e.target.value)} />
          <TextField label="Mô tả" fullWidth multiline minRows={3} sx={{ mb: 2 }} value={description} onChange={(e) => setDescription(e.target.value)} />

          {moderating && (
            <Box sx={{ mt: 2, mb: 2, p: 2, bgcolor: "#f5f5f5", borderRadius: 2 }}>
              <Typography variant="body2" sx={{ color: "#ad46ff", fontWeight: 600, mb: 1 }}>
                🤖 AI đang phân tích và kiểm duyệt video...
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Hệ thống đang cắt video thành frames và sử dụng Gemini AI để phát hiện nội dung không phù hợp
              </Typography>
            </Box>
          )}

          {uploading && <LinearProgress variant="determinate" value={progress} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpenUpload(false); resetForm(); }}>Hủy</Button>
          <Button onClick={handleUpload} disabled={!isValid || uploading} variant="contained" startIcon={<CloudUpload />}>
            Upload video
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={2500}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={toast.severity} variant="filled" sx={{ width: "100%" }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default VideoManagement;
