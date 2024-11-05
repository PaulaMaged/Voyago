import User from "../models/User.js";
import DeletionRequest from "../models/DeletionRequest.js";

const createUser = async (req, res) => {
  try {
    const payload = req.body;
    const existingUser = await User.findOne({ email: payload.email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }
    const userRole = payload.role || "user";
    const newUser = new User({ ...payload, role: userRole });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Function to handle changing a user's password
const changePassword = async (req, res) => {
  try {
    // Extract user ID, current password, and new password from the request body
    const { userId, currentPassword, newPassword } = req.body;

    // Retrieve the user with the provided ID from the database
    const user = await User.findById(userId);

    // If the user does not exist, return a 404 error response
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check the format of the new password for security
    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ message: "New password must be at least 8 characters long" });
    }

    // Compare the provided current password with the user's actual password using bcrypt's compare method
    const isMatch = currentPassword === user.password;

    // If the passwords do not match, return a 400 error response
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Update the user's password with the new one
    user.password = newPassword;

    // Save the changes to the user object in the database
    await user.save();

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

export default { Register, changePassword, createDeletionRequest, createUser };
