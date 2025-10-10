import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Stack, Typography, TextField, Paper, Button, IconButton } from '@mui/material';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { useShipper } from '@/hooks/useShipper';

const EditProfile = () => {
  const navigate = useNavigate();
  const { shipper, updateShipper } = useShipper();

  const [form, setForm] = React.useState({
    name: shipper?.name || '',
    phone: shipper?.phone || '',
    plate: shipper?.vehicle?.plate || '',
    avatar: shipper?.avatar || '' // data URL
  });

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  const handleSave = () => {
    updateShipper({
      name: form.name,
      phone: form.phone,
      avatar: form.avatar,
      vehicle: { ...(shipper?.vehicle || {}), plate: form.plate }
    });
    navigate('/shipper/profile');
  };

  const handlePickAvatar = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((f) => ({ ...f, avatar: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <Box sx={{ pb: 3 }}>
      <Box sx={{ background: 'linear-gradient(90deg, #ff6b35, #f54900)' }}>
        <Box sx={{ maxWidth: 390, mx: 'auto', color: '#fff', px: 2.5, pt: 2, pb: 2, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton onClick={() => navigate(-1)} size="small" sx={{ color: '#fff' }}>
              <ArrowBackIosNewOutlinedIcon />
            </IconButton>
            <Box>
              <Typography sx={{ fontSize: 18, fontWeight: 800 }}>Chỉnh sửa hồ sơ</Typography>
              <Typography sx={{ fontSize: 12, opacity: 0.9 }}>Cập nhật thông tin cá nhân</Typography>
            </Box>
          </Stack>
        </Box>
      </Box>

      <Box sx={{ maxWidth: 390, mx: 'auto', px: 2.5, mt: 2 }}>
        <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
          <Stack alignItems="center" sx={{ mb: 2 }}>
            <Box sx={{ width: 96, height: 96, borderRadius: '50%', overflow: 'hidden', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {form.avatar ? (
                <img src={form.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <Typography sx={{ color: '#6B7280', fontWeight: 700 }}>Ảnh</Typography>
              )}
            </Box>
            <Button component="label" variant="outlined" color="inherit" sx={{ mt: 1, height: 36, borderRadius: 1.25 }}>
              Tải ảnh từ máy
              <input type="file" accept="image/*" hidden onChange={handlePickAvatar} />
            </Button>
            {form.avatar && (
              <Button onClick={() => setForm((f) => ({ ...f, avatar: '' }))} color="inherit" sx={{ mt: 0.5, textTransform: 'none' }}>
                Xóa ảnh
              </Button>
            )}
          </Stack>
          <Stack spacing={1.5}>
            <TextField label="Họ và tên" value={form.name} onChange={handleChange('name')} size="small" fullWidth />
            <TextField label="Số điện thoại" value={form.phone} onChange={handleChange('phone')} size="small" fullWidth />
            <TextField label="Biển số xe" value={form.plate} onChange={handleChange('plate')} size="small" fullWidth />
          </Stack>
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Button variant="outlined" color="inherit" onClick={() => navigate(-1)} sx={{ flex: 1, height: 44, borderRadius: 1.5 }}>Hủy</Button>
            <Button onClick={handleSave} sx={{ flex: 1, height: 44, borderRadius: 1.5, background: '#ff6b35', color: '#fff', '&:hover': { background: '#f0602e' } }}>Lưu</Button>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
};

export default EditProfile;


