const jwt = require("jsonwebtoken");
const { User } = require("../models/User");

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1] || req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const user = await User.findById(decodedToken.userId);

      if (!user) {
        return res
          .status(401)
          .json({ message: "Unauthorized: User not found" });
      }

      req.session.user = user;
      console.log("User session set:", req.session.user);
      next();
    } catch (error) {
      console.error("Error verifying token:", error);
      return next(error);
    }
  });
};

// Middleware to check if session is expired
const checkSessionExpiration = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ message: "Session expired" });
  }
  next();
};

module.exports = {
  authenticateToken,
  checkSessionExpiration,
};
