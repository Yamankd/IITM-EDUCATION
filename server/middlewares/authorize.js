const authorize = (req, res, next) => {
  const role = req.user?.role?.toUpperCase();
  if (role === "ADMIN") {
    return next(); // allow
  }

  return res.status(403).json({
    message: "Access denied",
  });
};

module.exports = authorize;
