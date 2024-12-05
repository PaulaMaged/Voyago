import express from "express";
const router = express.Router();
import SellerController from "../controllers/SellerController.js";
import upload from "../middlewares/uploadMiddleware.js";
import multer from "multer";
// ==============================================
//                Seller Routes
// ==============================================

// Create a Seller
router.post("/create-seller", (req, res) => {
  upload.single("upFile")(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      console.error("Multer Error:", err);
      return res.status(400).json({ error: err.message });
    } else if (err) {
      // An unknown error occurred when uploading.
      console.error("Unknown Error:", err);
      return res.status(400).json({ error: err.message });
    }

    // Everything went fine. Proceed with your controller logic.
    SellerController.createSeller(req, res);
  });
});

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
router.get("/get-all-seller-products/:sellerId",SellerController.getAllProductsBySeller);

// Get Product by ID
router.get("/get-product/:productId", SellerController.getProduct);

// Update Product by ID
router.put("/update-product/:productId", upload.array('images'), SellerController.updateProduct);

// Delete Product by ID
router.delete("/delete-product/:productId", SellerController.deleteProduct);

router.get('/product-orders/:productId', SellerController.getProductOrders);
router.get('/total-revenue/:sellerId', SellerController.getTotalRevenue);
router.get('/sales-report/:sellerId', SellerController.getSalesReportFiltered);

export default router;
