const express = require('express');

const router = express.Router();

const phone = require('../controllers/phone');

router.post('/send_sms', phone.sendSms);
router.post('/check_key', phone.checkKey);

module.exports = router;
