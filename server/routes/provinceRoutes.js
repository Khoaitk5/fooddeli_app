import express from 'express';

const router = express.Router();

const BASE_API = 'https://provinces.open-api.vn/api/v2';

// Danh sách tỉnh/thành phố
router.get('/provinces', async (req, res) => {
  try {
    const response = await fetch(`${BASE_API}/p/`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('❌ Error fetching provinces:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch provinces',
      error: error.message 
    });
  }
});

// Danh sách xã/phường theo mã tỉnh
router.get('/wards/:provinceCode', async (req, res) => {
  try {
    const { provinceCode } = req.params;
    const response = await fetch(`${BASE_API}/p/${provinceCode}?depth=2`);
    const data = await response.json();
    
    const wards = data.wards || data.districts || data.communes || [];
    res.json(wards);
  } catch (error) {
    console.error('❌ Error fetching wards:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch wards',
      error: error.message 
    });
  }
});

export default router;
