const express = require("express");
const User = require("../model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { upload } = require("../utils/cloudinaryConfig");
const cloudinary = require("cloudinary").v2;
const BlacklistedUser = require("../model/blackList");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
//hundle errore
const hundleErrore = (err) => {
  console.log(err.message, err.code);
  let errors = { name: "", email: "", password: "" };
  //incorrect email
  if (err.message === "incorrect email ") {
    errors.email = "that email is not regestred";
  }
  //incorrect password
  if (err.message === "incorrect password") {
    errors.password = "this password is incorrect";
  }
  //duplicated errore
  if (err.code == 11000) {
    errors.email = "that email is already registered";
  }
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      //console.log(properties);
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};
//creat token
maxAge = 3 * 24 * 60 * 60 * 1000;
const createToken = (id) => {
  return jwt.sign({ id }, "artissan web site", {
    expiresIn: maxAge,
  });
};

signup_Post = async (req, res) => {
  const { email, password, name, bio } = req.body;
  const image = req.file;
  try {
    const isBlacklisted = await BlacklistedUser.findOne({ email: email });
    if (isBlacklisted) {
      return res.status(403).json({ message: "User is blacklisted" });
    }
    let imageUrl = null;
    if (image) {
      const resault = await cloudinary.uploader.upload(image.path, {
        folder: "profile_pictures",
      });
      imageUrl = resault.secure_url;
    }
    const user = await User.create({
      email,
      password,
      name,
      profilePicture: imageUrl,
      bio,
    });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge });
    res.status(200).json({ user });
    console.log(user);
  } catch (err) {
    const errores = hundleErrore(err);
    res.status(400).json(errores);
  }
};
login_Post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errore = hundleErrore(err);
    res.status(400).json(errore);
  }
};
async function create_admine() {
  const admin = await User.create({
    name: "admin",
    email: "admine1@gmail.com",
    password: "admin123",
    role: "admin",
  });
  await admin.save();
  console.log(admin);
}
//create_admine();
const login_admine = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await User.login(email, password);

    if (admin.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const token = createToken(admin._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge });
    res.status(200).json({ admin: admin._id });
  } catch (err) {
    const errore = hundleErrore(err);
    res.status(400).json(errore);
  }
};
const Forget_Password = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const resetcode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedResetCode = crypto
      .createHash("sha256")
      .update(resetcode)
      .digest("hex");
    //console.log(resetcode, "reset code", hashedResetCode);
    user.passwordResetcode = hashedResetCode;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    user.passwordResetVerified = false;
    await user.save();
    const message = `HI ${user.name},\n We recived a request to rest the password on your Artissan Account.\n ${resetcode} \n Enter this code to complete the reset.\n
  Thanks for helping us keep your account secure. \n The Artissan Website Team`;
    await sendEmail({
      email: user.email,
      subject: "our password reset code (valide for 10 min)",
      message,
    });
    res.status(200).json({
      success: true,
      message: "Password reset code sent to your email",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const logout_Post = async (req, res) => {
  try {
    // Clear the JWT cookie by setting it to expire immediately
    res.cookie("jwt", "", { 
      httpOnly: true, 
      expires: new Date(0),
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Error during logout" });
  }
};

module.exports = {
  signup_Post,
  login_Post,
  login_admine,
  Forget_Password,
  logout_Post,
};
