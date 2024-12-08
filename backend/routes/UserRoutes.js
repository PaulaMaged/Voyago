import express from "express";
const router = express.Router();

import UserController from "../controllers/UserController.js";

// Create User Route
router.post("/create-user", UserController.createUser);

router.post("/send-email", UserController.sendEmail);

// ================================= {{
// User Update and Delete Routes
// ================================= {{

//user get password
router.get("/get-user-password/:userId", UserController.getUserPassword);

// Change Password Route
router.put("/change-password/:userId", UserController.changePassword);

// Update User Route
router.put("/update-user/:userId", UserController.updateUser);

// Delete User Route
router.delete("/delete-user/:userId", UserController.deleteUser);

// ================================= {{
// User Retrieval Routes
// ================================= {{

// Get All Users Route
router.get("/get-all-users", UserController.getAllUsers);

// Get User Route
router.get("/get-user/:userId", UserController.getUser);

//Get new users
router.get("/get-new-users", UserController.getNewUsers);

router.post("/login", UserController.login);
// ================================= {{
// User Request Routes
// ================================= {{

// Create Deletion Request Route
router.post(
  "/create-delete-request/:userId",
  UserController.createDeletionRequest
);

router.post("/otp", UserController.sendOtp);
router.post("/verify-otp", UserController.verifyOtp);

router.get("/logout", UserController.logout);

export default router;
