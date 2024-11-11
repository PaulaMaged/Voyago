import Product from "../models/Product.js";
import Seller from "../models/Seller.js";
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
  const product = req.body;
  try {
    const newProduct = new Product(product);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
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

export default {
  createProduct,
  getAllProducts,
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
