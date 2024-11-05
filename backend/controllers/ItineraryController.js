import Itinerary from "../models/Itinerary";
import ItineraryBooking from "../models/ItineraryBooking";

const deactivateItinerary = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).send({ message: "Invalid request" });
  }

  try {
    // Check if the itinerary has any bookings
    const bookings = await ItineraryBooking.find({ Itinerary: id });

    if (bookings.length > 0) {
      // If it has bookings, check if it is already deactivated
      const itinerary = await Itinerary.findById(id);

      if (itinerary && !itinerary.active) {
        return res
          .status(400)
          .send({ message: "Itinerary is already deactivated" });
      }

      // If it has bookings, prevent it from being re-activated
      await Itinerary.findByIdAndUpdate(
        id,
        { active: false }, // Directly set the active status to false
        { new: true }
      );

      res.send({ message: "Itinerary deactivated" });
    } else {
      // If it doesn't have bookings, deactivate it
      await Itinerary.findByIdAndUpdate(
        id,
        { active: false }, // Directly set the active status to false
        { new: true }
      );

      res.send({ message: "Itinerary deactivated" });
    }
  } catch (err) {
    res.status(500).send({ message: "Failed to deactivate itinerary" });
  }
};

const activateItinerary = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).send({ message: "Invalid request" });
  }

  try {
    // Check if the itinerary has any bookings
    const bookings = await ItineraryBooking.find({ Itinerary: id });

    if (bookings.length > 0) {
      // If it has bookings, don't allow it to be activated
      return res
        .status(400)
        .send({ message: "Cannot reactivate an itinerary with bookings" });
    }

    // If it doesn't have bookings, activate it
    await Itinerary.findByIdAndUpdate(
      id,
      { active: true }, // Directly set the active status to true
      { new: true }
    );

    res.send({ message: "Itinerary activated" });
  } catch (err) {
    res.status(500).send({ message: "Failed to activate itinerary" });
  }
};

export default { activateItinerary, deactivateItinerary };
