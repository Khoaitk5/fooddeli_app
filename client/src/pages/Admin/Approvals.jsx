import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Tabs,
  Tab,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Stack,
  IconButton,
  InputAdornment,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import DescriptionIcon from "@mui/icons-material/Description";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const Approvals = () => {
  const [tab, setTab] = useState(0);
  const handleTabChange = (_, v) => setTab(v);

  const [shopContracts, setShopContracts] = useState([]);
  const [shipperContracts, setShipperContracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailType, setDetailType] = useState(null); // 'shop' | 'shipper'
  const [detailData, setDetailData] = useState(null);

  const getDocLabel = (type, key) => {
    if (type === "shipper") {
      const shipperLabels = {
        portrait_photo_url: "Ảnh chân dung",
        id_card_front_url: "CMND/CCCD mặt trước",
        id_card_back_url: "CMND/CCCD mặt sau",
        vehicle_registration_url: "Đăng ký xe",
        driving_license_front_url: "Bằng lái xe - mặt trước",
        driving_license_back_url: "Bằng lái xe - mặt sau",
        motorcycle_license_front_url: "Giấy phép lái xe máy - mặt trước",
        motorcycle_license_back_url: "Giấy phép lái xe máy - mặt sau",
        health_certificate_url: "Giấy khám sức khỏe",
        criminal_record_url: "Phiếu lý lịch tư pháp số 02",
        lltp_01_url: "LLTP số 01",
        lltp_appointment_url: "Giấy hẹn LLTP số 02",
        proof_image_url: "Ảnh minh chứng khác",
      };
      return shipperLabels[key] || key;
    }

    const shopLabels = {
      shop_logo_url: "Logo cửa hàng",
      shop_cover_url: "Ảnh bìa cửa hàng",
      id_card_front_url: "CMND/CCCD chủ hộ - mặt trước",
      id_card_back_url: "CMND/CCCD chủ hộ - mặt sau",
      household_business_cert_url: "Giấy đăng ký hộ kinh doanh",
      storefront_photo_url: "Ảnh mặt tiền/quầy bán",
      tax_code_doc_url: "Giấy tờ mã số thuế",
      company_business_cert_url: "Giấy đăng ký kinh doanh (công ty)",
      authorization_letter_url: "Giấy ủy quyền",
      food_safety_cert_url: "Giấy chứng nhận ATTP",
      representative_id_card_front_url: "CMND/CCCD người đại diện - mặt trước",
      representative_id_card_back_url: "CMND/CCCD người đại diện - mặt sau",
    };
    return shopLabels[key] || key;
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [shopRes, shipperRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/shop-contracts`, { withCredentials: true }),
        axios.get(`${API_BASE_URL}/shipper-contracts`, { withCredentials: true }),
      ]);

      const shops = shopRes.data?.data || shopRes.data || [];
      const shippers = shipperRes.data?.data || shipperRes.data || [];

      setShopContracts(shops.filter((c) => c.status === "pending"));
      setShipperContracts(shippers.filter((c) => c.status === "pending"));
    } catch (err) {
      console.error("❌ Fetch approvals error", err);
      setError(
        err.response?.data?.message || "Không thể tải danh sách hợp đồng cần duyệt."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenDetail = async (type, id) => {
    try {
      setDetailType(type);
      setDetailData(null);
      setDetailOpen(true);

      if (type === "shop") {
        const res = await axios.get(`${API_BASE_URL}/shop-contracts/${id}`, {
          withCredentials: true,
        });
        setDetailData(res.data?.data || res.data);
      } else {
        const res = await axios.get(`${API_BASE_URL}/shipper-contracts/${id}`, {
          withCredentials: true,
        });
        setDetailData(res.data?.data || res.data);
      }
    } catch (err) {
      console.error("❌ Fetch contract detail error", err);
      setDetailData({ error: err.response?.data?.message || "Không thể tải chi tiết." });
    }
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
    setDetailData(null);
    setDetailType(null);
  };

  const handleApproveDetail = async () => {
    if (!detailData || !detailType) return;

    try {
      const endpoint =
        detailType === "shop" ? "shop-contracts" : "shipper-contracts";

      await axios.patch(
        `${API_BASE_URL}/${endpoint}/${detailData.id}`,
        { status: "approved" },
        { withCredentials: true }
      );

      await fetchData();
      handleCloseDetail();
    } catch (err) {
      console.error("❌ Approve contract error", err);
      alert(
        err.response?.data?.message ||
          "Không thể chấp nhận hợp đồng. Vui lòng thử lại."
      );
    }
  };

  const handleRejectDetail = async () => {
    if (!detailData || !detailType) return;

    try {
      const endpoint =
        detailType === "shop" ? "shop-contracts" : "shipper-contracts";

      await axios.patch(
        `${API_BASE_URL}/${endpoint}/${detailData.id}`,
        { status: "rejected" },
        { withCredentials: true }
      );

      await fetchData();
      handleCloseDetail();
    } catch (err) {
      console.error("❌ Reject contract error", err);
      alert(
        err.response?.data?.message ||
          "Không thể từ chối hợp đồng. Vui lòng thử lại."
      );
    }
  };

  const StatCard = ({ title, value, sub, color }) => (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.paper",
        height: "100%",
      }}
    >
      <Typography variant="subtitle2" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 600, mt: 0.5 }}>
        {value}
      </Typography>
      <Typography variant="caption" color={color || "text.secondary"}>
        {sub}
      </Typography>
    </Paper>
  );

  return (
    <Box>
      {/* Tiêu đề */}
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
        Duyệt đăng ký
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Xem xét và phê duyệt đăng ký từ cửa hàng và shipper mới tham gia hệ thống
      </Typography>

      {/* Thẻ thống kê */}
      <Grid
        container
        spacing={2}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "nowrap",
          mb: 3,
        }}
      >
        <Grid item xs={12} sm={6} md={3} sx={{ flex: 1 }}>
          <StatCard
            title="Chờ duyệt cửa hàng"
            value={shopContracts.length}
            sub="Cần xử lý"
            color="warning.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ flex: 1 }}>
          <StatCard
            title="Chờ duyệt shipper"
            value={shipperContracts.length}
            sub="Cần xử lý"
            color="warning.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ flex: 1 }}>
          <StatCard title="Đã duyệt tuần này" value="12" sub="+8 cửa hàng, +4 shipper" />
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ flex: 1 }}>
          <StatCard title="Tỷ lệ chấp nhận" value="87%" sub="+5% so với tháng trước" />
        </Grid>
      </Grid>

      {/* Tabs */}
      <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Đăng ký cửa hàng" />
        <Tab label="Đăng ký shipper" />
      </Tabs>

      {/* Bảng danh sách */}
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
        {tab === 0 ? "Đăng ký cửa hàng" : "Đăng ký shipper"}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {tab === 0
          ? "Xem xét và phê duyệt đăng ký từ các cửa hàng mới"
          : "Xem xét và phê duyệt đăng ký từ các shipper mới"}
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <TextField
          size="small"
          placeholder={
            tab === 0
              ? "Tìm kiếm theo tên cửa hàng hoặc chủ cửa hàng..."
              : "Tìm kiếm theo tên shipper hoặc số điện thoại..."
          }
          sx={{ maxWidth: 400 }}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Paper
        elevation={0}
        sx={{ borderRadius: 2, border: "1px solid", borderColor: "divider", mt: 1 }}
      >
        {loading ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="body2">Đang tải danh sách...</Typography>
          </Box>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{tab === 0 ? "Cửa hàng" : "Shipper"}</TableCell>
                <TableCell>{tab === 0 ? "Chủ cửa hàng" : "Số điện thoại"}</TableCell>
                <TableCell>{tab === 0 ? "Danh mục" : "Email"}</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell>Giấy tờ</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell align="right">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(tab === 0 ? shopContracts : shipperContracts).map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Typography fontWeight={500}>
                      {tab === 0 ? item.shop_name : item.full_name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {tab === 0 ? item.shop_address : item.id_card_number}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {tab === 0 ? (
                      <>
                        <Typography variant="body2">{item.owner_name || ""}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.phone}
                        </Typography>
                      </>
                    ) : (
                      <Typography variant="body2">{item.phone}</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {tab === 0 ? (
                      <Chip
                        size="small"
                        label={item.business_type || "Khác"}
                        variant="outlined"
                      />
                    ) : (
                      <Typography variant="body2">{item.email || "-"}</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {item.created_at
                      ? new Date(item.created_at).toLocaleString("vi-VN")
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <DescriptionIcon fontSize="small" color="action" />
                      <Typography variant="body2">Tài liệu đính kèm</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip size="small" label={item.status} color="warning" />
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<VisibilityIcon />}
                      onClick={() =>
                        handleOpenDetail(tab === 0 ? "shop" : "shipper", item.id)
                      }
                    >
                      Xem chi tiết
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {(tab === 0 ? shopContracts : shipperContracts).length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body2" color="text.secondary">
                      Không có hồ sơ nào cần duyệt.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Paper>

      <Dialog open={detailOpen} onClose={handleCloseDetail} maxWidth="md" fullWidth>
        <DialogTitle>
          {detailType === "shop"
            ? "Chi tiết hợp đồng cửa hàng"
            : "Chi tiết hợp đồng shipper"}
        </DialogTitle>
        <DialogContent dividers>
          {!detailData && !error && (
            <Typography variant="body2">Đang tải chi tiết...</Typography>
          )}
          {detailData?.error && (
            <Typography color="error" variant="body2">
              {detailData.error}
            </Typography>
          )}
          {detailData && !detailData.error && (
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                Thông tin chính
              </Typography>
              {detailType === "shop" ? (
                <>
                  <Typography variant="body2">
                    <strong>Tên cửa hàng:</strong> {detailData.shop_name}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Mô tả:</strong> {detailData.shop_description}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Địa chỉ:</strong> {detailData.shop_address}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Điện thoại:</strong> {detailData.phone}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Email:</strong> {detailData.email || "-"}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Loại hình:</strong> {detailData.business_type}
                  </Typography>
                </>
              ) : (
                <>
                  <Typography variant="body2">
                    <strong>Họ tên:</strong> {detailData.full_name}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Số điện thoại:</strong> {detailData.phone}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Email:</strong> {detailData.email || "-"}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Biển số xe:</strong> {detailData.vehicle_plate_number || "-"}
                  </Typography>
                  <Typography variant="body2">
                    <strong>CMND/CCCD:</strong> {detailData.id_card_number || "-"}
                  </Typography>
                </>
              )}

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                Ảnh & tài liệu
              </Typography>
              <Stack direction="column" spacing={2}>
                {Object.entries(detailData)
                  .filter(
                    ([key, value]) =>
                      typeof value === "string" && value && key.endsWith("_url")
                  )
                  .map(([key, value]) => (
                    <Paper
                      key={key}
                      variant="outlined"
                      sx={{ p: 1.5, borderRadius: 2 }}
                    >
                      <Typography
                        variant="caption"
                        display="block"
                        sx={{ mb: 0.75, fontWeight: 500 }}
                      >
                        {getDocLabel(detailType, key)}
                      </Typography>
                      <Box
                        component="img"
                        src={value}
                        alt={key}
                        sx={{
                          width: "100%",
                          borderRadius: 1,
                          border: "1px solid",
                          borderColor: "divider",
                          objectFit: "contain",
                          maxHeight: 360,
                          bgcolor: "#f9fafb",
                        }}
                      />
                    </Paper>
                  ))}
                {Object.entries(detailData).filter(
                  ([key, value]) =>
                    typeof value === "string" && value && key.endsWith("_url")
                ).length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    Không có ảnh/tài liệu nào.
                  </Typography>
                )}
              </Stack>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetail}>Đóng</Button>
          <Button
            color="error"
            variant="outlined"
            startIcon={<CloseIcon />}
            onClick={handleRejectDetail}
            disabled={!detailData || detailData?.error}
          >
            Từ chối
          </Button>
          <Button
            color="primary"
            variant="contained"
            startIcon={<CheckIcon />}
            onClick={handleApproveDetail}
            disabled={!detailData || detailData?.error}
          >
            Chấp nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Approvals;
