const express = require("express");
const User = require("../model/user");
const Post = require("../model/post");
const { upload } = require("../utils/cloudinaryConfig");
const cloudinary = require("cloudinary").v2;
const { extractPublicId } = require("../helper/helper");
const bcrypt = require("bcrypt");
const Get_User_Controller = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).lean();
    console.log(user);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const { password, _id, createdAt, ...data } = user;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
const Update_user_profile = async (req, res) => {
  const { userId } = req.params;
  const profile_pictures = req.file;
  const { name, bio } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const imagesIds = [];
    if (user.profilePicture) {
      const publicId = extractPublicId(user.profilePicture);
      if (publicId) imagesIds.push(publicId);
    }
    await cloudinary.uploader.destroy(imagesIds);
    const uploadres = await cloudinary.uploader.upload(profile_pictures.path, {
      folder: "profile_pictures",
    });
    const imageUrl = uploadres.secure_url;
    await User.findByIdAndUpdate(
      userId,
      { profilePicture: imageUrl, name, bio },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Profile picture updated successfully!", user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const Update_User_Controller = async (req, res) => {
  const { userId } = req.params;
  const { email, password } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { email, password },
      { new: true }
    );

    res.status(200).json({ success: true, user: updatedUser });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
const follow_Post_Controller = async (req, res) => {
  const { userId } = req.params;
  const { _id } = req.body;

  try {
    if (userId === _id) {
      return res.status(500).json({ message: "You can not follow yourself" });
    }

    const userToFollow = await User.findById(userId);
    const loggedInUser = await User.findById(_id);

    if (!userToFollow || !loggedInUser) {
      return res.status(404).json({ message: "User not found!" });
    }
    if (loggedInUser.followings.includes(userId)) {
      return res.status(400).json({ message: "Already following this user!" });
    }

    loggedInUser.followings.push(userId);
    userToFollow.followers.push(_id);
    await loggedInUser.save();
    await userToFollow.save();

    res.status(200).json({ message: "Successfully followed user!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
const unfollow_Post_Controller = async (req, res) => {
  const { userId } = req.params;
  const { _id } = req.body;
  try {
    await User.findByIdAndUpdate(
      userId,
      {
        $pull: { followers: _id },
      },
      { new: true }
    );
    await User.findByIdAndUpdate(
      _id,
      {
        $pull: { followings: userId },
      },
      { new: true }
    );
    res.status(200).json({ message: " user Unfollow success !!", updatedUser });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
module.exports = {
  Get_User_Controller,
  Update_User_Controller,
  follow_Post_Controller,
  unfollow_Post_Controller,
  Update_user_profile,
};
