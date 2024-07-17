import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
// import Department from "../models/departmentModel.js";

const registerUser = asyncHandler(async (req, res) => {
  const { name, phoneNumber, email, role, password } = req.body;

  try {
    // Check for existing user
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new Error("User already exists"); // Or a more descriptive error message
    }

    // Create user
    const user = await User.create({
      name,
      phoneNumber,
      email,
      password,
      role,
    });

    if (user) {
      // Generate JWT token
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "30d", // Set expiry time for the token (e.g., 1 day)
      });

      res.status(201).json({ token, user }); // Send back token and sanitized user info (201 for created resource)
    } else {
      throw new Error("Failed to create user"); // Or a more specific error message
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message }); // Send back a user-friendly error message
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate user input
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide email and password" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // Compare password
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // Generate JWT token (replace with your secret key)
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d", // Set expiry time for the token (e.g., 1 day)
  });

  res.status(200).json({ token, user }); // Send back token and sanitized user info
});

const logOutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logout successful" });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password"); // Exclude password

  res.status(200).json(users);
});

const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, phoneNumber, email, role } = req.body;

  // Find user by ID and update relevant fields
  const user = await User.findByIdAndUpdate(
    id,
    {
      name,
      phoneNumber,
      email,
      role,
    },
    { new: true, runValidators: true }
  ); // Return updated user and run validation

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json(user);
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findByIdAndDelete(id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({ message: "User deleted successfully" });
});

export {
  loginUser,
  registerUser,
  logOutUser,
  getAllUsers,
  updateUser,
  deleteUser,
};
