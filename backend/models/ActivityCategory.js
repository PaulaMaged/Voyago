
import mongoose from "mongoose";

const activityCategorySchema = new mongoose.Schema({
category: {
    type: String,
    required: true,
    uppercase: true,
  },
});

const ActivityCategory = mongoose.model(
  "ActivityCategory",
  activityCategorySchema
);

export default ActivityCategory;
