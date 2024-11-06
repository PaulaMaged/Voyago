
import ProductController from "../controllers/ProductController";
import upload from "../middlewares/uploadMiddleware";

const router = Router();

// Archive a product
router.patch("/archive-product/:productId", ProductController.archiveProduct);

// Unarchive a product
router.patch(
"/unarchive-product/:productId/unarchive",
  ProductController.unarchiveProduct
);

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

// Upload a product image
router.post(
  "/upload-product-image/:productId",
  upload.single("image"),
  ProductController.uploadProductImage
);

// Create a product
router.post("/create-product", ProductController.createProduct);

// Retrieve all products
router.get("/retrieve-all-products", ProductController.getAllProducts);

// Retrieve a product by ID
router.get("/retrieve-product-by-id/:id", ProductController.getProductById);

// Update a product by ID
router.put("/update-product-by-id/:id", ProductController.updateProductById);

// Delete a product by ID
router.delete("/delete-product-by-id/:id", ProductController.deleteProductById);

export default router;
