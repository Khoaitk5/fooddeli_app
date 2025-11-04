const express = require('express');
const addressController = require('../controllers/addressController.js');

const router = express.Router();

router.post('/user-addresses', addressController.getUserAddresses);