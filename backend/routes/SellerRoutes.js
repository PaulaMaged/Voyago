import express from "express";
const router = express.Router();
import SellerController from "../controllers/SellerController.js";
import upload from "../middlewares/uploadMiddleware.js";
// ==============================================
//                Seller Routes
// ==============================================

// Create a Seller
router.post("/create-seller", upload.single('upFile'), SellerController.createSeller);

// Get Seller
router.get("/get-seller/:sellerId", SellerController.getSeller);

// Get Seller by userId
router.get("/get-seller-by-userId/:userId", SellerController.getSellerByUserId);

// Get Products by Seller ID
router.get(
  "/get-products-belonging-to-seller/:sellerId",
  SellerController.getProductsBelongingToSeller
);

// Update Seller by ID
router.put("/update-seller/:sellerId", SellerController.updateSeller);

// Delete Seller by ID
router.delete("/delete-seller/:sellerId", SellerController.deleteSeller);

// ==============================================
//                Product Routes
// ==============================================

// Create a Product
router.post("/create-product", SellerController.createProduct);

// Get All Products
router.get("/get-all-products", SellerController.getAllProducts);

// Get Product by ID
router.get("/get-product/:productId", SellerController.getProduct);

// Update Product by ID
router.put("/update-product/:productId", SellerController.updateProduct);

// Delete Product by ID
router.delete("/delete-product/:productId", SellerController.deleteProduct);

export default router;
