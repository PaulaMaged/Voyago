// Import the required models for the Itinerary and Tourist entities
import Itinerary from "../models/Itinerary.js";
import Tourist from "../models/Tourist.js";

/**
 * Create a new tourist.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const createTourist = async (req, res) => {
  try {
    // Create a new tourist instance using the request body
    const newTourist = new Tourist(req.body);
    // Save the new tourist to the database
    const savedTourist = await newTourist.save();
    // Return the saved tourist with a 201 Created status code
    res.status(201).json(savedTourist);
  } catch (error) {
    // Return an error response with a 500 Internal Server Error status code
    res.status(500).json({ error: error.message });
  }
};

/**
 * Retrieve a tourist by their ID.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const getTouristById = async (req, res) => {
  try {
    // Find the tourist by their ID and populate the user field
    const tourist = await Tourist.findById(req.params.id).populate("user");
    // Check if the tourist is not found
    if (!tourist) return res.status(404).json({ message: "Tourist not found" });
    // Return the tourist with a 200 OK status code
    res.status(200).json(tourist);
  } catch (error) {
    // Return an error response with a 500 Internal Server Error status code
    res.status(500).json({ error: error.message });
  }
};

/**
 * Helper function to retrieve a tourist by their ID.
 * @param {String} id - Tourist ID.
 * @returns {Object} Tourist object.
 */
const getTouristByIdHelper = async (id) => {
  try {
    // Find the tourist by their ID
    const tourist = await Tourist.findById(id);
    // Check if the tourist is not found
    if (!tourist) {
      // Throw a new error with a message
      throw new Error("Tourist not found");
    }
    // Return the tourist
    return tourist;
  } catch (error) {
    // Rethrow the error
    throw error;
  }
};

/**
 * Handle tourist payment for an activity or itinerary.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const touristPay = async (req, res) => {
  try {
    // Retrieve the tourist by their ID
    const tourist = await getTouristByIdHelper(req.params.id);

    // Check if the itinerary IDs are provided
    if (!req.body.itineraryIds) {
      return res
        .status(400)
        .json({ message: "Invalid itinerary IDs provided" });
    }

    // Retrieve the itinerary IDs
    const itineraryIds = req.body.itineraryIds;
    // Retrieve the plans for the itinerary IDs
    const plans = await getPlans(itineraryIds);

    // Check if the plans are not found
    if (plans.length !== itineraryIds.length) {
      return res
        .status(404)
        .json({ message: "One or more itineraries not found" });
    }

    // Calculate the total price of the plans
    const totalPrice = calculateTotalPrice(plans);

    // Check if the tourist has sufficient balance
    if (tourist.wallet < totalPrice) {
      return res.status(402).json({ message: "Insufficient balance" });
    }

    // Deduct the total price from the tourist's wallet
    tourist.wallet -= totalPrice;

    // Assign badges based on the tourist's level
    const badges = {
      1: "Copper",
      2: "Gold",
      3: "Platinum",
    };

    // Check if the tourist's current level corresponds to a badge and if they haven't already been awarded that badge
    if (
      badges[tourist.level] &&
      !tourist.badges.includes(badges[tourist.level])
    ) {
      // Add the badge to the tourist's badges
      tourist.badges.push(badges[tourist.level]);
    }

    // Update the tourist's data with the plans and total price
    const updatedTourist = await updateTouristData(tourist, plans, totalPrice);

    // Return the updated tourist
    res.json(updatedTourist);
  } catch (error) {
    // Return an error response with a 500 Internal Server Error status code
    res.status(500).json({ error: error.message });
  }
};

/**
 * Retrieve plans by their IDs.
 * @param {Array} itineraryIds - Array of itinerary IDs.
 * @returns {Array} Plans corresponding to the itinerary IDs.
 */
const getPlans = async (itineraryIds) => {
  try {
    // Find the plans by their IDs
    const plans = await Itinerary.find({ _id: { $in: itineraryIds } });
    // Return the plans
    return plans;
  } catch (error) {
    // Rethrow the error
    throw error;
  }
};

