import Product from "../models/Product.js";

const getSalesAndQuantity = async (req, res) => {
  try {
    const productId = req.params.productId; // Assuming you're passing the ID as a route parameter
    if (!productId) {
      res.status(400).send({ error: "Product ID is required" });
      return;
    }

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).send({ error: "Product not found" });
      return;
    }

    const result = await product.calculateSalesAndQuantity();
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to fetch sales and quantity" });
  }
};

export default { getSalesAndQuantity };
