import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

/**
 * Add an item to the cart.
 */
const addItemToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // Validate product existence
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find or create a cart for the user
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Check if the product is already in the cart
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex > -1) {
      // Update quantity if product exists in cart
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Add new product to cart
      cart.items.push({ product: productId, quantity });
    }

    // Save the cart
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Remove an item from the cart.
 */
const removeItemFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    // Find the user's cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Remove the product from the cart
    cart.items = cart.items.filter(item => item.product.toString() !== productId);

    // Save the updated cart
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Change the quantity of an item in the cart.
 */
const updateItemQuantityInCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // Find the user's cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the product in the cart and update its quantity
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
      res.status(200).json(cart);
    } else {
      res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  addItemToCart,
  removeItemFromCart,
  updateItemQuantityInCart,
}; 