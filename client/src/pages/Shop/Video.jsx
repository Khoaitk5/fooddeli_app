import React, { useMemo, useRef, useState } from 'react';
import { Typography, Box, Grid, Paper, Stack, Chip, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, InputLabel, FormControl, Snackbar, Alert, LinearProgress } from '@mui/material';
import { Add, Edit, MoreVert, PlayArrow, Visibility, CloudUpload } from '@mui/icons-material';

const VideoManagement = () => {
  const [videos, setVideos] = useState([
    { id: 1, title: 'Review Phở bò đặc biệt', description: 'Video review chi tiết về món phở bò với nước dùng đậm đà', status: 'Đã đăng', category: 'Phở bò', views: 1245, uploadDate: '15/1/2024', duration: '2:35', thumbnail: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop', statusColor: '#dcfce7', textColor: '#016630' },
    { id: 2, title: 'Cách làm Bún bò Huế', description: 'Hướng dẫn cách chế biến món bún bò Huế chuẩn vị miền Trung', status: 'Đã đăng', category: 'Bún bò Huế', views: 892, uploadDate: '10/1/2024', duration: '4:12', thumbnail: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400&h=300&fit=crop', statusColor: '#dcfce7', textColor: '#016630' },
    { id: 3, title: 'Bánh mì thịt nướng ngon', description: 'Giới thiệu bánh mì thịt nướng với nguyên liệu tươi ngon', status: 'Bản nháp', category: 'Bánh mì', views: 567, uploadDate: '5/1/2024', duration: '1:45', thumbnail: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&h=300&fit=crop', statusColor: '#fef9c2', textColor: '#894b00' }
  ]);

  const [openUpload, setOpenUpload] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [linkedDish, setLinkedDish] = useState('none');
  const [duration, setDuration] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [confirmDelete, setConfirmDelete] = useState({ open: false, videoId: null });

  const videoInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const editVideoInputRef = useRef(null);
  const editImageInputRef = useRef(null);

  const videoPreviewUrl = useMemo(() => (videoFile ? URL.createObjectURL(videoFile) : ''), [videoFile]);
  const thumbnailPreviewUrl = useMemo(() => (thumbnailFile ? URL.createObjectURL(thumbnailFile) : ''), [thumbnailFile]);

  const onPickVideo = (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    setVideoFile(file);
    // Lấy thời lượng video
    const tempVideo = document.createElement('video');
    tempVideo.preload = 'metadata';
    tempVideo.onloadedmetadata = () => {
      window.URL.revokeObjectURL(tempVideo.src);
      const total = tempVideo.duration || 0;
      const m = Math.floor(total / 60)
        .toString()
        .padStart(1, '0');
      const s = Math.floor(total % 60)
        .toString()
        .padStart(2, '0');
      setDuration(`${m}:${s}`);
    };
    tempVideo.src = URL.createObjectURL(file);
  };

  const onPickImage = (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    setThumbnailFile(file);
  };

  const onDrop = (e, type) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (type === 'video') onPickVideo({ target: { files: [file] } });
    if (type === 'image') onPickImage({ target: { files: [file] } });
  };

  const isValid = useMemo(() => Boolean(videoFile && title.trim()), [videoFile, title]);

  const resetForm = () => {
    setVideoFile(null);
    setThumbnailFile(null);
    setTitle('');
    setDescription('');
    setLinkedDish('none');
    setDuration('');
    setProgress(0);
  };

  const handleUpload = () => {
    if (!isValid) {
      setToast({ open: true, message: 'Vui lòng chọn video và nhập tiêu đề', severity: 'warning' });
      return;
    }
    setUploading(true);
    setProgress(10);
    // Giả lập tiến trình upload 1.2s
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          const now = new Date();
          const newVideo = {
            id: Date.now(),
            title: title.trim(),
            description: description.trim() || '—',
            status: 'Bản nháp',
            category: linkedDish === 'none' ? 'Không liên kết' : linkedDish,
            views: 0,
            uploadDate: `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`,
            duration: duration || '0:00',
            thumbnail: thumbnailPreviewUrl || 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&h=300&fit=crop',
            statusColor: '#fef9c2',
            textColor: '#894b00'
          };
          setVideos((list) => [newVideo, ...list]);
          setUploading(false);
          setOpenUpload(false);
          setToast({ open: true, message: 'Đã thêm video vào danh sách (local)', severity: 'success' });
          resetForm();
          return 100;
        }
        return p + 15;
      });
    }, 180);
  };

  const getStatusStyle = (status) => {
    if (status === 'Đã đăng') return { statusColor: '#dcfce7', textColor: '#016630' };
    return { statusColor: '#fef9c2', textColor: '#894b00' }; // Bản nháp
  };

  const toggleVideoStatus = (id) => {
    setVideos((list) =>
      list.map((v) => {
        if (v.id !== id) return v;
        const nextStatus = v.status === 'Bản nháp' ? 'Đã đăng' : 'Bản nháp';
        const style = getStatusStyle(nextStatus);
        return { ...v, status: nextStatus, ...style };
      })
    );
  };

  const requestDeleteVideo = (id) => setConfirmDelete({ open: true, videoId: id });
  const confirmDeleteVideo = () => {
    setVideos((list) => list.filter((v) => v.id !== confirmDelete.videoId));
    setConfirmDelete({ open: false, videoId: null });
    setToast({ open: true, message: 'Đã xóa video', severity: 'success' });
  };

  // ================== EDIT MODAL STATE & LOGIC ==================
  const [openEdit, setOpenEdit] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [editVideoFile, setEditVideoFile] = useState(null);
  const [editImageFile, setEditImageFile] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editLinkedDish, setEditLinkedDish] = useState('none');
  const [editDuration, setEditDuration] = useState('');

  const editVideoPreviewUrl = useMemo(() => (editVideoFile ? URL.createObjectURL(editVideoFile) : ''), [editVideoFile]);
  const editImagePreviewUrl = useMemo(() => (editImageFile ? URL.createObjectURL(editImageFile) : ''), [editImageFile]);

  const openEditModal = (video) => {
    setEditingVideo(video);
    setEditTitle(video.title || '');
    setEditDescription(video.description || '');
    setEditLinkedDish(video.category && video.category !== 'Không liên kết' ? video.category : 'none');
    setEditDuration(video.duration || '');
    setEditVideoFile(null);
    setEditImageFile(null);
    setOpenEdit(true);
  };

  const onPickEditVideo = (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    setEditVideoFile(file);
    const temp = document.createElement('video');
    temp.preload = 'metadata';
    temp.onloadedmetadata = () => {
      window.URL.revokeObjectURL(temp.src);
      const total = temp.duration || 0;
      const m = Math.floor(total / 60).toString().padStart(1, '0');
      const s = Math.floor(total % 60).toString().padStart(2, '0');
      setEditDuration(`${m}:${s}`);
    };
    temp.src = URL.createObjectURL(file);
  };

  const onPickEditImage = (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    setEditImageFile(file);
  };

  const onDropEdit = (e, type) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (type === 'video') onPickEditVideo({ target: { files: [file] } });
    if (type === 'image') onPickEditImage({ target: { files: [file] } });
  };

  const handleSaveEdit = () => {
    if (!editingVideo) return;
    const updated = {
      ...editingVideo,
      title: editTitle.trim() || editingVideo.title,
      description: editDescription.trim(),
      category: editLinkedDish === 'none' ? 'Không liên kết' : editLinkedDish,
      duration: editDuration || editingVideo.duration,
      thumbnail: editImagePreviewUrl || editingVideo.thumbnail
    };
    setVideos((list) => list.map((v) => (v.id === editingVideo.id ? updated : v)));
    setOpenEdit(false);
    setToast({ open: true, message: 'Đã cập nhật video (local)', severity: 'success' });
  };

  const VideoCard = ({ video }) => (
    <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden', transition: 'box-shadow 220ms ease, transform 220ms ease', '&:hover': { boxShadow: '0 10px 26px rgba(0,0,0,0.08)', transform: 'translateY(-3px)' }, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Media 16:9 */}
      <Box sx={{ position: 'relative', width: '100%', pt: '56.25%', backgroundImage: `url(${video.thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.35) 100%)' }} />
        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ width: 52, height: 52, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.12)' }}>
            <PlayArrow sx={{ fontSize: 26, color: '#000' }} />
          </Box>
        </Box>
        <Chip label={video.duration} size="small" sx={{ position: 'absolute', bottom: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.75)', color: 'white', fontSize: '12px', height: '22px', borderRadius: '8px' }} />
      </Box>
      {/* Content */}
      <Box sx={{ p: 2.2, display: 'flex', flexDirection: 'column', gap: 1.25, flexGrow: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '17px', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{video.title}</Typography>
        <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '14px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{video.description}</Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip label={video.status} size="small" sx={{ backgroundColor: video.statusColor, color: video.textColor, fontSize: '12px', height: '22px', borderRadius: '8px' }} />
          <Chip label={video.category} size="small" sx={{ backgroundColor: '#f3f4f6', color: '#111827', fontSize: '12px', height: '22px', borderRadius: '8px', border: '0.8px solid rgba(0,0,0,0.06)' }} />
        </Stack>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ color: '#6b7280' }}>
          <Visibility sx={{ fontSize: 16 }} />
          <Typography variant="body2" sx={{ fontSize: '13px' }}>{video.views.toLocaleString()} lượt xem · Ngày upload {video.uploadDate}</Typography>
        </Stack>
      </Box>
      {/* Actions bar */}
      <Box sx={{ px: 2.2, pb: 2.2 }}>
        <Box sx={{ backgroundColor: '#fafafa', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', p: 1, display: 'flex', gap: 1 }}>
          <Button onClick={() => openEditModal(video)} variant="outlined" startIcon={<Edit />} size="small" sx={{ flex: 1, height: 36, borderRadius: '999px', borderColor: 'rgba(0,0,0,0.12)' }}>Sửa</Button>
          <Button onClick={() => toggleVideoStatus(video.id)} variant="outlined" size="small" sx={{ height: 36, borderRadius: '999px', borderColor: 'rgba(0,0,0,0.12)', color: video.status === 'Bản nháp' ? '#059669' : '#d97706', minWidth: video.status === 'Bản nháp' ? 72 : 56 }}>{video.status === 'Bản nháp' ? 'Đăng' : 'Ẩn'}</Button>
          <Button onClick={() => requestDeleteVideo(video.id)} color="error" variant="outlined" size="small" sx={{ height: 36, borderRadius: '999px', borderColor: 'rgba(239,68,68,0.25)' }}>Xóa</Button>
        </Box>
      </Box>
    </Paper>
  );

  return (
    <>
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f9fafb', p: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 2 }}>
          <Button onClick={() => setOpenUpload(true)} variant="contained" startIcon={<Add />} sx={{ backgroundColor: '#ad46ff', borderRadius: '10px', height: 40, fontSize: '14px', px: 2.2, '&:hover': { backgroundColor: '#9c3de6' } }}>
            Upload video mới
          </Button>
        </Box>
        <Grid container spacing={{ xs: 2, md: 3 }}>
          {videos.map((video) => (
            <Grid item xs={12} sm={4} md={4} lg={4} key={video.id}>
              <VideoCard video={video} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
    {/* Modal Upload */}
    <Dialog open={openUpload} onClose={() => (!uploading ? setOpenUpload(false) : null)} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Upload video mới</DialogTitle>
      <DialogContent dividers sx={{ pt: 2 }}>
        <Typography variant="body2" sx={{ color: '#717182', mb: 2 }}>Thêm video review cho món ăn của bạn</Typography>

        {/* Khu vực video */}
        <Typography sx={{ fontWeight: 600, mb: 1 }}>Video</Typography>
        <Box onDragOver={(e) => e.preventDefault()} onDrop={(e) => onDrop(e, 'video')} sx={{ border: '1px dashed #cbd5e1', borderRadius: '12px', p: 3, textAlign: 'center', mb: 3, backgroundColor: '#fafafa' }}>
          {videoFile ? (
            <Box>
              <video src={videoPreviewUrl} controls style={{ width: '100%', borderRadius: 8 }} />
              {duration && (
                <Chip label={`Thời lượng: ${duration}`} size="small" sx={{ mt: 1 }} />
              )}
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <CloudUpload sx={{ color: '#ad46ff', fontSize: 48 }} />
              <Typography sx={{ fontWeight: 600 }}>Tải lên video của bạn</Typography>
              <Typography variant="body2" sx={{ color: '#717182' }}>Kéo thả file hoặc click để chọn</Typography>
              <Button disabled={uploading} onClick={() => videoInputRef.current?.click()} variant="outlined" sx={{ mt: 1, borderRadius: '8px' }}>Chọn video</Button>
              <input ref={videoInputRef} onChange={onPickVideo} type="file" accept="video/*" hidden />
            </Box>
          )}
        </Box>

        {/* Thumbnail */}
        <Typography sx={{ fontWeight: 600, mb: 1 }}>Ảnh bìa (Thumbnail)</Typography>
        <Box onDragOver={(e) => e.preventDefault()} onDrop={(e) => onDrop(e, 'image')} sx={{ border: '1px dashed #cbd5e1', borderRadius: '12px', p: 3, textAlign: 'center', mb: 3, backgroundColor: '#fafafa' }}>
          {thumbnailFile ? (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <img src={thumbnailPreviewUrl} alt="thumbnail" style={{ width: '100%', maxHeight: 220, objectFit: 'cover', borderRadius: 8 }} />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <CloudUpload sx={{ color: '#64748b', fontSize: 40 }} />
              <Typography sx={{ fontWeight: 600 }}>Tải lên ảnh bìa</Typography>
              <Typography variant="body2" sx={{ color: '#717182' }}>PNG, JPG (khuyến nghị 16:9)</Typography>
              <Button disabled={uploading} onClick={() => imageInputRef.current?.click()} variant="outlined" sx={{ mt: 1, borderRadius: '8px' }}>Chọn ảnh</Button>
              <input ref={imageInputRef} onChange={onPickImage} type="file" accept="image/*" hidden />
            </Box>
          )}
        </Box>

        {/* Form thông tin */}
        <TextField label="Tiêu đề video" placeholder="VD: Review Phở bò đặc biệt" fullWidth sx={{ mb: 2 }} value={title} onChange={(e) => setTitle(e.target.value)} />
        <TextField label="Mô tả" placeholder="Mô tả chi tiết về video..." fullWidth multiline minRows={3} sx={{ mb: 2 }} value={description} onChange={(e) => setDescription(e.target.value)} />
        <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
          <FormControl fullWidth>
            <InputLabel id="dish-select">Liên kết món ăn</InputLabel>
            <Select labelId="dish-select" label="Liên kết món ăn" value={linkedDish} onChange={(e) => setLinkedDish(e.target.value)}>
              <MenuItem value="none">Không liên kết</MenuItem>
              <MenuItem value="Phở bò">Phở bò</MenuItem>
              <MenuItem value="Bún bò Huế">Bún bò Huế</MenuItem>
              <MenuItem value="Bánh mì">Bánh mì</MenuItem>
            </Select>
          </FormControl>
          <TextField label="Thời lượng" placeholder="VD: 2:35" value={duration} onChange={(e) => setDuration(e.target.value)} fullWidth />
        </Box>
        {uploading && (
          <Box sx={{ mt: 1 }}>
            <LinearProgress variant="determinate" value={progress} />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button disabled={uploading} onClick={() => { setOpenUpload(false); resetForm(); }} sx={{ color: '#111827' }}>Hủy</Button>
        <Button onClick={handleUpload} disabled={!isValid || uploading} variant="contained" startIcon={<CloudUpload />} sx={{ backgroundColor: '#ad46ff', '&:hover': { backgroundColor: '#9c3de6' } }}>
          Upload video
        </Button>
      </DialogActions>
    </Dialog>
    <Snackbar open={toast.open} autoHideDuration={2600} onClose={() => setToast((t) => ({ ...t, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
      <Alert onClose={() => setToast((t) => ({ ...t, open: false }))} severity={toast.severity} variant="filled" sx={{ width: '100%' }}>
        {toast.message}
      </Alert>
    </Snackbar>
    {/* Confirm delete */}
    <Dialog open={confirmDelete.open} onClose={() => setConfirmDelete({ open: false, videoId: null })} maxWidth="xs" fullWidth>
      <DialogTitle>Xóa video</DialogTitle>
      <DialogContent dividers>
        <Typography>Bạn có chắc muốn xóa video này? Hành động này không thể hoàn tác.</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setConfirmDelete({ open: false, videoId: null })}>Hủy</Button>
        <Button color="error" variant="contained" onClick={confirmDeleteVideo}>Xóa</Button>
      </DialogActions>
    </Dialog>
    {/* Modal Chỉnh sửa */}
    <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Chỉnh sửa video</DialogTitle>
      <DialogContent dividers sx={{ pt: 2 }}>
        <Typography variant="body2" sx={{ color: '#717182', mb: 2 }}>Thêm video review cho món ăn của bạn</Typography>

        {/* Video */}
        <Typography sx={{ fontWeight: 600, mb: 1 }}>Video</Typography>
        <Box onDragOver={(e) => e.preventDefault()} onDrop={(e) => onDropEdit(e, 'video')} sx={{ border: '1px dashed #cbd5e1', borderRadius: '12px', p: 3, textAlign: 'center', mb: 3, backgroundColor: '#fafafa' }}>
          <Box>
            <video src={editVideoFile ? editVideoPreviewUrl : editingVideo?.thumbnail} controls style={{ width: '100%', borderRadius: 8 }} />
          </Box>
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <Button onClick={() => editVideoInputRef.current?.click()} startIcon={<CloudUpload />} variant="outlined" sx={{ flex: 1, borderRadius: '8px' }}>Thay video khác</Button>
            <Button color="error" variant="outlined" sx={{ borderRadius: '8px' }} onClick={() => setEditVideoFile(null)}>Xóa</Button>
          </Box>
          <input ref={editVideoInputRef} onChange={onPickEditVideo} type="file" accept="video/*" hidden />
        </Box>

        {/* Thumbnail */}
        <Typography sx={{ fontWeight: 600, mb: 1 }}>Ảnh bìa (Thumbnail)</Typography>
        <Box onDragOver={(e) => e.preventDefault()} onDrop={(e) => onDropEdit(e, 'image')} sx={{ border: '1px dashed #cbd5e1', borderRadius: '12px', p: 3, textAlign: 'center', mb: 3, backgroundColor: '#fafafa' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <img src={editImageFile ? editImagePreviewUrl : editingVideo?.thumbnail} alt="thumbnail" style={{ width: '100%', maxHeight: 220, objectFit: 'cover', borderRadius: 8 }} />
          </Box>
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <Button onClick={() => editImageInputRef.current?.click()} startIcon={<CloudUpload />} variant="outlined" sx={{ flex: 1, borderRadius: '8px' }}>Thay ảnh khác</Button>
            <Button color="error" variant="outlined" sx={{ borderRadius: '8px' }} onClick={() => setEditImageFile(null)}>Xóa</Button>
          </Box>
          <input ref={editImageInputRef} onChange={onPickEditImage} type="file" accept="image/*" hidden />
        </Box>

        {/* Form */}
        <TextField label="Tiêu đề video" fullWidth sx={{ mb: 2 }} value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
        <TextField label="Mô tả" fullWidth multiline minRows={3} sx={{ mb: 2 }} value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
        <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
          <FormControl fullWidth>
            <InputLabel id="dish-edit-select">Liên kết món ăn</InputLabel>
            <Select labelId="dish-edit-select" label="Liên kết món ăn" value={editLinkedDish} onChange={(e) => setEditLinkedDish(e.target.value)}>
              <MenuItem value="none">Không liên kết</MenuItem>
              <MenuItem value="Phở bò">Phở bò</MenuItem>
              <MenuItem value="Bún bò Huế">Bún bò Huế</MenuItem>
              <MenuItem value="Bánh mì">Bánh mì</MenuItem>
            </Select>
          </FormControl>
          <TextField label="Thời lượng" value={editDuration} onChange={(e) => setEditDuration(e.target.value)} fullWidth />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenEdit(false)} sx={{ color: '#111827' }}>Hủy</Button>
        <Button onClick={handleSaveEdit} variant="contained" startIcon={<CloudUpload />} sx={{ backgroundColor: '#ad46ff', '&:hover': { backgroundColor: '#9c3de6' } }}>
          Cập nhật video
        </Button>
      </DialogActions>
    </Dialog>
    </>
  );
};

export default VideoManagement;


