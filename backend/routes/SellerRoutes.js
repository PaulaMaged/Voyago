import express from "express";
const router = express.Router();
import SellerController from "../controllers/SellerController.js";

// Create a Seller
router.post("/sellers", SellerController.createSeller);

// Get Sellers by User ID
router.get("/sellers/user/:userId", SellerController.getSellersByUserId);

// Get Products by Seller ID
router.get("/sellers/:sellerId/products", SellerController.getProductsBelongingToSeller);

// Update Seller by ID
router.put("/sellers/:id", SellerController.updateSellerById);

// Delete Seller by ID
router.delete("/sellers/:id", SellerController.deleteSellerById);

export default router;
