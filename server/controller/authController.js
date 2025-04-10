const express = require("express");
const User = require("../model/user");
const jwt = require("jsonwebtoken");
const { upload } = require("../utils/cloudinaryConfig");
const cloudinary = require("cloudinary").v2;
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
module.exports = {
  signup_Post,

  login_Post,
};
