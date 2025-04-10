const express = require("express");
const User = require("../model/user");
const Post = require("../model/post");
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
const Update_User_Controller = async (req, res) => {
  const { userId } = req.params;
  const { name, password, bio } = req.body;
  const profilePicture = req.file;
  console.log(req.body);
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const Updatefields = {};
    if (name) {
      Updatefields.name = name;
    }
    if (password) {
      Updatefields.password = password;
    }
    // if (profilePicture) {
    // Updatefields.profilePicture = profilePicture;
    // }
    if (bio) {
      Updatefields.bio = bio;
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { Updatefields },
      { new: true }
    );

    //console.log(updatedUser);
    res.status(200).json(updatedUser);
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
    res.status(200).json({ message: " user Unfollow success !!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
module.exports = {
  Get_User_Controller,
  Update_User_Controller,
  follow_Post_Controller,
  unfollow_Post_Controller,
};
