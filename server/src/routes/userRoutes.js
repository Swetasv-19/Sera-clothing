const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getMe, updateProfile, signup, login } = require('../controller/userController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.get('/profile', protect, getMe);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;
