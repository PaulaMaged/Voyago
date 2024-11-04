import Itinerary from "../models/Itinerary";
import Booking from "../models/Booking";

const setActive = async (req, res) => {
  const { id } = req.params;
  const { active } = req.body;

  if (!id || typeof active !== "boolean") {
    return res.status(400).send({ message: "Invalid request" });
  }

  try {
    const itinerary = await Itinerary.findByIdAndUpdate(
      id,
      { active },
      { new: true }
    );
    if (!itinerary) {
      return res.status(404).send({ message: "Itinerary not found" });
    }

    // Update the booking's active status as well
    await Booking.updateMany({ itineraryId: id }, { active });

    res.send(itinerary);
  } catch (err) {
    res
      .status(500)
      .send({ message: "Failed to update itinerary and bookings" });
  }
};

export default { setActive };
