import {User} from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { response } from "express";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { log } from "console";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Please fill in all fields",
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "Try different email",
        success: false,
      });
    }
    await User.create({ username, email, password: hashedPassword });
    return res.status(201).json({
      message: "Account created successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Please fill in all fields",
        success: false,
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
        success: false,
      });
    }

    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      followings: user.followings,
      posts: user.posts,
    };

    const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 100,
      })
      .status(200)
      .json({
        message: `Logged in successfully as ${user.username}`,
        success: true,
        user,
      });
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req, res) => {
  try {
    return res.clearCookie("token").status(200).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    let user = await User.findById(userId).select('-password');
    return res.status(200).json({
      message: "User found",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    console.log(req.id,req.body);
    const { bio, gender } = req.body;
    const profilePicture = req.file;
    let cloudResponse;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
        success: false,
      });
    }
    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }
    
    if (bio) {
      user.bio = bio;
    }
    if (gender) user.gender = gender;
    if (profilePicture) user.profilePicture = cloudResponse.secure_url;

    await user.save();

    return res.status(200).json({
      message: "Profile Updated",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getSuggestedUser = async (req, res) => {
  try {
    const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select(
      "-password"
    );
    if (!suggestedUsers) {
      return res.status(402).json({
        message: "Currently no user found",
        success: false,
      });
    }
    return res.status(200).json({
      success: true,
      suggestedUsers,
    });
  } catch (error) {
    console.log(error);
  }
};

export const followOrUnfollow = async (req, res) => {
  try {
    const loggedInUserID = req.id;
    const targetUserID = req.params.id;
    if (loggedInUserID == targetUserID) {
      return res.status(400).json({
        message: "You cannot follow yourself",
        success: false,
      });
    }

    const loggedInUser = await User.findById(loggedInUserID);
    const targetUser = await User.findById(targetUserID);

    if (!loggedInUser || !targetUser) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    // now check wheather to follow or unfollow
    const isFollowing = loggedInUser.followings.includes(targetUserID);
    if (isFollowing){
      // unfollow logic
      await Promise.all([
        User.updateOne({_id:loggedInUserID},{$pull:{followings:targetUserID}}),
        User.updateOne({_id:targetUserID},{$pull:{followers:loggedInUserID}}),
      ])
      return res.status(200).json({
        message:`Unfollowed ${targetUser.username}`,
        success:true,
      })
    }else {
      // follow logic
      await Promise.all([
        User.updateOne({_id:loggedInUserID},{$push:{followings:targetUserID}}),
        User.updateOne({_id:targetUserID},{$push:{followers:loggedInUserID}}),
      ])
      return res.status(200).json({
        message:`Followed ${targetUser.username}`,
        success:true,
      })
    }
  } catch (error) {
    console.log(error);
  }
};
