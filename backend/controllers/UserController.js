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

    // Delete the user from the database
    await User.findByIdAndDelete(user._id);

    // Return a 200 success response with a message confirming the deletion
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    // Catch any errors that occur during the process and return a 400 error response with the error message
    res.status(400).json({ message: error.message });
  }
}; //el klam dah eye klam , m7tag efham el booked scheams wa el 7agt el taniya

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
    // Retrieve the user with the provided email from the database
    console.log(username);
    const user = await User.findOne({ username });
    // If the user does not exist, return a 404 error response
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Compare the provided password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(password, user.password);
    // If the passwords do not match, return a 401 error response
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const role = user.role;
    // Generate a JSON Web Token (JWT) for the authenticated user
    if (
      user.is_accepted === true &&
      user.is_new === false &&
      user.terms_and_conditions === false
    ) {
      return res.status(201).json({
        message: "Please accept the terms and conditions",
        userId: user._id,
      });
    }
    const token = createToken({ username, role });

    switch (role) {
      case "TOURIST":
        const tourist = await Tourist.findOne({ user: user._id });
        res.status(200).json({ token, user, tourist });
        break;
      case "TOUR_GUIDE":
        const tourGuide = await TourGuide.findOne({ user: user._id });
        res.status(200).json({ token, user, tourGuide });
        break;
      case "ADVERTISER":
        const advertiser = await Advertiser.findOne({ user: user._id });
        res.status(200).json({ token, user, advertiser });
        break;
      case "TOUR_GOVERNOR":
        const tourGovernor = await TourGovernor.findOne({ user: user._id });
        res.status(200).json({ token, user, tourGovernor });
        break;
      case "SELLER":
        const seller = await Seller.findOne({ user: user._id });
        res.status(200).json({ token, user, seller });
        break;
      case "ADMIN":
        const admin = await Admin.findOne({ user: user._id });
        res.status(200).json({ token, user, admin });
        break;
    }
  } catch (error) {
    // Catch any errors that occur during the process and return a 400 error response with the error message
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

export default {
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
