// routes/wishlist.js
import express from "express";
import Wishlist from "../models/wishlist.js";
import Product from "../models/Product.js";

const router = express.Router();

// GET /api/wishlist/:userId - Get user's wishlist
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    let wishlist = await Wishlist.findOne({ user: userId }).populate("products");
    if (!wishlist) {
      return res.json({ products: [] });
    }
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// POST /api/wishlist/:userId/:productId - Add product to wishlist
router.post("/:userId/:productId", async (req, res) => {
  try {
    const { userId, productId } = req.params;
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, products: [productId] });
    } else if (wishlist.products.includes(productId)) {
      return res.status(400).json({ message: "Product already in wishlist" });
    } else {
      wishlist.products.push(productId);
    }
    
    await wishlist.save();
    res.json({ message: "Product added to wishlist", wishlist });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// DELETE /api/wishlist/:userId/:productId - Remove product from wishlist
router.delete("/:userId/:productId", async (req, res) => {
  try {
    const { userId, productId } = req.params;
    
    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId
    );
    
    await wishlist.save();
    res.json({ message: "Product removed from wishlist", wishlist });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

export default router;

