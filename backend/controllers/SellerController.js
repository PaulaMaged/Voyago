import Product from '../models/Product.js'
import Seller from '../models/Seller.js'

/**
 * Creates a new seller in the database.
 *
 * @param {Object} req - The request object containing the seller data.
 * @param {Object} res - The response object to send back the result.
 * @param {Object} req.body - The seller data to be created.
 * @returns {Object} - The created seller object or an error message.
 * @throws Will throw an error if the seller data is invalid or if there's a database error.
 */
const createSeller = async (req, res, ) => {
    const seller = req.body;
    try {
        const newSeller = new Seller(seller);
        const savedSeller = await newSeller.save();
        res.status(201).json(savedSeller);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


/**

 * Retrieves all sellers associated with a specific user ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.params - The parameters from the request URL.
 * @param {string} req.params.userId - The ID of the user whose sellers are to be retrieved.
 * @param {Object} res - The response object used to send back the result.
 * @returns {Object} - A JSON response containing an array of sellers or an error message.
 */
const getSellersByUserId = async (req, res) => {
    try {
        const sellers = await Seller.find({ user: req.params.userId });
        res.json(sellers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

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
        const products = await Product.find({ seller: req.params.sellerId });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const updateSellerById = async (req, res) => {
    try {
        const updatedSeller = await Seller.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedSeller) return res.status(404).json({ message: 'Seller not found' });
        res.json(updatedSeller);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const deleteSellerById = async (req, res) => {
    try {
        const deletedSeller = await Seller.findByIdAndDelete(req.params.id);
        if (!deletedSeller) return res.status(404).json({ message: 'Seller not found' });
        res.json({ message: 'Seller deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const createProduct = async (req, res) => {
    const product = req.body;
    try {
        const newProduct = new Product(product);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getAllProducts = async (req, res) => { 
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


const updateProductById = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const deleteProductById = async (req, res) => {   

    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export default {createProduct, 
    getAllProducts, 
    getProductById , 
    deleteProductById, 
    updateProductById,
    getSellersByUserId,
    createSeller,
    updateSellerById,
    deleteSellerById,
    getProductsBelongingToSeller}