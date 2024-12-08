import express from "express";
import CartController from "../controllers/CartController.js";

const router = express.Router();

// Get cart contents
router.get("/:touristId", CartController.getCart);

// Add item to cart
router.post("/:touristId/:productId", CartController.addItemToCart);

// Remove item from cart
router.delete("/:touristId/:productId", CartController.removeItemFromCart);

// Add new route for clearing cart
router.delete("/:touristId", CartController.clearCart);

export default router; 