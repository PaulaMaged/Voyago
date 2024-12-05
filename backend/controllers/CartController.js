import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Tourist from "../models/Tourist.js";

/**
 * Add an item to the cart.
 * @route POST /api/cart/:touristId/:productId
 */
const addItemToCart = async (req, res) => {
  try {
    const { touristId, productId } = req.params;
    const { quantity } = req.body;

    // Validate tourist existence
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Validate product existence
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find or create a cart for the tourist
    let cart = await Cart.findOne({ tourist: touristId });
    if (!cart) {
      cart = new Cart({ tourist: touristId, items: [] });
    }

    // Check if the product is already in the cart
    const itemIndex = cart.items.findIndex(item => 
      item.product.toString() === productId
    );

    if (itemIndex > -1) {
      // Update quantity if product exists in cart
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Add new product to cart
      cart.items.push({ product: productId, quantity });
    }

    // Save the cart
    await cart.save();
    
    // Populate the product details before sending response
    await cart.populate('items.product');
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Remove an item from the cart.
 * @route DELETE /api/cart/:touristId/:productId
 */
const removeItemFromCart = async (req, res) => {
  try {
    const { touristId, productId } = req.params;

    // Validate tourist existence
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Find the tourist's cart
    const cart = await Cart.findOne({ tourist: touristId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Remove the product from the cart
    cart.items = cart.items.filter(item => 
      item.product.toString() !== productId
    );

    // Save the updated cart
    await cart.save();
    
    // Populate the product details before sending response
    await cart.populate('items.product');
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get cart contents
 * @route GET /api/cart/:touristId
 */
const getCart = async (req, res) => {
  try {
    const { touristId } = req.params;

    // Validate tourist existence
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Find the cart and populate product details
    const cart = await Cart.findOne({ tourist: touristId })
      .populate('items.product');

    if (!cart) {
      return res.status(200).json({ tourist: touristId, items: [] });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    const { touristId } = req.params;

    // Validate tourist existence
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Find and update the cart
    const cart = await Cart.findOne({ tourist: touristId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Clear all items
    cart.items = [];
    await cart.save();
    
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  addItemToCart,
  removeItemFromCart,
  getCart,
  clearCart
}; 