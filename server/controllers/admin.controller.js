const adminSchema = require("../models/adminModal");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')


const admin_Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await adminSchema.findOne({ email }).select("+password");
    // console.log(admin)
    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, admin.password);
    // console.log(isPasswordMatch)
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Use request origin to determine if this is a localhost request.
    // NODE_ENV alone is unreliable since .env may have NODE_ENV=production even for local dev.
    const requestOrigin = req.headers.origin || req.headers.referer || '';
    const isLocalhost = requestOrigin.includes('localhost') || requestOrigin.includes('127.0.0.1');

    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: !isLocalhost,             // Only secure on HTTPS (non-localhost)
      sameSite: isLocalhost ? "lax" : "none", // lax for local dev, none for cross-origin production
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      token, // Return token for API clients/testing
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};


const AdminDashboard = (req, res) => {
  res.status(200).json({
    message: "Welcome to Admin Dashboard",
    admin: req.user,
  });
};


const admin_Logout = (req, res) => {
  const requestOrigin = req.headers.origin || req.headers.referer || '';
  const isLocalhost = requestOrigin.includes('localhost') || requestOrigin.includes('127.0.0.1');

  res.clearCookie("adminToken", {
    httpOnly: true,
    secure: !isLocalhost,
    sameSite: isLocalhost ? "lax" : "none",
  });
  res.status(200).json({ message: "Logout successful" });
};

const updateAdmin = async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;
    const adminId = req.user.id;

    // Find admin
    const admin = await adminSchema.findById(adminId).select("+password");
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Verify current password
    if (!currentPassword) {
      return res.status(400).json({ message: "Current password is required" });
    }

    const isPasswordMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid current password" });
    }

    // Update fields
    if (req.body.name) admin.name = req.body.name;
    if (email) admin.email = email;
    if (req.body.mobile !== undefined) admin.mobile = req.body.mobile;
    if (req.body.contactEmail !== undefined) admin.contactEmail = req.body.contactEmail;
    if (newPassword) {
      if (newPassword.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters long" });
      }
      admin.password = await bcrypt.hash(newPassword, 10);
    }

    await admin.save();

    res.status(200).json({
      message: "Admin profile updated successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        mobile: admin.mobile,
        contactEmail: admin.contactEmail,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = { admin_Login, AdminDashboard, admin_Logout, updateAdmin };
