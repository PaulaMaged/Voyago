import ProductController from "../controllers/ProductController";
import upload from "../middlewares/uploadMiddleware";

const router = Router();

// Archive a product
router.patch("/products/:productId/archive", ProductController.archiveProduct);

// Unarchive a product
router.patch(
  "/products/:productId/unarchive",
  ProductController.unarchiveProduct
);

// Retrieve all products sales and quantity
router.get(
  "/products/sales-and-quantity",
  ProductController.getAllProductsSalesAndQuantity
);

// Retrieve a single product sales and quantity
router.get(
  "/products/:productId/sales-and-quantity",
  ProductController.getSingleProductSalesAndQuantity
);

// Upload a product image
router.post(
  "/products/:productId/upload-image",
  upload.single("image"),
  ProductController.uploadProductImage
);

// Create a Product
router.post("/products", ProductController.createProduct);

// Get All Products
router.get("/products", ProductController.getAllProducts);

// Get Product by ID
router.get("/products/:id", ProductController.getProductById);

// Update Product by ID
router.put("/products/:id", ProductController.updateProductById);

// Delete Product by ID
router.delete("/products/:id", ProductController.deleteProductById);

export default router;
