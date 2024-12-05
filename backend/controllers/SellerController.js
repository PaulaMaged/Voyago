import Product from "../models/Product.js";
import Seller from "../models/Seller.js";
import Order from "../models/Order.js";
import mongoose from "mongoose";
import multer from "multer";
import ProductImage from '../models/ProductImage.js';
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
    const product = await Product.findById(req.params.productId)
      .populate('seller')
      .populate('reviews')
      .lean();

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Get the product image
    const productImage = await ProductImage.findOne({ product: product._id });
    
    const productWithImage = {
      ...product,
      image: productImage ? productImage.image_url : null
    };

    res.json(productWithImage);
  } catch (error) {
    console.error('Error getting product:', error);
    res.status(500).json({ error: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('seller')
      .populate('reviews')
      .lean();

    console.log('Debug - Products before images:', products); // Debug log

    // Get images for each product
    const productsWithImages = await Promise.all(products.map(async (product) => {
      const images = await ProductImage.find({ product: product._id })
        .sort({ created_at: -1 });
      
      console.log(`Debug - Images for product ${product._id}:`, images); // Debug log
      
      return {
        ...product,
        images: images.map(img => ({
          ...img,
          image_url: img.image_url // Virtual field will be included
        }))
      };
    }));

    console.log('Debug - Final products with images:', productsWithImages); // Debug log
    res.json(productsWithImages);
  } catch (error) {
    console.error('Error in getAllProducts:', error);
    res.status(500).json({ error: error.message });
  }
};

const getAllProductsBySeller = async (req, res) => {
  try {
    const sellerId = req.params.sellerId;
    const products = await Product.find({ seller: sellerId })
      .populate('seller')
      .populate('reviews')
      .lean();

    // Get images for each product
    const productsWithImages = await Promise.all(products.map(async (product) => {
      const images = await ProductImage.find({ product: product._id });
      return { 
        ...product, 
        images: images.map(img => ({
          ...img,
          image_url: img.image_url // The filename is already stored correctly
        }))
      };
    }));

    res.json(productsWithImages);
  } catch (error) {
    console.error('Error in getAllProductsBySeller:', error);
    res.status(500).json({ error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const updateData = req.body;
    const files = req.files;

    console.log('Debug - Files received:', files);
    console.log('Debug - Update data:', updateData);

    // Update product basic info
    const updatedProduct = await Product.findById(productId);
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update basic fields
    updatedProduct.name = updateData.name;
    updatedProduct.description = updateData.description;
    updatedProduct.price = updateData.price;
    updatedProduct.available_quantity = updateData.available_quantity;
    updatedProduct.archived = updateData.archived === 'true';

    await updatedProduct.save();

    // Handle existing images
    if (updateData.existingImages) {
      const existingImages = JSON.parse(updateData.existingImages);
      // Delete images that are not in the existingImages array
      await ProductImage.deleteMany({
        product: productId,
        _id: { $nin: existingImages.map(img => img._id) }
      });
    }

    // Handle new image uploads
    if (files && files.length > 0) {
      const imagePromises = files.map(async (file) => {
        const productImage = new ProductImage({
          product: productId,
          filename: file.filename
        });
        return await productImage.save();
      });

      await Promise.all(imagePromises);
    }

    // Get all images for this product
    const productImages = await ProductImage.find({ product: productId });
    console.log('Debug - Final product images:', productImages);

    // Send response with product and its images
    const response = {
      ...updatedProduct.toObject(),
      images: productImages
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: error.message });
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

const getProductOrders = async (req, res) => {
  try {
    const orders = await Order.find({ 
      product: req.params.productId,
    });
    res.json(orders);
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
      const { date, month } = req.query;

      // Get all products for this seller
      const products = await Product.find({ seller: sellerId });

      let totalRevenue = 0;

      for (const product of products) {
          // Base filter with product ID
          let orderFilter = { 
              product: product._id 
          };

          if (date) {
              // For specific date
              const startDate = new Date(date);
              startDate.setHours(0, 0, 0, 0);
              
              const endDate = new Date(date);
              endDate.setHours(23, 59, 59, 999);

              orderFilter.arrival_date = {
                  $gte: startDate,
                  $lte: endDate
              };
          } else if (month) {
              // For specific month
              const year = new Date().getFullYear();
              const monthIndex = parseInt(month) - 1;
              
              const startDate = new Date(year, monthIndex, 1);
              const endDate = new Date(year, monthIndex + 1, 0, 23, 59, 59, 999);

              orderFilter.arrival_date = {
                  $gte: startDate,
                  $lte: endDate
              };
          }

          // Get orders and populate product details
          const orders = await Order.find(orderFilter)
              .populate('product', 'price name');

          // Calculate revenue for this product
          const productRevenue = orders.reduce((sum, order) => {
              return sum + (order.quantity * product.price);
          }, 0);

          totalRevenue += productRevenue;

          // Debug logging
          console.log(`Product ${product.name}:`, {
              orders: orders.length,
              revenue: productRevenue,
              filter: orderFilter
          });
      }

      console.log('Total Filtered Revenue:', totalRevenue);

      res.status(200).json({ totalRevenue });
  } catch (error) {
      console.error('Error in getSalesReportFiltered:', error);
      res.status(500).json({ 
          error: 'Error generating sales report',
          details: error.message 
      });
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
  getProductOrders,
  getSalesReportFiltered,
  getTotalRevenue,
};
