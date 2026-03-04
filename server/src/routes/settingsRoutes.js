const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { changePassword, updatePreferences, deleteAccount } = require('../controller/settingsController');

const router = express.Router();

router.use(protect);

router.put('/password', changePassword);
router.put('/preferences', updatePreferences);
router.delete('/account', deleteAccount);

module.exports = router;
