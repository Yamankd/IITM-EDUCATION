const HR = require("../models/hrModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/* ================= HR SIGNUP ================= */
const hrSignup = async (req, res) => {
  try {
    const { name, email, password, permissions } = req.body;

    // check existing hr
    const existingHR = await HR.findOne({ email });
    if (existingHR) {
      return res.status(409).json({
        message: "HR already exists"
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const hr = await HR.create({
      name,
      email,
      password: hashedPassword,
      permissions,
      createdBy: req.user.id // admin id from JWT
    });

    res.status(201).json({
      message: "HR created successfully",
      hr: {
        id: hr._id,
        name: hr.name,
        email: hr.email,
        role: hr.role,
        permissions: hr.permissions
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};


/* ================= HR LOGIN ================= */
const hrLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const hr = await HR.findOne({ email }).select("+password");
    //   console.log(hr)
      if (!hr) {
        return res.status(404).json({
          message: "HR not found"
        });
      }
  
      if (!hr.isActive) {
        return res.status(403).json({
          message: "HR account is disabled"
        });
      }
  
      const isMatch = await bcrypt.compare(password, hr.password);
      if (!isMatch) {
        return res.status(401).json({
          message: "Invalid credentials"
        });
      }
  
      // update last login
      hr.lastLogin = new Date();
      await hr.save();
  
      const token = jwt.sign(
        {
          id: hr._id,
          role: hr.role,
          permissions: hr.permissions
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
  
      res.cookie("hrToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000
      });
  
      res.status(200).json({
        message: "HR login successful",
        hr: {
          id: hr._id,
          name: hr.name,
          email: hr.email,
          role: hr.role,
          permissions: hr.permissions
        }
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Server error"
      });
    }
  };
  
  module.exports = { hrSignup, hrLogin };
  