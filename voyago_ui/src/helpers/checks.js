import axios from "axios";

const isBooked = async (event, type) => {
  if (!event?._id) return false;
  
  const touristId = localStorage.getItem("roleId");
  if (!touristId) return false;

  try {
    const { data: bookings } = await axios.get(
      `http://localhost:8000/api/tourist/get-all-tourists-${type}-bookings/${touristId}`
    );

    return bookings?.some(booking => 
      booking?.[type]?._id === event._id
    ) || false;
  } catch (error) {
    console.error('Error checking booking status:', error);
    return false;
  }
};

const getEndDateActivity = (activity) => {
  if (activity == null) {
    return null;
  }
  const startDate = new Date(activity.start_time);
  const endDate = new Date(startDate);
  endDate.setMinutes(endDate.getMinutes() + activity.duration);
  return endDate;
};

const isPastActivity = (activity) => {
  if (activity == null) {
    return null;
  }

  const endDate = getEndDateActivity(activity);
  const currentDate = new Date();
  const dt = currentDate - endDate;

  return dt >= 0;
};

const isPastItinerary = (itinerary) => {
  //get latest activity date that are part of itinerary
  if (itinerary.activities.length == 0) {
    const itineraryDate = new Date(itinerary.start_date);
    const currentDate = new Date();
    const dt = currentDate - itineraryDate;
    return dt >= 0;
  }

  let latestActivity = itinerary.activities[0];

  itinerary.activities.forEach((currentActivity) => {
    const currentActivityEndDate = getEndDateActivity(currentActivity);
    const latestActivityEndDate = getEndDateActivity(latestActivity);
    if (currentActivityEndDate > latestActivityEndDate)
      latestActivity = currentActivity;
  });

  const isPast = isPastActivity(latestActivity);

  return isPast;
};

const isCompleted = (activity) => {
  if (!activity?.start_time || !activity?.duration) {
    return false;
  }

  const endDate = getEndDateActivity(activity);
  if (!endDate) return false;

  const currentDate = new Date();
  return currentDate > endDate;
};

export default {
  isBooked,
  isCompleted,
};
