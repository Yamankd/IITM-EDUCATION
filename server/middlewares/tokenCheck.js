const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const token = req.cookies.adminToken || req.cookies.hrToken;

  if (!token) {
    return res.status(401).json({
      message: "Not authenticated"
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role, permissions }
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid token"
    });
  }
};


module.exports = protect;