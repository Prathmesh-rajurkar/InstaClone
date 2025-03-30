import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { response } from "express";
import jwt from "jsonwebtoken";

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

    const user = await User.findOne({ email });
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
        _id:user._id,
        username:user.username,
        email:user.email,
        profilePicture:user.profilePicture,
        bio:user.bio,
        followers:user.followers,
        followings:user.followings,
        posts:user.posts,
    }

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
        user
      });
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req, res) => {
    try {
        return response.clearCookie("token").status(200).json({
            message:"Logged out successfully",
            success:true
        })
    }
    catch(error){
        console.log(error);
    }
}

export const getProfile = async (req,res) => {
    try {
        const userId = req.params.id;
        let user = await User.findById(userId);
        return res.status(200).json({
            message:"User found",
            success:true,
            user
        })
    } catch (error) {
        console.log(error);
    }
}

export const editProfile = async(req,res) => {
    try {
        const userId =req.id;
    } catch (error) {
        console.log(error);
        
    }
}