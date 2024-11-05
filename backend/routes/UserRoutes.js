import express from "express";
const router = express.Router();

import UserController from "../controllers/UserController.js";

// Define routes for user actions
router.post("/create-user", UserController.createUser);
router.put("/change-password/:userId", UserController.changePassword); // Using PUT method for changing password
router.put("/update-user/:userId", UserController.updateUser);
router.get("/get-all-users", UserController.getAllUsers);
router.delete("/delete-user/:userId", UserController.deleteUser);
router.get("/get-user/:userId", UserController.getUser);
router.post(
  "/create-delete-request/:userId",
  UserController.createDeletionRequest
);

export default router;
