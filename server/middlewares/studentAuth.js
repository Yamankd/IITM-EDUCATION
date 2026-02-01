const jwt = require("jsonwebtoken");
const Student = require("../models/student.model");

const protectStudent = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(" ")[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get student from the token
            req.student = await Student.findById(decoded.id).select("-password");

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: "Not authorized" });
        }
    }

    if (!token) {
        res.status(401).json({ message: "Not authorized, no token" });
    }
};

module.exports = { protectStudent };
