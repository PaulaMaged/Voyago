import express from 'express';
import OrderController from '../controllers/OrderController.js';

const router = express.Router();

// Existing routes
router.get('/tourist/:touristId', OrderController.getOrdersByTourist);
router.get('/details/:orderId', OrderController.getOrderDetails);
router.post('/cancel/:orderId', OrderController.cancelOrder);

// Add these routes for addresses
router.post('/tourist-addresses/:touristId', OrderController.addDeliveryAddress);
router.get('/tourist-addresses/:touristId', OrderController.getDeliveryAddresses);

// Checkout route
router.post('/checkout', OrderController.checkoutOrder);

export default router;