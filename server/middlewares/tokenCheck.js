const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  let token = req.cookies.adminToken;

  // Check Authorization header (case-insensitive)
  const authHeader = req.headers.authorization || req.headers.Authorization || req.get("Authorization");

  if (!token && authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }

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