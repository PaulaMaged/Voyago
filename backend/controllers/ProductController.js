// Import the Product model to interact with the product collection in the database
import mongoose from "mongoose"
import Product from "../models/Product.js";
import Order from "../models/Order.js";
/**
 * Retrieves sales and quantity data for all products in the database.
 *
 * @async
 * @function getAllProductsSalesAndQuantity
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const getAllProductsSalesAndQuantity = async (req, res) => {
  try {
    // Retrieve all products from the database
    const products = await Product.find().exec();

    // Check if any products were found
    if (!products || products.length === 0) {
      // If no products were found, return a 404 error
      res.status(404).send({ error: "No products found" });
      return;
    }

    // Map over each product and calculate sales and quantity data
    const results = await Promise.all(
      products.map(async (product) => {
        // Calculate sales and quantity data for the current product
        const result = await product.calculateSalesAndQuantity();

        // Return the product ID, name, and calculated sales and quantity data
        return {
          productId: product._id,
          productName: product.name,
          ...result,
        };
      })
    );

    // Return the sales and quantity data for all products
    res.status(200).send(results);
  } catch (error) {
    // Log any errors that occur during execution
    console.error(error);

    // Return a 500 error if an error occurs
    res.status(500).send({ error: "Failed to fetch sales and quantity" });
  }
};

/**
 * Archives a product by setting the 'archived' field to true.
 *
 * @async
 * @function archiveProduct
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const archiveProduct = async (req, res) => {
  try {
    // Get the product ID from the request parameters
    const productId = req.params.productId;

    // Check if a product ID was provided
    if (!productId) {
      // If no product ID was provided, return a 400 error
      res.status(400).send({ error: "Product ID is required" });
      return;
    }

    // Retrieve the product from the database
    const product = await Product.findById(productId);

    // Check if the product exists
    if (!product) {
      // If the product does not exist, return a 404 error
      res.status(404).send({ error: "Product not found" });
      return;
    }

    // Check if the product is already archived
    if (product.archived) {
      // If the product is already archived, return a 400 error
      res.status(400).send({ error: "Product is already archived" });
      return;
    }

    // Set the 'archived' field to true
    product.archived = true;

    // Save the updated product
    await product.save();

    // Return a success message
    res.status(200).send({ message: "Product archived successfully" });
  } catch (error) {
    // Log any errors that occur during execution
    console.error(error);

    // Return a 500 error if an error occurs
    res.status(500).send({ error: "Failed to archive product" });
  }
};

/**
 * Unarchives a product by setting the 'archived' field to false.
 *
 * @async
 * @function unarchiveProduct
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const unarchiveProduct = async (req, res) => {
  try {
    // Get the product ID from the request parameters
    const productId = req.params.productId;

    // Check if a product ID was provided
    if (!productId) {
      // If no product ID was provided, return a 400 error
      res.status(400).send({ error: "Product ID is required" });
      return;
    }

    // Retrieve the product from the database
    const product = await Product.findById(productId);

    // Check if the product exists
    if (!product) {
      // If the product does not exist, return a 404 error
      res.status(404).send({ error: "Product not found" });
      return;
    }

    // Check if the product is already unarchived
    if (!product.archived) {
      // If the product is already unarchived, return a 400 error
      res.status(400).send({ error: "Product is not archived" });
      return;
    }

    // Set the 'archived' field to false
    product.archived = false;

    // Save the updated product
    await product.save();

    // Return a success message
    res.status(200).send({ message: "Product unarchived successfully" });
  } catch (error) {
    // Log any errors that occur during execution
    console.error(error);

    // Return a 500 error if an error occurs
    res.status(500).send({ error: "Failed to unarchive product" });
  }
};

/**
 * Uploads a product image.
 *
 * @async
 * @function uploadProductImage
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const uploadProductImage = async (req, res) => {
  try {
    // Check if a file was provided
    if (!req.file) {
      // If no file was provided, return a 400 error
      res.status(400).send({ error: "No image file provided" });
      return;
    }

    // Get the product ID from the request parameters
    const productId = req.params.productId;

    // Check if a product ID was provided
    if (!productId) {
      // If no product ID was provided, return a 400 error
      res.status(400).send({ error: "Product ID is required" });
      return;
    }

    // Retrieve the product from the database
    const product = await Product.findById(productId);

    // Check if the product exists
    if (!product) {
      // If the product does not exist, return a 404 error
      res.status(404).send({ error: "Product not found" });
      return;
    }

    // Set the product picture to the uploaded file name
    product.picture = req.file.filename;

    try {
      // Save the updated product
      await product.save();

      // Return a success message
      res.status(200).send({ message: "Image uploaded successfully" });
    } catch (error) {
      // If a validation error occurs, return a 400 error
      if (error.name === "ValidationError") {
        res.status(400).send({ error: "Invalid image filename" });
      } else {
        // Log any other errors that occur during execution
        console.error(error);

        // Return a 500 error if an error occurs
        res.status(500).send({ error: "Failed to save product" });
      }
    }
  } catch (error) {
    // Log any errors that occur during execution
    console.error(error);

    // Return a 500 error if an error occurs
    res.status(500).send({ error: "Failed to upload image" });
  }
};

/**
 * Retrieves sales and quantity data for a single product by ID.
 *
 * @async
 * @function getSingleProductSalesAndQuantity
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const getSingleProductSalesAndQuantity = async (req, res) => {
  try {
    // Get the product ID from the request parameters
    const productId = req.params.productId;

    // Check if a product ID was provided
    if (!productId) {
      // If no product ID was provided, return a 400 error
      res.status(400).send({ error: "Product ID is required" });
      return;
    }

    // Retrieve the product from the database
    const product = await Product.findById(productId);

    // Check if the product exists
    if (!product) {
      // If the product does not exist, return a 404 error
      res.status(404).send({ error: "Product not found" });
      return;
    }

    // Calculate sales and quantity data for the product
    const result = await product.calculateSalesAndQuantity();

    // Return the sales and quantity data
    res.status(200).send(result);
  } catch (error) {
    // Log any errors that occur during execution
    console.error(error);

    // Return a 500 error if an error occurs
    res.status(500).send({ error: "Failed to fetch sales and quantity" });
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

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate(
      "seller".populate("reviews")
    );
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProductById = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
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

const deleteProductById = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct)
      return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createOrder = async (req, res) => {
  const order = req.body;
  try {
    const newOrder = new Order(order);
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("products")
      .populate("customer");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllOrdersForTourist = async (req, res) => {
  try {
    const touristId = req.params.touristId;
    
    // Validate if touristId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(touristId)) {
      return res.status(400).json({ message: "Invalid tourist ID" });
    }

    // Fetch orders for the tourist and populate all relevant fields
    const orders = await Order.find({ tourist: touristId })
      .populate({
        path: 'product', // Populate the 'product' field
        populate: [
          { 
            path: 'reviews', // Populate the 'reviews' field inside the product
            populate: { 
              path: 'reviewer' // Optionally populate the reviewer (Tourist) for each review
            }
          },
          { 
            path: 'seller', // Populate the 'seller' field inside the product
            // No need to specify fields here, it will include everything from Seller schema
          }
        ]
      })
      .populate('arrival_location'); // Populate the 'arrival_location' field in the order

    // If no orders are found
    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this tourist" });
    }

    res.json(orders); // Return the populated orders
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("products").populate("customer");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateOrderById = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedOrder)
      return res.status(404).json({ message: "Order not found" });
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteOrderById = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder)
      return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Export all functions for use in other parts of the application
export default {
  getAllProductsSalesAndQuantity,
  getSingleProductSalesAndQuantity,
  archiveProduct,
  unarchiveProduct,
  uploadProductImage,
  createProduct,
  getProductById,
  getAllProducts,
  updateProductById,
  deleteProductById,
  createOrder,
  getOrderById,
  getAllOrdersForTourist,
  getAllOrders,
  updateOrderById,
  deleteOrderById,
};
