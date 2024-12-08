import Itinerary from "../models/Itinerary.js";
import ItineraryBooking from "../models/ItineraryBooking.js";
import TourGuide from "../models/TourGuide.js";
import ActivityReview from "../models/ActivityReview.js";
import TourGuideReview from "../models/TourGuideReview.js";
import Notification from "../models/Notification.js";
import Tourist from "../models/Tourist.js";
//create Tour Guide
const createTourGuide = async (req, res) => {
  try {
    // Log the received data for debugging
    console.log("Received body:", req.body);
    console.log("Received file:", req.file);

    // Extract tour guide data from the request body
    const tourGuideData = {
      user: req.body.user,
      dob: req.body.dob,
      phone_number: req.body.phone_number,
      years_of_experience: req.body.years_of_experience,
      previous_work: req.body.previous_work,
      // Add the file path if a file was uploaded
      document_path: req.file ? req.file.path : null,
    };

    // Create a new TourGuide instance
    const newTourGuide = new TourGuide(tourGuideData);

    // Save the tour guide to the database
    const savedTourGuide = await newTourGuide.save();

    // Respond with the saved tour guide data
    res.status(201).json(savedTourGuide);
  } catch (error) {
    console.error("Error in createTourGuide:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get Tour Guide Profile Info
const getTourGuideProfileInfo = async (req, res) => {
  try {
    const tourGuideId = req.params.tourGuideId;
    const tourGuide = await TourGuide.findById(tourGuideId).populate("user");
    if (!tourGuide)
      return res.status(404).json({ error: "Tour Guide not found" });
    res.status(200).json(tourGuide);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//get Tour Guide
const getTourGuide = async (req, res) => {
  try {
    const tourGuide = await TourGuide.findById(req.params.tourGuideId).populate(
      "user"
    );
    if (!tourGuide)
      return res.status(404).json({ message: "Tour Guide not found" });
    res.status(200).json(tourGuide);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//get Tour Guide by User ID
const getTourGuideByUserId = async (req, res) => {
  try {
    const tourGuide = await TourGuide.findOne({
      user: req.params.userId,
    }).populate("user");
    if (!tourGuide)
      return res.status(404).json({ message: "Tour Guide not found" });
    res.status(200).json(tourGuide);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//update Tour Guide by id
const updateTourGuide = async (req, res) => {
  try {
    const updatedTourGuide = await TourGuide.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updatedTourGuide)
      return res.status(404).json({ message: "Tour Guide not found" });
    res.status(200).json(updatedTourGuide);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//delete Tour Guide by id
const deleteTourGuide = async (req, res) => {
  try {
    const deletedTourGuide = await TourGuide.findByIdAndDelete(req.params.id);
    if (!deletedTourGuide)
      return res.status(404).json({ message: "Tour Guide not found" });
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create an Itinerary
const createItinerary = async (req, res) => {
  try {
    const newItinerary = new Itinerary(req.body);
    const savedItinerary = await newItinerary.save();
    res.status(201).json(savedItinerary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Read Itinerary (By ID)
const getItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.itineraryId).populate(
      "activities"
    );
    if (!itinerary)
      return res.status(404).json({ message: "Itinerary not found" });
    res.status(200).json(itinerary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Read all Itineraries
const getAllItineraries = async (req, res) => {
  try {
    const itineraries = await Itinerary.find()
      .populate({
        path: "activities",
        populate: [
          {
            path: "tags",
            model: "Tag",
          },
          {
            path: "category",
            model: "ActivityCategory",
          },
        ],
      })
      .populate({
        path: "tour_guide",
        populate: {
          path: "user",
          model: "User",
          select: "username", // Assuming you want to include the username
        },
      })
      .populate("pick_up")
      .populate("drop_off");
    if (itineraries.length === 0) {
      return res.status(404).json({ message: "No itineraries found" });
    }
    res.status(200).json(itineraries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an Itinerary
const updateItinerary = async (req, res) => {
  try {
    const updatedItinerary = await Itinerary.findByIdAndUpdate(
      req.params.itineraryId,
      { $set: req.body },
      { new: true }
    )
      .populate({
        path: "activities",
        populate: [
          {
            path: "tags",
            model: "Tag",
          },
          {
            path: "category",
            model: "ActivityCategory",
          },
        ],
      })
      .populate({
        path: "tour_guide",
        populate: {
          path: "user",
          model: "User",
          select: "username", // Assuming you want to include the username
        },
      })
      .populate("pick_up")
      .populate("drop_off");
    if (!updatedItinerary)
      return res.status(404).json({ message: "Itinerary not found" });
    res.status(200).json(updatedItinerary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an Itinerary (Prevent if bookings exist)
const deleteItinerary = async (req, res) => {
  try {
    const bookings = await ItineraryBooking.find({
      itinerary: req.params.itineraryId,
    });
    if (bookings.length > 0) {
      return res
        .status(400)
        .json({ message: "Cannot delete itinerary with existing bookings" });
    }

    const deletedItinerary = await Itinerary.findByIdAndDelete(
      req.params.itineraryId
    );
    if (!deletedItinerary)
      return res.status(404).json({ message: "Itinerary not found" });
    res.status(200).json({ message: "Itinerary deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// View All Tour Guide's Itineraries
const getTourGuideItineraries = async (req, res) => {
  try {
    const itineraries = await Itinerary.find({
      tour_guide: req.params.tourGuideId,
    })
      .populate({
        path: "activities",
        populate: [
          {
            path: "tags",
            model: "Tag",
          },
          {
            path: "category",
            model: "ActivityCategory",
          },
        ],
      })
      .populate({
        path: "tour_guide",
        populate: {
          path: "user",
          model: "User",
          select: "username", // Assuming you want to include the username
        },
      })
      .populate("pick_up")
      .populate("drop_off");
    res.status(200).json(itineraries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getActivityRate = async (req, res) => {
  const activityReviews = await ActivityReview.find({
    activity: req.params.activityId,
  });
  res.send(activityReviews);
};

const getTourGuideReview = async (req, res) => {
  const tourGuideReviews = await TourGuideReview.find({
    tourGuide: req.params.tourGuideId,
  });
  res.send(tourGuideReviews);
};

const getAllSales = async (req, res) => {
  try {
    const tourGuideId = req.params.tourGuideId;
    const itineraries = await Itinerary.find({ tour_guide: tourGuideId });
    
    let totalRevenue = 0;
    const itineraryStats = {};

    for (const itinerary of itineraries) {
      const itineraryBookings = await ItineraryBooking.find({
        itinerary: itinerary._id
      });

      const attendedBookings = itineraryBookings.filter(booking => booking.attended);
      const revenue = attendedBookings.length * itinerary.price;

      itineraryStats[itinerary._id] = {
        totalSales: revenue,
        bookingCount: itineraryBookings.length,
        attendedCount: attendedBookings.length
      };

      totalRevenue += revenue;
    }

    res.status(200).json({
      totalRevenue,
      itineraryStats,
      itineraries
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTotalRevenueByDate = async (req, res) => {
  try {
    const tourGuideId = req.params.tourGuideId;
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({ error: "Date parameter is required" });
    }

    // Create date range for the specified date
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1); // Add one day to include the whole target day

    const itineraries = await Itinerary.find({ tour_guide: tourGuideId });
    let totalRevenue = 0;
    const itineraryStats = {};

    for (const itinerary of itineraries) {
      const itineraryBookings = await ItineraryBooking.find({
        itinerary: itinerary._id,
        booking_date: {
          $gte: startDate,
          $lt: endDate
        }
      }).populate('tourist');

      const attendedBookings = itineraryBookings.filter(booking => booking.attended);
      const revenue = attendedBookings.length * itinerary.price;

      itineraryStats[itinerary._id] = {
        totalSales: revenue,
        bookingCount: itineraryBookings.length,
        attendedCount: attendedBookings.length
      };

      totalRevenue += revenue;
    }

    res.status(200).json({
      totalRevenue,
      itineraryStats,
      itineraries
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTotalRevenueByMonth = async (req, res) => {
  try {
    const tourGuideId = req.params.tourGuideId;
    const { month } = req.query;
    
    if (!month) {
      return res.status(400).json({ error: "Month parameter is required" });
    }

    const year = new Date().getFullYear();
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const itineraries = await Itinerary.find({ tour_guide: tourGuideId });
    let totalRevenue = 0;
    const itineraryStats = {};

    for (const itinerary of itineraries) {
      const itineraryBookings = await ItineraryBooking.find({
        itinerary: itinerary._id,
        booking_date: {
          $gte: startDate,
          $lte: endDate
        }
      });

      const attendedBookings = itineraryBookings.filter(booking => booking.attended);
      const revenue = attendedBookings.length * itinerary.price;

      itineraryStats[itinerary._id] = {
        totalSales: revenue,
        bookingCount: itineraryBookings.length,
        attendedCount: attendedBookings.length
      };

      totalRevenue += revenue;
    }

    res.status(200).json({
      totalRevenue,
      itineraryStats,
      itineraries
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllRevenueByItinerary = async (req, res) => {
  try {
    const { tourGuideId, itineraryId } = req.params;

    // Find the specific itinerary and verify it belongs to the tour guide
    const itinerary = await Itinerary.findOne({
      _id: itineraryId,
      tour_guide: tourGuideId
    });

    if (!itinerary) {
      return res.status(404).json({ error: "Itinerary not found" });
    }

    // Get all bookings for this itinerary
    const bookings = await ItineraryBooking.find({
      itinerary: itineraryId
    });

    const attendedBookings = bookings.filter(booking => booking.attended);
    const revenue = attendedBookings.length * itinerary.price;

    // Return in the same format as other endpoints for consistency
    res.status(200).json({
      totalRevenue: revenue,
      itineraries: [itinerary],
      itineraryStats: {
        [itinerary._id]: {
          totalSales: revenue,
          bookingCount: bookings.length,
          attendedCount: attendedBookings.length
        }
      }
    });
  } catch (error) {
    console.error('Controller Error:', error);
    res.status(500).json({ error: error.message });
  }
};

const getTotalTourists = async (req, res) => {
  try {
    const tourGuideId = req.params.tourGuideId;
    const itineraries = await Itinerary.find({ tour_guide: tourGuideId });

    let totalTourists = 0;
    const itineraryStats = {};

    for (const itinerary of itineraries) {
      const bookings = await ItineraryBooking.find({
        itinerary: itinerary._id
      });

      const attendedCount = bookings.filter(booking => booking.attended).length;
      
      itineraryStats[itinerary._id] = {
        totalBookings: bookings.length,
        attendedCount: attendedCount
      };

      totalTourists += attendedCount;
    }

    res.status(200).json({
      totalTourists,
      itineraryStats,
      itineraries
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTouristsByMonth = async (req, res) => {
  try {
    const tourGuideId = req.params.tourGuideId;
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ error: "Month parameter is required" });
    }

    const year = new Date().getFullYear();
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const itineraries = await Itinerary.find({ tour_guide: tourGuideId });
    let totalTourists = 0;
    const itineraryStats = {};

    for (const itinerary of itineraries) {
      const bookings = await ItineraryBooking.find({
        itinerary: itinerary._id,
        booking_date: {
          $gte: startDate,
          $lte: endDate
        }
      });

      const attendedCount = bookings.filter(booking => booking.attended).length;
      
      itineraryStats[itinerary._id] = {
        totalBookings: bookings.length,
        attendedCount: attendedCount
      };

      totalTourists += attendedCount;
    }

    res.status(200).json({
      totalTourists,
      itineraryStats,
      itineraries
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllNotifications = async (req, res) => {
  try {
    const tourGuideId = req.params.tourGuideId; // Assuming tourGuideId is in the URL params

    // Fetch the tour guide by their ID
    const tourGuide = await TourGuide.findById(tourGuideId).populate("user");
    if (!tourGuide) {
      return res.status(404).json({ message: "Tour guide not found" });
    }

    // Get the user associated with the tour guide
    const user = tourGuide.user;

    // Fetch all notifications for this user
    const notifications = await Notification.find({ recipient: user._id });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// backend/controllers/TourGuideController.js

const getAllNotificationsByType = async (req, res) => {
  try {
    const tourGuideId = req.params.tourGuideId;
    const type = req.body.type; // Assuming type is passed as a query parameter

    if (!type) {
      return res.status(400).json({ error: "Notification type is required" });
    }

    const tourGuide = await TourGuide.findById(tourGuideId).populate("user");
    if (!tourGuide) {
      return res.status(404).json({ message: "TourGuide not found" });
    }

    const user = tourGuide.user;
    const notifications = await Notification.find({ recipient: user._id, type: type });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTourGuideNotifications = async (req, res) => {
  try {
    const tourGuideId = req.params.tourGuideId;
    const tourGuide = await TourGuide.findById(tourGuideId).populate('user');
    
    if (!tourGuide) {
      return res.status(404).json({ message: "Tour Guide not found" });
    }

    const notifications = await Notification.find({ 
      recipient: tourGuide.user._id,
      type: "ITINERARY_FLAG"
    }).sort({ created_at: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

const createItineraryFlagNotification = async (tourGuideId, itineraryName) => {
  try {
    const tourGuide = await TourGuide.findById(tourGuideId).populate('user');
    if (!tourGuide) {
      throw new Error('Tour Guide not found');
    }

    const notification = new Notification({
      recipient: tourGuide.user._id,
      type: "ITINERARY_FLAG",
      message: `Your itinerary "${itineraryName}" has been flagged as inappropriate by an admin.`,
      is_read: false,
      created_at: new Date()
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating itinerary flag notification:', error);
    throw error;
  }
};

// Get all bookings for a tour guide's itineraries
const getItineraryBookings = async (req, res) => {
  try {
    const tourGuideId = req.params.tourGuideId;
    
    // First get all itineraries for this tour guide
    const itineraries = await Itinerary.find({ tour_guide: tourGuideId });
    const itineraryIds = itineraries.map(itinerary => itinerary._id);

    // Then get all bookings for these itineraries
    const bookings = await ItineraryBooking.find({ 
      itinerary: { $in: itineraryIds },
      active: true
    })
    .populate({
      path: 'tourist',
      populate: {
        path: 'user',
        select: 'username email'
      }
    })
    .populate('itinerary');

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark attendance for a booking
const markAttendance = async (req, res) => {
  try {
    const { tourGuideId, bookingId } = req.params;

    // Verify that this booking belongs to one of the tour guide's itineraries
    const booking = await ItineraryBooking.findById(bookingId)
      .populate('itinerary');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.itinerary.tour_guide.toString() !== tourGuideId) {
      return res.status(403).json({ message: 'Not authorized to mark this attendance' });
    }

    // Mark as attended
    booking.attended = true;
    await booking.save();

    res.status(200).json({ message: 'Attendance marked successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  createItinerary,
  getItinerary,
  updateItinerary,
  getTourGuideByUserId,
  deleteItinerary,
  getTourGuideItineraries,
  createTourGuide,
  getTourGuide,
  updateTourGuide,
  deleteTourGuide,
  getTourGuideProfileInfo,
  getAllItineraries,
  getActivityRate,
  getTourGuideReview,
  getAllSales,
  getTotalRevenueByDate,
  getTotalRevenueByMonth,
  getAllRevenueByItinerary,
  getTotalTourists,
  getTouristsByMonth,
  getTourGuideNotifications,
  createItineraryFlagNotification,
  getItineraryBookings,
  markAttendance,
};
