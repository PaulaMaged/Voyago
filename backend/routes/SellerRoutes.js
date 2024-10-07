import express from "express";
const router = express.Router();
import SellerController from "../controllers/SellerController.js";

// Create a Seller
router.post("/sellers", SellerController.createSeller);

// Get Sellers by User ID
router.get("/sellers/user/:userId", SellerController.getSellersByUserId);

// Get Products by Seller ID
router.get("/sellers/:Id", SellerController.getProductsBelongingToSeller);

// Update Seller by ID
router.put("/sellers/:id", SellerController.updateSellerById);

// Delete Seller by ID
router.delete("/sellers/:id", SellerController.deleteSellerById);

// Create a Product
router.post("/products", SellerController.createProduct);

// Get All Products
router.get("/products", SellerController.getAllProducts);

// Get Product by ID
router.get("/products/:id", SellerController.getProductById);

// Update Product by ID
router.put("/products/:id", SellerController.updateProductById);

// Delete Product by ID
router.delete("/products/:id", SellerController.deleteProductById);

export default router;
