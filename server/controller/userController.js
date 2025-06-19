const express = require("express");
const User = require("../model/user");
const Post = require("../model/post");
const jwt = require("jsonwebtoken");
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

    let imageUrl = user.profilePicture; // Keep existing image by default

    // Only handle image upload if a new file is provided
    if (profile_pictures) {
      // Try to delete old image if it exists and is a Cloudinary URL
      if (user.profilePicture && user.profilePicture.includes("cloudinary")) {
        try {
          const publicId = extractPublicId(user.profilePicture);
          if (publicId) {
            await cloudinary.uploader.destroy(publicId);
          }
        } catch (cloudinaryError) {
          console.error("Error deleting old profile picture:", cloudinaryError);
          // Continue with the update even if deletion fails
        }
      }

      // Upload new image
      try {
        const uploadres = await cloudinary.uploader.upload(
          profile_pictures.path,
          {
            folder: "profile_pictures",
          }
        );
        imageUrl = uploadres.secure_url;
      } catch (uploadError) {
        console.error("Error uploading new profile picture:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Failed to upload profile picture",
        });
      }
    }

    // Update user with new information
    const updateData = {
      name: name || user.name,
      bio: bio || user.bio,
    };

    // Only update profilePicture if we have a new one
    if (profile_pictures) {
      updateData.profilePicture = imageUrl;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Failed to update profile",
    });
  }
};

const Update_User_Controller = async (req, res) => {
  const { userId } = req.params;
  const { password, currentPassword } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Verify current password
    if (!currentPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Current password is required" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Current password is incorrect" });
    }

    // Update password
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { password },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Password update error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Failed to update password",
    });
  }
};
const follow_Post_Controller = async (req, res) => {
  const { userId } = req.params;
  const userToken = req.cookies.jwt;

  if (!userToken) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(userToken, "artissan web site", async (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    const loggedInUserId = decoded.id;

    if (userId === loggedInUserId) {
      return res.status(400).json({ message: "You can't follow yourself" });
    }

    const userToFollow = await User.findById(userId);
    const loggedInUser = await User.findById(loggedInUserId);

    if (!userToFollow || !loggedInUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (loggedInUser.followings.includes(userId)) {
      return res.status(400).json({ message: "Already following" });
    }

    loggedInUser.followings.push(userId);
    userToFollow.followers.push(loggedInUserId);
    await loggedInUser.save();
    await userToFollow.save();

    res.status(200).json({ message: "Successfully followed user" });
  });
};
const Get_User_Followers = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    const followers = await User.find({ _id: { $in: user.followers } });
    res.status(200).json({ success: true, count: followers.length, followers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const Get_User_followings = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    const followings = await User.find({ _id: { $in: user.followings } });
    res
      .status(200)
      .json({ success: true, count: followings.length, followings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
const unfollow_Post_Controller = async (req, res) => {
  const { userId } = req.params;
  const userToken = req.cookies.jwt;

  if (!userToken) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(userToken, "artissan web site", async (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    const loggedInUserId = decoded.id;

    if (userId === loggedInUserId) {
      return res.status(400).json({ message: "You can't unfollow yourself" });
    }

    const userToUnfollow = await User.findById(userId);
    const loggedInUser = await User.findById(loggedInUserId);

    if (!userToUnfollow || !loggedInUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove the relationship
    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => id.toString() !== loggedInUserId
    );
    loggedInUser.followings = loggedInUser.followings.filter(
      (id) => id.toString() !== userId
    );

    await userToUnfollow.save();
    await loggedInUser.save();

    res.status(200).json({ message: "Successfully unfollowed user" });
  });
};

const ContactList = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const contactIds = [...new Set([...user.followings, ...user.followers])];

    const contacts = await User.find({ _id: { $in: contactIds } });

    res.status(200).json(contacts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching contacts" });
  }
};
const length_user = async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.status(200).json({ success: true, count });
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
  ContactList,
  Get_User_Followers,
  Get_User_followings,
  length_user,
};
