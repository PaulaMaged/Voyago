import User from "../models/User.js";
import DeletionRequest from "../models/DeletionRequest.js";
import Advertiser from "../models/Advertiser.js";
import Seller from "../models/Seller.js";
import Admin from "../models/Admin.js";
import TourGovernor from "../models/TourGovernor.js";
import TourGuide from "../models/TourGuide.js";
import Tourist from "../models/Tourist.js";
import bcrypt from "bcrypt";
import createToken from "../Data/cookiesArr.js";
import { get } from "http";
import { match } from "assert";
import { sendNotificationEmail } from "./mailer.js";

const createUser = async (req, res) => {
  try {
    const payload = req.body;
    const existingUser = await User.findOne({ email: payload.email });
    const existingUsername = await User.findOne({ username: payload.username });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    } else if (existingUsername) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const salt = await bcrypt.genSalt();
    const userRole = payload.role || "user";
    const hashedPassword = await bcrypt.hash(payload.password, salt);
    payload.password = hashedPassword;
    const newUser = new User({ ...payload, role: userRole });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getUserPassword = async (req, res) => {
  try {
    // Retrieve the user with the provided ID from the database
    const { currentPassword } = req.query;
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log(currentPassword);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    console.log(isMatch);

    // If the user does not exist, return a 404 error response

    // Return a 200 success response with the user's password
    if (isMatch) res.status(200).json({ password: user.password });
    else res.status(400).json({ message: "Current password is incorrect" });
  } catch (error) {
    // Catch any errors that occur during the process and return a 400 error response with the error message
    res.status(400).json({ message: error.message });
  }
};

// Function to handle changing a user's password
const changePassword = async (req, res) => {
  try {
    // Extract user ID, current password, and new password from the request body

    const { currentPassword, newPassword } = req.body;
    // Retrieve the user with the provided ID from the database
    const user = await User.findById(req.params.userId);

    // If the user does not exist, return a 404 error response
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check the format of the new password for security
    if (newPassword.length < 7) {
      return res
        .status(400)
        .json({ message: "New password must be at least 8 characters long" });
    }

    // Compare the provided current password with the user's actual password using bcrypt's compare method

    // If the passwords do not match, return a 400 error response

    // Update the user's password with the new one
    const salt = await bcrypt.genSalt();

    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;

    // Save the changes to the user object in the database
    await user.save();
    console.log(newPassword);
    console.log(user);

    // Return a 200 success response with a message confirming the password change
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    // Catch any errors that occur during the process and return a 400 error response with the error message
    res.status(400).json({ message: error.message });
  }
};

const createDeletionRequest = async (req, res) => {
  try {
    const { userId } = req.params;
    const reason = req.body.reason;

    // Retrieve the user with the provided ID from the database
    const user = await User.findById(userId);

    // If the user does not exist, return a 404 error response
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create a deletion request for this user
    const deletionRequest = new DeletionRequest({
      userId: user._id,
      reason,
    });

    await deletionRequest.save();

    // Return a 201 success response with the created deletion request
    res.status(201).json(deletionRequest);
  } catch (error) {
    // Catch any errors that occur during the process and return a 400 error response with the error message
    res.status(400).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ is_accepted: true });
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Retrieve the user with the provided ID from the database
    const user = await User.findById(userId);

    // If the user does not exist, return a 404 error response
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete any related schemas that reference this user
    await Promise.all([
      Tourist.findOneAndDelete({ user: user._id }),
      TourGuide.findOneAndDelete({ user: user._id }),
      Advertiser.findOneAndDelete({ user: user._id }),
      TourGovernor.findOneAndDelete({ user: user._id }),
      Seller.findOneAndDelete({ user: user._id }),
      Admin.findOneAndDelete({ user: user._id }),
    ]);

    // Delete the user from the database
    await User.findByIdAndDelete(user._id);

    // Return a 200 success response with a message confirming the deletion
    res
      .status(200)
      .json({ message: "User and related data deleted successfully" });
  } catch (error) {
    // Catch any errors that occur during the process and return a 400 error response with the error message
    res.status(400).json({ message: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Retrieve the user with the provided ID from the database
    const user = await User.findById(userId);

    // If the user does not exist, return a 404 error response
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return a 200 success response with the user object
    res.status(200).json(user);
  } catch (error) {
    // Catch any errors that occur during the process and return a 400 error response with the error message
    res.status(400).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const payload = req.body;

    // Retrieve the user with the provided ID from the database
    const user = await User.findById(userId);

    // If the user does not exist, return a 404 error response
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the new email already exists in the database
    if (payload.email && payload.email !== user.email) {
      const existingUser = await User.findOne({ email: payload.email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    user.set({ ...payload });

    // If userRole is not defined, return an error
    if (!user.role && payload.role) {
      user.role = payload.role;
    }

    // Save the changes to the user object in the database
    await user.save();

    // Return a 200 success response with a message confirming the update
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    // Catch any errors that occur during the process and return a 400 error response with the error message
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const role = user.role;
    console.log("User role:", role);

    if (user.is_accepted === true && user.terms_and_conditions === false) {
      return res.status(201).json({
        message: "Please accept the terms and conditions",
        userId: user._id,
      });
    }

    const token = createToken({ username, role });
    let responseData = { token, user };

    // Make sure these property names match exactly with the frontend roleKeyMap
    switch (role) {
      case "TOURIST":
        const tourist = await Tourist.findOne({ user: user._id });
        responseData.tourist = tourist;
        break;
      case "TOUR_GUIDE":
        const tourGuide = await TourGuide.findOne({ user: user._id });
        responseData.tour_guide = tourGuide; // Changed from tourguide to tour_guide
        break;
      case "ADVERTISER":
        const advertiser = await Advertiser.findOne({ user: user._id });
        responseData.advertiser = advertiser;
        break;
      case "TOUR_GOVERNOR":
        const tourGovernor = await TourGovernor.findOne({ user: user._id });
        responseData.tour_governor = tourGovernor; // Changed from tourgovernor to tour_governor
        break;
      case "SELLER":
        const seller = await Seller.findOne({ user: user._id });
        responseData.seller = seller;
        break;
      case "ADMIN":
        const admin = await Admin.findOne({ user: user._id });
        responseData.admin = admin;
        break;
      default:
        return res.status(400).json({ message: "Invalid role" });
    }

    // Log the response data to verify the structure
    console.log("Response data being sent:", responseData);
    res.status(200).json(responseData);
  } catch (error) {
    console.error("Login error:", error);
    res.status(400).json({ message: error.message });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("jwt", { httpOnly: true });
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getNewUsers = async (req, res) => {
  try {
    const users = await User.find({ is_accepted: false, is_new: true });
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const sendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ message: "No user found with this email." });
    }

    // Generate OTP (6-digit random number)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set OTP expiration (e.g., 10 minutes)
    const otpExpiration = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Save OTP and expiration time in the user document
    user.otp = otp;
    user.otpExpiration = otpExpiration;
    await user.save();

    // Send OTP to the user's email

    const otpMessage = `Your OTP code is: ${otp} and it will expire in ${otpExpiration}minutes.`;
    await sendNotificationEmail("Number1bos@hotmail.com", otpMessage);
    return res.status(200).json({ message: "OTP sent to your email." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({
      email,
      otp,
      otpExpiration: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user's password and clear OTP fields
    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpiration = undefined;
    await user.save();

    return res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};

export default {
  verifyOtp,
  sendOtp,
  getNewUsers,
  changePassword,
  createDeletionRequest,
  createUser,
  getAllUsers,
  deleteUser,
  updateUser,
  getUser,
  login,
  getUserPassword,
  logout,
};
