import express from "express";
import CartController from "../controllers/CartController.js";

const router = express.Router();

router.post("/cart/add", CartController.addItemToCart);
router.post("/cart/remove", CartController.removeItemFromCart);
router.post("/cart/update", CartController.updateItemQuantityInCart);

export default router; 