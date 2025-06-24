const jwt = require("jsonwebtoken");
const User = require("../model/user");
const blacklistedUser = require("../model/blackList");

//verify if the o=token is correct
const requireMidllware = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token found" });
  }

  jwt.verify(token, "artissan web site", async (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
    
    try {
      // Check if user exists and is not blacklisted
      const user = await User.findById(decodedToken.id);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      
      // Check if user is blacklisted
      const blacklisted = await blacklistedUser.findOne({ email: user.email });
      if (blacklisted) {
        // Clear the JWT cookie to log them out
        res.clearCookie('jwt');
        return res.status(403).json({ 
          message: "Access denied: Your account has been blocked",
          blocked: true 
        });
      }
      
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Authentication failed" });
    }
  });
};

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    res.locals.user = null;
    return next();
  }
  jwt.verify(token, "artissan web site", async (err, decodedToken) => {
    if (err) {
      res.locals.user = null;
      return next();
    }

    try {
      const user = await User.findById(decodedToken.id);
      if (!user) {
        res.locals.user = null;
        return next();
      }
      
      // Check if user is blacklisted
      const blacklisted = await blacklistedUser.findOne({ email: user.email });
      if (blacklisted) {
        // Clear the JWT cookie to log them out
        res.clearCookie('jwt');
        res.locals.user = null;
        return next();
      }
      
      res.locals.user = user;
    } catch (error) {
      res.locals.user = null;
    }
    return next();
  });
};

const isAdmin = async (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "you are not allowed to do this action" });
  }
  next();
};

module.exports = {
  checkUser,
  requireMidllware,
  isAdmin,
};
