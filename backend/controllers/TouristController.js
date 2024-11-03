import Itinerary from "../models/Itinerary.js";
import Tourist from "../models/Tourist.js";

//create Tourist
const createTourist = async (req, res) => {
  try {
    const newTourist = new Tourist(req.body);
    const savedTourist = await newTourist.save();
    res.status(201).json(savedTourist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//get Tourist by id
const getTouristById = async (req, res) => {
  try {
    const tourist = await Tourist.findById(req.params.id).populate("user");
    if (!tourist) return res.status(404).json({ message: "Tourist not found" });
    res.status(200).json(tourist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Helper function to get Tourist by id
const getTouristByIdHelper = async (id) => {
  try {
    const tourist = await Tourist.findById(id);
    if (!tourist) {
      throw new Error("Tourist not found");
    }
    return tourist;
  } catch (error) {
    throw error;
  }
};

// Tourist: pay for an activity or itinerary.
const touristPay = async (req, res) => {
  try {
    const tourist = await getTouristByIdHelper(req.params.id);

    if (!req.body.itineraryIds) {
      return res
        .status(400)
        .json({ message: "Invalid itinerary IDs provided" });
    }

    const itineraryIds = req.body.itineraryIds;
    const plans = await getPlans(itineraryIds);

    if (plans.length !== itineraryIds.length) {
      return res
        .status(404)
        .json({ message: "One or more itineraries not found" });
    }

    const totalPrice = calculateTotalPrice(plans);

    if (tourist.wallet < totalPrice) {
      return res.status(402).json({ message: "Insufficient balance" });
    }

    tourist.wallet -= totalPrice;

    // Assign badges based on tourist's level
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
      tourist.badges.push(badges[tourist.level]);
    }

    const updatedTourist = await updateTouristData(tourist, plans, totalPrice);

    res.json(updatedTourist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPlans = async (itineraryIds) => {
  try {
    const plans = await Itinerary.find({ _id: { $in: itineraryIds } });
    return plans;
  } catch (error) {
    throw error;
  }
};

const calculateTotalPrice = (plans) => {
  return plans.reduce((total, plan) => total + plan.price, 0);
};

const updateTouristData = async (tourist, plans, totalPrice) => {
  try {
    const levelMultipliers = {
      1: 0.5,
      2: 1,
      3: 1.5,
    };

    tourist.points += totalPrice * levelMultipliers[tourist.level] || 0;

    // Define level requirements
    const levels = [
      { points: 0, level: 1 },
      { points: 100000, level: 2 },
      { points: 500000, level: 3 },
    ];

    // Find the level based on the tourist's points
    const newLevel =
      levels.find((level) => tourist.points >= level.points)?.level || 1;

    // Update the tourist's level
    tourist.level = newLevel;

    plans.forEach((plan) => {
      tourist.plans.push(plan);
    });

    await tourist.save();
    return tourist;
  } catch (error) {
    throw error;
  }
};

const rateProduct = async (req, res) => {
  try {
    const tourist = await getTouristByIdHelper(req.params.id);
    if (!tourist) return res.status(404).json({ message: "Tourist not found" });

    const productId = req.body.productId;
    const rating = req.body.rating;
    const comment = req.body.comment;

    if (!productId) {
      return res.status(400).json({ message: "Invalid product ID provided" });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Invalid rating provided" });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const review = await Review.findOne({
      product: productId,
      reviewer: tourist._id,
    });
    if (review)
      return res
        .status(400)
        .json({ message: "You have already reviewed this product" });

    const newReview = new Review({
      reviewer: tourist._id,
      product: productId,
      rating: rating,
      comment: comment,
      review_date: new Date(),
    });

    const savedReview = await newReview.save();
    res.json(savedReview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const redeemPoints = async (req, res) => {
  try {
    const tourist = await getTouristByIdHelper(req.params.id);
    if (!tourist) return res.status(404).json({ message: "Tourist not found" });

    const pointsToRedeem = tourist.points;
    if (pointsToRedeem < 10) {
      return res.status(400).json({ message: "Invalid points provided" });
    }

    const cashAmount = Math.floor(pointsToRedeem / 10000) * 100;

    tourist.wallet += cashAmount;
    tourist.points = 0; // reset points to 0

    await tourist.save();
    res.json(tourist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  createTourist,
  rateProduct,
  touristPay,
  redeemPoints,
  getTouristById,
};
