const jwt = require("jsonwebtoken");
const User = require("../model/user");
//verify if the o=token is correct
const requireMidllware = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token found" });
  }

  jwt.verify(token, "artissan web site", (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
    // req.user = decodedToken;
    next();
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
      res.locals.user = user || null; // If user is not found, set null
    } catch (error) {
      res.locals.user = null;
    }
    return next();
  });
};
module.exports = {
  checkUser,
  requireMidllware,
};
