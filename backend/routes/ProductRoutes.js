import { Router } from 'express';
import ProductController from '../controllers/ProductController';
import upload from '../middlewares/uploadMiddleware';

const router = Router();

// Archive/unarchive a product
router.put('/products/:productId/archive', ProductController.archiveProduct);
router.put('/products/:productId/unarchive', ProductController.unarchiveProduct);

// Retrieve all products sales and quantity
router.get('/products/sales-and-quantity', ProductController.getAllProductsSalesAndQuantity);

// Retrieve a single product sales and quantity
router.get('/products/:productId/sales-and-quantity', ProductController.getSingleProductSalesAndQuantity);

// Upload a product image
router.post('/products/:productId/upload-image', upload.single('image'), ProductController.uploadProductImage);

export default router;