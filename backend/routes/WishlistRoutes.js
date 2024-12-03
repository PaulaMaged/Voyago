// routes/wishlist.js
import express from "express";
import Wishlist from "../models/wishlist.js";
import Product from "../models/Product.js";

const router = express.Router();

// GET /api/wishlist/:touristId
router.get("/:touristId", async (req, res) => {
  try {
    const { touristId } = req.params;
    let wishlist = await Wishlist.findOne({ tourist: touristId }).populate("items.itemId");
    if (!wishlist) {
      return res.json({ items: [] });
    }
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// POST /api/wishlist/:touristId/:productId
router.post("/:touristId/:productId", async (req, res) => {
  try {
    const { touristId, productId } = req.params;
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let wishlist = await Wishlist.findOne({ tourist: touristId });
    if (!wishlist) {
      wishlist = new Wishlist({ 
        tourist: touristId, 
        items: [{ itemId: productId, itemType: 'Product' }] 
      });
    } else {
      const itemExists = wishlist.items.some(
        item => item.itemId.toString() === productId && item.itemType === 'Product'
      );
      if (itemExists) {
        return res.status(400).json({ message: "Product already in wishlist" });
      }
      wishlist.items.push({ itemId: productId, itemType: 'Product' });
    }
    
    await wishlist.save();
    res.json({ message: "Product added to wishlist", wishlist });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// DELETE /api/wishlist/:touristId/:productId
router.delete("/:touristId/:productId", async (req, res) => {
  try {
    const { touristId, productId } = req.params;
    
    let wishlist = await Wishlist.findOne({ tourist: touristId });
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.items = wishlist.items.filter(
      item => !(item.itemId.toString() === productId && item.itemType === 'Product')
    );
    
    await wishlist.save();
    res.json({ message: "Product removed from wishlist", wishlist });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

export default router;

