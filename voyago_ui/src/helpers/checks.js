import axios from "axios";

const isBooked = async (event, type) => {
  let isBooked = false;

  const user = JSON.parse(localStorage.getItem("user"));

  const { data: tourist } = await axios.get(
    `http://localhost:8000/api/tourist/get-tourist-by-user-id/${user._id}`
  );

  const { data: bookings } = await axios.get(
    `http://localhost:8000/api/tourist/get-all-tourists-${type}-bookings/${tourist._id}`
  );

  isBooked =
    bookings && bookings.some((booking) => event._id == booking[type]._id);
  return isBooked;
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

const isCompleted = async (event, type) => {
  let isCompleted = false;

  if (type == "activity") {
    isCompleted = isPastActivity(event);
  } else if (type == "itinerary") {
    isCompleted = isPastItinerary(event);
  }

  return isCompleted;
};

export default {
  isBooked,
  isCompleted,
};
