const getAllProductsSalesAndQuantity = async (req, res) => {
  try {
    const products = await Product.find().exec(); // Retrieve all products
    if (!products || products.length === 0) {
      res.status(404).send({ error: "No products found" });
      return;
    }

    const results = await Promise.all(
      products.map(async (product) => {
        const result = await product.calculateSalesAndQuantity();
        return {
          productId: product._id,
          productName: product.name,
          ...result,
        };
      })
    );

    res.status(200).send(results);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to fetch sales and quantity" });
  }
};

const archiveUnarchiveProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    if (!productId) {
      res.status(400).send({ error: "Product ID is required" });
      return;
    }

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).send({ error: "Product not found" });
      return;
    }

    product.archived = !product.archived;
    await product.save();
    res
      .status(200)
      .send({
        message: `Product ${
          product.archived ? "archived" : "unarchived"
        } successfully`,
      });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to archive/unarchive product" });
  }
};

const uploadProductImage = async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).send({ error: "No image file provided" });
      return;
    }

    const productId = req.params.productId;
    if (!productId) {
      res.status(400).send({ error: "Product ID is required" });
      return;
    }

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).send({ error: "Product not found" });
      return;
    }

    product.picture = req.file.filename;
    try {
      await product.save();
      res.status(200).send({ message: "Image uploaded successfully" });
    } catch (error) {
      if (error.name === "ValidationError") {
        res.status(400).send({ error: "Invalid image filename" });
      } else {
        console.error(error);
        res.status(500).send({ error: "Failed to save product" });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to upload image" });
  }
};

const getSingleProductSalesAndQuantity = async (req, res) => {
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
    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to fetch sales and quantity" });
  }
};

export default {
  getAllProductsSalesAndQuantity,
  getSingleProductSalesAndQuantity,
};
