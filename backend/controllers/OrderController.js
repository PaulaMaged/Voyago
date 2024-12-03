import Order from "../models/Order.js";
import DeliveryAddress from "../models/DeliveryAddress.js";
import Cart from "../models/Cart.js";

const getOrdersByTourist = async (req, res) => {
  try {
    const { touristId } = req.params;
    const orders = await Order.find({ tourist: touristId })
      .populate('product')
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId)
      .populate('product')
      .populate('arrival_location');
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    // Only allow cancellation if order is recent (e.g., within 24 hours)
    const orderTime = new Date(order.createdAt).getTime();
    const currentTime = new Date().getTime();
    const hoursSinceOrder = (currentTime - orderTime) / (1000 * 60 * 60);
    
    if (hoursSinceOrder > 24) {
      return res.status(400).json({ message: "Orders can only be cancelled within 24 hours" });
    }
    
    order.status = "cancelled";
    await order.save();
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addDeliveryAddress = async (req, res) => {
  try {
    const { touristId } = req.params;
    const addressData = { ...req.body, tourist: touristId };
    
    if (addressData.isDefault) {
      // If this is a default address, remove default status from other addresses
      await DeliveryAddress.updateMany(
        { tourist: touristId },
        { $set: { isDefault: false } }
      );
    }
    
    const newAddress = new DeliveryAddress(addressData);
    await newAddress.save();
    res.status(201).json(newAddress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDeliveryAddresses = async (req, res) => {
  try {
    const { touristId } = req.params;
    const addresses = await DeliveryAddress.find({ tourist: touristId });
    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const checkoutOrder = async (req, res) => {
  try {
    const { touristId, addressId } = req.body;
    
    // Get cart items
    const cart = await Cart.findOne({ user: touristId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    
    // Verify delivery address
    const deliveryAddress = await DeliveryAddress.findById(addressId);
    if (!deliveryAddress) {
      return res.status(404).json({ message: "Delivery address not found" });
    }

    // Create orders for each cart item
    const orders = await Promise.all(cart.items.map(async (item) => {
      const order = new Order({
        tourist: touristId,
        product: item.product._id,
        quantity: item.quantity,
        arrival_location: addressId,
        description: `Order for ${item.product.name}`
      });
      return order.save();
    }));

    // Clear the cart
    cart.items = [];
    await cart.save();

    res.status(201).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  getOrdersByTourist,
  getOrderDetails,
  cancelOrder,
  addDeliveryAddress,
  getDeliveryAddresses,
  checkoutOrder
}; 