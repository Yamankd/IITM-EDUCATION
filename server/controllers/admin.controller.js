const adminSchema = require("../models/adminModal");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')

// const admin_Register = async (req, res) => {
//   try {
//     const { name, email, password, role, isActive } = req.body;

//     const existingAdmin = await adminSchema.findOne({ email });

//     if (existingAdmin) {
//       return res.status(409).json({
//         message: "Admin already exists",
//       });
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const admin = await adminSchema.create({
//       name,
//       email,
//       password: hashedPassword,
//       role,
//       isActive,
//     });

//     res.status(201).json({
//       message: "Admin registered successfully",
//       admin: {
//         id: admin._id,
//         name: admin.name,
//         email: admin.email,
//         role: admin.role,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "Server error",
//     });
//   }
// };

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

    // Default to production settings (Secure, SameSite=None) unless explicitly in Development
    // This fixes the issue where missing NODE_ENV on Render causes cookies to fail cross-site
    const isDev = process.env.NODE_ENV === "development";

    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: !isDev,                   // True in Production (or if NODE_ENV is missing)
      sameSite: isDev ? "lax" : "none", // 'None' required for cross-site (Netlify -> Render)
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
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
  const isDev = process.env.NODE_ENV === "development";

  res.clearCookie("adminToken", {
    httpOnly: true,
    secure: !isDev,
    sameSite: isDev ? "lax" : "none",
  });
  res.status(200).json({ message: "Logout successful" });
};

module.exports = { admin_Login, AdminDashboard, admin_Logout };
