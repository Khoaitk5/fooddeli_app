// src/pages/Video.jsx (hoặc nơi bạn đặt component)
import React, { useMemo, useRef, useState, useContext } from "react";
import {
  Typography,
  Box,
  Grid,
  Paper,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  LinearProgress,
} from "@mui/material";
import { Add, PlayArrow, CloudUpload } from "@mui/icons-material";
import { ShopContext } from "../../contexts/ShopContext";

const VideoManagement = () => {
  // ======= LIST STATE =======
  const [videos, setVideos] = useState([]);

  // ======= UPLOAD MODAL STATE =======
  const [openUpload, setOpenUpload] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(""); // auto-computed, read-only
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // ======= EDIT MODAL STATE (để sửa local, duration read-only) =======
  const [openEdit, setOpenEdit] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [editVideoFile, setEditVideoFile] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDuration, setEditDuration] = useState("");

  // ======= TOAST =======
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  // ======= CONTEXT =======
  const shopId = useContext(ShopContext); // ✅ shop_id lấy từ context

  // ======= REFS & PREVIEWS =======
  const videoInputRef = useRef(null);
  const editVideoInputRef = useRef(null);
  const videoPreviewUrl = useMemo(() => (videoFile ? URL.createObjectURL(videoFile) : ""), [videoFile]);
  const editVideoPreviewUrl = useMemo(
    () => (editVideoFile ? URL.createObjectURL(editVideoFile) : ""),
    [editVideoFile]
  );

  // ======= HELPERS =======
  const formatDuration = (seconds) => {
    if (!seconds && seconds !== 0) return "";
    const s = Math.floor(seconds % 60).toString().padStart(2, "0");
    const m = Math.floor(seconds / 60);
    return `${m}:${s}`;
  };

  // ======= HANDLERS (UPLOAD MODAL) =======
  const onPickVideo = (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    setVideoFile(file);

    // Auto compute duration
    const tempVideo = document.createElement("video");
    tempVideo.preload = "metadata";
    tempVideo.onloadedmetadata = () => {
      window.URL.revokeObjectURL(tempVideo.src);
      setDuration(formatDuration(tempVideo.duration));
    };
    tempVideo.src = URL.createObjectURL(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    onPickVideo({ target: { files: [file] } });
  };

  const isValid = useMemo(() => Boolean(videoFile && title.trim()), [videoFile, title]);

  const resetForm = () => {
    setVideoFile(null);
    setTitle("");
    setDescription("");
    setProgress(0);
    setDuration("");
  };

  const handleUpload = async () => {
    if (!isValid) {
      setToast({
        open: true,
        message: "Vui lòng chọn video và nhập tiêu đề",
        severity: "warning",
      });
      return;
    }

    if (!shopId) {
      setToast({
        open: true,
        message: "Chưa có shop_id – vui lòng đăng nhập/refresh.",
        severity: "warning",
      });
      return;
    }

    try {
      console.log("[DEBUG] 🚀 Bắt đầu upload video...");
      setUploading(true);
      setProgress(10);

      // === 1️⃣ UPLOAD VIDEO FILE LÊN FIREBASE ===
      const formData = new FormData();
      formData.append("video", videoFile);
      formData.append("title", title);
      formData.append("shop_id", shopId);

      console.log("[DEBUG] [STEP 1] formData ready:", {
        title,
        shopId,
        videoFile: videoFile?.name,
      });

      const uploadRes = await fetch("http://localhost:5000/api/videos/upload", {
        method: "POST",
        body: formData,
      });

      console.log("[DEBUG] [STEP 1] uploadRes.ok =", uploadRes.ok, "status =", uploadRes.status);

      let uploadData;
      try {
        uploadData = await uploadRes.json();
      } catch (err) {
        console.error("[DEBUG] ❌ Lỗi parse JSON uploadRes:", err);
        throw new Error("Phản hồi upload không hợp lệ từ server");
      }

      console.log("[DEBUG] [STEP 1] uploadData =", uploadData);

      // ⚙️ FIX: đọc đúng key backend trả về (videoUrl hoặc video_url)
      const videoUrl = uploadData.video_url || uploadData.videoUrl;
      if (!uploadRes.ok || !videoUrl) {
        console.error("[DEBUG] ❌ Upload thất bại hoặc không có video URL:", uploadData);
        throw new Error("Upload video thất bại hoặc thiếu video URL trong phản hồi");
      }

      console.log("[DEBUG] ✅ Upload thành công, nhận videoUrl =", videoUrl);
      setProgress(60);

      // === 2️⃣ GỬI METADATA ĐỂ LƯU DB ===
      const newVideoData = {
        title: title.trim(),
        description: description.trim() || "—",
        video_url: videoUrl, // ✅ gửi đúng field backend cần
        duration: duration || "0:00",
        shop_id: Number(shopId),
      };

      console.log("[DEBUG] [STEP 2] Gửi metadata lên /api/videos:");
      console.table(newVideoData);

      const saveRes = await fetch("http://localhost:5000/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newVideoData),
      });

      console.log("[DEBUG] [STEP 2] saveRes.ok =", saveRes.ok, "status =", saveRes.status);
      if (!saveRes.ok) {
        const raw = await saveRes.text();
        console.error("[DEBUG] ❌ Lỗi lưu DB:", raw);
        throw new Error("Không thể lưu video vào database");
      }

      const saveData = await saveRes.json();
      console.log("[DEBUG] ✅ Video đã lưu DB:", saveData);

      setProgress(100);
      setVideos((prev) => [saveData.data, ...prev]);

      console.log("[DEBUG] 🎉 Upload và lưu video hoàn tất!");
      setToast({ open: true, message: "✅ Đã upload và lưu video!", severity: "success" });
      resetForm();
      setOpenUpload(false);
    } catch (err) {
      console.error("[DEBUG] ❌ Lỗi trong handleUpload:", err);
      setToast({
        open: true,
        message: err.message || "Lỗi upload video",
        severity: "error",
      });
    } finally {
      console.log("[DEBUG] 🧹 Dọn dẹp trạng thái upload");
      setUploading(false);
    }
  };


  // ======= HANDLERS (EDIT MODAL – read-only duration) =======
  const openEditModal = (video) => {
    setEditingVideo(video);
    setEditTitle(video.title || "");
    setEditDescription(video.description || "");
    setEditDuration(video.duration || ""); // giữ để hiển thị read-only
    setEditVideoFile(null);
    setOpenEdit(true);
  };

  const onPickEditVideo = (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    setEditVideoFile(file);

    const temp = document.createElement("video");
    temp.preload = "metadata";
    temp.onloadedmetadata = () => {
      window.URL.revokeObjectURL(temp.src);
      setEditDuration(formatDuration(temp.duration));
    };
    temp.src = URL.createObjectURL(file);
  };

  const handleSaveEdit = () => {
    if (!editingVideo) return;
    const updated = {
      ...editingVideo,
      title: editTitle.trim() || editingVideo.title,
      description: editDescription.trim(),
      duration: editDuration || editingVideo.duration, // read-only, tự tính khi chọn video
      // Nếu sau này cho phép thay file video thật: upload file editVideoFile và cập nhật video_url
    };
    setVideos((list) => list.map((v) => (v.id === editingVideo.id ? updated : v)));
    setOpenEdit(false);
    setToast({ open: true, message: "Đã cập nhật video (local)", severity: "success" });
  };

  // ======= UI =======
  const VideoCard = ({ video }) => (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "16px",
        border: "1px solid rgba(0,0,0,0.06)",
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Media placeholder 16:9 */}
      <Box sx={{ position: "relative", width: "100%", pt: "56.25%", backgroundColor: "#e5e7eb" }}>
        <Box sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Box
            sx={{
              width: 52,
              height: 52,
              backgroundColor: "rgba(255,255,255,0.9)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PlayArrow sx={{ fontSize: 26, color: "#000" }} />
          </Box>
        </Box>
      </Box>
      <Box sx={{ p: 2.2, display: "flex", flexDirection: "column", gap: 1.25, flexGrow: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {video.title}
        </Typography>
        <Typography variant="body2" sx={{ color: "#6b7280" }}>
          {video.description}
        </Typography>
        {video.duration && <Chip label={video.duration} size="small" />}
      </Box>
    </Paper>
  );

  return (
    <>
      <Box sx={{ minHeight: "100vh", backgroundColor: "#f9fafb", p: { xs: 2, sm: 3, md: 4 } }}>
        <Box sx={{ maxWidth: 1200, mx: "auto" }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Button
              onClick={() => setOpenUpload(true)}
              variant="contained"
              startIcon={<Add />}
              sx={{ backgroundColor: "#ad46ff" }}
            >
              Upload video mới
            </Button>
          </Box>
          <Grid container spacing={3}>
            {videos.map((video) => (
              <Grid item xs={12} sm={4} md={4} lg={4} key={video.id}>
                <VideoCard video={video} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* Upload Modal */}
      <Dialog open={openUpload} onClose={() => (!uploading ? setOpenUpload(false) : null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Upload video mới</DialogTitle>
        <DialogContent dividers sx={{ pt: 2 }}>
          <Typography variant="body2" sx={{ color: "#717182", mb: 2 }}>
            Thêm video review
          </Typography>

          <Typography sx={{ fontWeight: 600, mb: 1 }}>Video</Typography>
          <Box
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
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
              <Box>
                <video src={videoPreviewUrl} controls style={{ width: "100%", borderRadius: 8 }} />
                {duration && <Chip label={`Thời lượng: ${duration}`} size="small" sx={{ mt: 1 }} />}
              </Box>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                <CloudUpload sx={{ color: "#ad46ff", fontSize: 48 }} />
                <Typography sx={{ fontWeight: 600 }}>Tải lên video của bạn</Typography>
                <Typography variant="body2" sx={{ color: "#717182" }}>
                  Kéo thả file hoặc click để chọn
                </Typography>
                <Button disabled={uploading} onClick={() => videoInputRef.current?.click()} variant="outlined" sx={{ mt: 1, borderRadius: "8px" }}>
                  Chọn video
                </Button>
                <input ref={videoInputRef} onChange={onPickVideo} type="file" accept="video/*" hidden />
              </Box>
            )}
          </Box>

          <TextField label="Tiêu đề video" fullWidth sx={{ mb: 2 }} value={title} onChange={(e) => setTitle(e.target.value)} />
          <TextField label="Mô tả" fullWidth multiline minRows={3} sx={{ mb: 2 }} value={description} onChange={(e) => setDescription(e.target.value)} />

          {uploading && (
            <Box sx={{ mt: 1 }}>
              <LinearProgress variant="determinate" value={progress} />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button disabled={uploading} onClick={() => { setOpenUpload(false); resetForm(); }}>
            Hủy
          </Button>
          <Button onClick={handleUpload} disabled={!isValid || uploading} variant="contained" startIcon={<CloudUpload />}>
            Upload video
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Chỉnh sửa video</DialogTitle>
        <DialogContent dividers sx={{ pt: 2 }}>
          <Typography variant="body2" sx={{ color: "#717182", mb: 2 }}>
            Chỉnh sửa thông tin video
          </Typography>

          {/* Video replace */}
          <Typography sx={{ fontWeight: 600, mb: 1 }}>Video</Typography>
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
            <Box>
              <video
                src={editVideoFile ? editVideoPreviewUrl : editingVideo?.video_url}
                controls
                style={{ width: "100%", borderRadius: 8 }}
              />
              {editDuration && <Chip label={`Thời lượng: ${editDuration}`} size="small" sx={{ mt: 1 }} />}
            </Box>
            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
              <Button onClick={() => editVideoInputRef.current?.click()} startIcon={<CloudUpload />} variant="outlined" sx={{ flex: 1, borderRadius: "8px" }}>
                Thay video khác
              </Button>
              <Button
                color="error"
                variant="outlined"
                sx={{ borderRadius: "8px" }}
                onClick={() => {
                  setEditVideoFile(null);
                  setEditDuration(editingVideo?.duration || "");
                }}
              >
                Xóa
              </Button>
            </Box>
            <input ref={editVideoInputRef} onChange={onPickEditVideo} type="file" accept="video/*" hidden />
          </Box>

          {/* Text fields */}
          <TextField label="Tiêu đề video" fullWidth sx={{ mb: 2 }} value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
          <TextField label="Mô tả" fullWidth multiline minRows={3} sx={{ mb: 2 }} value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Hủy</Button>
          <Button onClick={handleSaveEdit} variant="contained" startIcon={<CloudUpload />}>
            Cập nhật video
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={2600}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setToast((t) => ({ ...t, open: false }))} severity={toast.severity} variant="filled" sx={{ width: "100%" }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default VideoManagement;
