import Notification from "../models/Notification.js";
import ActivityBooking from "../models/ActivityBooking.js";
import Tourist from "../models/Tourist.js";
import Bookmark from "../models/Bookmark.js";

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

export const checkBookmarkedActivities = async () => {
  try {
    const bookmarks = await Bookmark.find()
      .populate('tourist')
      .populate('activity');

    for (const bookmark of bookmarks) {
      const activity = bookmark.activity;
      const tourist = bookmark.tourist;
      
      // Check if activity is available for booking
      if (activity.booking_open && 
          new Date(activity.start_time) > new Date() && 
          !activity.flag_inapproperiate) {
            
        // Check if notification already exists
        const existingNotification = await Notification.findOne({
          recipient: tourist.user,
          message: `Activity "${activity.title}" that you bookmarked is now available for booking!`,
          type: "NORMAL"
        });

        if (!existingNotification) {
          const notification = new Notification({
            recipient: tourist.user,
            type: "NORMAL",
            message: `Activity "${activity.title}" that you bookmarked is now available for booking!`
          });
          
          await notification.save();
        }
      }
    }
  } catch (error) {
    console.error("Error checking bookmarked activities:", error);
  }
};

export const createNotifications = async () => {
  await createUpcomingActivityNotifications();
  await checkBookmarkedActivities();
};
