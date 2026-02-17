const express = require("express");
const router = express.Router();
const { sendOtp, verifyOtp, registerDetails } = require("../controllers/certification.controller");

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/register", registerDetails);

module.exports = router;
