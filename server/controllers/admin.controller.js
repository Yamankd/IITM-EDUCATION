const adminSchema = require("../models/adminModal");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')

const admin_Register = async (req, res) => {
  try {
    const { name, email, password, role, isActive } = req.body;

    const existingAdmin = await adminSchema.findOne({ email });

    if (existingAdmin) {
      return res.status(409).json({
        message: "Admin already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await adminSchema.create({
      name,
      email,
      password: hashedPassword,
      role,
      isActive,
    });

    res.status(201).json({
      message: "Admin registered successfully",
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

    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
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


module.exports = { admin_Register, admin_Login , AdminDashboard};
