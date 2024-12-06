import express from 'express';
import OrderController from '../controllers/OrderController.js';
import mongoose from 'mongoose';
import Order from '../models/Order.js';

const router = express.Router();

// Existing routes
router.get('/tourist/:touristId', OrderController.getOrdersByTourist);
router.get('/details/:orderId', OrderController.getOrderDetails);
router.post('/cancel/:orderId', OrderController.cancelOrder);

// Add these routes for addresses
router.post('/tourist-addresses/:touristId', OrderController.addDeliveryAddress);
router.get('/tourist-addresses/:touristId', OrderController.getDeliveryAddresses);

// Checkout route
router.post('/checkout', OrderController.checkoutOrder);

// GET /api/orders/:touristId
router.get("/:touristId", async (req, res) => {
  try {
    const touristId = req.params.touristId;

    // Validate if touristId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(touristId)) {
      return res.status(400).json({ message: "Invalid tourist ID" });
    }

    // Fetch orders for the tourist and populate all relevant fields
    const orders = await Order.find({ tourist: touristId })
      .populate({
        path: "product",
        populate: [
          {
            path: "images",
            model: "ProductImage",
            options: { sort: { created_at: -1 } }
          },
          {
            path: "seller",
            model: "Seller"
          },
          {
            path: "reviews",
            populate: {
              path: "reviewer"
            }
          }
        ]
      })
      .populate("arrival_location")
      .sort({ createdAt: -1 }); // Most recent orders first

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this tourist" });
    }

    // Transform the data to make it easier to use in frontend
    const transformedOrders = orders.map(order => ({
      _id: order._id,
      quantity: order.quantity,
      status: order.status,
      arrival_date: order.arrival_date,
      arrival_location: order.arrival_location,
      createdAt: order.createdAt,
      product: {
        _id: order.product._id,
        name: order.product.name,
        description: order.product.description,
        price: order.product.price,
        picture: order.product.images?.[0]?.image_url || order.product.picture,
        images: order.product.images,
        seller: order.product.seller,
        reviews: order.product.reviews
      }
    }));

    res.json(transformedOrders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;