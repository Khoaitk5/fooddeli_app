import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Stack,
  TextField,
  Button,
  Card,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Fade,
  Slide,
  InputAdornment,
  Divider,
} from '@mui/material';
import {
  ArrowBackIosNew,
  Edit,
  Visibility,
  VisibilityOff,
  Check,
  Close,
  DirectionsCarFilled,
  AttachMoney,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    vehicleType: '',
    vehiclePlate: '',
    vehicleNumber: '',
    identityCard: '',
  });
  const [loadingUser, setLoadingUser] = useState(true);
  const [userError, setUserError] = useState(null);

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [editMode, setEditMode] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      setLoadingUser(true);
      setUserError(null);
      try {
        const res = await fetch('http://localhost:5000/api/users/me', { credentials: 'include' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const user = data?.user;
        if (user) {
          setFormData({
            fullName: user.full_name || '',
            email: user.email || '',
            phone: user.phone || '',
            vehicleType: user.shipper_profile?.vehicle_type || '',
            vehiclePlate: user.shipper_profile?.vehicle_plate || '',
            vehicleNumber: user.shipper_profile?.vehicle_number || '',
            identityCard: user.shipper_profile?.identity_card || '',
          });
        }
      } catch (err) {
        console.error('[Settings] fetchUserData error:', err);
        setUserError(err.message || String(err));
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUserData();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  // Validate and save profile changes
  const handleSaveProfile = async () => {
    if (!formData.fullName || !formData.phone) {
      setMessage({ type: 'error', text: 'Vui lòng điền đầy đủ thông tin bắt buộc' });
      return;
    }

    try {
      setLoading(true);
      // TODO: Call API to update shipper profile
      // await updateShipperProfile(formData);
      setMessage({ type: 'success', text: 'Cập nhật thông tin thành công' });
      setEditMode(false);
    } catch (error) {
      setMessage({ type: 'error', text: 'Cập nhật thất bại: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  // Validate and change password
  const handleChangePassword = async () => {
    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Vui lòng điền đầy đủ mật khẩu' });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Mật khẩu mới không trùng khớp' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Mật khẩu phải có ít nhất 6 ký tự' });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData?.message || `HTTP ${res.status}`);
      }
      setMessage({ type: 'success', text: 'Đổi mật khẩu thành công' });
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordDialog(false);
    } catch (error) {
      console.error('[Settings] changePassword error:', error);
      setMessage({ type: 'error', text: 'Đổi mật khẩu thất bại: ' + (error.message || String(error)) });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset to currently fetched values
    setEditMode(false);
    setMessage({ type: '', text: '' });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fff5f2 0%, #f0f9ff 100%)',
        pb: 12,
      }}
    >
      {/* Header */}
      <Slide direction="down" in timeout={600}>
        <Box
          sx={{
            background: 'linear-gradient(135deg, #ff6b35 0%, #ff5722 100%)',
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
            color: '#fff',
            p: 3,
            mb: 3,
            boxShadow: '0 16px 48px rgba(255,107,53,0.25)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              width: 250,
              height: 250,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              transform: 'translate(30%, -30%)',
            }}
          />

          <Stack direction="row" alignItems="center" spacing={2} sx={{ position: 'relative', zIndex: 1 }}>
            <IconButton
              onClick={() => navigate('/shipper/profile')}
              size="small"
              sx={{
                color: '#fff',
                bgcolor: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
              }}
            >
              <ArrowBackIosNew fontSize="small" />
            </IconButton>
            <Typography sx={{ fontSize: 24, fontWeight: 900, color: '#fff', flex: 1 }}>
              Cài đặt tài khoản
            </Typography>
          </Stack>
        </Box>
      </Slide>

      {/* Content */}
      <Box sx={{ px: 2.5, maxWidth: 420, mx: 'auto' }}>
        {/* Message Alert */}
        {message.text && (
          <Fade in timeout={500}>
            <Alert
              severity={message.type === 'success' ? 'success' : message.type === 'error' ? 'error' : 'info'}
              onClose={() => setMessage({ type: '', text: '' })}
              sx={{ mb: 3, borderRadius: 3 }}
            >
              {message.text}
            </Alert>
          </Fade>
        )}

        {/* Loading state */}
        {loadingUser ? (
          <Card sx={{ p: 6, borderRadius: 3, textAlign: 'center' }}>
            <Stack alignItems="center" spacing={2}>
              <CircularProgress />
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#6b7280' }}>
                Đang tải thông tin...
              </Typography>
            </Stack>
          </Card>
        ) : userError ? (
          <Card sx={{ p: 6, borderRadius: 3, textAlign: 'center' }}>
            <Typography sx={{ fontSize: 20, mb: 1 }}>⚠️ Lỗi</Typography>
            <Typography sx={{ fontSize: 14, color: '#9ca3af' }}>{userError}</Typography>
          </Card>
        ) : (
          <>
            {/* Section 1: Personal Information */}
            <Fade in timeout={700}>
          <Card
            sx={{
              borderRadius: 4,
              p: 3,
              mb: 3,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.8)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
              <Typography sx={{ fontSize: 18, fontWeight: 800, color: '#111827' }}>
                Thông tin cá nhân
              </Typography>
              {!editMode && (
                <Button
                  size="small"
                  startIcon={<Edit sx={{ fontSize: 18 }} />}
                  onClick={() => setEditMode(true)}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 700,
                    color: '#ff6b35',
                    '&:hover': { bgcolor: 'rgba(255,107,53,0.1)' },
                  }}
                >
                  Chỉnh sửa
                </Button>
              )}
            </Stack>

            <Stack spacing={2.5}>
              <TextField
                label="Họ và tên"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                disabled={!editMode}
                fullWidth
                variant={editMode ? 'outlined' : 'filled'}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2.5,
                    backgroundColor: editMode ? '#fff' : '#f5f5f5',
                  },
                }}
              />

              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!editMode}
                fullWidth
                variant={editMode ? 'outlined' : 'filled'}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2.5,
                    backgroundColor: editMode ? '#fff' : '#f5f5f5',
                  },
                }}
              />

              <TextField
                label="Số điện thoại"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!editMode}
                fullWidth
                variant={editMode ? 'outlined' : 'filled'}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2.5,
                    backgroundColor: editMode ? '#fff' : '#f5f5f5',
                  },
                }}
              />

              {editMode && (
                <Stack direction="row" spacing={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Check />}
                    onClick={handleSaveProfile}
                    disabled={loading}
                    sx={{
                      background: 'linear-gradient(135deg, #ff6b35 0%, #ff5722 100%)',
                      textTransform: 'none',
                      fontWeight: 700,
                      py: 1.5,
                      borderRadius: 2.5,
                    }}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Lưu'}
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Close />}
                    onClick={handleCancel}
                    sx={{
                      borderColor: '#d1d5db',
                      color: '#4b5563',
                      textTransform: 'none',
                      fontWeight: 700,
                      py: 1.5,
                      borderRadius: 2.5,
                      '&:hover': { bgcolor: '#f5f5f5' },
                    }}
                  >
                    Hủy
                  </Button>
                </Stack>
              )}
            </Stack>
          </Card>
        </Fade>

        {/* Section 2: Vehicle Information */}
        <Fade in timeout={900}>
          <Card
            sx={{
              borderRadius: 4,
              p: 3,
              mb: 3,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.8)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
              <DirectionsCarFilled sx={{ fontSize: 24, color: '#ff6b35' }} />
              <Typography sx={{ fontSize: 18, fontWeight: 800, color: '#111827' }}>
                Thông tin phương tiện
              </Typography>
            </Stack>

            <Stack spacing={2.5}>
              <TextField
                label="Loại xe"
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                disabled
                fullWidth
                variant="filled"
                sx={{
                  '& .MuiFilledInput-root': {
                    backgroundColor: '#f5f5f5',
                    borderRadius: 2.5,
                  },
                }}
              />

              <TextField
                label="Biển số xe"
                name="vehiclePlate"
                value={formData.vehiclePlate}
                onChange={handleChange}
                disabled
                fullWidth
                variant="filled"
                sx={{
                  '& .MuiFilledInput-root': {
                    backgroundColor: '#f5f5f5',
                    borderRadius: 2.5,
                  },
                }}
              />

              <TextField
                label="Số hiệu xe"
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleChange}
                disabled
                fullWidth
                variant="filled"
                sx={{
                  '& .MuiFilledInput-root': {
                    backgroundColor: '#f5f5f5',
                    borderRadius: 2.5,
                  },
                }}
              />

              <Typography sx={{ fontSize: 12, color: '#6b7280', fontStyle: 'italic' }}>
                💡 Thông tin phương tiện được cập nhật bởi quản trị viên
              </Typography>
            </Stack>
          </Card>
        </Fade>

        {/* Section 3: Identity Information */}
        <Fade in timeout={1000}>
          <Card
            sx={{
              borderRadius: 4,
              p: 3,
              mb: 3,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.8)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
            }}
          >
            <Typography sx={{ fontSize: 18, fontWeight: 800, color: '#111827', mb: 2.5 }}>
              Thông tin định danh
            </Typography>

            <Stack spacing={2.5}>
              <TextField
                label="Số CMND/CCCD"
                name="identityCard"
                value={formData.identityCard}
                onChange={handleChange}
                disabled
                fullWidth
                variant="filled"
                sx={{
                  '& .MuiFilledInput-root': {
                    backgroundColor: '#f5f5f5',
                    borderRadius: 2.5,
                  },
                }}
              />

              <Typography sx={{ fontSize: 12, color: '#6b7280', fontStyle: 'italic' }}>
                💡 Thông tin định danh được cập nhật bởi quản trị viên
              </Typography>
            </Stack>
          </Card>
        </Fade>

        {/* Section 4: Change Password */}
        <Fade in timeout={1100}>
          <Card
            sx={{
              borderRadius: 4,
              p: 3,
              mb: 3,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.8)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
            }}
          >
            <Typography sx={{ fontSize: 18, fontWeight: 800, color: '#111827', mb: 2.5 }}>
              Bảo mật
            </Typography>

            <Button
              fullWidth
              variant="outlined"
              onClick={() => setShowPasswordDialog(true)}
              sx={{
                borderColor: '#ff6b35',
                color: '#ff6b35',
                textTransform: 'none',
                fontWeight: 700,
                py: 1.5,
                borderRadius: 2.5,
                '&:hover': { bgcolor: 'rgba(255,107,53,0.1)' },
              }}
            >
              Đổi mật khẩu
            </Button>
          </Card>
        </Fade>

        {/* Footer */}
        <Typography
          align="center"
          sx={{
            color: '#9ca3af',
            fontSize: 12,
            mt: 4,
            fontWeight: 500,
          }}
        >
          Shipper App v1.0.0 🚀
        </Typography>
          </>
        )}
      </Box>

      {/* Change Password Dialog */}
      <Dialog
        open={showPasswordDialog}
        onClose={() => setShowPasswordDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            backdropFilter: 'blur(20px)',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: 18, pt: 3 }}>Đổi mật khẩu</DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2.5}>
            <TextField
              label="Mật khẩu cũ"
              name="oldPassword"
              type={showPasswordFields.old ? 'text' : 'password'}
              value={passwordData.oldPassword}
              onChange={handlePasswordChange}
              fullWidth
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowPasswordFields(prev => ({
                          ...prev,
                          old: !prev.old,
                        }))
                      }
                      edge="end"
                    >
                      {showPasswordFields.old ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ borderRadius: 2.5 }}
            />

            <TextField
              label="Mật khẩu mới"
              name="newPassword"
              type={showPasswordFields.new ? 'text' : 'password'}
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              fullWidth
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowPasswordFields(prev => ({
                          ...prev,
                          new: !prev.new,
                        }))
                      }
                      edge="end"
                    >
                      {showPasswordFields.new ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ borderRadius: 2.5 }}
            />

            <TextField
              label="Xác nhận mật khẩu"
              name="confirmPassword"
              type={showPasswordFields.confirm ? 'text' : 'password'}
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              fullWidth
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowPasswordFields(prev => ({
                          ...prev,
                          confirm: !prev.confirm,
                        }))
                      }
                      edge="end"
                    >
                      {showPasswordFields.confirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ borderRadius: 2.5 }}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 1.5 }}>
          <Button
            onClick={() => setShowPasswordDialog(false)}
            sx={{ textTransform: 'none', fontWeight: 700, color: '#6b7280' }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleChangePassword}
            disabled={loading}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #ff6b35 0%, #ff5722 100%)',
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: 2,
            }}
          >
            {loading ? <CircularProgress size={24} /> : 'Đổi mật khẩu'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings;
