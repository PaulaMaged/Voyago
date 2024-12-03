// routes/wishlist.js
import express from "express";
import Wishlist from "../models/wishlist.js";
import Product from "../models/Product.js";

const router = express.Router();

// GET /api/wishlist - Retrieve all items in the user's wishlist
router.get("/", async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne().populate("products");
    if (!wishlist) {
      // If no wishlist exists, return an empty wishlist
      return res.json({ products: [] });
    }
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// POST /api/wishlist/add - Add a product to the wishlist
router.post("/add", async (req, res) => {
  const { productId } = req.body;
  try {
    // Validate product existence
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let wishlist = await Wishlist.findOne();
    if (!wishlist) {
      // Create new wishlist if none exists
      wishlist = new Wishlist({ products: [productId] });
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
router.post("/remove", async (req, res) => {
  const { productId } = req.body;
  try {
    let wishlist = await Wishlist.findOne();
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

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

