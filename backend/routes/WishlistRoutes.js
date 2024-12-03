// routes/wishlist.js
import express from "express";
import { addToWishlist, removeFromWishlist, getWishlist } from '../controllers/WishlistController.js';

const router = express.Router();

router.post('/add', addToWishlist);
router.delete('/:userId/:itemId', removeFromWishlist);
router.get('/:userId', getWishlist);

export default router;

