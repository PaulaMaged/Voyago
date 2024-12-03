// routes/wishlist.js
import express from "express";
import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";

const router = express.Router();

// Middleware to authenticate user (Assuming you have an auth middleware)
import { authenticateUser } from "../middleware/auth.js";

// GET /api/wishlist - Retrieve all items in the user's wishlist
router.get("/", authenticateUser, async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate("products");
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, products: [] });
      await wishlist.save();
    }
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// POST /api/wishlist/add - Add a product to the wishlist
router.post("/add", authenticateUser, async (req, res) => {
  const { productId } = req.body;
  try {
    // Validate product existence
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, products: [productId] });
    } else {
      if (wishlist.products.includes(productId)) {
        return res.status(400).json({ message: "Product already in wishlist" });
      }
      wishlist.products.push(productId);
    }
    await wishlist.save();
    res.json({ message: "Product added to wishlist", wishlist });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// POST /api/wishlist/remove - Remove a product from the wishlist
router.post("/remove", authenticateUser, async (req, res) => {
  const { productId } = req.body;
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) return res.status(404).json({ message: "Wishlist not found" });

    if (!wishlist.products.includes(productId)) {
      return res.status(400).json({ message: "Product not in wishlist" });
    }

    wishlist.products.pull(productId);
    await wishlist.save();
    res.json({ message: "Product removed from wishlist", wishlist });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

export default router;

