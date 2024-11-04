// Import the required models for the Itinerary and Tourist entities
import Itinerary from "../models/Itinerary.js";
import Tourist from "../models/Tourist.js";
import Complaint from "../models/Complaint.js";
import Booking from "../models/Booking.js";
import ProductReview from "../models/ProductReview.js";

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
 * Handle tourist payment for an activity or itinerary and create bookings for the itineraries.
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

    // Create bookings for the itineraries
    const bookings = plans.map((plan) => {
      return {
        tourist: tourist._id,
        plan_id: plan._id,
        booking_date: new Date(),
      };
    });

    // Save the bookings to the database
    await Promise.all(
      bookings.map(async (booking) => {
        const newBooking = new Booking(booking);
        await newBooking.save();
      })
    );

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
 * Rate an itinerary.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const rateItinerary = async (req, res) => {
  try {
    // Retrieve the tourist by their ID
    const tourist = await getTouristByIdHelper(req.params.id);
    // Check if the tourist is not found
    if (!tourist) return res.status(404).json({ message: "Tourist not found" });

    // Retrieve the itinerary ID, rating, and comment from the request body
    const itineraryId = req.body.itineraryId;
    const rating = req.body.rating;
    const comment = req.body.comment;

    // Check if the itinerary ID is not provided
    if (!itineraryId) {
      return res.status(400).json({ message: "Invalid itinerary ID provided" });
    }

    // Check if the rating is not valid
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Invalid rating provided" });
    }

    // Find the itinerary by its ID
    const itinerary = await Itinerary.findById(itineraryId);
    // Check if the itinerary is not found
    if (!itinerary)
      return res.status(404).json({ message: "Itinerary not found" });

    // Find the review by the tourist and itinerary
    const review = await ItineraryReview.findOne({
      itinerary: itineraryId,
      reviewer: tourist._id,
    });
    // Check if the review already exists
    if (review)
      return res
        .status(400)
        .json({ message: "You have already reviewed this itinerary" });

    // Create a new review
    const newReview = new ItineraryReview({
      reviewer: tourist._id,
      itinerary: itineraryId,
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
 * Rate a tour guide.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const rateTourGuide = async (req, res) => {
  try {
    // Retrieve the tourist by their ID
    const tourist = await getTouristByIdHelper(req.params.id);
    // Check if the tourist is not found
    if (!tourist) return res.status(404).json({ message: "Tourist not found" });

    // Retrieve the tour guide ID, rating, and comment from the request body
    const tourGuideId = req.body.tourGuideId;
    const rating = req.body.rating;
    const comment = req.body.comment;

    // Check if the tour guide ID is not provided
    if (!tourGuideId) {
      return res
        .status(400)
        .json({ message: "Invalid tour guide ID provided" });
    }

    // Check if the rating is not valid
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Invalid rating provided" });
    }

    // Find the tour guide by its ID
    const tourGuide = await TourGuide.findById(tourGuideId);
    // Check if the tour guide is not found
    if (!tourGuide)
      return res.status(404).json({ message: "Tour guide not found" });

    // Find the review by the tourist and tour guide
    const review = await TourGuideReview.findOne({
      tourGuide: tourGuideId,
      reviewer: tourist._id,
    });
    // Check if the review already exists
    if (review)
      return res
        .status(400)
        .json({ message: "You have already reviewed this tour guide" });

    // Create a new review
    const newReview = new TourGuideReview({
      reviewer: tourist._id,
      tourGuide: tourGuideId,
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
 * Rate an activity.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const rateActivity = async (req, res) => {
  try {
    // Retrieve the tourist by their ID
    const tourist = await getTouristByIdHelper(req.params.id);
    // Check if the tourist is not found
    if (!tourist) return res.status(404).json({ message: "Tourist not found" });

    // Retrieve the activity ID, rating, and comment from the request body
    const activityId = req.body.activityId;
    const rating = req.body.rating;
    const comment = req.body.comment;

    // Check if the activity ID is not provided
    if (!activityId) {
      return res.status(400).json({ message: "Invalid activity ID provided" });
    }

    // Check if the rating is not valid
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Invalid rating provided" });
    }

    // Find the activity by its ID
    const activity = await Activity.findById(activityId);
    // Check if the activity is not found
    if (!activity)
      return res.status(404).json({ message: "Activity not found" });

    // Find the review by the tourist and activity
    const review = await ActivityReview.findOne({
      activity: activityId,
      reviewer: tourist._id,
    });
    // Check if the review already exists
    if (review)
      return res
        .status(400)
        .json({ message: "You have already reviewed this activity" });

    // Create a new review
    const newReview = new ActivityReview({
      reviewer: tourist._id,
      activity: activityId,
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
    const review = await ProductReview.findOne({
      product: productId,
      reviewer: tourist._id,
    });
    // Check if the review already exists
    if (review)
      return res
        .status(400)
        .json({ message: "You have already reviewed this product" });

    // Create a new review
    const newReview = new ProductReview({
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
/**
 * File a complaint.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const fileComplaint = async (req, res) => {
  try {
    // Retrieve the tourist by their ID
    const tourist = await getTouristByIdHelper(req.params.id);
    // Check if the tourist is not found
    if (!tourist) return res.status(404).json({ message: "Tourist not found" });

    // Retrieve the complaint details from the request body
    const { title, body } = req.body;

    // Check if the title or body is missing
    if (!title || !body) {
      return res.status(400).json({ message: "Title and body are required" });
    }

    // Create a new complaint
    const newComplaint = new Complaint({
      tourist: tourist._id,
      title: title,
      body: body,
      date: new Date(),
    });

    // Save the new complaint
    const savedComplaint = await newComplaint.save();

    // Return the saved complaint
    res.status(201).json(savedComplaint);
  } catch (error) {
    // Return an error response with a 500 Internal Server Error status code
    res.status(500).json({ error: error.message });
  }
};

const cancelBooking = async (bookingId) => {
  try {
    // Find the booking by ID
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      throw new Error("Booking not found");
    }

    // Calculate the time 48 hours before the start of the event/activity/itinerary
    let startTime;
    if (booking.plan_id) {
      const itinerary = await Itinerary.findById(booking.plan_id);
      startTime = itinerary.start_date; // Assuming Itinerary has a start_date field
    } else {
      const activity = await Activity.findById(booking.activity);
      startTime = activity.start_time; // Assuming Activity has a start_time field
    }

    const cancellationDeadline = new Date(startTime);
    cancellationDeadline.setDate(cancellationDeadline.getDate() - 2); // Subtract 2 days (48 hours)

    // Get the tourist's ID from the booking
    const touristId = booking.tourist;

    // Check if the current time is before the cancellation deadline
    if (new Date() < cancellationDeadline) {
      // Cancel the booking (e.g., update the booking status)
      booking.status = "cancelled"; // Assuming you have a status field in the Booking schema
      await booking.save();

      // Find the tourist by ID
      const tourist = await Tourist.findById(touristId);

      // Calculate the amount to refund
      let refundAmount;
      if (booking.plan_id) {
        const itinerary = await Itinerary.findById(booking.plan_id);
        refundAmount = itinerary.price; // Assuming Itinerary has a price field
      } else {
        const activity = await Activity.findById(booking.activity);
        refundAmount = activity.price; // Assuming Activity has a price field
      }

      // Refund the amount to the tourist's wallet
      tourist.wallet += refundAmount;
      await tourist.save();

      return "Booking cancelled successfully and amount refunded.";
    } else {
      throw new Error("Cancellation deadline has passed");
    }
  } catch (error) {
    console.error("Error cancelling booking:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

/**
 * View my list of issued complaints and its status (pending/resolved)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const viewComplaints = async (req, res) => {
  try {
    // Retrieve the tourist by their ID
    const tourist = await getTouristByIdHelper(req.params.id);
    // Check if the tourist is not found
    if (!tourist) return res.status(404).json({ message: "Tourist not found" });

    // Find all complaints by the tourist
    const complaints = await Complaint.find({ tourist: tourist._id })
      .populate("tourist")
      .exec();

    // Return the complaints
    res.json(complaints);
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
  fileComplaint,
  cancelBooking,
  viewComplaints,
  rateActivity,
  rateItinerary,
  rateTourGuide,
};