/**
 * Calculate the total price of the plans.
 * @param {Array} plans - Array of plans.
 * @returns {Number} Total price of the plans.
 */
const calculateTotalPrice = (plans) => {
  // Use the reduce method to calculate the total price
  return plans.reduce((total, plan) => total + plan.price, 0);
};

/**
 * Update the tourist's data with the plans and total price.
 * @param {Object} tourist - Tourist object.
 * @param {Array} plans - Array of plans.
 * @param {Number} totalPrice - Total price of the plans.
 * @returns {Object} Updated tourist object.
 */
const updateTouristData = async (tourist, plans, totalPrice) => {
  try {
    // Define the level multipliers
    const levelMultipliers = {
      1: 0.5,
      2: 1,
      3: 1.5,
    };

    // Update the tourist's points
    tourist.points += totalPrice * levelMultipliers[tourist.level] || 0;

    // Define the level requirements
    const levels = [
      { points: 0, level: 1 },
      { points: 100000, level: 2 },
      { points: 500000, level: 3 },
    ];

    // Find the new level based on the tourist's points
    const newLevel =
      levels.find((level) => tourist.points >= level.points)?.level || 1;

    // Update the tourist's level
    tourist.level = newLevel;

    // Add the plans to the tourist's plans
    plans.forEach((plan) => {
      tourist.plans.push(plan);
    });

    // Save the updated tourist
    await tourist.save();
    // Return the updated tourist
    return tourist;
  } catch (error) {
    // Rethrow the error
    throw error;
  }
};

/**
 * Rate a product.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const rateProduct = async (req, res) => {
  try {
    // Retrieve the tourist by their ID
    const tourist = await getTouristByIdHelper(req.params.id);
    // Check if the tourist is not found
    if (!tourist) return res.status(404).json({ message: "Tourist not found" });

    // Retrieve the product ID, rating, and comment from the request body
    const productId = req.body.productId;
    const rating = req.body.rating;
    const comment = req.body.comment;

    // Check if the product ID is not provided
    if (!productId) {
      return res.status(400).json({ message: "Invalid product ID provided" });
    }

    // Check if the rating is not valid
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Invalid rating provided" });
    }

    // Find the product by its ID
    const product = await Product.findById(productId);
    // Check if the product is not found
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Find the review by the tourist and product
    const review = await Review.findOne({
      product: productId,
      reviewer: tourist._id,
    });
    // Check if the review already exists
    if (review)
      return res
        .status(400)
        .json({ message: "You have already reviewed this product" });

    // Create a new review
    const newReview = new Review({
      reviewer: tourist._id,
      product: productId,
      rating: rating,
      comment: comment,
      review_date: new Date(),
    });

    // Save the new review
    const savedReview = await newReview.save();
    // Return the saved review
    res.json(savedReview);
  } catch (error) {
    // Return an error response with a 500 Internal Server Error status code
    res.status(500).json({ error: error.message });
  }
};

/**
 * Redeem the tourist's points.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const redeemPoints = async (req, res) => {
  try {
    // Retrieve the tourist by their ID
    const tourist = await getTouristByIdHelper(req.params.id);
    // Check if the tourist is not found
    if (!tourist) return res.status(404).json({ message: "Tourist not found" });

    // Retrieve the points to redeem
    const pointsToRedeem = tourist.points;
    // Check if the points are not enough
    if (pointsToRedeem < 10) {
      return res.status(400).json({ message: "Invalid points provided" });
    }

    // Calculate the cash amount to redeem
    const cashAmount = Math.floor(pointsToRedeem / 10000) * 100;

    // Update the tourist's wallet and points
    tourist.wallet += cashAmount;
    tourist.points = 0; // reset points to 0

    // Save the updated tourist
    await tourist.save();
    // Return the updated tourist
    res.json(tourist);
  } catch (error) {
    // Return an error response with a 500 Internal Server Error status code
    res.status(500).json({ error: error.message });
  }
};

// Export the controllers
export default {
  createTourist,
  rateProduct,
  touristPay,
  redeemPoints,
  getTouristById,
};
