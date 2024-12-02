import Notification from "../models/Notification.js";
import ActivityBooking from "../models/ActivityBooking.js";
import Tourist from "../models/Tourist.js";

export const createUpcomingActivityNotifications = async () => {
  try {
    const currentDate = new Date();
    const upcomingDate = new Date();
    upcomingDate.setDate(currentDate.getDate() + 1); // 1 day before the activity

    const bookings = await ActivityBooking.find({
      active: true,
      attended: false,
    }).populate("activity tourist");

    for (const booking of bookings) {
      const activityStartDate = new Date(booking.activity.start_date);
      if (activityStartDate <= upcomingDate && activityStartDate > currentDate) {
        const notification = new Notification({
          recipient: booking.tourist.user, // Assuming tourist has a user reference
          type: "NORMAL",
          message: `Reminder: Your activity "${booking.activity.name}" is happening soon.`,
        });
        await notification.save();
      }
    }
  } catch (error) {
    console.error("Error creating notifications:", error);
  }
};
