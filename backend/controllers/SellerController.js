import Product from "../models/Product.js";
import Seller from "../models/Seller.js";
import Order from "../models/Order.js";
import mongoose from "mongoose";
import multer from "multer";
/**
 * Creates a new seller in the database.
 *
 * @param {Object} req - The request object containing the seller data.
 * @param {Object} res - The response object to send back the result.
 * @param {Object} req.body - The seller data to be created.
 * @returns {Object} - The created seller object or an error message.
 * @throws Will throw an error if the seller data is invalid or if there's a database error.
 */

const createSeller = async (req, res) => {
  try {
    // Log the received data for debugging
    console.log("Received body:", req.body);
    console.log("Received file:", req.file);

    // Extract seller data from the request body
    const sellerData = {
      user: req.body.user,
      store_name: req.body.store_name,
      description: req.body.description,
      // Add the file path if a file was uploaded
      document_path: req.file ? req.file.path : null,
    };

    // Create a new Seller instance
    const newSeller = new Seller(sellerData);

    // Save the seller to the database
    const savedSeller = await newSeller.save();

    // Respond with the saved seller data
    res.status(201).json(savedSeller);
  } catch (error) {
    console.error("Error in createSeller:", error);
    res.status(500).json({ error: error.message });
  }
};
/**
 * Retrieves all sellers
 *
 * @param {Object} req - The request object.
 * @param {Object} req.params - The parameters from the request URL.
 * @param {string} req.params.userId - The ID of the user whose sellers are to be retrieved.
 * @param {Object} res - The response object used to send back the result.
 * @returns {Object} - A JSON response containing an array of sellers or an error message.
 */

const getSeller = async (req, res) => {
  try {
    const sellers = await Seller.findById(req.params.sellerId).populate("user");
    res.json(sellers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSellerByUserId = async (req, res) => {
  try {
    const sellers = await Seller.findOne({ user: req.params.userId }).populate(
      "user"
    );
    res.json(sellers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Retrieves all products associated with a specific seller ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.params - The parameters from the request URL.
 * @param {string} req.params.sellerId - The ID of the seller whose products are to be retrieved.
 * @param {Object} res - The response object used to send back the result.
 * @returns {Object} - A JSON response containing an array of products or an error message.
 */

const getProductsBelongingToSeller = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.params.sellerId })
      .populate({
        path: "seller",
        select: "store_name", // Include only 'store_name' from the 'Seller' schema
      })
      .populate({
        path: "reviews",
        populate: {
          path: "reviewer",
          populate: {
            path: "user",
            select: "username", // Include only 'username' from the 'User' schema
          },
        },
      });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateSeller = async (req, res) => {
  try {
    const updatedSeller = await Seller.findByIdAndUpdate(
      req.params.sellerId,
      req.body,
      { new: true }
    );
    if (!updatedSeller)
      return res.status(404).json({ message: "Seller not found" });
    res.json(updatedSeller);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteSeller = async (req, res) => {
  try {
    const deletedSeller = await Seller.findByIdAndDelete(req.params.sellerId);
    if (!deletedSeller)
      return res.status(404).json({ message: "Seller not found" });
    res.json({ message: "Seller deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createProduct = async (req, res) => {
  const {
    seller,
    name,
    description,
    price,
    available_quantity,
    picture,
    archived,
  } = req.body;

  // Ensure all required fields are provided
  if (!seller || !name || !price || !available_quantity) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Ensure the seller exists
    const sellerExists = await Seller.findById(seller);
    if (!sellerExists) {
      return res.status(400).json({ error: "Seller not found" });
    }

    // Create the new product
    const newProduct = new Product({
      seller,
      name,
      description: description || "", // Default to an empty string if not provided
      price,
      available_quantity,
      picture: picture || "", // Default to an empty string if not provided
      archived: archived || false, // Default to false if not provided
    });

    // Save the product to the database
    const savedProduct = await newProduct.save();

    // Return the saved product
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: error.message });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    // Populate 'seller' to only include the 'store_name' and 'reviews' with 'reviewer' up to 'user' level
    const products = await Product.find()
      .populate({
        path: "seller",
        select: "store_name", // Only include the 'store_name' field from the 'Seller' schema
      })
      .populate({
        path: "reviews",
        populate: {
          path: "reviewer",
          populate: {
            path: "user",
            select: "username", // Include only the 'username' field from the 'User' schema
          },
        },
      });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllProductsBySeller = async (req, res) => {
  try {
    const { sellerId } = req.params; // Get sellerId from the URL parameters

    // Check if sellerId is provided and valid
    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(400).json({ error: "Invalid seller ID" });
    }

    // Fetch all products for the specific seller
    const products = await Product.find({ seller: sellerId })
      .populate({
        path: "seller",
        select: "store_name", // Only include the 'store_name' field from the 'Seller' schema
      })
      .populate({
        path: "reviews",
        populate: {
          path: "reviewer",
          populate: {
            path: "user",
            select: "username", // Include only the 'username' field from the 'User' schema
          },
        },
      });

    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found for this seller." });
    }

    res.json(products); // Return the products
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.productId,
      req.body,
      { new: true }
    );
    if (!updatedProduct)
      return res.status(404).json({ message: "Product not found" });
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(
      req.params.productId
    );
    if (!deletedProduct)
      return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTotalRevenue = async (req, res) => {
  const sellerId = req.params.sellerId;
  const productsOfSeller = await Product.find({ seller: sellerId });

  let sum = 0;

  for (let i = 0; i < productsOfSeller.length; i++) {
    const product = productsOfSeller[i];

    const orders = await Order.find({ product: product._id }).populate();

    for (let j = 0; j < orders.length; j++) {
      const order = orders[j];
      sum += order.product.price * order.product.quantity;
    }
  }

  res.json({ totalRevenue: sum });
};

const getSalesReportFiltered = async (req, res) => {
  try {
    const sellerId = req.params.sellerId;
    const { productId, date, month } = req.query;

    const products = productId
      ? await Product.find({ _id: productId, seller: sellerId })
      : await Product.find({ seller: sellerId });

    let totalRevenue = 0;
    for (let i = 0; i < products.length; i++) {
      let orders;
      const filter = { product: products[i]._id };

      if (date) {
        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(startDate.getDate() + 1);
        filter.order_date = { $gte: startDate, $lt: endDate };
      } else if (month) {
        filter.order_date = { $month: parseInt(month) }; // Assuming month is passed as 1-12
      }

      orders = await Order.find(filter);

      for (let j = 0; j < orders.length; j++) {
        totalRevenue += products[i].price * orders[j].quantity;
      }
    }
    res.status(200).json({ totalRevenue: totalRevenue });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getNotifications = async (req, res) => {
  try {
    const sellerId = req.params.sellerId;
    const seller = await Seller.findById(sellerId);
    if (!seller) return res.status(404).json({ message: "Seller not found" });
    const notifications = await Notification.find({ user: seller.user });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  createProduct,
  getAllProducts,
  getAllProductsBySeller,
  getProduct,
  deleteProduct,
  updateProduct,
  getSeller,
  createSeller,
  updateSeller,
  deleteSeller,
  getSellerByUserId,
  getProductsBelongingToSeller,
};
