import Bookmark from "../models/Bookmark.js";
import Activity from "../models/Activity.js";

// Create a bookmark
const createBookmark = async (req, res) => {
  try {
    const { touristId, activityId } = req.body;
    
    // Check if bookmark already exists
    const existingBookmark = await Bookmark.findOne({
      tourist: touristId,
      activity: activityId
    });

    if (existingBookmark) {
      return res.status(400).json({ message: "Activity already bookmarked" });
    }

    const newBookmark = new Bookmark({
      tourist: touristId,
      activity: activityId
    });

    const savedBookmark = await newBookmark.save();
    res.status(201).json(savedBookmark);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all bookmarks for a tourist
const getTouristBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ tourist: req.params.touristId })
      .populate({
        path: 'activity',
        select: 'title description price start_time duration location'
      })
      .sort({ created_at: -1 });

    res.status(200).json(bookmarks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove a bookmark
const removeBookmark = async (req, res) => {
  try {
    const { touristId, bookmarkId } = req.params;
    
    const bookmark = await Bookmark.findOneAndDelete({
      _id: bookmarkId,
      tourist: touristId
    });

    if (!bookmark) {
      return res.status(404).json({ message: "Bookmark not found" });
    }

    res.status(200).json({ message: "Bookmark removed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  createBookmark,
  getTouristBookmarks,
  removeBookmark
}; 