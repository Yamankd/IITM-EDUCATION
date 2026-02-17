const express = require("express");
const router = express.Router();
const { sendOtp, verifyOtp, register, login } = require("../controllers/external/auth.controller");
const { protectExternal } = require("../middleware/authExternal.middleware");

// Auth Routes
router.post("/auth/send-otp", sendOtp);
router.post("/auth/verify-otp", verifyOtp);
router.post("/auth/register", register);
router.post("/auth/login", login);

// Placeholder for protected routes (e.g., profile, exam)
router.get("/profile", protectExternal, (req, res) => {
    res.json({ message: "External Profile Access Granted", user: req.externalStudent });
});

module.exports = router;
