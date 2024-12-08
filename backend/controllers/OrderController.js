import Order from "../models/Order.js";
import DeliveryAddress from "../models/DeliveryAddress.js";
import Cart from "../models/Cart.js";
import Tourist from "../models/Tourist.js";
import Notification from "../models/Notification.js";
import Product from "../models/Product.js";

const getOrdersByTourist = async (req, res) => {
  try {
    const { touristId } = req.params;
    const orders = await Order.find({ tourist: touristId })
      .populate('product')
      .sort({ createdAt: -1 });

    // Update order statuses based on arrival time
    const updatedOrders = orders.map(order => {
      const arrivalDate = new Date(order.arrival_date).getTime();
      const currentTime = new Date().getTime();
      const hoursUntilArrival = (arrivalDate - currentTime) / (1000 * 60 * 60);

      if (hoursUntilArrival <= 24 && !order.status) {
        order.status = 'on the way';
        order.save(); // Save the updated status
      }
      return order;
    });

    res.status(200).json(updatedOrders);
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
    const order = await Order.findById(orderId).populate('product');
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if order is already cancelled
    if (order.status === 'cancelled') {
      return res.status(400).json({ message: "Order is already cancelled" });
    }

    // Calculate time until arrival
    const arrivalDate = new Date(order.arrival_date).getTime();
    const currentTime = new Date().getTime();
    const hoursUntilArrival = (arrivalDate - currentTime) / (1000 * 60 * 60);
    
    // Only allow cancellation if more than 24 hours until arrival
    if (hoursUntilArrival <= 24) {
      return res.status(400).json({ message: "Orders cannot be cancelled within 24 hours of arrival" });
    }

    // Calculate refund amount
    const refundAmount = order.product.price * order.quantity;

    // Find the tourist and update their wallet
    const tourist = await Tourist.findById(order.tourist);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Update tourist's wallet with refund
    tourist.wallet += refundAmount;
    await tourist.save();

    // Restore product quantity
    const product = await Product.findById(order.product._id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    product.available_quantity += order.quantity;
    await product.save();

    // Delete the order
    await Order.findByIdAndDelete(orderId);

    // Create notification
    const notification = new Notification({
      recipient: tourist.user,
      message: `Your order #${order._id.toString().slice(-6)} has been cancelled. $${refundAmount} has been refunded to your wallet.`,
      type: "WARNING"
    });
    await notification.save();

    // Return success response with updated wallet balance
    res.status(200).json({
      message: "Order cancelled successfully",
      refundAmount,
      updatedWalletBalance: tourist.wallet
    });

  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ message: "Error cancelling order", error: error.message });
  }
};

const addDeliveryAddress = async (req, res) => {
  try {
    const { touristId } = req.params;
    const { location, ...addressData } = req.body;
    
    // Validate location ID
    if (!location) {
      return res.status(400).json({ message: "Location reference is required" });
    }

    const addressWithRefs = { 
      ...addressData,
      tourist: touristId,
      location: location // This is the location ID from the location reference
    };
    
    if (addressWithRefs.isDefault) {
      // If this is a default address, remove default status from other addresses
      await DeliveryAddress.updateMany(
        { tourist: touristId },
        { $set: { isDefault: false } }
      );
    }
    
    const newAddress = new DeliveryAddress(addressWithRefs);
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
    const { touristId, addressId, paymentMethod } = req.body;
    
    // Get cart items
    const cart = await Cart.findOne({ tourist: touristId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    
    // Calculate total price
    const totalPrice = cart.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);

    // Get tourist and check wallet balance if payment method is wallet
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    if (paymentMethod === 'wallet') {
      if (tourist.wallet < totalPrice) {
        return res.status(400).json({ message: "Insufficient wallet balance" });
      }
      // Deduct from wallet
      tourist.wallet -= totalPrice;
      await tourist.save();
    }
    
    // Verify delivery address and get location
    const deliveryAddress = await DeliveryAddress.findById(addressId).populate('location');
    if (!deliveryAddress) {
      return res.status(404).json({ message: "Delivery address not found" });
    }

    // Create orders with location reference
    const orders = await Promise.all(cart.items.map(async (item) => {
      const order = new Order({
        tourist: touristId,
        product: item.product._id,
        quantity: item.quantity,
        arrival_location: deliveryAddress.location._id,
        payment_method: paymentMethod,
        arrival_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        description: `Order for ${item.product.name}`,
        total_price: item.product.price * item.quantity
      });
      return order.save();
    }));

    // Clear the cart
    cart.items = [];
    await cart.save();

    // Prepare receipt data
    const receipt = {
      orders,
      totalAmount: totalPrice,
      paymentMethod,
      deliveryAddress,
      updatedWalletBalance: tourist.wallet,
      orderDate: new Date(),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    };

    res.status(201).json(receipt);
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