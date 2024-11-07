import ProductController from "../controllers/ProductController";
import upload from "../middlewares/uploadMiddleware";
import Router from "express";

const router = Router();

// ====================================
// Product Archive and Unarchive Router
// ====================================
// Archive a product
router.patch("/archive-product/:productId", ProductController.archiveProduct);

// Unarchive a product
router.patch(
  "/unarchive-product/:productId/unarchive",
  ProductController.unarchiveProduct
);

// ====================================
// Product Sales and Quantity Router
// ====================================
// Retrieve all products sales and quantity
router.get(
  "/retrieve-all-products-sales-and-quantity",
  ProductController.getAllProductsSalesAndQuantity
);

// Retrieve a single product sales and quantity
router.get(
  "/retrieve-single-product-sales-and-quantity/:productId",
  ProductController.getSingleProductSalesAndQuantity
);

// ====================================
// Product Image Upload Router
// ====================================
// Upload a product image
router.post(
  "/upload-product-image/:productId",
  upload.single("image"),
  ProductController.uploadProductImage
);

// ====================================
// Product Creation and Retrieval Router
// ====================================
// Create a product
router.post("/create-product", ProductController.createProduct);

// Retrieve all products
router.get("/retrieve-all-products", ProductController.getAllProducts);

// Retrieve a product by ID
router.get("/retrieve-product-by-id/:id", ProductController.getProductById);

// ====================================
// Product Update and Deletion Router
// ====================================
// Update a product by ID
router.put("/update-product-by-id/:id", ProductController.updateProductById);

// Delete a product by ID
router.delete("/delete-product-by-id/:id", ProductController.deleteProductById);

// ====================================
// Order Creation and Management Router
// ====================================
// Create an order
router.post("/create-order", ProductController.createOrder);

// Retrieve all orders
router.get("/retrieve-all-orders", ProductController.getAllOrders);

// Retrieve an order by ID
router.get("/retrieve-order-by-id/:id", ProductController.getOrderById);

// Update an order by ID
router.put("/update-order-by-id/:id", ProductController.updateOrderById);

// Delete an order by ID
router.delete("/delete-order-by-id/:id", ProductController.deleteOrderById);

export default router;
