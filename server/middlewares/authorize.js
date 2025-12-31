const authorize = (req, res, next) => {
  const role = req.user.role;

  if (role === "ADMIN" || role === "HR") {
    return next(); // allow
  }

  return res.status(403).json({
    message: "Access denied",
  });
};

module.exports = authorize;
