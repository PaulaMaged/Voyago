import Notification from "../models/Notification.js";
import ActivityBooking from "../models/ActivityBooking.js";
import Tourist from "../models/Tourist.js";
import Bookmark from "../models/Bookmark.js";

export const createUpcomingActivityNotifications = async () => {
  try {
    const currentDate = new Date();
    const upcomingDate = new Date();
    upcomingDate.setDate(currentDate.getDate() + 1);

    const bookings = await ActivityBooking.find({
      active: true,
      attended: false,
    }).populate({
      path: 'activity',
      match: { start_time: { $exists: true } }
    }).populate('tourist');

    const validBookings = bookings.filter(booking => booking.activity);

    for (const booking of validBookings) {
      const activityStartDate = new Date(booking.activity.start_time);
      if (activityStartDate <= upcomingDate && activityStartDate > currentDate) {
        const notification = new Notification({
          recipient: booking.tourist.user,
          type: "NORMAL",
          message: `Reminder: Your activity "${booking.activity.title}" is happening soon.`,
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
      .populate({
        path: 'activity',
        match: { 
          booking_open: { $exists: true },
          start_time: { $exists: true },
          flag_inapproperiate: { $exists: true }
        }
      })
      .populate('tourist');

    const validBookmarks = bookmarks.filter(bookmark => bookmark.activity);

    for (const bookmark of validBookmarks) {
      const activity = bookmark.activity;
      const tourist = bookmark.tourist;
      
      if (activity.booking_open && 
          new Date(activity.start_time) > new Date() && 
          !activity.flag_inapproperiate) {
            
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
