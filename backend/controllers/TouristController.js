// Import the required models for the Itinerary and Tourist entities
import Itinerary from "../models/Itinerary.js";
import Activity from "../models/Activity.js";
import Tourist from "../models/Tourist.js";
import ActivityComplaint from "../models/ActivityComplaint.js";
import ItineraryComplaint from "../models/ItineraryComplaint.js";
import ItineraryBooking from "../models/ItineraryBooking.js";
import ActivityBooking from "../models/ActivityBooking.js";
import ProductReview from "../models/ProductReview.js";
import ItineraryReview from "../models/ItineraryReview.js";
import TourGuideReview from "../models/TourGuideReview.js";
import ActivityReview from "../models/ActivityReview.js";
import TourGuide from "../models/TourGuide.js"; // Added
import Product from "../models/Product.js"; // Added
import Complain from "../models/Complaint.js";
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

const getTouristByUserId = async (req, res) => {
  try {
    const tourist = await Tourist.findOne({
      user: req.params.userId,
    }).populate("user");

    if (!tourist) {
      return res
        .status(404)
        .json({ message: "Tourist not found for this user" });
    }
    res.status(200).json(tourist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Retrieve a tourist by their ID.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const getTourist = async (req, res) => {
  try {
    // Find the tourist by their ID and populate the user field
    const tourist = await Tourist.findById(req.params.touristId).populate(
      "user"
    );
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
 * Retrieve a tourist by their ID.
 * @param {String} touristId - The ID of the tourist.
 * @returns {Object} Tourist Mongoose document.
 */
const getTouristByIdHelper = async (touristId) => {
  try {
    const tourist = await Tourist.findById(touristId)
      .populate("user") // Populate other necessary fields if needed
      .exec();
    if (!tourist) {
      throw new Error("Tourist not found");
    }
    return tourist;
  } catch (error) {
    throw error;
  }
};

const getAllTouristsItineraryBooking = async (req, res) => {
  try {
    const touristId = req.params.touristId;
    const tourist = await getTouristByIdHelper(touristId);
    const itineraryBookings = await ItineraryBooking.find({
      tourist: tourist._id,
    }).populate("itinerary");
    res.status(200).json(itineraryBookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllTouristActivityBooking = async (req, res) => {
  try {
    const touristId = req.params.touristId;
    const tourist = await getTouristByIdHelper(touristId);
    const activityBookings = await ActivityBooking.find({
      tourist: tourist._id,
    }).populate("activity");
    res.status(200).json(activityBookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Retrieve all tourists.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const getAllTourists = async (req, res) => {
  try {
    // Find all tourists and populate the user field
    const tourists = await Tourist.find().populate("user");
    // Return the tourists with a 200 OK status code
    res.status(200).json(tourists);
  } catch (error) {
    // Return an error response with a 500 Internal Server Error status code
    res.status(500).json({ error: error.message });
  }
};

const touristPay = async (req, res) => {
  try {
    const touristId = req.params.touristId;
    const tourist = await getTouristByIdHelper(touristId); // Ensure this helper does not populate 'plans'
    const plans = req.body.plans;

    // Validate the 'plans' array
    if (!plans || !Array.isArray(plans) || plans.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid list of plans provided" });
    }

    let totalPrice = 0;

    // Process each plan: validate and create bookings
    for (const plan of plans) {
      try {
        let existingPlan;
        if (plan.type === "Activity") {
          existingPlan = await Activity.findById(plan.activityId);
        } else if (plan.type === "Itinerary") {
          existingPlan = await Itinerary.findById(plan.itineraryId);
        } else {
          return res
            .status(400)
            .json({ message: `Invalid plan type: ${plan.type}` });
        }

        if (!existingPlan) {
          return res.status(404).json({
            message: `Plan ID not found: ${
              plan.type === "Activity" ? plan.activityId : plan.itineraryId
            }`,
          });
        }

        // Accumulate the total price
        totalPrice += existingPlan.price;

        // Create the appropriate booking
        if (plan.type === "Activity") {
          await ActivityBooking.create({
            activity: existingPlan._id,
            tourist: tourist._id,
            attended: false,
            active: true,
            booking_date: new Date(),
          });
        } else if (plan.type === "Itinerary") {
          await ItineraryBooking.create({
            itinerary: existingPlan._id,
            tourist: tourist._id,
            attended: false,
            active: true,
            booking_date: new Date(),
          });
        }
      } catch (error) {
        console.error("Error processing plan:", error);
        return res
          .status(500)
          .json({ message: "Error processing plan", error: error.message });
      }
    }

    // Check if the tourist has sufficient balance
    if (tourist.wallet < totalPrice) {
      return res.status(402).json({ message: "Insufficient balance" });
    }

    // Deduct the total price from the tourist's wallet
    tourist.wallet -= totalPrice;

    // Update tourist's points, level, and badges
    const updatedTourist = await updateTouristData(tourist, totalPrice);

    // Save the updated wallet balance
    await tourist.save();

    // Respond with the updated tourist data
    res.json(updatedTourist);
  } catch (error) {
    console.error("Error in touristPay:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Update the tourist's data with the total price.
 * @param {Object} tourist - Tourist Mongoose document.
 * @param {Number} totalPrice - Total price of the plans.
 * @returns {Object} Updated tourist object.
 */
const updateTouristData = async (tourist, totalPrice) => {
  try {
    // Define the level multipliers
    const levelMultipliers = {
      1: 0.5,
      2: 1,
      3: 1.5,
    };

    // Calculate and update the tourist's points
    const multiplier = levelMultipliers[tourist.level] || 0;
    tourist.points += totalPrice * multiplier;

    // Define the level requirements in ascending order
    const levels = [
      { points: 0, level: 1 },
      { points: 100000, level: 2 },
      { points: 500000, level: 3 },
    ];

    // Determine the new level based on updated points
    let newLevel = tourist.level;
    for (const lvl of levels) {
      if (tourist.points >= lvl.points) {
        newLevel = lvl.level;
      } else {
        break;
      }
    }

    // Update the tourist's level if it has changed
    if (newLevel !== tourist.level) {
      tourist.level = newLevel;

      // Assign badges based on the new level
      const badges = {
        1: "Copper",
        2: "Gold",
        3: "Platinum",
      };

      const newBadge = badges[newLevel];
      if (newBadge && !tourist.badges.includes(newBadge)) {
        tourist.badges.push(newBadge);
      }
    }

    // Save the updated tourist
    await tourist.save();

    // Return the updated tourist
    return tourist;
  } catch (error) {
    // Rethrow the error for upstream handling
    throw error;
  }
};

/**
 * Delete a tourist.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const deleteTourist = async (req, res) => {
  try {
    // Find the tourist by ID and remove them
    await Tourist.findByIdAndDelete(req.params.touristId);
    // Return a success response with a 200 OK status code
    res.status(200).json({ message: "Tourist deleted successfully" });
  } catch (error) {
    // Return an error response with a 500 Internal Server Error status code
    res.status(500).json({ error: error.message });
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
    const tourist = await getTouristByIdHelper(req.params.touristId);

    // Check if the tourist is not found
    if (!tourist) return res.status(404).json({ message: "Tourist not found" });

    // Retrieve the itinerary ID, rating, and comment from the request body
    const itineraryId = req.body.itinerary;
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
    const tourist = await getTouristByIdHelper(req.params.touristId);

    // Check if the tourist is not found
    if (!tourist) return res.status(404).json({ message: "Tourist not found" });

    // Retrieve the tour guide ID, rating, and comment from the request body
    const tourGuideId = req.body.tourGuide;
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
 * Update the tourist's profile.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

const updateTourist = async (req, res) => {
  try {
    const updatedTourist = await Tourist.findByIdAndUpdate(
      req.params.touristId,
      { $set: req.body },
      { new: true }
    );
    if (!updatedTourist)
      return res.status(404).json({ message: "Tourist not found" });
    res.status(200).json(updatedTourist);
  } catch (error) {
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
    const tourist = await getTouristByIdHelper(req.params.touristId);
    // Check if the tourist is not found
    if (!tourist) return res.status(404).json({ message: "Tourist not found" });

    // Retrieve the activity ID, rating, and comment from the request body
    const activityId = req.body.activity;
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
 * Get the balance of a tourist.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

const getTouristBalance = async (req, res) => {
  try {
    // Retrieve the tourist by their ID
    const touristId = req.params.touristId;
    const tourist = await Tourist.findById(touristId);

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Return the balance of the tourist
    res.json({ balance: tourist.wallet });
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
    const tourist = await getTouristByIdHelper(req.params.touristId);
    // Check if the tourist is not found
    if (!tourist) return res.status(404).json({ message: "Tourist not found" });

    // Retrieve the product ID, rating, and comment from the request body
    const productId = req.body.product;
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
   
    // Update the product to include the new review
    await Product.findByIdAndUpdate(
      productId,
      { $push: { reviews: savedReview._id } },
      { new: true } // Returns the updated document
    );
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
    const tourist = await getTouristByIdHelper(req.params.touristId);
    // Check if the tourist is not found
    if (!tourist) return res.status(404).json({ message: "Tourist not found" });

    // Retrieve the points to redeem
    const pointsToRedeem = tourist.points;
    // Check if the points are not enough
    if (pointsToRedeem < 10000) {
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
 * File an itinerary complaint.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const fileItineraryComplaint = async (req, res) => {
  try {
    // Retrieve the tourist by their ID
    const tourist = await getTouristByIdHelper(req.params.touristId);
    // Check if the tourist is not found
    if (!tourist) return res.status(404).json({ message: "Tourist not found" });

    // Retrieve the complaint details from the request body
    const { title, body, itineraryId } = req.body;

    // Check if the title, body, or itinerary ID is missing
    if (!title || !body || !itineraryId) {
      return res
        .status(400)
        .json({ message: "Title, body, and itinerary ID are required" });
    }

    // Create a new itinerary complaint
    const newComplaint = new ItineraryComplaint({
      tourist: tourist._id,
      itinerary: itineraryId,
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

/**
 * File an activity complaint.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const fileActivityComplaint = async (req, res) => {
  try {
    // Retrieve the tourist by their ID
    const tourist = await getTouristByIdHelper(req.params.touristId);
    // Check if the tourist is not found
    if (!tourist) return res.status(404).json({ message: "Tourist not found" });

    // Retrieve the complaint details from the request body
    const { title, body, activityId } = req.body;

    // Check if the title, body, or activity ID is missing
    if (!title || !body || !activityId) {
      return res
        .status(400)
        .json({ message: "Title, body, and activity ID are required" });
    }

    // Create a new activity complaint
    const newComplaint = new ActivityComplaint({
      tourist: tourist._id,
      activity: activityId,
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

/**
 * Cancel an Itinerary Booking.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const cancelItineraryBooking = async (req, res) => {
  try {
    const bookingId = req.params.itineraryBookingId;

    // Find the Itinerary Booking by its ID
    const booking = await ItineraryBooking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Itinerary booking not found" });
    }

    // Find the Itinerary by its ID
    const itinerary = await Itinerary.findById(booking.itinerary);
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    // Calculate the cancellation deadline
    const cancellationDeadline = new Date(itinerary.start_date);
    cancellationDeadline.setDate(cancellationDeadline.getDate() - 2); // Subtract 2 days (48 hours)

    // Calculate the refund amount
    const refundAmount = itinerary.price;

    // Find the Tourist by its ID
    const touristId = booking.tourist;
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Check if the cancellation deadline has passed
    if (new Date() < cancellationDeadline) {
      // Delete the booking
      await ItineraryBooking.findByIdAndDelete(bookingId);

      // Refund the tourist
      tourist.wallet += refundAmount;
      await tourist.save();

      // Return a success message
      return res.json({
        message:
          "Itinerary booking cancelled successfully and amount refunded.",
      });
    } else {
      // Return an error message if the cancellation deadline has passed
      return res
        .status(400)
        .json({ message: "Cancellation deadline has passed" });
    }
  } catch (error) {
    // Log the error and return a server error response
    console.error("Error cancelling itinerary booking:", error);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Cancel an Activity Booking.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const cancelActivityBooking = async (req, res) => {
  try {
    const bookingId = req.params.activityBookingId;

    // Find the Activity Booking by its ID
    const booking = await ActivityBooking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Activity booking not found" });
    }

    // Find the Activity by its ID
    const activity = await Activity.findById(booking.activity);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    // Find the Tourist by its ID
    const touristId = booking.tourist;
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Calculate the refund amount
    const refundAmount = activity.price;

    // Delete the booking
    await ActivityBooking.findByIdAndDelete(bookingId);

    // Refund the tourist
    tourist.wallet += refundAmount;
    await tourist.save();

    // Return a success message
    return res.json({
      message: "Activity booking cancelled successfully and amount refunded.",
    });
  } catch (error) {
    // Log the error and return a server error response
    console.error("Error cancelling activity booking:", error);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * View all itinerary complaints and its status (pending/resolved)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const viewAllItineraryComplaints = async (req, res) => {
  try {
    // Retrieve the tourist by their ID
    const tourist = await getTouristByIdHelper(req.params.touristId);

    // Check if the tourist is not found
    if (!tourist) return res.status(404).json({ message: "Tourist not found" });

    // Find all itinerary complaints by the tourist
    const complaints = await ItineraryComplaint.find({ tourist: tourist._id })
      .populate("tourist")
      .exec();

    // Return the complaints
    res.json(complaints);
  } catch (error) {
    // Return an error response with a 500 Internal Server Error status code
    res.status(500).json({ error: error.message });
  }
};

/**
 * View all activity complaints and its status (pending/resolved)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const viewAllActivityComplaints = async (req, res) => {
  try {
    // Retrieve the tourist by their ID
    const tourist = await getTouristByIdHelper(req.params.touristId);

    // Check if the tourist is not found
    if (!tourist) return res.status(404).json({ message: "Tourist not found" });

    // Find all activity complaints by the tourist
    const complaints = await ActivityComplaint.find({ tourist: tourist._id })
      .populate("tourist")
      .exec();

    // Return the complaints
    res.json(complaints);
  } catch (error) {
    // Return an error response with a 500 Internal Server Error status code
    res.status(500).json({ error: error.message });
  }
};

//create a complaint
const createUserComplaint = async (req, res) => {
  try {
    const { userId } = req.params;
    const payload = req.body;
    const newComplaint = new Complain({ ...payload, complainer: userId });
    await newComplaint.save();
    res.status(201).json(newComplaint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllUserComplaints = async (req, res) => {
  try {
    const { userId } = req.params;
    const complaints = await Complain.find({ complainer: userId });
    res.status(200).json(complaints);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complain.find();
    res.status(200).json(complaints);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateComplaint = async (req, res) => {
  try {
    const updatedComplaint = await Complain.findByIdAndUpdate(
      req.params.complaintId,
      { $set: req.body },
      { new: true }
    );
    if (!updatedComplaint)
      return res.status(404).json({ message: "Complaint not found" });
    res.status(200).json(updatedComplaint);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const bookActivity = async (req, res) => {
  try {
    const { activityId, touristId } = req.body;

    // Check if the activity and tourist exist
    const activity = await Activity.findById(activityId);
    const tourist = await Tourist.findById(touristId);

    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    // Create a new activity booking
    const newBooking = new ActivityBooking({
      activity: activityId,
      tourist: touristId,
    });

    // Save the booking to the database
    const savedBooking = await newBooking.save();

    // Respond with the saved booking
    res.status(201).json(savedBooking);
  } catch (error) {
    console.error("Error booking activity:", error);
    res.status(500).json({ error: error.message });
  }
};



// Export the controllers
export default {
  createTourist,
  rateProduct,
  touristPay,
  redeemPoints,
  getTourist,
  fileActivityComplaint,
  fileItineraryComplaint,
  cancelActivityBooking,
  cancelItineraryBooking,
  viewAllActivityComplaints,
  viewAllItineraryComplaints,
  rateActivity,
  rateItinerary,
  getTouristBalance,
  updateTourist,
  deleteTourist,
  rateTourGuide,
  getAllTourists,
  getAllTouristsItineraryBooking,
  getAllTouristActivityBooking,
  getTouristByUserId,
  createUserComplaint,
  getAllUserComplaints,
  getAllComplaints,
  updateComplaint,
  bookActivity
};
