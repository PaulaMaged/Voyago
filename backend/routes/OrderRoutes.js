import express from "express";
import OrderController from "../controllers/OrderController.js";

const router = express.Router();

// Order management routes
router.get("/orders/:touristId", OrderController.getOrdersByTourist);
router.get("/orders/details/:orderId", OrderController.getOrderDetails);
router.post("/orders/cancel/:orderId", OrderController.cancelOrder);
router.post("/checkout", OrderController.checkoutOrder);

// Delivery address routes
router.post("/address/:touristId", OrderController.addDeliveryAddress);
router.get("/address/:touristId", OrderController.getDeliveryAddresses);

export default router; 