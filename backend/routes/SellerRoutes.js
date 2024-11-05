import express from "express";
const router = express.Router();
import SellerController from "../controllers/SellerController.js";

// Create a Seller
router.post("/create-seller", SellerController.createSeller);

// Get Sellers by User ID
router.get("/get-seller/:sellerId", SellerController.getSellersByUserId);

// Get Products by Seller ID
router.get(
  "/get-products-belonging-to-seller/:sellerId",
  SellerController.getProductsBelongingToSeller
);

// Update Seller by ID
router.put("/update-seller/:sellerId", SellerController.updateSellerById);

// Delete Seller by ID
router.delete("/delete-seller/:sellerId", SellerController.deleteSellerById);

// Create a Product
router.post("/create-product", SellerController.createProduct);

// Get All Products
router.get("/get-all-products", SellerController.getAllProducts);

// Get Product by ID
router.get("/get-product/:productId", SellerController.getProductById);

// Update Product by ID
router.put("/update-product/:productId", SellerController.updateProductById);

// Delete Product by ID
router.delete("/delete-product/:productId", SellerController.deleteProductById);

export default router;
